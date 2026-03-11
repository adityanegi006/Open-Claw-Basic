import express from 'express';
import { run } from './agent1.1.js';

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.post('/message', async (req, res) => {
    try {
        const message = req.body.message;
        console.log("Received message:", message);
        const history = await run(message);
        res.json({ history });
    } catch (err) {
        console.error("Full error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ make sure this is at the bottom and not inside any block
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});