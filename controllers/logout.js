const router = require('express').Router()
require('express-async-errors');

const { errorHandler, tokenExtractor } = require('../util/middlewares');
const { Session } = require('../models');

router.delete('/', tokenExtractor, async (req, res) => {
      await Session.destroy({ where: { id: req.user.sessionId } });
      res.status(204).end();
  });

router.use(errorHandler);

module.exports = router;