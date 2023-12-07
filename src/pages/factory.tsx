import Head from 'next/head';
import React, { useState } from 'react';

type Choice = string;

interface Question {
    id: number;
    type: 'multiple_choice';
    question: string;
    choices: Choice[];
    correctAnswer: Choice;
}

interface Quiz {
    topic: string;
    level: string;
    scorePerQuestion: number;
    time: number; // Add the time property
    questions: Question[];
}

const QuizForm = () => {
    const [topic, setTopic] = useState<string>('');
    const [level, setLevel] = useState<string>('');
    const [scorePerQuestion, setScorePerQuestion] = useState<number>(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [time, setTime] = useState<number>(0);

    const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopic(event.target.value);
    };

    const handleLevelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLevel(event.target.value);
    };

    const handleScorePerQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setScorePerQuestion(Number(event.target.value));
    };

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTime(Number(event.target.value));
    };

    const handleQuestionSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        // create the question object with the collected information
        const question: Question = {
            id: questions.length + 1,
            type: 'multiple_choice',
            question: '',
            choices: Array(4).fill(''), // This will create an array with 4 empty strings
            correctAnswer: '',
        };
        setQuestions([...questions, question]);
    };

    const handleQuestionChange = (id: number, field: string, value: string | Choice[]) => {
        const updatedQuestions = questions.map((question) => {
            if (question.id === id) {
                return {
                    ...question,
                    [field]: value,
                };
            }
            return question;
        });
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // Create the quiz object with the collected information
        const quiz: Quiz = {
            topic,
            level,
            scorePerQuestion,
            time,
            questions,
        };

        try {
            const response = await fetch('/api/saveQuiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(quiz),
            });

            if (!response.ok) {
                throw new Error('Failed to save quiz.');
            }

            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleChoiceChange = (questionId: number, choiceIndex: number, value: string) => {
        const updatedQuestions = questions.map((question) => {
            if (question.id === questionId) {
                return {
                    ...question,
                    choices: question.choices.map((choice, index) => {
                        if (index === choiceIndex) {
                            return value;
                        }
                        return choice;
                    }),
                };
            }
            return question;
        });
        setQuestions(updatedQuestions);
    };

    return (
        <React.Fragment>
            <Head>
                <title>Enter Quiz Details | Quiz Factory</title>
            </Head>

            <form onSubmit={handleSubmit} className="md:px-32 py-5 px-12">
                <div className='px-10 py-10 space-y-6 ring-1 ring-slate-400/20 rounded-xl shadow-lg bg-inherit/30 backdrop-blur-sm'>

                    <div className='text-3xl font-bold text-center'>
                        Quiz Factory
                    </div>
                    <div className='text-xs text-center italic'>
                        Enter Quiz Info Here and submit
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Topic:
                            <input type="text" value={topic} onChange={handleTopicChange} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Level:
                            <input type="text" value={level} onChange={handleLevelChange} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Score per Question:
                            <input type="number" value={scorePerQuestion} onChange={handleScorePerQuestionChange} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">
                            Time (in minutes):
                            <input type="number" value={time} onChange={handleTimeChange} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
                        </label>
                    </div>
                    {questions.map((question) => (
                        <div key={question.id} className="space-y-4">
                            <label className="block text-sm font-medium">
                                Question:
                                <input type="text" value={question.question} onChange={(event) => handleQuestionChange(question.id, 'question', event.target.value)} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
                            </label>
                            {question.choices.map((choice, index) => (
                                <label key={index} className="block text-sm font-medium">
                                    Choice {index + 1}:
                                    <input
                                        type="text"
                                        value={choice}
                                        onChange={(event) => handleChoiceChange(question.id, index, event.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                </label>
                            ))}
                            <label className="block text-sm font-medium">
                                Correct Answer:
                                <input type="text" value={question.correctAnswer} onChange={(event) => handleQuestionChange(question.id, 'correctAnswer', event.target.value)} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
                            </label>
                        </div>
                    ))}
                    <div className="flex justify-between">
                        <button type="button" onClick={handleQuestionSubmit} className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75">Add Question</button>
                        <button type="submit" className="py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">Submit</button>
                    </div>

                </div>
            </form>
        </React.Fragment>
    );
};

export default QuizForm;