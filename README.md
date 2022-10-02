# Neutralize Event Store

A service for event storage on MongoDB using kafka as message transport. The service is connected to the broker and when it receives a message published in the defined topic it registers the event in the database.

It can be used to log events and nested aggregation root to track user behavior on a given system. See more in this article: [Pattern: Event sourcing](https://microservices.io/patterns/data/event-sourcing.html).

---

## Dependencies

- [NodeJS](https://nodejs.org/en/)
- [Docker](https://docs.docker.com/)
- [PowerShell Core](https://docs.microsoft.com/pt-br/powershell/scripting/install/installing-powershell?view=powershell-7.1)

---

## For run e2e test

Then in the `./` folder, run the `./run.ps1` file with the following command.

```pwsh
run.ps1 -Teste2e
```

---
## For develop

Then in the `./` folder, run the `./run.ps1` file with the following command.

```pwsh
run.ps1
```
---
## Publishing mesagen in kafka

> See how to create a tenant and generate a token in 2e2 tests.

Let's leave an example of how to publish a message in the broker in *C#* code.

- Create a console project.

```pwsh
dotnet new console -o Producer

dotnet add package Confluent.Kafka
dotnet add package Newtonsoft.Json

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

        var token = Encoding.UTF8.GetBytes("token here");

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
                    ),
                    Headers = new Headers
                    {
                        { "X-NL-TOKEN", token }
                    }
                };

                await producer.ProduceAsync("nl.tp.events", message);
            }
        }
    }
}
```
---
## Read data with REST API

If running on your local machine use.

GET `nl-event-store/v1/event/list?limit=2&offset=0&datetime=2021-08-01`
Response
```json
{
  "total": 3,
  "items": [
    {
      "_id": "62e5d50b7092826cabfdd2c8",
      "type": "mollitia-consequatur-deleniti",
      "dateTime": "2022-07-31T00:01:09.311Z",
      "aggregateId": "aspernatur-quaerat-eum"
    },
    {
      "_id": "62e5d30bd57c66b6e57a6c97",
      "type": "dolores-exercitationem-earum",
      "dateTime": "2022-07-30T23:44:00.328Z",
      "aggregateId": "ipsum-harum-error"
    }
  ]
}
```