/* m2m-no-fail-form */

var fs = require('fs');
var http = require('http');
var querystring = require('querystring');
var util = require('util');

var messageColor = '\033[36m';
var bodyColor = '\033[32m';
var lineColor = '\033[37m';
var resetColor = '\033[0m';

var log = (process.argv.length > 2 && process.argv[2] == 'log');

// in-memory storage (since this is just an experiment<g>)
var storage = {};
storage.href="/data";
storage.status="pending";
storage.data = [
  {name:'firstname',value:''},
  {name:'lastname',value:''},
  {name:'email',value:''},
  {name:'website',value:''},
  {name:'cellphone',value:''}
];
storage.actions = [
  {name:"write", href:"/data",
    data : [
      {name:'firstname',value:''},
      {name:'lastname',value:''},
      {name:'email',value:''},
      {name:'website',value:''},
      {name:'cellphone',value:''}
    ]
  }
];

function handler(req, res) {

  switch(req.url) {
    case '/':
      switch(req.method) {
        case 'GET':
          emitHtml(res);
          break;
        default:
          emitResponse(415,"Method Not Allowed", "text/plain");
          break;
      }
      break;
    case '/data':
      switch(req.method) {
        case 'GET':
          emitData(res);
          break;
        case 'PUT':
          processData(req, res);
          break;
        default:
          emitResponse(415,"Method Not Allowed", "text/plain");
          break;
      }
      break;
    default:
      emitResponse(res, 404,"Not Found","text/plain");
      break;
  }
}

function emitHtml(res) {
  fs.readFile("./index.html", "binary", function(err, file){sendFile(err, file, res);});
}
function sendFile(err, file, res) {
  if(err) {
    emitResponse(res, 500, err.message, "text/plain");
  }
  else {
    emitResponse(res, 200, file, "text/html");
  }
}

function emitData(res) {
  emitResponse(res, 200, JSON.stringify(storage), "application/json");

  if (log) {
    console.log(messageColor + "response body:\r\n", bodyColor + util.inspect(storage,false,null));
    console.log(lineColor + "================================================" + resetColor);
  }
}

function processData(req, res) {
  var body = '';

  req.on('data', function(chunk) {
    body += chunk.toString();
  });

  req.on('end', function() {
    var state, i, x, j, data;

    state = querystring.parse(body);
    if (log)
      console.log(messageColor + "request body:", bodyColor + body);

    // update storage w/ new data
    for(i=0,x=storage.data.length;i<x;i++) {
      if(state[storage.data[i].name]) {
        storage.data[i].value=state[storage.data[i].name];
      }
    }

    // add any inputs still empty
    j=0;
    data = [];
    for(i=0,x=storage.data.length;i<x;i++) {
      if(storage.data[i].value==='') {
        data[j++] = {name:storage.data[i].name, value:''};
      }
    }
    storage.actions[0].data=data;

    // update the "status" of the storage (pending,complete)
    if(j>0) {
      storage.status='pending';
    }
    else {
      storage.status='complete';
    }

    emitData(res);
    //emitResponse(res, 200, JSON.stringify(storage),"application/json");
  });
}

function emitResponse(res, status, text, type) {
  res.writeHead(status, {'content-type':type});
  res.end(text);
}

http.createServer(handler).listen(process.env.PORT || 1337);
