const stripe = require('stripe')(
  `sk_test_51IojHySC9ZmVvJfvIElxDvoJ7pUMV6TFBs3obm06UVIOKH6nJO1i1ZVSWJBLnxXfyHQzDDSymSf8PRhpai8IhDFq00j21kd09T`
);

const catchAsync = require('../utlis/catchAsync');

const AppError = require('../utlis/appError');
const factory = require('../controllers/handlerFactory');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const handler = require('../controllers/handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) get the tour
  const tour = Tour.findById(req.params.tourId);
  //   console.log(stripe);
  // 2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  //3) create checkout session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  req.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
