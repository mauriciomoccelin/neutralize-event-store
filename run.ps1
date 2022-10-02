param(
  [switch]$Dev,
  [switch]$Teste2e
)

Clear-Host

$env:COMPOSE_PROJECT_NAME="event-store"

if ($True -eq $Teste2e) {
  Set-Location ../docker
  docker compose --env-file ./config/dev.env up --build esl-e2e
  Set-Location ../build

  return
}

Set-Location
docker compose --env-file ./config/dev.env up --build esl-dev
Set-Location ../build