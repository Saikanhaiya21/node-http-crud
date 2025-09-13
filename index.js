const http = require('http');
const fs = require('fs');
const url = require('url');
const PORT = 3000;
const HOSTNAME = 'localhost';

// Helper: Read record from file
function getRecords() {
    const data = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(data);
}

// Helper: Save record to file
function saveRecords(records) {
    fs.writeFileSync('data.json', JSON.stringify(records, null, 2));
}

// Create a server object
http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    // Set common headers
    res.setHeader('Content-Type', 'application/json');

    // GET / - Get all records
    if(method === 'GET' && path === '/') {
        res.writeHead(200);
        res.end(JSON.stringify(getRecords()));
    }
    // GET /records/:id - Get a record by ID
    else if(method === 'GET' && path.startsWith('/records/')) {
        const id = path.split('/')[2];
        const record = getRecords().find(u => u.id == id);

        if (record) {
            res.writeHead(200);
            res.end(JSON.stringify(record));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Record not found' }));
        }
    }
    // POST /records - Create a new record
    else if(method === 'POST' && path === '/records') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newRecord = JSON.parse(body);
            const records = getRecords();

            newRecord.id = records.length ? records[records.length - 1].id + 1 : 1;
            records.push(newRecord);
            saveRecords(records);

            res.writeHead(201);
            res.end(JSON.stringify(newRecord));
        });
    }
    // PUT /records/:id - Update a record by ID
    else if(method === 'PUT' && path.startsWith('/records/')) {
        const id = parseInt(path.split('/')[2]);
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const updateData = JSON.parse(body);
            let records = getRecords();
            const index = records.findIndex(u => u.id === id);

            if (index !== -1) {
                records[index] = { ...records[index], ...updateData };
                saveRecords(records);
                res.writeHead(200);
                res.end(JSON.stringify(records[index]));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Record not found' }));
            }
        });
    }
    // DELETE /records/:id - Delete a record by ID
    else if(method === 'DELETE' && path.startsWith('/records/')) {
        const id = parseInt(path.split('/')[2]);
        let records = getRecords();
        const index = records.findIndex(u => u.id === id);

        if (index !== -1) {
            const deletedUser = records.splice(index, 1)[0];
            saveRecords(records);
            res.writeHead(200);
            res.end(JSON.stringify(deletedUser));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Record not found' }));
        }
    }
    // Handle 404 for other routes
    else{
        res.writeHead(404);
        res.end(http.STATUS_CODES[404])
    }
}).listen(PORT, HOSTNAME, () => {
    console.log(`Server is running at http://${HOSTNAME}:${PORT}/`);
});

