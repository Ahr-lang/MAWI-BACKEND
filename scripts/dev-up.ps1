Param()

$RepoRoot = Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Definition) "..")
$ScriptDir = Join-Path $RepoRoot 'scripts'

Write-Host "Generating dev certs (mkcert)..."
"& $ScriptDir\generate-dev-certs.ps1"

Write-Host "Starting docker compose (build + detached)..."
Push-Location (Join-Path $RepoRoot 'docker')
docker compose up --build -d
Pop-Location

Write-Host "Done. Use 'docker compose logs -f caddy' in the docker folder to follow logs."
