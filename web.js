var http = require('http')
var util = require('util')
var querystring = require('querystring')
var client = require('mongodb').MongoClient

var uri = process.env.MONGOLAB_URI || "mongodb://juanpa:yami@ds111718.mlab.com:11718/practicamongodb"
//MONGOLAB_URI=mongodb://user:pass@server.mongohq.com:port/db_name
client.connect(uri, function(error, db) {
	if (error) return console.error(error)
	var collection = db.collection('messages')
	var app = http.createServer(function (request, response) {
		if (request.method === 'GET' && request.url === '/messages/list.json') {
			collection.find().toArray(function(error,results) {
				if (error) return console.error(error)
				response.writeHead(200,{ 'Content-Type': 'text/plain'})
				console.dir(results)
				response.end(JSON.stringify(results))
			})
		} else if (request.method === 'POST' && request.url === '/messages/create.json') {
			request.on('data', function(data) {
				collection.insert(querystring.parse(data.toString('utf-8')), {safe:true}, function(error, obj) {
					if (error) return console.error(error)
					response.end(JSON.stringify(obj))
				})
			})
		} else {
			response.end('Resultado de la prueba: \nha funcionado')
		}
	})
	var port = process.env.PORT || 1337
	app.listen(port)
})
