/*
 * 參考文件：http://opennodes.arecord.us/md/connect-couchdb.md
 */ 
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var cradle = require('cradle'),
		connect = require('connect'),
		util = require('util');
var ConnectCouchDB = require('connect-couchdb')(connect),
    store = new ConnectCouchDB({
      name: 'portal_session',
      host: 'localhost',
      port: 5984,
      username: 'admin',
      password: 'admin',
      ssl: false
    });
var app = express();

// all environments
app.set('port', process.env.PORT || 3004);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(connect.cookieParser());
app.use(connect.session({secret: 'location', store: store }));
app.use(express.cookieParser('location'));
app.use(express.session());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res, next){
	console.log(req.session);
	next()
},
 routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
