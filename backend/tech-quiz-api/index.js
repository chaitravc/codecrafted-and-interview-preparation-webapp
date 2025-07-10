const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/techQuizDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected')).catch(err => console.error(err));

// Mongoose schema and model
const questionSchema = new mongoose.Schema({
    category: String,
    difficulty: String,
    question: String,
    options: [String],
    correctAnswer: String
});

const Question = mongoose.model('Question', questionSchema);

// Routes

// 1. Get questions by category and difficulty
app.get('/questions', async (req, res) => {
    const { category, difficulty } = req.query;
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    try {
        const questions = await Question.find(query);
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
});

// 2. Submit answer for checking
app.post('/check-answer', async (req, res) => {
    const { questionId, userAnswer } = req.body;

    try {
        const question = await Question.findById(questionId);
        if (!question) return res.status(404).json({ error: 'Question not found' });

        const isCorrect = question.correctAnswer === userAnswer;
        res.json({ correct: isCorrect });
    } catch (err) {
        res.status(500).json({ error: 'Error checking answer' });
    }
});

// 3. Add a new question (for admin use)
app.post('/add-question', async (req, res) => {
    const { category, difficulty, question, options, correctAnswer } = req.body;

    try {
        const newQuestion = new Question({ category, difficulty, question, options, correctAnswer });
        await newQuestion.save();
        res.json({ message: 'Question added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add question' });
    }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
