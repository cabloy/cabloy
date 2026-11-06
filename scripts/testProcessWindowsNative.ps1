# PowerShell 7 is an explicit runtime dependency; this file is never shell-interpolated.
# stdout belongs exclusively to the bounded native JSON control protocol.
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('job', 'inspect')]
    [string] $Mode
)
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
try {
    if ($PSVersionTable.PSVersion.Major -lt 7 -or -not $IsWindows) {
        throw 'The isolated Windows process backend requires PowerShell 7 on native Windows.'
    }
    Add-Type -Path (Join-Path $PSScriptRoot 'testProcessWindowsNative.cs') -ErrorAction Stop
    $code = [Cabloy.TestProcessWindowsNative]::Run($Mode)
    exit $code
} catch {
    [Console]::Error.WriteLine($_.Exception.ToString())
    exit 1
}
