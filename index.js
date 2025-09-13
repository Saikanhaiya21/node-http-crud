const http = require('http');
const PORT = 3000;
const HOSTNAME = 'localhost';

const index = (req, res) =>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end('Crud Operation!\n');
}

http.createServer((req, res) => {
    if(req.url === '/'){
        return index(req,res);

        res.writeHead(404);
        res.end(http.STATUS_CODES[404])
    }
}).listen(PORT, HOSTNAME, () => {
    console.log(`Server is running at http://${HOSTNAME}:${PORT}/`);
});

