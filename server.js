const fs = require('node:fs');
const http = require('http');

const server = http.createServer(function(request, response) {

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'OPTIONS, PUT, DELETE, GET', 
    'Access-Control-Max-Age': 2592000, 
    'Access-Control-Allow-Headers': '*'
  };

  if (request.method == 'OPTIONS') {
    response.writeHead(204, headers);
    response.end();
    return;
  } else if (request.method == 'PUT') {
    console.log('PUT', request.url);
    let body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      //console.log('Body: ' + body);
      response.writeHead(200, headers);
      fs.writeFileSync(
        `../server${request.url}`,
        body,
        { encoding: "utf-8" }
      )
      response.end(JSON.stringify({message:'Map is saved'}));
    });
    return;
  } else if (request.method == 'GET'){
    console.log('GET', request.url);
      if (request.url.endsWith('.json')) {
          const file = fs.readFileSync(`../server${request.url}`, { encoding: "utf-8" });
          response.writeHead(200, headers);
          response.end(JSON.stringify(file));
      } else {
        const fileList = fs.readdirSync(`../server${request.url}`, {withFileTypes: true});
        fileList.sort(
          (a, b) => a.name.localeCompare(b.name, "en")
        );
        console.log(fileList);
        response.writeHead(200, headers);
        response.end(JSON.stringify(fileList));
      }
    return;
  } else {
    console.log('DELETE', request.url);
    response.writeHead(200, headers);
    fs.rmSync(`../server${request.url}`);
    response.end(JSON.stringify({message:'Map is deleted'}));
  }
  return;
});

const port = 8000;
const host = '127.0.0.1';
server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);
