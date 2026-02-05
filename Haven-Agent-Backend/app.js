var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var onboardingRouter = require('./routes/onboarding');

var app = express();

// Enable CORS
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// Test routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRouter);
app.use('/api/onboarding', onboardingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const isApiRequest = (req.originalUrl || req.url || '').startsWith('/api');
  const wantsJson = isApiRequest || req.accepts(['json', 'html']) === 'json';
  if (wantsJson) {
    const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 500);
    return res.status(status).json({ message: err.message || 'Server error' });
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
