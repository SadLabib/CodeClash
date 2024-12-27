const app = require('./app');
const port = process.env.PORT;
const sequelize = require('./config/database');

// Sync database
sequelize.sync().then(() => {
    console.log('✅ Database synced.');
}).catch(err => {
    console.error('❌ Error syncing database:', err);
});


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});