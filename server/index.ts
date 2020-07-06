import http = require('http');
import fs = require('fs');

const FS = fs.promises;

class Server {
    constructor() {
        // TODO: put stuff here
    }

    async createServer(port: number) {
        const commands = await FS.readdir('./src-dist/plugins/commands');
        const server = http.createServer(function (req, res) {
            const cssFile = req.url?.substring('/css/'.length);
            const jsFile = req.url?.substring('/js/'.length);
            switch (req.url) {
                case '/':
                    FS.readFile('./client/html/index.html').then(contents => {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.end(contents);
                    });
                    res.end();
                break;
                case '/commands':
                    FS.readFile('./client/html/commandindex.html').then(contents => {
                        res.writeHead(200, {'Content-Type': 'text/html'});
                        res.write(contents);
                    });
                break;
                case `/css/${cssFile}`:
                    FS.readFile(`./client/css/${cssFile}`).then(contents => {
                        res.writeHead(200, {'Content-Type': 'text/css'});
                        res.end(contents);
                    });
                break;
                case `/js/${jsFile}`:
                    FS.readFile(``).then(contents => {
                    res.writeHead(200, {'Content-Type': 'txt/js'});
                    res.end(contents);
                    })
                break;
                default:
                    FS.readFile('./client/html/404.html').then(contents => {
                        res.writeHead(404, {'Content-Type': 'text/html'});
                        res.end(contents);
                    });
                break;
            }
        });
        server.listen(port || 8000);
    }
}

module.exports = Server;
