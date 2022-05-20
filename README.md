# Neutralize Event Store

A service for event storage on MongoDB using kafka as message transport. The service is connected to the broker and when it receives a message published in the defined topic it registers the event in the database.

The service exposes events using an api in [graphql](https://graphql.org/).

It can be used to log events and nested aggregation root to track user behavior on a given system. See more in this article: [Pattern: Event sourcing](https://microservices.io/patterns/data/event-sourcing.html).

---

## Dependencies

- [NodeJS](https://nodejs.org/en/)
- [Docker](https://docs.docker.com/)
- [PowerShell Core](https://docs.microsoft.com/pt-br/powershell/scripting/install/installing-powershell?view=powershell-7.1)

---
## For deploy on docker

Go to the `./build` folder and set a value for the variables on `up.ps1`:

Ex:
```pwsh
# app
$env:APP_PORT="80"

# kafka
$env:KAFKA_LISTENER_OUTSIDE="localhost:9092"

# sql2019
$env:MONGO_URI="mongodb://mongo:27017/event-store"

...
```

Then in the `./build` folder, run the `./up.ps1` file with the following command.

```pwsh
pwsh -File up.ps1
```
---
## Publishing mesagen in kafka

Let's leave an example of how to publish a message in the broker in *C#* code.

- Create a console project.

```pwsh
dotnet new console -o Publish
```

- Create a model that represents an event in your application.
```csharp
public class StoreEvent
{
    public Guid AggregateId { get; set; }
    public string Type { get; set; }
    public DateTime DateTime { get; set; }
    public object Data { get; set; }
    public IEnumerable<object> Metadata { get; set; }

    public StoreEvent(
        string type,
        Guid aggregateId,
        DateTime dateTime,
        object data,
        IEnumerable<object> metadata
    )
    {
        Type = type;
        AggregateId = aggregateId;
        DateTime = dateTime;
        Data = data;
        Metadata = metadata;
    }
}
```
- Post the message in the kafka thread.

```csharp
static class Program
{
    static async Task Main(string[] args)
    {
        var config = new ProducerConfig
        {
            BootstrapServers = "localhost:9092",
            ClientId = "nl.events.consumer",
        };

        using (var producer = new ProducerBuilder<string, string>(config).Build())
        {
            foreach (var item in Enumerable.Range(0, 1000))
            {
                var @event = new StoreEvent(
                    typeof(StoreEvent).FullName,
                    Guid.NewGuid(),
                    DateTime.Now,
                    item % 2 == 0 ? new
                    {
                        id = Guid.NewGuid(),
                        name = "John Doe",
                        email = "john.dow@fake.mail"
                    } :
                    new[] {
                        new
                        {
                            id = Guid.NewGuid(),
                            name = "John Doe",
                            email = "john.dow@fake.mail"
                        }
                    },
                    new object[]
                    {
                        new {
                            id = Guid.NewGuid(),
                            name = "John Doe",
                            email = "john.dow@fake.mail"
                        }
                    }
                );

                var message = new Message<string, string>
                {
                    Key = typeof(StoreEvent).FullName,
                    Value = JsonConvert.SerializeObject(
                        @event,
                        new JsonSerializerSettings
                        {
                            NullValueHandling = NullValueHandling.Ignore,
                            ContractResolver = new CamelCasePropertyNamesContractResolver()
                        }
                    )
                };

                await producer.ProduceAsync("nl.tp.events", message);
            }
        }
    }
}
```
---
## Read data with GraphQL 

If running on your local machine go to `localhost/nl-event-store/v1/graphql` in your browser.

In query variables add the following value:
```json
{
  "datetime": "2022-08-03",
  "limit": 10, // max 30
  "offset": 1,
  "type": ""
}
```
And in the query copy the following code:

```
query GetPagedEvents($datetime: String!, $limit: Int, $offset: Int, $type: String) {
  result: getEvents(datetime: $datetime, limit: $limit, offset: $offset, type: $type) {
    total
    items {
      aggregateId,
      dateTime,
      type
    }
  }
}

```

The return should be as follows.

```json
{
  "data": {
    "result": {
      "total": 1000,
      "items": [
        {
          "aggregateId": "42e9e8b3-98bd-4f75-a7b5-4d8e6ce4bed2",
          "dateTime": "2022-05-20T11:21:49.476Z",
          "type": "StoreEvent"
        },
        ...
      ]
    }
  }
}
```

Ok, the services are online you can check if the kafka connection is online in the `graphql` container logs with the following command.

```
docker logs graphql
```

In the exit look for **Kafka is starting**.

With this it is now possible to publish a message on the broker.