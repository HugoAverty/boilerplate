/**
 * Module dependencies.
 */
var express = require('express'), // Node.js web framework.
    cookieParser = require('cookie-parser'), // Express 4 middleware.
    compress = require('compression'), // Express 4 middleware.
    session = require('express-session'), // Express 4 middleware.
    bodyParser = require('body-parser'), // Express 4 middleware.
    logger = require('morgan'), // Express 4 middleware.
    errorHandler = require('errorhandler'), // Express 4 middleware.
    lusca = require('lusca'), // CSRF middleware.
    methodOverride = require('method-override'), // Express 4 middleware.
    dotenv = require('dotenv'), // 	Loads environment variables from .env file.
    MongoStore = require('connect-mongo/es5')(session), // MongoDB session store for Express.
    flash = require('express-flash'), // Provides flash messages for Express.
    path = require('path'),
    mongoose = require('mongoose'), // MongoDB ODM.
    passport = require('passport'), // 	Simple and elegant authentication library for node.js
    expressValidator = require('express-validator'), // Easy form validation for Express.
    http = require('http'),
    io = require('socket.io'),
    sass = require('node-sass-middleware'),
    // Todo add Middleware for JS concat and stuff
    multer = require('multer'),
    storage = multer.diskStorage({
        destination: __dirname + '/uploads/',
        filename: function (req, file, cb) {
            var fileName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 12);
            cb(null, fileName + path.extname(file.originalname));
        }
    }),
    upload = multer({storage: storage });

/**
 * Adding Middleware for manipulating mongo db
 * @type {middleware|exports}
 */
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./config.js');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env (You can remove the path argument entirely, after renaming `.env.example` to `.env`)
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');
var dashboardController = require('./controllers/dashboard');

/**
 * API keys and Passport configuration.
 */
var passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
var app = express(),
    server = require('http').createServer(app),
    io = io.listen(server);

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */
var hour  = 3600000;  //milliseconds
var day   = (hour * 24);
var week  = (day * 7);
var month = (day * 30);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(function(req, res, next) {
  if (/api/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static( path.join(__dirname, 'public'), { maxAge: week } ));

app.use('/mongo_express', mongo_express(mongo_express_config));

/**
 * Primary app routes.
 */
app.get('/', homeController.index);

// /mongo_express : for accessing to mongoDB data

app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);

app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);

app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);

app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);

app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);

app.get('/dashboard', passportConfig.isAuthenticated, dashboardController.getDashboard);

app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

/**
 * API examples routes.
 */
app.get('/api', passportConfig.isAuthenticated, apiController.getApi);
app.get('/api/steam', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getSteam);
app.get('/api/facebook', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postTwitter);
app.get('/api/linkedin', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getLinkedin);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/upload', apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);
//app.get('/api/lastfm', apiController.getLastfm);
//app.get('/api/nyt', apiController.getNewYorkTimes);
//app.get('/api/aviary', apiController.getAviary);
//app.get('/api/stripe', apiController.getStripe);
//app.post('/api/stripe', apiController.postStripe);
//app.get('/api/scraping', apiController.getScraping);
//app.get('/api/twilio', apiController.getTwilio);
//app.post('/api/twilio', apiController.postTwilio);
//app.get('/api/clockwork', apiController.getClockwork);
//app.post('/api/clockwork', apiController.postClockwork);
//app.get('/api/foursquare', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFoursquare);
//app.get('/api/tumblr', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getTumblr);
//app.get('/api/venmo', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getVenmo);
//app.post('/api/venmo', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postVenmo);
//app.get('/api/instagram', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getInstagram);
//app.get('/api/yahoo', apiController.getYahoo);
//app.get('/api/lob', apiController.getLob);
//app.get('/api/bitgo', apiController.getBitGo);
//app.post('/api/bitgo', apiController.postBitGo);
//app.get('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getPinterest);
//app.post('/api/pinterest', passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.postPinterest);

/**
 * OAuth authentication routes. (Sign in)
 */
/*app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
*/
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
/*
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/tumblr');
});
app.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
app.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/venmo');
});
*/
app.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
app.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
/*
app.get('/auth/pinterest', passport.authorize('pinterest', { scope: 'read_public write_public' }));
app.get('/auth/pinterest/callback', passport.authorize('pinterest', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/api/pinterest');
});
*/
/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));

});

/**
 * Emit Pageviews on Socket.io
 */
/**
var io = require('socket.io').listen(server, {
    'authorization' : function(data, accept) {
        // authorization logic
    });
});
io.configure('production', function(){
    io.enable('browser client minification');  // send minified client
    io.enable('browser client etag');          // apply etag caching logic based on version number
    io.enable('browser client gzip');          // gzip the file
    io.set('log level', 1);                    // reduce logging
    io.set("polling duration", 10);            // increase polling frequency
    io.set('transports', [                     // Manage transports
        'websocket'
        , 'htmlfile'
        , 'xhr-polling'
        , 'jsonp-polling'
    ]);
    io.set('authorization', function (handshakeData, callback) {
        if (handshakeData.xdomain) {
            callback('Cross-domain connections are not allowed');
        } else {
            callback(null, true);
        }
    });
});

io.configure('development', function(){
    io.set('log level', 1);                    // reduce logging
    io.set('transports', [
        'websocket'                              // Let's just use websockets for development
    ]);
    io.set('authorization', function (handshakeData, callback) {
        if (handshakeData.xdomain) {
            callback('Cross-domain connections are not allowed');
        } else {
            callback(null, true);
        }
    });
});
*/
io.sockets.on('connection', function (socket) {
    socket.on('message', function (message) {
        console.log("Got message: " + message);
        var ip = socket.handshake.address.address;
        var url = message;
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length, 'ip': ip, 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
    });
    socket.on('disconnect', function () {
        console.log("Socket disconnected");
        io.sockets.emit('pageview', { 'connections': Object.keys(io.connected).length});
    });
});

module.exports = app;
