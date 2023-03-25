export const quiz = {
    topic: 'Q&A',
    level: 'Beginner',
    totalQuestions: 4,
    scorePerQuestion: 5,
    questions: [
        {
            type: 'multiple_choice',
            question: 'What is the capital of France?',
            choices: ['Berlin', 'Paris', 'Madrid', 'London'],
            correctAnswer: 'Paris',
        },
        {
            type: 'multiple_choice',
            question: 'Which of the following is a programming language?',
            choices: ['HTML', 'CSS', 'JavaScript', 'All of the above'],
            correctAnswer: 'JavaScript',
        },
        {
            type: 'multiple_choice',
            question: 'Which planet in our solar system is the largest?',
            choices: ['Venus', 'Mars', 'Saturn', 'Jupiter'],
            correctAnswer: 'Jupiter',
        }
    ]
};
