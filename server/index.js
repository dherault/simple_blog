const fs = require('fs');
const path = require('path');
const http = require('http');
const parseMarkdown = require('./markdownParser');

// Tickets
const ticketFiles = fs.readdirSync(path.join(__dirname, 'tickets')).reverse();
const tickets = ticketFiles
.map(fileName => fs.readFileSync(path.join(__dirname, 'tickets/', fileName), 'utf-8'))
.map((ticket, i) => parseMarkdown(ticket, i));
const parsedMarkdown = tickets.filter((ticket, i) => i < 3).join('');

// Html
const htmlContent = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf-8');
const finalHtml = htmlContent.split('<!-- body -->').join(parsedMarkdown);

// Public folder
const publicFolderContent = fs.readdirSync(path.join(__dirname, 'public'));
const publicFolderFiles = {};
publicFolderContent.forEach(fileName => {
  publicFolderFiles[fileName] = fs.readFileSync(path.join(__dirname, 'public', fileName), 'utf-8');
});

// Content-types
const extensionToContentType = {
  css: 'text/css',
  js: 'application/javascript',
};

const visitsCountFile = path.join(__dirname, 'visits.json');

function countVisit() {
  fs.readFile(visitsCountFile, 'utf8', (err, file) => {
    if (err) return console.error(err);

    const visits = JSON.parse(file) || {};
    const d = new Date();
    const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

    visits[today] = (visits[today] || 0) + 1;

    fs.writeFile(visitsCountFile, JSON.stringify(visits, null, 2), 'utf8', err => {
      if (err) console.error(err);
    });
  });
}

http.createServer((request, response) => {

  if (request.url === '/') {
    countVisit();
    response.writeHead(200, { 'Content-type': 'text/html' });

    response.write(finalHtml);
  }
  else if (request.url.startsWith('/ticket/')) {
    const ticketId = parseInt(request.url.split('/').pop(), 10);

    if (ticketId) {
      response.writeHead(200, { 'Content-type': 'text/html' });
      response.write(tickets[ticketId]);
    }
  }
  else {
    const trimmedUrl = request.url.substring(1);

    if (publicFolderFiles[trimmedUrl]) {
      const extension = trimmedUrl.split('.').pop();

      response.writeHead(200, { 'Content-type': extensionToContentType[extension] });
      response.write(publicFolderFiles[trimmedUrl]);
    }
    // 404
    else {
      response.writeHead(200, { 'Content-type': 'text/html' });
      response.write(publicFolderFiles['404.html']);
    }
  }

  response.end();
})
.listen(3000, () => console.log('Server listening on port 3000.'));
