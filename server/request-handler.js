/*************************************************************
*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
**************************************************************/
const urlModule = require('url');
const _ = require('underscore');
let results = [];

exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.


  const { method, url } = request;
  console.log('Serving request type ' + method + ' for url ' + url);

  // Build chunk
  let data = '';
  let statusCode;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, accept',
    'Access-Control-Max-Age': 10,
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json'
  };

  if (method === 'OPTIONS') {
    const urlSearch = urlModule.parse(url).search;
    if (!urlSearch && urlSearch !== null) {
      const sortCriteria = urlSearch.slice(7);
      results = _.sortBy(results, sortCriteria);
    }
    statusCode = 200;
    response.writeHead(statusCode, headers);
    const responseBody = { results };
    response.end(JSON.stringify(responseBody));

  } else if (url.includes('/classes/messages')) {
    if (method === 'GET') {
      statusCode = 200;

      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.
      // headers['Content-Type'] = 'application/json';
      response.writeHead(statusCode, headers);
      const responseBody = { results };

      // Make sure to always call response.end() - Node may not send
      // anything back to the client until you do. The string you pass to
      // response.end() will be the body of the response - i.e. what shows
      // up in the browser.
      //
      // Calling .end "flushes" the response's internal buffer, forcing
      // node to actually send all the data over to the client.
      response.end(JSON.stringify(responseBody));

    } else if (method === 'POST') {
      request.on('data', (chunk) => {
        data += chunk;
      }).on('end', () => {
        results.push(JSON.parse(data));
        statusCode = 201;
        // headers['Content-Type'] = 'application/json';
        response.writeHead(statusCode, headers);
        const responseBody = { results };
        response.end(JSON.stringify(responseBody));
      });
    }
  } else {
    response.statusCode = 404;
    response._responseCode = 404;
    response.end();
  }

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10 // Seconds.
// };

