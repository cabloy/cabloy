using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Runtime.InteropServices;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Text;
using Microsoft.Win32.SafeHandles;

namespace Cabloy {
    // Local NTFS only. FlushFileBuffers + same-directory rename provides committed
    // process/crash-safe updates, not a promise of power-loss directory durability.
    public static class TestClaimFilesystem {
        const uint ReadControl = 0x20000, DeleteAccess = 0x10000, ReadAttributes = 0x80;
        const uint GenericRead = 0x80000000, GenericWrite = 0x40000000;
        const uint ShareRead = 1, ShareWrite = 2, OpenExisting = 3, CreateNew = 1;
        const uint OpenReparsePoint = 0x200000, BackupSemantics = 0x2000000;
        const uint ReparsePoint = 0x400, DirectoryAttribute = 0x10;
        const int Limit = 4 * 1024 * 1024;
        static readonly string UserSid = WindowsIdentity.GetCurrent().User.Value;
        static readonly Encoding Utf8 = new UTF8Encoding(false, true);
        [StructLayout(LayoutKind.Sequential)] struct SecurityAttributes {
            public int Length; public IntPtr Descriptor;
            [MarshalAs(UnmanagedType.Bool)] public bool Inherit;
        }
        [StructLayout(LayoutKind.Sequential)] struct FileInformation {
            public uint Attributes; public System.Runtime.InteropServices.ComTypes.FILETIME Creation, Access, Write;
            public uint Volume, SizeHigh, SizeLow, Links, IndexHigh, IndexLow;
        }
        [StructLayout(LayoutKind.Sequential)] struct Disposition {
            [MarshalAs(UnmanagedType.U1)] public bool Delete;
        }
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        static extern SafeFileHandle CreateFileW(string name, uint access, uint share, IntPtr security, uint creation, uint flags, IntPtr template);
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        static extern bool CreateDirectoryW(string name, ref SecurityAttributes security);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool GetFileInformationByHandle(SafeFileHandle file, out FileInformation info);
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        static extern bool GetVolumeInformationByHandleW(SafeFileHandle file, StringBuilder volume, uint volumeSize, out uint serial, out uint maxLength, out uint flags, StringBuilder filesystem, uint filesystemSize);
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode)] static extern uint GetDriveTypeW(string root);
        [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        static extern bool ConvertStringSecurityDescriptorToSecurityDescriptorW(string sddl, uint revision, out IntPtr descriptor, out uint size);
        [DllImport("advapi32.dll")] static extern uint GetSecurityInfo(SafeFileHandle file, int type, uint information, out IntPtr owner, out IntPtr group, out IntPtr dacl, out IntPtr sacl, out IntPtr descriptor);
        [DllImport("advapi32.dll")] static extern uint GetSecurityDescriptorLength(IntPtr descriptor);
        [DllImport("kernel32.dll")] static extern IntPtr LocalFree(IntPtr value);
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        static extern bool MoveFileExW(string existing, string replacement, uint flags);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool FlushFileBuffers(SafeFileHandle file);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool SetFileInformationByHandle(SafeFileHandle file, int type, ref Disposition info, uint size);

        static void Check(bool success) { if (!success) throw new Win32Exception(Marshal.GetLastWin32Error()); }
        static Exception Unsafe() { return new InvalidOperationException("Unsafe claim filesystem"); }
        static string Canonical(string value) {
            if (String.IsNullOrEmpty(value) || value.IndexOf('\0') >= 0 || value.StartsWith(@"\\")) throw Unsafe();
            string full = Path.GetFullPath(value);
            string root = Path.GetPathRoot(full);
            if (root.Length != 3 || !Char.IsLetter(root[0]) || root[1] != ':' || GetDriveTypeW(root) != 3) throw Unsafe();
            // Reject ADS, Win32 aliases, wildcard paths, and path normalization surprises.
            foreach (string part in full.Substring(root.Length).Split('\\')) {
                if (part.Length == 0) continue;
                if (part.EndsWith(".") || part.EndsWith(" ") || part.IndexOfAny(new char[] { ':', '*', '?', '"', '<', '>', '|' }) >= 0) throw Unsafe();
                string stem = part.Split('.')[0].ToUpperInvariant();
                if (stem == "CON" || stem == "PRN" || stem == "AUX" || stem == "NUL" ||
                    (stem.Length == 4 && (stem.StartsWith("COM") || stem.StartsWith("LPT")) && stem[3] >= '0' && stem[3] <= '9')) throw Unsafe();
            }
            return full;
        }
        static FileInformation Info(SafeFileHandle handle, bool directory) {
            FileInformation info;
            Check(GetFileInformationByHandle(handle, out info));
            if ((info.Attributes & ReparsePoint) != 0 || ((info.Attributes & DirectoryAttribute) != 0) != directory || (!directory && info.Links != 1)) throw Unsafe();
            StringBuilder fs = new StringBuilder(32), volume = new StringBuilder(256);
            uint serial, max, flags;
            Check(GetVolumeInformationByHandleW(handle, volume, 256, out serial, out max, out flags, fs, 32));
            if (fs.ToString() != "NTFS" || (flags & 8) == 0) throw Unsafe(); // persistent ACLs
            return info;
        }
        static SafeFileHandle Open(string file, bool directory, uint access, uint share = ShareRead) {
            SafeFileHandle handle = CreateFileW(file, access | ReadAttributes | ReadControl, share, IntPtr.Zero, OpenExisting, OpenReparsePoint | BackupSemantics, IntPtr.Zero);
            if (handle.IsInvalid) { int error = Marshal.GetLastWin32Error(); handle.Dispose(); throw new Win32Exception(error); }
            try { Info(handle, directory); return handle; } catch { handle.Dispose(); throw; }
        }
        static void Private(SafeFileHandle file) {
            IntPtr owner, group, dacl, sacl, descriptor;
            uint code = GetSecurityInfo(file, 1, 5, out owner, out group, out dacl, out sacl, out descriptor);
            if (code != 0) throw new Win32Exception((int)code);
            try {
                byte[] bytes = new byte[GetSecurityDescriptorLength(descriptor)];
                Marshal.Copy(descriptor, bytes, 0, bytes.Length);
                RawSecurityDescriptor security = new RawSecurityDescriptor(bytes, 0);
                if (security.Owner == null || security.Owner.Value != UserSid || security.DiscretionaryAcl == null ||
                    (security.ControlFlags & ControlFlags.DiscretionaryAclProtected) == 0 ||
                    (security.ControlFlags & ControlFlags.DiscretionaryAclPresent) == 0) throw Unsafe();
                bool user = false;
                foreach (GenericAce item in security.DiscretionaryAcl) {
                    CommonAce ace = item as CommonAce;
                    if (ace == null || ace.AceQualifier != AceQualifier.AccessAllowed || ace.IsCallback ||
                        (ace.AceFlags & (AceFlags.Inherited | AceFlags.InheritOnly)) != 0 ||
                        (ace.SecurityIdentifier.Value != UserSid && ace.SecurityIdentifier.Value != "S-1-5-18" && ace.SecurityIdentifier.Value != "S-1-5-32-544")) throw Unsafe();
                    if (ace.SecurityIdentifier.Value == UserSid && (ace.AccessMask & 0x1f01ff) == 0x1f01ff) user = true;
                }
                if (!user) throw Unsafe();
            } finally { if (descriptor != IntPtr.Zero) LocalFree(descriptor); }
        }
        sealed class Chain : IDisposable {
            readonly List<SafeFileHandle> handles = new List<SafeFileHandle>();
            public Chain(string file, bool includeLeaf, bool missing) {
                string root = Path.GetPathRoot(file), current = root;
                try {
                    handles.Add(Open(root, true, 0, ShareRead | ShareWrite));
                    string[] parts = file.Substring(root.Length).Split(new char[] { '\\' }, StringSplitOptions.RemoveEmptyEntries);
                    for (int i = 0; i < parts.Length; i++) {
                        current = Path.Combine(current, parts[i]);
                        if (i == parts.Length - 1 && !includeLeaf) break;
                        try {
                            // Holding each ancestor without FILE_SHARE_DELETE pins the path
                            // throughout native operations instead of merely lstat-ing names.
                            bool leaf = i == parts.Length - 1;
                            if (leaf) {
                                SafeFileHandle h = CreateFileW(current, ReadAttributes | ReadControl, ShareRead | ShareWrite, IntPtr.Zero, OpenExisting, OpenReparsePoint | BackupSemantics, IntPtr.Zero);
                                if (h.IsInvalid) { int e = Marshal.GetLastWin32Error(); h.Dispose(); throw new Win32Exception(e); }
                                try { FileInformation info; Check(GetFileInformationByHandle(h, out info)); Info(h, (info.Attributes & DirectoryAttribute) != 0); handles.Add(h); } catch { h.Dispose(); throw; }
                            } else handles.Add(Open(current, true, 0, ShareRead | ShareWrite));
                        } catch (Win32Exception e) { if (missing && (e.NativeErrorCode == 2 || e.NativeErrorCode == 3)) break; throw; }
                    }
                } catch { Dispose(); throw; }
            }
            public void Dispose() { for (int i = handles.Count - 1; i >= 0; i--) handles[i].Dispose(); handles.Clear(); }
        }
        static IntPtr Descriptor(bool directory) {
            string inheritance = directory ? "OICI" : "";
            string sddl = "O:" + UserSid + "D:P(A;" + inheritance + ";FA;;;" + UserSid + ")(A;" + inheritance + ";FA;;;SY)(A;" + inheritance + ";FA;;;BA)";
            IntPtr descriptor; uint length;
            Check(ConvertStringSecurityDescriptorToSecurityDescriptorW(sddl, 1, out descriptor, out length));
            return descriptor;
        }
        static SafeFileHandle Create(string file) {
            IntPtr descriptor = Descriptor(false), memory = IntPtr.Zero;
            try {
                SecurityAttributes security = new SecurityAttributes { Length = Marshal.SizeOf<SecurityAttributes>(), Descriptor = descriptor, Inherit = false };
                memory = Marshal.AllocHGlobal(security.Length); Marshal.StructureToPtr(security, memory, false);
                SafeFileHandle handle = CreateFileW(file, GenericRead | GenericWrite | ReadControl | DeleteAccess, 0, memory, CreateNew, OpenReparsePoint | BackupSemantics, IntPtr.Zero);
                if (handle.IsInvalid) { int e = Marshal.GetLastWin32Error(); handle.Dispose(); throw new Win32Exception(e); }
                try { Info(handle, false); Private(handle); return handle; } catch { handle.Dispose(); throw; }
            } finally { if (memory != IntPtr.Zero) Marshal.FreeHGlobal(memory); LocalFree(descriptor); }
        }
        static void Write(string file, byte[] content) {
            using (SafeFileHandle handle = Create(file))
            using (FileStream stream = new FileStream(handle, FileAccess.ReadWrite)) {
                stream.Write(content, 0, content.Length); stream.Flush(true); Check(FlushFileBuffers(handle));
            }
        }
        static string Read(SafeFileHandle handle) {
            FileInformation info = Info(handle, false); Private(handle);
            if (info.SizeHigh != 0 || info.SizeLow > Limit) throw Unsafe();
            using (FileStream stream = new FileStream(handle, FileAccess.Read)) {
                byte[] data = new byte[Limit + 1]; int count = 0, n;
                while (count < data.Length && (n = stream.Read(data, count, data.Length - count)) != 0) count += n;
                if (count > Limit) throw Unsafe();
                Info(handle, false); return Utf8.GetString(data, 0, count);
            }
        }
        static void Remove(SafeFileHandle handle) {
            Disposition info = new Disposition { Delete = true };
            Check(SetFileInformationByHandle(handle, 4, ref info, (uint)Marshal.SizeOf<Disposition>()));
        }
        static void ParentPrivate(string file) { using (SafeFileHandle parent = Open(Path.GetDirectoryName(file), true, 0, ShareRead | ShareWrite)) Private(parent); }
        static Dictionary<string, object> Success() { return new Dictionary<string, object> { { "ok", true } }; }
        public static Dictionary<string, object> Execute(string command, string file, bool allowMissing, string content, string expected) {
            try {
                file = Canonical(file);
                Dictionary<string, object> result = Success();
                if (command == "safe-path") { using (new Chain(file, true, allowMissing)) { } return result; }
                using (new Chain(file, false, false)) {
                    if (command == "ensure-directory") {
                        IntPtr descriptor = Descriptor(true);
                        try {
                            SecurityAttributes security = new SecurityAttributes { Length = Marshal.SizeOf<SecurityAttributes>(), Descriptor = descriptor };
                            if (!CreateDirectoryW(file, ref security)) { int e = Marshal.GetLastWin32Error(); if (e != 183) throw new Win32Exception(e); }
                        } finally { LocalFree(descriptor); }
                    }
                    if (command == "directory" || command == "ensure-directory") {
                        try { using (SafeFileHandle h = Open(file, true, 0, ShareRead | ShareWrite)) Private(h); result["exists"] = true; }
                        catch (Win32Exception e) { if (!allowMissing || (e.NativeErrorCode != 2 && e.NativeErrorCode != 3)) throw; result["exists"] = false; }
                        return result;
                    }
                    ParentPrivate(file);
                    if (command == "read") { using (SafeFileHandle h = Open(file, false, GenericRead)) result["content"] = Read(h); return result; }
                    if (command == "delete" || command == "release-lock") {
                        using (SafeFileHandle h = Open(file, false, GenericRead | DeleteAccess)) {
                            Private(h);
                            if (command == "release-lock") {
                                // Read through a non-owning SafeFileHandle so the delete handle stays live.
                                using (SafeFileHandle borrowed = new SafeFileHandle(h.DangerousGetHandle(), false)) {
                                    if (Read(borrowed) != expected) throw Unsafe();
                                }
                            }
                            Remove(h);
                        }
                        return result;
                    }
                    byte[] bytes = Utf8.GetBytes(content);
                    if (bytes.Length > Limit) throw Unsafe();
                    if (command == "create") { Write(file, bytes); return result; }
                    if (command != "replace") throw Unsafe();
                    using (SafeFileHandle h = Open(file, false, GenericRead)) Private(h);
                    string temp = file + "." + Guid.NewGuid().ToString("N") + ".tmp";
                    bool created = false;
                    try {
                        Write(temp, bytes); created = true;
                        using (SafeFileHandle h = Open(file, false, GenericRead)) Private(h);
                        // No COPY_ALLOWED: same-directory local-NTFS replacement only.
                        // Both files are flushed first. Failure is never acknowledged.
                        Check(MoveFileExW(temp, file, 1 | 8)); created = false;
                        using (SafeFileHandle h = Open(file, false, GenericRead)) { if (Read(h) != content) throw Unsafe(); }
                    } finally {
                        if (created) {
                            using (SafeFileHandle h = Open(temp, false, DeleteAccess)) { Private(h); Remove(h); }
                        }
                    }
                    return result;
                }
            } catch (Win32Exception e) {
                return new Dictionary<string, object> { { "ok", false }, { "code", e.NativeErrorCode == 80 || e.NativeErrorCode == 183 ? "EEXIST" : e.NativeErrorCode == 2 || e.NativeErrorCode == 3 ? "ENOENT" : "EUNSAFE" } };
            } catch { return new Dictionary<string, object> { { "ok", false }, { "code", "EUNSAFE" } }; }
        }
    }
}
