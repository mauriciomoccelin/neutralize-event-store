param(
  [switch]$Dev,
  [switch]$Teste2e
)

Clear-Host

$env:COMPOSE_PROJECT_NAME="event-store"

if ($True -eq $Teste2e) {
  Set-Location ../docker
  docker-compose --env-file ../config/e2e.env up --build event-store-logs-e2e
  Set-Location ../build

  return
} elseif ($True -eq $Dev) {
  Set-Location ../docker
  docker-compose --env-file ../config/dev.env up --build event-store-logs-dev
  Set-Location ../build

  return
}

Set-Location ../docker
docker-compose --env-file ../prod.env up --build --detach event-store-logs-api
Set-Location ../build
