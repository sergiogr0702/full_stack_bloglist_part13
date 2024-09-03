const router = require('express').Router()
require('express-async-errors');

const { errorHandler, tokenExtractor } = require('../util/middlewares');
const { Blog, User } = require('../models')

router.post('/', async (req, res) => {
    const { blogId, userId } = req.body;
  
    const user = await User.findByPk(userId);
    const blog = await Blog.findByPk(blogId);

    if (!user || !blog) {
    return res.status(404).json({ error: 'User or blog not found' });
    }

    await user.addReadingList(blog, { through: { read: false } });

    res.status(201).json({ message: 'Blog added to reading list' });
});

router.put('/:id', tokenExtractor, async (req, res) => {
    const { id } = req.params;
    const { read } = req.body;
  
    if (typeof read !== 'boolean') {
      return res.status(400).json({ error: 'Invalid read status' });
    }
  
    const readingListEntry = await ReadingList.findByPk(id);

    if (!readingListEntry) {
      return res.status(404).json({ error: 'Reading list entry not found' });
    }

    const blog = await Blog.findByPk(readingListEntry.blog_id);
    const user = await User.findByPk(readingListEntry.user_id);

    if (!user || !blog) {
      return res.status(404).json({ error: 'User or blog not found' });
    }

    if (user.id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    readingListEntry.read = read;
    await readingListEntry.save();

    res.json({ message: 'Reading list entry updated', read: readingListEntry.read });
});

router.use(errorHandler);

module.exports = router;