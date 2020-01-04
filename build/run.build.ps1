try {
  # sql2019
  $env:DB_HOST=""
  $env:DB_DATABASE="graphql_logs"
  $env:DB_USER=""
  $env:DB_PASSWORD=""

  # kafka
  $env:KAFKA_LISTENER_OUTSIDE=""

  # app
  $env:APP_PORT="80"
  Set-Location ..
  docker-compose up --build --detach
}
catch {
  Set-Location ./build
}
finally {
  Set-Location ./build
}
