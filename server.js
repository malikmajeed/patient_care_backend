require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/database');

// routers
const router = require('./src/routes/index');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDB();

        // mount routes BEFORE starting server
        app.use('/api', router);
        // app.use('/',
        //     (req, res) => {
        //         res.send("Welcome to Patient Care API")
        //     }
        // )

        app.listen(PORT, () => {
            console.log(`Server is vibing on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database refused to vibe:', error);
        process.exit(1);
    }
}

startServer();
