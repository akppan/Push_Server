//Modules
const http = require('http');
const push = require('./push');

//Create HTTP Server
http.createServer((request,response)=>{

  //Enable CORS
  response.setHeader('Access-Control-Allow-Origin','*')

  //Get request vars
  const {url,method} = request

  //subscribe
  if (method === 'POST' && url.match(/^\/subscribe\/?/)) {

    //Get POST Body
    let body = []

    //Read Body Stream
    request.on('data',chunk => body.push(chunk) ).on('end',()=>{

      //Parse subscription body to object
      let subscription = JSON.parse(body.toString())

      //Store subscription for push notifications
      push.addSubscription(subscription)

      //Respond
      response.end('Subscribed');
    })

    //Public Key
  } else if (url.match(/^\/key\/?/)) {

    //Respond with Public Key from push module
    response.end(push.getKey());

    //Push Notification
  }else if (method === 'POST' && url.match(/^\/push\/?/)) {

    //Get POST Body
    let body = []

    //Read Body Stream
    request.on('data',chunk => body.push(chunk) ).on('end',()=>{
      push.send(body.toString())
      //Respond
      response.end('Push Sent');
    })

    //Not Found
  } else {

    response.status = 404;
    response.end('ERROR:Unknown Request');
  }

  //response.end('Hello from HTTP server - Updated');


  //Start the server
}).listen(3333,()=>{console.log('Server Running');})
