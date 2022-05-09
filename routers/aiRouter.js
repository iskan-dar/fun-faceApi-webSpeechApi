const express = require('express');

const aiRouter = express.Router();

aiRouter.get('/', (req, res) => {
  res.render('ai');
});

module.exports = aiRouter;
