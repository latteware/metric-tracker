# metric-tracker

### Run the project

This project requieres redis and to the install dependencies with:
```
npm install
```

To start the metrics server do:
```
supervisor runner.js | bunyan 

```

### Create a metric

```
curl -H "Content-Type: application/json" -X POST -d '{}' http://localhost:3000/metrics/METRIC_KEY
```

Sample call with 
```
curl -H "Content-Type: application/json" -X POST -d '{"keys":["user.JGbgvo8E4C", "post.V0lURRlURT"]}' http://localhost:3000/metrics/view-10-22-2016
```

## Routes


#### Get all metrics

`GET /metrics/` Allows to get all available metrics and the total for each. Sample response:

```
{
	"view-10-22-2016":"4",
	"view-10-21-2016":"1"
}
```

#### Get metric detail

`GET /metrics/:metricKey` Allows to get a metric with its total and details. Sample response:

```
{
	"details":{
		"post":{
			"V0lURRlUR4":"1",
			"V0lURRlURT":"3"
		},
		"user":{
			"JGbgvo8E4C":"4"
		}
	},
	"total":"4"
}
```

#### Add metric value

`POST /metrics/:metricKey` Adds a metric plus the extra keys to track from this metric, sample body:

```
{
	"keys": ["user.JGbgvo8E4C", "post.V0lURRlURT"]
}
```

Using dot on the metrics allows to create metrics in a object form, based on Lodash [ZipObjectDeep](https://lodash.com/docs/4.16.4#zipObjectDeep)

All metric values are store in redis with a ttl(time to live) of 3 days.

## To Dos

- [Done]Add Mongo action tracket over redis condenced metrics
- [Done]Add Mongo owner to group actions
- [Done]Add Auth to request with a user, token file
- [Done]Add env errors for prod and for dev
- Add config for redis and mongo dbs
- Add owner data
- Add max and incremet operations owner data
- Add tests for actions and metrics

