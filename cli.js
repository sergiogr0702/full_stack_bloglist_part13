require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

const main = async () => {
    try {
        await sequelize.authenticate();
        const blogs = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT });

        blogs.forEach(blog => {
            console.log(blog.author, ': ', blog.title, ', ', blog.likes, ' likes')
        });
        sequelize.close();
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

main();