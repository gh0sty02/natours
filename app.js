// exporting all modules
/* eslint-disable*/

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const userRouter = require('./routes/userRouter');
const tourRouter = require('./routes/tourRouter');
const bookingRouter = require('./routes/bookingRouter');
const AppError = require('./utlis/appError');
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const reviewRouter = require('./routes/reviewRouter');
const viewRouter = require('./routes/viewRouter');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const upload = multer({ dest: 'public/img/users' });
// GLOBAL MIDDLEWARES

const app = express();

//pug engine

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// adding headers for better security
app.use(helmet());

const scriptSrcUrls = [
  'https://api.mapbox.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net/',
  'https://api.tiles.mapbox.com/',
  'https://js.stripe.com/',
  'https://api.stripe.com',
];
const styleSrcUrl = [];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://www.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
  'https://js.stripe.com/',
  'https://api.stripe.com',
  'https://stripe.com',
];

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ['*', 'blob:'],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ['*', "'unsafe-inline'"],
      imgSrc: ["'self'", 'blob:', 'data:'],
      connectSrc: ["'self'", ...connectSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      fontSrc: '*',
    },
  })
);

// serving static files

app.use(express.static(path.join(__dirname, 'public')));

// log for the devlopment env

if (process.env.NODE_ENV === 'development') {
  morgan('dev');
}

// limiting requests from a single Ip

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests from this IP, Please try again after 1 hour',
});

app.use('/api', limiter);

// body parser and size limiter

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// sanitize data for nosql attacks
app.use(mongoSanitizer());

//sanitize data from xss attacks
app.use(xssClean());

// preventing the parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

//routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// pug routes

app.all('*', (req, res, next) => {
  next(
    new AppError(`Cannot get the url ${req.originalUrl} from this server`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
