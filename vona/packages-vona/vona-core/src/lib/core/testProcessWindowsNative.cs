using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.IO.Pipes;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32.SafeHandles;

namespace Cabloy
{
    // The PowerShell process, not the application subtree, owns the only Job handle.
    // No fallback to AssignProcessToJobObject: job membership is a creation attribute.
    public static class TestProcessWindowsNative
    {
        const int MaxFrame = 1024 * 1024;
        const uint CREATE_SUSPENDED = 0x4, CREATE_UNICODE_ENVIRONMENT = 0x400;
        const uint EXTENDED_STARTUPINFO_PRESENT = 0x80000, CREATE_NO_WINDOW = 0x08000000;
        const uint STARTF_USESTDHANDLES = 0x100, HANDLE_FLAG_INHERIT = 1;
        const uint PROCESS_QUERY_LIMITED_INFORMATION = 0x1000, SYNCHRONIZE = 0x100000;
        const uint WAIT_OBJECT_0 = 0, WAIT_TIMEOUT = 258;
        const int ERROR_INVALID_PARAMETER = 87;
        const long PROC_THREAD_ATTRIBUTE_HANDLE_LIST = 0x20002;
        const long PROC_THREAD_ATTRIBUTE_JOB_LIST = 0x2000D;
        static readonly UTF8Encoding Utf8 = new UTF8Encoding(false, true);

        [StructLayout(LayoutKind.Sequential)] struct FILETIME { public uint Low, High; }
        [StructLayout(LayoutKind.Sequential)] struct IO_COUNTERS { public ulong A, B, C, D, E, F; }
        [StructLayout(LayoutKind.Sequential)] struct BASIC_LIMIT {
            public long PerProcessUserTimeLimit, PerJobUserTimeLimit;
            public uint LimitFlags;
            public UIntPtr MinimumWorkingSetSize, MaximumWorkingSetSize;
            public uint ActiveProcessLimit;
            public UIntPtr Affinity;
            public uint PriorityClass, SchedulingClass;
        }
        [StructLayout(LayoutKind.Sequential)] struct EXTENDED_LIMIT {
            public BASIC_LIMIT BasicLimitInformation;
            public IO_COUNTERS IoInfo;
            public UIntPtr ProcessMemoryLimit, JobMemoryLimit, PeakProcessMemoryUsed, PeakJobMemoryUsed;
        }
        [StructLayout(LayoutKind.Sequential)] struct BASIC_ACCOUNTING {
            public long TotalUserTime, TotalKernelTime, ThisPeriodTotalUserTime, ThisPeriodTotalKernelTime;
            public uint TotalPageFaultCount, TotalProcesses, ActiveProcesses, TotalTerminatedProcesses;
        }
        [StructLayout(LayoutKind.Sequential)] struct SECURITY_ATTRIBUTES {
            public int Length;
            public IntPtr SecurityDescriptor;
            [MarshalAs(UnmanagedType.Bool)] public bool InheritHandle;
        }
        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)] struct STARTUPINFO {
            public int cb;
            public string Reserved, Desktop, Title;
            public uint X, Y, XSize, YSize, XCountChars, YCountChars, FillAttribute, Flags;
            public short ShowWindow, Reserved2;
            public IntPtr Reserved2Pointer, StdInput, StdOutput, StdError;
        }
        [StructLayout(LayoutKind.Sequential)] struct STARTUPINFOEX {
            public STARTUPINFO StartupInfo;
            public IntPtr AttributeList;
        }
        [StructLayout(LayoutKind.Sequential)] struct PROCESS_INFORMATION {
            public IntPtr Process, Thread;
            public uint ProcessId, ThreadId;
        }
        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)] static extern IntPtr CreateJobObjectW(IntPtr attributes, string name);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool SetInformationJobObject(IntPtr job, int infoClass, ref EXTENDED_LIMIT info, uint length);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool QueryInformationJobObject(IntPtr job, int infoClass, out BASIC_ACCOUNTING info, uint length, IntPtr returned);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool TerminateJobObject(IntPtr job, uint code);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool IsProcessInJob(IntPtr process, IntPtr job, [MarshalAs(UnmanagedType.Bool)] out bool result);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool SetHandleInformation(IntPtr handle, uint mask, uint flags);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool CloseHandle(IntPtr handle);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool InitializeProcThreadAttributeList(IntPtr list, int count, int flags, ref IntPtr size);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool UpdateProcThreadAttribute(IntPtr list, uint flags, IntPtr attribute, IntPtr value, IntPtr size, IntPtr previous, IntPtr returned);
        [DllImport("kernel32.dll")] static extern void DeleteProcThreadAttributeList(IntPtr list);
        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)] static extern bool CreateProcessW(string application, StringBuilder command, IntPtr processAttributes, IntPtr threadAttributes, bool inherit, uint flags, IntPtr environment, string cwd, ref STARTUPINFOEX startup, out PROCESS_INFORMATION info);
        [DllImport("kernel32.dll", SetLastError = true)] static extern uint ResumeThread(IntPtr thread);
        [DllImport("kernel32.dll", SetLastError = true)] static extern uint WaitForSingleObject(IntPtr handle, uint milliseconds);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool GetExitCodeProcess(IntPtr process, out uint code);
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool GetProcessTimes(IntPtr process, out FILETIME creation, out FILETIME exit, out FILETIME kernel, out FILETIME user);
        [DllImport("kernel32.dll", SetLastError = true)] static extern IntPtr OpenProcess(uint access, bool inherit, uint pid);
        [DllImport("kernel32.dll")] static extern IntPtr GetCurrentProcess();
        [DllImport("kernel32.dll")] static extern uint GetCurrentProcessId();
        [DllImport("kernel32.dll", SetLastError = true)] static extern bool CreatePipe(out IntPtr read, out IntPtr write, ref SECURITY_ATTRIBUTES attributes, uint size);
        [DllImport("kernel32.dll", SetLastError = true, CharSet = CharSet.Unicode)] static extern IntPtr CreateFileW(string path, uint access, uint share, ref SECURITY_ATTRIBUTES attributes, uint creation, uint flags, IntPtr template);

        static Exception Native(string operation) { return new Win32Exception(Marshal.GetLastWin32Error(), operation); }
        static void Check(bool ok, string operation) { if (!ok) throw Native(operation); }
        static void Close(ref IntPtr handle) { if (handle != IntPtr.Zero && handle != new IntPtr(-1)) CloseHandle(handle); handle = IntPtr.Zero; }
        static string CreationTime(IntPtr handle) {
            FILETIME creation, exit, kernel, user;
            Check(GetProcessTimes(handle, out creation, out exit, out kernel, out user), "GetProcessTimes");
            return (((ulong)creation.High << 32) | creation.Low).ToString(CultureInfo.InvariantCulture);
        }
        static void Emit(object value) { Console.Out.WriteLine(JsonSerializer.Serialize(value)); Console.Out.Flush(); }
        static string ReadFrame() {
            var text = new StringBuilder();
            for (;;) {
                int ch = Console.In.Read();
                if (ch == -1) { if (text.Length != 0) throw new IOException("Truncated native control frame"); return null; }
                if (ch == '\n') return text.ToString();
                if (text.Length >= MaxFrame) throw new IOException("Native control frame exceeds limit");
                text.Append((char)ch);
            }
        }
        static JsonDocument RequiredFrame() {
            var frame = ReadFrame();
            if (frame == null) throw new IOException("Parent disconnected before launch authorization");
            return JsonDocument.Parse(frame, new JsonDocumentOptions { MaxDepth = 16 });
        }
        static bool Exited(IntPtr process) {
            uint state = WaitForSingleObject(process, 0);
            if (state == WAIT_OBJECT_0) return true;
            if (state == WAIT_TIMEOUT) return false;
            throw Native("WaitForSingleObject");
        }
        static uint Active(IntPtr job) {
            BASIC_ACCOUNTING info;
            Check(QueryInformationJobObject(job, 1, out info, (uint)Marshal.SizeOf<BASIC_ACCOUNTING>(), IntPtr.Zero), "QueryInformationJobObject");
            return info.ActiveProcesses;
        }
        static string Quote(string value) {
            if (value.IndexOf('\0') >= 0) throw new ArgumentException("NUL in process argument");
            var result = new StringBuilder("\"");
            int slashes = 0;
            foreach (char ch in value) {
                if (ch == '\\') { slashes++; continue; }
                result.Append('\\', ch == '"' ? slashes * 2 + 1 : slashes);
                result.Append(ch); slashes = 0;
            }
            result.Append('\\', slashes * 2); result.Append('"'); return result.ToString();
        }
        static string EnvironmentBlock(JsonElement env) {
            var sorted = new SortedDictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            foreach (var entry in env.EnumerateObject()) {
                string value = entry.Value.GetString();
                if (entry.Name.Length == 0 || entry.Name.IndexOfAny(new char[] {'=', '\0'}) >= 0 || value == null || value.IndexOf('\0') >= 0)
                    throw new ArgumentException("Invalid Windows process environment");
                sorted.Add(entry.Name, value);
            }
            var text = new StringBuilder();
            foreach (var entry in sorted) text.Append(entry.Key).Append('=').Append(entry.Value).Append('\0');
            // Even an empty environment needs two terminating UTF-16 NULs.
            if (sorted.Count == 0) text.Append('\0');
            return text.Append('\0').ToString();
        }
        static FileStream ReadPipe(out IntPtr write) {
            var attributes = new SECURITY_ATTRIBUTES { Length = Marshal.SizeOf<SECURITY_ATTRIBUTES>(), InheritHandle = true };
            IntPtr read;
            Check(CreatePipe(out read, out write, ref attributes, 0), "CreatePipe");
            try {
                Check(SetHandleInformation(read, HANDLE_FLAG_INHERIT, 0), "SetHandleInformation(pipe)");
                return new FileStream(new SafeFileHandle(read, true), FileAccess.Read, 4096, false);
            } catch { Close(ref read); Close(ref write); throw; }
        }
        static NamedPipeClientStream ConnectOutput(string name) {
            if (!System.Text.RegularExpressions.Regex.IsMatch(name, "^cabloy-test-[a-f0-9]{64}-(out|err)$")) throw new ArgumentException("Invalid output pipe name");
            var pipe = new NamedPipeClientStream(".", name, PipeDirection.Out, PipeOptions.Asynchronous);
            try { pipe.Connect(10000); return pipe; } catch { pipe.Dispose(); throw; }
        }
        static int Inspect() {
            using (var request = RequiredFrame()) {
                var rows = new List<object>();
                foreach (var item in request.RootElement.GetProperty("pids").EnumerateArray()) {
                    uint pid = item.GetUInt32();
                    if (pid == 0) throw new ArgumentException("Invalid process PID");
                    IntPtr handle = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | SYNCHRONIZE, false, pid);
                    if (handle == IntPtr.Zero) {
                        int error = Marshal.GetLastWin32Error();
                        if (error == ERROR_INVALID_PARAMETER) continue; // Only confirmed absent PIDs are omitted.
                        throw new Win32Exception(error, "OpenProcess(" + pid.ToString(CultureInfo.InvariantCulture) + ")");
                    }
                    try {
                        string startTime = CreationTime(handle);
                        if (!Exited(handle)) rows.Add(new { pid = pid, startTime = startTime });
                    } finally { Close(ref handle); }
                }
                Emit(new { type = "inspection", processes = rows });
                return 0;
            }
        }
        static void Containment(IntPtr job, string jobId, string frame) {
            using (var request = JsonDocument.Parse(frame, new JsonDocumentOptions { MaxDepth = 16 })) {
                var query = request.RootElement;
                if (query.GetProperty("type").GetString() != "containment" || query.GetProperty("jobId").GetString() != jobId)
                    throw new IOException("Invalid native containment request");
                string requestId = query.GetProperty("requestId").GetString();
                string creation = query.GetProperty("startTime").GetString();
                if (!System.Text.RegularExpressions.Regex.IsMatch(requestId ?? "", "^[a-f0-9]{32}$") ||
                    !System.Text.RegularExpressions.Regex.IsMatch(creation ?? "", "^[1-9][0-9]{0,19}$"))
                    throw new IOException("Invalid native containment identity");
                uint pid = query.GetProperty("pid").GetUInt32();
                if (pid == 0) throw new IOException("Invalid native containment PID");
                bool contained = false;
                IntPtr process = OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION | SYNCHRONIZE, false, pid);
                // Missing, denied, terminated, mismatched and query errors all deny, never infer membership.
                if (process != IntPtr.Zero) {
                    try {
                        bool inJob;
                        contained = !Exited(process) && CreationTime(process) == creation &&
                            IsProcessInJob(process, job, out inJob) && inJob && !Exited(process);
                    } catch { contained = false; }
                    finally { Close(ref process); }
                }
                Emit(new { type = "containment", requestId = requestId, jobId = jobId, contained = contained });
            }
        }
        static int Job() {
            IntPtr job = IntPtr.Zero, attributes = IntPtr.Zero, jobValue = IntPtr.Zero, handlesValue = IntPtr.Zero, environment = IntPtr.Zero;
            IntPtr outWrite = IntPtr.Zero, errWrite = IntPtr.Zero, input = IntPtr.Zero;
            PROCESS_INFORMATION target = new PROCESS_INFORMATION();
            bool initialized = false;
            using (var request = RequiredFrame()) {
                var config = request.RootElement;
                string jobId = config.GetProperty("jobId").GetString();
                Guid parsed;
                if (!Guid.TryParse(jobId, out parsed)) throw new ArgumentException("Invalid jobId");
                try {
                    job = CreateJobObjectW(IntPtr.Zero, null); // unnamed; no other process can open it by name
                    if (job == IntPtr.Zero) throw Native("CreateJobObjectW");
                    Check(SetHandleInformation(job, HANDLE_FLAG_INHERIT, 0), "SetHandleInformation(job)");
                    var limits = new EXTENDED_LIMIT();
                    limits.BasicLimitInformation.LimitFlags = 0x2000; // KILL_ON_JOB_CLOSE, explicitly no breakaway flags
                    Check(SetInformationJobObject(job, 9, ref limits, (uint)Marshal.SizeOf<EXTENDED_LIMIT>()), "SetInformationJobObject");
                    Emit(new { type = "ready", jobId = jobId, pid = GetCurrentProcessId(), startTime = CreationTime(GetCurrentProcess()) });
                    // The controller publishes the helper identity durably BEFORE sending authorize.
                    var authorization = Task.Run(() => RequiredFrame());
                    if (!authorization.Wait(30000)) throw new TimeoutException("Launch authorization timed out");
                    using (var authorize = authorization.GetAwaiter().GetResult()) {
                        if (authorize.RootElement.GetProperty("type").GetString() != "authorize" || authorize.RootElement.GetProperty("jobId").GetString() != jobId)
                            throw new IOException("Launch not authorized");
                    }
                    using (var stdout = ConnectOutput(config.GetProperty("stdoutPipe").GetString()))
                    using (var stderr = ConnectOutput(config.GetProperty("stderrPipe").GetString()))
                    using (var outRead = ReadPipe(out outWrite))
                    using (var errRead = ReadPipe(out errWrite)) {
                        var security = new SECURITY_ATTRIBUTES { Length = Marshal.SizeOf<SECURITY_ATTRIBUTES>(), InheritHandle = true };
                        input = CreateFileW("NUL", 0x80000000, 3, ref security, 3, 0, IntPtr.Zero);
                        if (input == new IntPtr(-1)) throw Native("CreateFileW(NUL)");
                        IntPtr size = IntPtr.Zero;
                        InitializeProcThreadAttributeList(IntPtr.Zero, 2, 0, ref size);
                        if (size == IntPtr.Zero) throw Native("InitializeProcThreadAttributeList(size)");
                        attributes = Marshal.AllocHGlobal(size);
                        Check(InitializeProcThreadAttributeList(attributes, 2, 0, ref size), "InitializeProcThreadAttributeList"); initialized = true;
                        jobValue = Marshal.AllocHGlobal(IntPtr.Size); Marshal.WriteIntPtr(jobValue, job);
                        // Test-only negative capability probe. It can only prevent launch, never weaken containment.
                        if (config.TryGetProperty("rejectJobAssignment", out var reject) && reject.GetBoolean()) Marshal.WriteIntPtr(jobValue, IntPtr.Zero);
                        Check(UpdateProcThreadAttribute(attributes, 0, new IntPtr(PROC_THREAD_ATTRIBUTE_JOB_LIST), jobValue, new IntPtr(IntPtr.Size), IntPtr.Zero, IntPtr.Zero), "UpdateProcThreadAttribute(JOB_LIST)");
                        handlesValue = Marshal.AllocHGlobal(IntPtr.Size * 3);
                        Marshal.WriteIntPtr(handlesValue, 0, input); Marshal.WriteIntPtr(handlesValue, IntPtr.Size, outWrite); Marshal.WriteIntPtr(handlesValue, IntPtr.Size * 2, errWrite);
                        Check(UpdateProcThreadAttribute(attributes, 0, new IntPtr(PROC_THREAD_ATTRIBUTE_HANDLE_LIST), handlesValue, new IntPtr(IntPtr.Size * 3), IntPtr.Zero, IntPtr.Zero), "UpdateProcThreadAttribute(HANDLE_LIST)");
                        var startup = new STARTUPINFOEX();
                        startup.StartupInfo.cb = Marshal.SizeOf<STARTUPINFOEX>(); startup.StartupInfo.Flags = STARTF_USESTDHANDLES;
                        startup.StartupInfo.StdInput = input; startup.StartupInfo.StdOutput = outWrite; startup.StartupInfo.StdError = errWrite; startup.AttributeList = attributes;
                        string command = config.GetProperty("command").GetString();
                        if (!Path.IsPathFullyQualified(command) || !File.Exists(command) || !command.EndsWith(".exe", StringComparison.OrdinalIgnoreCase)) throw new ArgumentException("Windows owned command must be an absolute .exe path; launch npm via node's npm-cli.js");
                        var commandLine = new StringBuilder(Quote(command));
                        foreach (var argument in config.GetProperty("args").EnumerateArray()) commandLine.Append(' ').Append(Quote(argument.GetString()));
                        if (commandLine.Length >= 32767) throw new ArgumentException("Windows command line too long");
                        environment = Marshal.StringToHGlobalUni(EnvironmentBlock(config.GetProperty("env")));
                        Check(CreateProcessW(command, commandLine, IntPtr.Zero, IntPtr.Zero, true,
                            CREATE_SUSPENDED | CREATE_UNICODE_ENVIRONMENT | EXTENDED_STARTUPINFO_PRESENT | CREATE_NO_WINDOW,
                            environment, config.GetProperty("cwd").GetString(), ref startup, out target), "CreateProcessW(JOB_LIST)");
                        Close(ref outWrite); Close(ref errWrite); Close(ref input);
                        // Creation-time membership is already established. A crash even here closes the Job and kills the suspended process.
                        if (Active(job) != 1) throw new IOException("Created process was not accounted in the owned Job");
                        var outputTask = outRead.CopyToAsync(stdout);
                        var errorTask = errRead.CopyToAsync(stderr);
                        if (ResumeThread(target.Thread) == UInt32.MaxValue) throw Native("ResumeThread");
                        Close(ref target.Thread);
                        Emit(new { type = "started" });
                        var control = Task.Run(() => ReadFrame());
                        bool failed = false, terminated = false;
                        long rootExitAt = -1, stopAt = -1;
                        var clock = Stopwatch.StartNew();
                        for (;;) {
                            bool rootExited = Exited(target.Process);
                            uint active = Active(job);
                            if (rootExited && rootExitAt < 0) rootExitAt = clock.ElapsedMilliseconds;
                            if (control.IsCompleted && !terminated) {
                                bool disconnect = false;
                                try {
                                    string frame = control.GetAwaiter().GetResult();
                                    if (frame == null) disconnect = true;
                                    else {
                                        Containment(job, jobId, frame);
                                        control = Task.Run(() => ReadFrame());
                                    }
                                } catch { disconnect = true; }
                                if (disconnect) {
                                    // EOF, explicit stop, malformed input, and reader faults still terminate.
                                    failed = true; terminated = true; stopAt = clock.ElapsedMilliseconds;
                                    Check(TerminateJobObject(job, 1), "TerminateJobObject(parent stop/disconnect)");
                                }
                            }
                            if (rootExited && active == 0) break;
                            if (!terminated && rootExitAt >= 0 && clock.ElapsedMilliseconds - rootExitAt >= 1000) {
                                failed = true; terminated = true; stopAt = clock.ElapsedMilliseconds;
                                Check(TerminateJobObject(job, 1), "TerminateJobObject(remaining descendants)");
                            }
                            if (terminated && clock.ElapsedMilliseconds - stopAt > 10000) throw new TimeoutException("Owned Windows Job did not drain");
                            Thread.Sleep(25);
                        }
                        uint exitCode; Check(GetExitCodeProcess(target.Process, out exitCode), "GetExitCodeProcess");
                        if (!Task.WaitAll(new Task[] { outputTask, errorTask }, 10000)) throw new TimeoutException("Owned process output did not drain");
                        stdout.Flush(); stderr.Flush();
                        Emit(new { type = "drained", code = exitCode, failed = failed });
                        return 0; // Controller must observe this successful helper exit before durable drainage.
                    }
                } finally {
                    // Sole Job handle always closes, including assignment/resume/query/output failures.
                    Close(ref job); Close(ref target.Thread); Close(ref target.Process);
                    Close(ref input); Close(ref outWrite); Close(ref errWrite);
                    if (initialized) DeleteProcThreadAttributeList(attributes);
                    if (attributes != IntPtr.Zero) Marshal.FreeHGlobal(attributes);
                    if (jobValue != IntPtr.Zero) Marshal.FreeHGlobal(jobValue);
                    if (handlesValue != IntPtr.Zero) Marshal.FreeHGlobal(handlesValue);
                    if (environment != IntPtr.Zero) Marshal.FreeHGlobal(environment);
                }
            }
        }
        public static int Run(string mode) {
            try {
                Console.InputEncoding = Utf8; Console.OutputEncoding = Utf8;
                if (mode == "inspect") return Inspect();
                if (mode == "job") return Job();
                throw new ArgumentException("Invalid native process mode");
            } catch (Exception error) { Console.Error.WriteLine(error.ToString()); return 1; }
        }
    }
}
