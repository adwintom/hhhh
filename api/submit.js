const mongoose = require('mongoose');

export default async function handler(req, res) {
    // 1. Connect to MongoDB using your Vercel Environment Variable
    // Vercel automatically reads the MONGODB_URI you pasted in their dashboard!
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Database connection failed' });
    }

    // 2. Define the blueprint for your feedback
    const feedbackSchema = new mongoose.Schema({
        name: String,
        message: String,
        date: { type: Date, default: Date.now }
    });

    // 3. Create the model (checking if it already exists to prevent Vercel errors)
    const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

    // 4. Save the incoming data
    if (req.method === 'POST') {
        try {
            const newFeedback = new Feedback({
                name: req.body.name,
                message: req.body.message
            });
            await newFeedback.save();
            return res.status(200).json({ message: 'Success!' });
        } catch (error) {
            return res.status(500).json({ message: 'Error saving feedback' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}