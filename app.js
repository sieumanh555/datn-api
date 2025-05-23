require('./mongo/config');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('./mongo/model/category/category.model')
require('./mongo/model/products/product.model')
require('./mongo/model/user/user.model')
require('./mongo/model/order/order.model')
require('./mongo/model/order/orderDetail.model')


var indexRouter = require('./routes/index');
var productRouter = require('./routes/product');
var categoryRouter = require('./routes/category');
var userRouter = require('./routes/users');
var newsRouter = require('./routes/news');
var supplierRouter = require('./routes/supplier');
var voucherRouter = require('./routes/voucher');
var commentsRouter = require('./routes/comments');
var orderRouter = require('./routes/order');
var orderDetailsRouter = require('./routes/odrdetails');
var checkoutRouter = require('./routes/checkout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors({
  origin: ['http://103.20.96.47:3000', 'http://localhost:3000', "https://datn-admin-plum.vercel.app"],
  credentials: true 
}));

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
// mongoose.connect('mongodb://localhost:27017/project')
.then(() => console.log(' 🚀 Ket noi thanh cong'))
.catch(err => console.log('❌ Ket noi that bai', err));

app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/category', categoryRouter);
app.use('/user', userRouter);
app.use('/news', newsRouter);
app.use('/supplier', supplierRouter);
app.use('/comments', commentsRouter);
app.use('/voucher', voucherRouter);
app.use('/order', orderRouter);
app.use('/orderDetails', orderDetailsRouter);
app.use("/checkout", checkoutRouter )

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  next(err);
});

module.exports = app;
