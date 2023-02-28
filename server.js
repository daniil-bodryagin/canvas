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
    console.log('PUT');
    let body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      console.log('Body: ');// + body);
      response.writeHead(200, headers);
      const name = request.url.split('/');
      fs.writeFileSync(
        `../maps/${name[name.length - 1]}.json`,
        body,
        { encoding: "utf-8" }
      )
      response.end(JSON.stringify({message:'Map is saved'}));
    });
    return;
  } else if (request.method == 'GET'){
    console.log('GET', request.url);
    if (request.url == '/') {
      const mapList = fs.readdirSync('../maps', {withFileTypes: true});
      console.log(mapList);
      mapList.sort(
        (a, b) => a.name.localeCompare(b.name, "en")
      );
      response.writeHead(200, headers);
      response.end(JSON.stringify(mapList));
    } else {
      const map = fs.readFileSync(`../maps/${request.url}.json`, { encoding: "utf-8" });
      response.writeHead(200, headers);
      response.end(JSON.stringify(map));
    }
    return;
  } else {
    console.log('DELETE');
    response.writeHead(200, headers);
    const name = request.url.split('/');
    fs.rmSync(`../maps/${name[name.length - 1]}.json`);
    response.end(JSON.stringify({message:'Map is deleted'}));
  }
  return;
});

const port = 8000;
const host = '127.0.0.1';
server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);
