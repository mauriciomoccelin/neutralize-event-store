param(
  [switch]$Down,
  [switch]$Teste2e
)

Clear-Host

$env:COMPOSE_PROJECT_NAME="event-store"

if ($True -eq $Down) {
  docker compose --env-file ./config/dev.env down
  return
}

if ($True -eq $Teste2e) {
  docker compose --env-file ./config/e2e.env up --build esl-e2e
  return
}

docker compose --env-file ./config/dev.env up --build esl-dev