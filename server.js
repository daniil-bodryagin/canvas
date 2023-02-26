const fs = require('node:fs');
const http = require('http');

const server = http.createServer(function(request, response) {

  if (request.method == 'POST' || request.method == 'OPTIONS') {
    console.log('POST');
    let body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      console.log('Body: ');// + body);
      response.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET', 
        'Access-Control-Max-Age': 2592000, 
        'Access-Control-Allow-Headers': '*'
      });
      const map = JSON.parse(body);
      fs.writeFileSync(
        `../maps/${map.name}.json`,
        `${JSON.stringify(map)}`,
        { encoding: "utf-8" }
      )
      response.end(JSON.stringify({message:'Map is saved'}));
    });
  } 
  else {
    console.log('GET', request.url)
    // var link = request.url.slice(1)
    // var contentType = link.split('.')[1] == 'js' ? 'application/javascript' : 'text/html'
    // try {
    //     var result = fs.readFileSync(`${link}`, { encoding: "utf-8" });
    //     response.writeHead(200, {'Content-Type': `${contentType}`})
    //     response.end(result)
    // } catch {
    //     console.log('no file')
    // }    
  }
});

const port = 8000;
const host = '127.0.0.1';
server.listen(port, host);
console.log(`Listening at http://${host}:${port}`);
