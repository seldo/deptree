const remoteHost = "https://registry.npmjs.org/"
const headers = {}

var restify = require('restify');
var fetch = require('isomorphic-fetch')
var url = require('url')

var server = restify.createServer({
  name: 'deptree',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(
  function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    return next()
  }
)

// push /api to the registry
server.get('/api/.*', function(req, res, next) {
  // shift /api and reconstitute
  var endpoint = url.parse(req.url).path.split("/").splice(2).join("/")
  console.log(endpoint)
  var response = fetch(`${remoteHost}${endpoint}`,{
    headers: headers
  })
  .then((response) => {
    response.json().then((json) => {
      res.send(json)
      return next()
    })
  })
});

// serve static files
server.get(/\/public\/?.*/, restify.serveStatic({
    directory: __dirname
}));

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
