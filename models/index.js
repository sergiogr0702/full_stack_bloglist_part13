const Blog = require('./blog')
const User = require('./user')
const ReadingLists = require('./readingLists')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingLists, as: 'readingList' })
Blog.belongsToMany(User, { through: ReadingLists, as: 'readers' })

module.exports = {
    Blog,
    User,
    ReadingLists,
    Session,
}