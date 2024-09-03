const router = require('express').Router()
require('express-async-errors');

const { userFinder, userFinderByUsername, errorHandler } = require('../util/middlewares');
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] },
        }
    });
    res.json(users);
})

router.post('/', async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
})

router.get('/:id', userFinder, async (req, res) => {
    const user = req.user

    const response = {
        name: user.name,
        username: user.username,
        readings: user.readingList.map(blog => ({
          id: blog.id,
          url: blog.url,
          title: blog.title,
          author: blog.author,
          likes: blog.likes,
          year: blog.year,
          readinglists: [
            {
              read: blog.reading_lists.read,
              id: blog.reading_lists.id
            }
          ]
        }))
    };

    res.json(response);
})

router.put('/:username', userFinderByUsername, async (req, res) => {
    await req.user.update(req.body);
    res.json(req.user);
})

// Use the error-handling middleware
router.use(errorHandler);

module.exports = router