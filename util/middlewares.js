const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models');
const { SECRET } = require('./config');

const errorHandler = (err, req, res, next) => {
    if (err.name === 'SequelizeValidationError') {
        // Extract and format Sequelize validation error messages
        const validationErrors = err.errors.map(error => ({
            field: error.path,
            message: error.message
        }));
        return res.status(400).json({ errors: validationErrors });
    }

    // Handle other types of errors
    console.error(err.stack);
    res.status(500).json({ error: 'An unexpected error occurred.' });
};

// Blog finder middleware with error handling
const blogFinder = async (req, res, next) => {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
    }
    req.blog = blog;
    next();
};

const userFinder = async (req, res, next) => {
    const user = await User.findByPk(id, {
        include: {
          model: Blog,
          as: 'readingList',
          attributes: ['id', 'title', 'author', 'likes', 'year'],
          through: {
            attributes: ['read', 'id']
          }
        }
    });
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    req.user = user;
    next();
};

const userFinderByUsername = async (req, res, next) => {
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    req.user = user;
    next();
}

const blogOwnerCheck = async (req, res, next) => {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
    }
    if (blog.userId !== req.user.id) {
        return res.status(403).json({ error: 'You are not authorized to delete this blog' });
    }
    req.blog = blog;
    next();
};

const tokenExtractor = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')){
        try {
            const decodedToken = jwt.verify(authorization.substring(7), SECRET)

            const session = await Session.findByPk(decodedToken.sessionId, {
                include: {
                  model: User,
                  attributes: ['id', 'username', 'disabled']
                }
            });

            if (!session || session.expires_at < new Date() || session.user.disabled) {
                return res.status(401).json({ error: 'Session invalid' });
            }
            
            req.decodedToken = decodedToken
        } catch {
            return res.status(401).json({ error: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ error: 'Missing token' });
    }
    next()
}

const isAdmin = async (req, res, next) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user.admin) {
      return res.status(401).json({ error: 'operation not allowed' })
    }
    next()
  }

module.exports = {
    blogFinder,
    userFinder,
    blogOwnerCheck,
    userFinderByUsername,
    errorHandler,
    tokenExtractor,
    isAdmin,
}