import React, { useState, useEffect, useRef } from "react";
import quiz from "../../../data/quiz.json";
import { Button } from "../components/Buttons/button";
import Modal from "../components/Modal/modal";
import Link from "next/link";
import Head from "next/head";

interface Result {
    score: number;
    correctAnswers: number;
    passed: boolean;
    showModal: boolean;
}

const Quiz: React.FC = () => {
    const [quizStarted, setQuizStarted] = useState<boolean>(false);
    const [activeQuestion, setActiveQuestion] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [remainingTime, setRemainingTime] = useState<number>(quiz.time);
    const timerRef = useRef<number | NodeJS.Timeout | null>(null);
    const [result, setResult] = useState<Result>({
        score: 0,
        correctAnswers: 0,
        passed: false,
        showModal: false,
    });

    const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

    useEffect(() => {
        if (quizStarted) {
            setShuffledQuestions(shuffleArray(quiz.questions));
        }
    }, [quizStarted]);

    const { question, choices } = shuffledQuestions[activeQuestion] || {};
    const correctAnswer = shuffledQuestions[activeQuestion]?.correctAnswer;

    const onClickNext = () => {
        setResult((prev) => {
            const isCorrect = selectedAnswer === correctAnswer;
            return {
                ...prev,
                score: isCorrect ? prev.score + 5 : prev.score,
                correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
            };
        });
        if (!isQuizFinished) {
            setActiveQuestion((prev) => prev + 1);
            setSelectedAnswer("");
        } else {
            onShowResult();
        }
    };

    const onAnswerSelected = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const onStartQuiz = () => {
        setQuizStarted(true);
    };

    const resetQuiz = () => {
        setQuizStarted(false);
        setActiveQuestion(0);
        setSelectedAnswer("");
        setResult({
            score: 0,
            correctAnswers: 0,
            passed: false,
            showModal: false,
        });
        setRemainingTime(quiz.time); // Reset the timer
        // clearInterval(timerRef.current);
    };

    const onStopQuiz = () => {
        const shouldStop = window.confirm("Are you sure you want to stop the quiz?");

        if (shouldStop) {
            onShowResult();
            resetQuiz();
        }
    };

    useEffect(() => {
        if (activeQuestion >= shuffledQuestions.length) {
            onShowResult(); // Call the onShowResult function when the quiz is finished
        }
    }, [activeQuestion, shuffledQuestions]);

    const isQuizFinished = activeQuestion >= shuffledQuestions.length;
    const onShowResult = () => {
        const totalPossibleScore = quiz.questions.length * quiz.scorePerQuestion;
        const minimumPassScore = totalPossibleScore * 0.5;

        setResult((prev) => ({
            ...prev,
            showModal: true,
            passed: (prev.score >= minimumPassScore),
        }));
    };

    const onTryAgain = () => {
        setActiveQuestion(0);
        setSelectedAnswer("");
        setResult({
            score: 0,
            correctAnswers: 0,
            passed: false,
            showModal: false,
        });
        setRemainingTime(quiz.time); // Reset the timer
        setShuffledQuestions(shuffleArray(quiz.questions));
    };

    const shuffleArray = (array: any[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    useEffect(() => {
        if (quizStarted) {
            timerRef.current = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev === 0) {
                        clearInterval(timerRef.current as number);
                        // Submit the quiz and show results immediately
                        if (!isQuizFinished) {
                            onClickNext();
                        }
                        onShowResult();
                        return prev;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [quizStarted, isQuizFinished, onClickNext, onShowResult]);

    return (
        <React.Fragment>
            <Head>
                <title>Start Quiz</title>
            </Head>

            <div className="w-full p-5 grid gap-2">
                {!quizStarted && (
                    <div>
                        <div className="text-3xl font-bold mb-4">Welcome to the Quiz</div>
                        <Button className="w-fit" action={onStartQuiz} text="Start Quiz" />
                        <div className="py-3 text-sm">Visit our <Link href='/factory' className="italic text-slate-400 hover:text-slate-500 hover:underline duration-300 underline-offset-4">Quiz Factory</Link></div>
                    </div>
                )}
                {quizStarted && (
                    <>
                        {question && (
                            <div>
                                <div className="text-3xl font-bold">Quiz</div>
                                {/* Display the timer */}
                                <div className="text-xl font-semibold my-2">{question}</div>
                                <div className="text-md my-1">
                                    Time remaining: {remainingTime} seconds
                                </div>
                                {shuffledQuestions[activeQuestion]?.choices.map((val: string, key: number) => {
                                    return (
                                        <div className="m-2" key={key}>
                                            <input
                                                className="m-2"
                                                type="radio"
                                                name={question}
                                                onChange={() => onAnswerSelected(val)}
                                                value={val}
                                                checked={selectedAnswer === val}
                                            />
                                            {val}
                                        </div>
                                    );
                                })}
                                <div className="flex gap-x-5">
                                    <Button
                                        className="w-fit mx-5 my-5"
                                        action={!isQuizFinished ? onClickNext : onShowResult}
                                        text={!isQuizFinished ? "Next" : "Show Result"}
                                    />
                                    {/* Add the stop quiz button */}
                                    {!isQuizFinished && (
                                        <Button
                                            className="w-fit mx-5 my-5"
                                            action={onStopQuiz}
                                            text="Stop Quiz"
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                        {isQuizFinished && (
                            <Modal
                                onClose={() => {
                                    setResult((prev) => ({ ...prev, showModal: false }));
                                    window.location.reload();
                                }}
                            >
                                <div className="text-3xl text-center font-bold my-3">
                                    {result.passed ? "Congratulations!" : "Sorry!"}
                                </div>
                                <div className="text-center">
                                    You got {result.correctAnswers} out of {quiz.questions.length} questions right.
                                </div>
                                <div className="text-center my-2">Your score is {result.score}.</div>
                                <div className='font-semibold text-lg my-3'>
                                    {result.passed ? (
                                        <div>Congratulations, you passed the quiz!</div>
                                    ) : (
                                        <div>Unfortunately, you did not pass the quiz. Please try again.</div>
                                    )}
                                </div>
                                <Button className="w-fit m-2" action={onTryAgain} text="Try Again" />
                            </Modal>
                        )}
                    </>
                )}
            </div>

        </React.Fragment>
    );
};

export default Quiz;