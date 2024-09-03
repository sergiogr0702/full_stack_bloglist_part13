const router = require('express').Router();
require('express-async-errors');
const { fn, col } = require('sequelize');

const { errorHandler } = require('../util/middlewares');
const { Blog } = require('../models');

router.get('/', async (req, res) => {
    const authorsData = await Blog.findAll({
        attributes: [
            'author',
            [fn('COUNT', col('id')), 'articles'],
            [fn('SUM', col('likes')), 'likes']
        ],
        group: ['author'],
        order: [[fn('SUM', col('likes')), 'DESC']]
    });

    res.json(authorsData);
});

router.use(errorHandler);

module.exports = router