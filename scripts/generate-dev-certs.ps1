Param()

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$RepoRoot = Resolve-Path (Join-Path $ScriptDir "..")
$SslDir = Join-Path $RepoRoot 'caddy\\ssl'

if (-not (Test-Path $SslDir)) {
    Write-Host "Creating ssl directory: $SslDir"
    New-Item -ItemType Directory -Path $SslDir | Out-Null
}

# Try to find mkcert
$mkcertCmd = Get-Command mkcert -ErrorAction SilentlyContinue
if (-not $mkcertCmd) {
    $userBin = Join-Path $env:USERPROFILE 'bin\\mkcert.exe'
    if (Test-Path $userBin) {
        $mkcertCmd = $userBin
    }
}

if (-not $mkcertCmd) {
    Write-Error "mkcert not found in PATH. Install mkcert (https://github.com/FiloSottile/mkcert) and try again. For Windows you can put mkcert.exe in %USERPROFILE%\\bin and add it to PATH."
    exit 1
}

Write-Host "Using mkcert: $mkcertCmd"

Write-Host "Installing local CA (if not already installed)..."
& $mkcertCmd -install

$certFile = Join-Path $SslDir 'localhost.pem'
$keyFile = Join-Path $SslDir 'localhost-key.pem'

Write-Host "Generating cert and key into: $SslDir"
& $mkcertCmd -cert-file $certFile -key-file $keyFile "localhost" "127.0.0.1" "api.local"

Write-Host "Done. Files created:"
Get-ChildItem -Path $SslDir | Format-Table Name,Length,LastWriteTime -AutoSize

Write-Host "Now run (from the docker folder): docker compose up --build -d"
