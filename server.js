const app = require('./app');
const port = process.env.PORT;
const sequelize = require('./config/database');

// Sync database
sequelize.sync().then(() => {
    console.log('✅ Database synced.');
}).catch(err => {
    console.error('❌ Error syncing database:', err);
});

// Test database connection
// sequelize.authenticate().then(() => {
//     console.log('✅ Database connected.');
// }).catch(err => {
//     console.error('❌ Error connecting to the database:', err);
// });

// Start server
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});