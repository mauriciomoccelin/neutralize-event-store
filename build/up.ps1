try {
  # app
  $env:APP_PORT="80"

  # kafka
  $env:KAFKA_LISTENER_OUTSIDE="localhost:9092"

  # sql2019
  $env:MONGO_URI="mongodb://mongo:27017/event-store"

  Set-Location ..
  npm i
  npm run build
  docker-compose -p "neutralize-event-store" up --build --detach
}
catch {
  Set-Location ./build
}
finally {
  Set-Location ./build
}
