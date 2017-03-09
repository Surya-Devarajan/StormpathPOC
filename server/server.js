/* Everything to GOD */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var http = require('http');
var util = require('util');
//var stormpath = require('express-stormpath');

//var config = require('./app/config');

//config = new config();

var app = express();

// configuration
//app.set('config', config);
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
// view engine setup
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.on('stormpath.ready',function(){
  console.log('Stormpath Ready');
});



var stormpath = require('stormpath');
var client = new stormpath.Client({apiKey: {
      id: '5WRITC8QT856Y77QYDNJ3LVK3',
      secret: 'giGqngJowWUDAEZozucjaxIRqYZ6F5U6x9/LSo8aErg'
    }
  });


//**********Create organization and map org to directory************

// var newOrganization = {
//   name: 'OrangeOrg',
//   nameKey :'Orange111'
 
// }

// var org = client.createOrganization(newOrganization, function (err, organization) {
//   var organization = organization;
//   console.log(err, organization);
//   var mapping = {
//     accountStore: {
//       href: 'https://api.stormpath.com/v1/directories/307jHo0F6Zdp96ZNQg3dtK'
//     },
//     isDefaultAccountStore: true,
//     isDefaultGroupStore: true
//   };
//   var directoryHref = 'https://api.stormpath.com/v1/directories/307jHo0F6Zdp96ZNQg3dtK';
//   organization.createAccountStoreMapping(mapping, function (err, organizationAccountStoreMapping) {
//     if (!err) {
      
//       console.log('Organization directory is mapped');
//     }
//   });

 

// });


//************Create Directory************
// client.createDirectory({name: 'Orange'}, function (err, directories) {
//   console.log(err,directories);
// });



// ************All accounts***********
// client.getAccounts(function (err, accountsCollection) {
//   accountsCollection.each(function (account, next) {
//     console.log(account);
//     next();
//   });
// });


//**********List organization**********
//  client.getOrganizations({},function(err, organizationCollection) {
//   console.log("organizationCollection", organizationCollection);
  
// });


// ****************Add group to organization*************
// client.getOrganizations({nameKey:'Red111'},function(err, organizationCollection) {
//    console.log("organizationCollection", organizationCollection);
//   var foundOrg = organizationCollection.items[0];
//   var group = {
//     name: 'New Users'
//   };

//   foundOrg.createGroup(group, function (err, group) {
//     console.log(err, group);
//     if (!err) {
//       console.log('Group Created!');
//     }
//   });
// });

//************Create new account and add to group************
// client.getOrganizations({nameKey:'Red111'},function(err, organizationCollection) {
//   console.log("organizationCollection", organizationCollection);
//   var foundOrg = organizationCollection.items[0];

//   var newAccount = {
//     email: 'red1@example.com',
//     givenName: 'red1',
//     surname: 'bar',
//     password: 'Password!A1',
//     customData : {
//       privilage: 'Admin'
//     }
//   };

//   foundOrg.createAccount(newAccount, function(err, createdAccount){

//     client.getGroup('https://api.stormpath.com/v1/groups/2jijipb0MkCp9H67UaV5oI', function (err, group) {
//       group.addAccount(createdAccount.href, function(err, createdAccount){
//         console.log(err, createdAccount);
//       })
//     });
//   });
// });


// **********login**************
var applicationHref = 'https://api.stormpath.com/v1/applications/5G2alkpIZG0qx9tRBT8a44'


var authRequest = {
  username: 'red1@example.com',
  password: 'Password!A1',
  accountStore: {
    nameKey: 'Red111'
  }
};

client.getApplication(applicationHref, function (err, application) {
  console.log(application);
  application.authenticateAccount(authRequest, function (err, authResult) {
    if (err) {
      return console.error(err);
    }

    authResult.getAccount(function (err, account) {
      if (err) {
        return console.error(err);
      }
      account.getCustomData(function(err, coustomData){
        console.log(err, coustomData);
      })
      console.log('Account has authenticated: ', account);
    });
  });
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images/', express.static(__dirname + '/images/'));
app.use('/pdfExportFiles/', express.static(__dirname + '/pdfExportFiles/'));
app.use('/doc/', express.static(__dirname + '/doc/'));






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.json(failure(err.message, err.status));
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.json(failure(err.message, err.status));
});


module.exports = app;
