require('dotenv').config();
const express = require('express');

const { errorCreator } = require('./middlewares/errorCreator');
const { errorHandler } = require('./controllers/errorHandler');

const app = express();
const PORT = process.env.PORT ?? 3000;

app.set('view engine', 'hbs');
app.use(morgan('dev'));
app.use(express.static('public'));

// create custom error
app.use(errorCreator);

// handle error
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server has started on PORT ${PORT}`);
});
