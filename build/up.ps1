try {
  # sql2019
  $env:DB_HOST="sql2019"
  $env:DB_DATABASE="graphql_logs"
  $env:DB_USER="sa"
  $env:DB_PASSWORD=""

  # kafka
  $env:KAFKA_LISTENER_OUTSIDE="localhost:9092"

  # app
  $env:APP_PORT="80"
  Set-Location ..
  npm run build
  docker-compose up --build --detach
}
catch {
  Set-Location ./build
}
finally {
  Set-Location ./build
}
