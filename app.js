require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const { errorCreator } = require('./middlewares/errorCreator');
const { errorHandler } = require('./controllers/errorHandler');
const indexRouter = require('./routers/indexRouter');
const aiRouter = require('./routers/aiRouter');

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set('view engine', 'hbs');
app.use(morgan('dev'));
app.use(express.static('public'));

// routers
app.use('/', indexRouter);
app.use('/ai', aiRouter);

// create custom error
app.use(errorCreator);

// handle error
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server has started on PORT ${PORT}`);
});
