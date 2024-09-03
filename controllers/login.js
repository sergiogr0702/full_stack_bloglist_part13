const jwt = require('jsonwebtoken')
const router = require('express').Router()
require('express-async-errors');

const { errorHandler } = require('../util/middlewares');
const { SECRET } = require('../util/config')
const { User, Session } = require('../models');

router.post('/', async (req, res) => {
    const body = req.body

    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    const passwordCorrect = body.password === 'secret'

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'Invalid username or password'
        })
    }

    if (user.disabled) {
        return response.status(401).json({
          error: 'Account disabled, please contact admin'
        })
    }

    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Session.create({
        id: sessionId,
        user_id: user.id,
        expires_at: expiresAt
      });

    const userForToken = {
        username: user.username,
        sessionId: sessionId,
        id: user.id
    }

    const token = jwt.sign(userForToken, SECRET, { expiresIn: '24h' })

    res.status(200).send({ token, username: user.username, name: user.name })
})

router.use(errorHandler);

module.exports = router