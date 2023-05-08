const http = require('http');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
let responseData;
let DB_NAME = "job_application";
let COLLECTION_NAME = "jobs"
const uri = `mongodb+srv://rajikancheti999:Saradhi9669@cluster0.keoy6xn.mongodb.net/job_application?retryWrites=true&w=majority`;
const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        const client = new MongoClient(uri);
    try {
        await client.connect();
        responseData = await getAllDataFromMongo(client)
        res.end(JSON.stringify(responseData[0]))

} finally {
        await client.close();
    }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(" <h1> 404 Nothing Found </h1>")
    }
});

async function getAllDataFromMongo(client) {
    const cursor = client.db(DB_NAME).collection(COLLECTION_NAME)
        .find();
    const results = await cursor.toArray();
    if (results.length > 0) {
        console.log('results===========>', results)
        return results;
    } else {
        console.log(`No results==========.`);
    }
}
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Our server is running on port: ${PORT}`));