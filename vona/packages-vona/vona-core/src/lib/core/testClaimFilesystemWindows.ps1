#requires -Version 7.0
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
try {
  if (-not $IsWindows) { throw 'Windows is required' }
  Add-Type -Path (Join-Path $PSScriptRoot 'testClaimFilesystemWindows.cs')
  while ($null -ne ($line = [Console]::In.ReadLine())) {
    $request = $line | ConvertFrom-Json -AsHashtable
    $result = [Cabloy.TestClaimFilesystem]::Execute(
      [string]$request.command, [string]$request.path, [bool]$request.allowMissing,
      [string]$request.content, [string]$request.expected)
    [Console]::Out.WriteLine(($result | ConvertTo-Json -Compress))
    [Console]::Out.Flush()
  }
} catch {
  # Never copy request contents, paths, or native error diagnostics into logs.
  [Console]::Out.WriteLine('{"ok":false,"code":"EUNSAFE"}')
}
