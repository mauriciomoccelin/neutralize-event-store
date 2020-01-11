try {
  # sql2019
  $env:DB_HOST="sql2019"
  $env:DB_DATABASE="graphql_logs"
  $env:DB_USER="sa"
  $env:DB_PASSWORD="3U>p-)EW.#.8l"

  # kafka
  $env:KAFKA_LISTENER_OUTSIDE="10.0.75.1:9092"

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
