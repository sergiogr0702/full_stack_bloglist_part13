const router = require('express').Router()
require('express-async-errors');
const { Op } = require('sequelize');

const { blogFinder, errorHandler, tokenExtractor, blogOwnerCheck } = require('../util/middlewares');
const { Blog, User } = require('../models')

// Route to get all blogs
router.get('/', async (req, res) => {
    const searchQuery = req.query.search;

    const whereClause = searchQuery
    ? {
        [Op.or]: [
            { title: { [Op.iLike]: `%${searchQuery}%` } },
            { author: { [Op.iLike]: `%${searchQuery}%` } }
        ]
    }
    : {};


    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where: whereClause,
        order: [['likes', 'DESC']]
    });
    res.json(blogs);
});

// Route to create a new blog
router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = Blog.build({ ...req.body, userId: user.id });
    await blog.save();
    res.status(201).json(blog);
});

// Route to update a blog's likes
router.put('/:id', blogFinder, async (req, res) => {
    if (req.body.likes) {
        const likesNumber = Number(req.body.likes);
        req.blog.likes = likesNumber;
        await req.blog.save();
        res.json({ likes: likesNumber });
    } else {
        res.status(400).json({ error: 'Likes value is required' });
    }
});

// Route to delete a blog
router.delete('/:id', blogOwnerCheck, async (req, res) => {
    await req.blog.destroy();
    res.status(204).end();
});

// Use the error-handling middleware
router.use(errorHandler);

module.exports = router