###Sentinel Crime Management and Prevention Dashboard###
==================================================
Sentinel is the server side component of the ¡Basta Ya!
crime management system.

It's deployed in [Node.js][1], and
relies on [jQuery][2] for client side functionality.

Starting the Server
-------------------
After installing Node, open up a terminal and navigate
to the repo's root directory and run the following
command:

```
node server.js
```

Note that this assumes you haven't moved/renamed the
```server.js``` file.

Node.js Routing
---------------
While Node has the ability to create http servers, its
functionality is somewhat limited.

[Express][3] is a framework built on top
of node that allows for easy server management, such as
POST/GET method abstractions.

Using Express, we can set the server to listen for different
paths and act accordingly:

```
#!javascript

var express = require('express');
var app = express();

/*
*  Set up routing.
*/

//GET method for root path
app.get('/', function(request, response){
  //logic
});

//POST method for login path
app.post('/login', function(request, response){
  //logic
});
```

The paths aren't actual files/directories: they act much like
different pages in any other server environment, or actions
in html forms.

[1]:http://nodejs.org
[2]:http://jquery.com
[3]:http://expressjs.com/