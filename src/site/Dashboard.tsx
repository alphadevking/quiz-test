import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Dashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch the logged-in user's quizzes from the database
        // (Replace with your own API call)
        const fetchQuizzes = async () => {
            // ...
        };
        fetchQuizzes();
    }, []);

    const handleDeleteQuiz = async (quizId: number) => {
        // Delete the quiz from the database
        // (Replace with your own API call)
        // ...
    };

    return (
        <div>
            <h1>Your Quizzes</h1>
            
            <Link href="/factory">
                <a>Create a New Quiz</a>
            </Link>

            <div>
                {quizzes.map((quiz) => (
                    <div key={quiz.id}>
                        <h2>{quiz.title}</h2>
                        <Link href={`/quiz/${quiz.id}`}>
                            <a>View Quiz</a>
                        </Link>
                        <Link href={`/edit-quiz/${quiz.id}`}>
                            <a>Edit Quiz</a>
                        </Link>
                        <button onClick={() => handleDeleteQuiz(quiz.id)}>Delete Quiz</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;