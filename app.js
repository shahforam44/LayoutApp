var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');


var sessionVar;
//var localStorage;


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

////***Session Storage
app.use(expressSession({
    secret: 'PredictSpring App',
    resave: false,
    saveUninitialized: true
}));
app.get('/', function(req, res, next) {
    sessionVar = req.session.layouts = {};
    next(null,{"sessionVar":sessionVar});
});

////****local storage
//if(localStorage === undefined || typeof localStorage === "" || localStorage === null) {
//    LocalStorage = require('node-localstorage').LocalStorage;
//    localStorage = new LocalStorage('./scratch');
//}

//localStorage.setItem('layouts', {});
//console.log(localStorage.getItem('layouts'));

app.use('/', routes);
app.use('/users', users);

////****public folders
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

////****Api Call
app.get('/api/index', routes.findAll);
app.post('/api/index', routes.insertUpdate);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if(app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
