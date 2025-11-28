require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // connect to database
        await connectDB();

        // start backend server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

startServer();
