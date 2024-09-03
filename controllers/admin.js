const router = require('express').Router()
require('express-async-errors');

const { isAdmin, tokenExtractor, errorHandler } = require('../util/middlewares');
const { User } = require('../models')

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
    const user = await User.findOne({
      where: {
        username: req.params.username
      }
    })
  
    if (user) {
      user.disabled = req.body.disabled
      await user.save()
      res.json(user)
    } else {
      res.status(404).end()
    }
  })

router.use(errorHandler);

module.exports = router