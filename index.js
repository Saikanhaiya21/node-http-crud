const http = require('http');
const PORT = 3000;
const HOSTNAME = 'localhost';

http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('Crud Operation\n');
}).listen(PORT, HOSTNAME, () => {
    console.log(`Server is running at http://${HOSTNAME}:${PORT}/`);
});

