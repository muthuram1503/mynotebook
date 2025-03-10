const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// Route 1: Get all quizzes
router.get('/fetchallquizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Route 2: Add a new quiz
router.post('/addquiz', async (req, res) => {
    const { question, options, answer, class: classNum } = req.body;

    try {
        const newQuiz = new Quiz({
            question,
            options,
            answer,
            class: classNum
        });

        const savedQuiz = await newQuiz.save();
        res.json(savedQuiz);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
