# Neutralize Event Store

A service for event storage on sql server using kafka as message transport. The service is connected to the broker and when it receives a message published in the defined topic it registers the event in the database.

The service exposes events using an api in [graphql](https://graphql.org/).

It can be used to log events and nested aggregation root to track user behavior on a given system. See more in this article: [Pattern: Event sourcing](https://microservices.io/patterns/data/event-sourcing.html).

## Dependencies

- [PowerShell Core](https://docs.microsoft.com/pt-br/powershell/scripting/install/installing-powershell?view=powershell-7.1)
- [knex Migration CLI](https://knexjs.org/#Migrations-CLI)

## For deploy on docker

Go to the `./build` folder and set a value for the variable `$env:DB_PASSWORD=""`. It must be a strong password as the sql server requires it.

```pwsh
$env:DB_PASSWORD="Strong Password"
```

Then in the `./build` folder, run the `./up.ps1` file
with the following command.

```pwsh
pwsh -File up.ps1
```

Access the SQL Server database and create the database to run the database migrations.

```sql
CREATE DATABASE Store
GO
```

Before running the migrations access your terminal and run the pwsh command to start a PowerShell Core session. Then set the following environment variables, change as needed.

```pwsh
$env:DB_HOST="localhost"
$env:DB_DATABASE="store"
$env:DB_USER="sa"
$env:DB_PASSWORD="Strong Password"
```

Then run the migrations with the following command, still in the `./src/data` folder.

```pwsh
knex migrate:latest
```

The output will look something like this:
```
Requiring external module ts-node/register
Batch 1 run: 1 migrations
```

If running on your local machine go to `localhost:30001/graphql` in your browser.

In query variables add the following value:
```json
{
  "datetime": "2021-08-03",
  "limit": 10,
  "offset": 1,
  "search": "",
}
```
And in the query copy the following code:

```
query GetPagedEvents($datetime: String!, $limit: Int, $offset: Int, $search: String) {
  result: getEvents(datetime: $datetime, limit: $limit, offset: $offset, search: $search) {
    total
    itens {
      eventId,
      datetime,
      eventType,
      data,
      metadata
    }
  }
}
```

The return should be as follows.

```json
{
  "data": {
    "result": {
      "total": 0,
      "itens": []
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
    public string Nome { get; set; }

    public StoreEvent()
    {
        AggregateId = Guid.NewGuid();
        Nome = "Neutralize Logs"; 
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
            ClientId = "nl.events",
        };

        using (var producer = new ProducerBuilder<string, string>(config).Build())
        {
            foreach (var item in Enumerable.Range(0, 1000))
            {
                var message = new Message<string, string>
                {
                    Key = typeof(StoreEvent).FullName,
                    Value = JsonConvert.SerializeObject(new StoreEvent())
                };

                Console.WriteLine(item);
                await producer.ProduceAsync("nl.tp.events", message);
            }
        }
    }
}
```

### Comments

Change the database user and ensure there is a strong password. The examples are as basic as possible to make understanding easier.
The database used is sql server but the ideal would be a non-relational database to store the events. We implement because we like challenges.
For more information see the [knex repository](https://github.com/knex/knex).