param(
  [switch]$Dev,
  [switch]$Test2e
)

Clear-Host

if ($True -eq $Test2e) {
  Set-Location ../docker
  docker-compose --env-file ../config/e2e.env up --build graphql-logs-e2e
  Set-Location ../build

  return
} elseif ($True -eq $Dev) {
  Set-Location ../docker
  docker-compose --env-file ../config/dev.env up --build graphql-logs-dev
  Set-Location ../build

  return
}

Set-Location ../docker
docker-compose --env-file ../prod.env up --build --detach graphql-logs-api
Set-Location ../build
