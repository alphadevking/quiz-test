import React, { useState, useEffect } from "react";
import { quiz } from ".";
import { Button } from "../components/Buttons/button";
import Modal from "../components/Modal/modal";

interface Result {
    questions?: any;
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    passed: boolean;
    showModal: boolean;
}

const Quiz: React.FC = () => {
    const [activeQuestion, setActiveQuestion] = useState<number>(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [result, setResult] = useState<Result>({
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        passed: false,
        showModal: false,
    });
    const [timeRemaining, setTimeRemaining] = useState<number>(30);

    // console.log(result.questionCount)

    const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

    useEffect(() => {
        // Shuffle questions array and set to state
        setShuffledQuestions(shuffleArray(quiz.questions));
    }, []);

    // Timer for each question (30 seconds)
    useEffect(() => {
        if (isQuizFinished) return;
        // Set the initial time remaining
        setTimeRemaining(30);
        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                // Update time remaining every second
                if (prev > 0) return prev - 1;
                else {
                    // Time is up, move to next question
                    onClickNext();
                    return 0;
                }
            });
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, [activeQuestion]);

    const { question, choices } = shuffledQuestions[activeQuestion] || {};
    const correctAnswer = shuffledQuestions[activeQuestion]?.correctAnswer;

    const onClickNext = () => {
        setResult((prev) => {
            const isCorrect = selectedAnswer === correctAnswer;

            return {
                ...prev,
                score: isCorrect ? prev.score + 5 : prev.score,
                correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
                wrongAnswers: isCorrect ? prev.wrongAnswers : prev.wrongAnswers + 1,
            };
        });

        setActiveQuestion((prev) => prev + 1);
        setSelectedAnswer("");
    };

    const onAnswerSelected = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const isQuizFinished = activeQuestion >= shuffledQuestions.length;
    const scorePercentage = (result.score / (shuffledQuestions.length * 5)) * 100;

    const onShowResult = () => {
        setResult((prev) => ({
            ...prev,
            showModal: true,
            passed: scorePercentage >= 50,
        }));
    };

    const onTryAgain = () => {
        setActiveQuestion(0);
        setSelectedAnswer("");
        setResult({
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            passed: false,
            showModal: false,
        });

        // Shuffle questions array again and set to state
        setShuffledQuestions(shuffleArray(quiz.questions));
    };

    const shuffleArray = (array: any[]) => {
        // Shuffles array using Fisher-Yates algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    };

    return (
        <div className="w-full p-5 grid gap-2">

            {question && (
                <div>
                    <div className="text-3xl font-bold">Quiz</div>
                    <div className="text-xl font-semibold">
                        <div>
                            {question}
                        </div>
                        <div className="flex-1 text-lg font-semibold">
                            Time Remaining: {timeRemaining} seconds
                        </div>
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
                    <Button
                        className="w-fit mx-5 my-5"
                        action={onClickNext}
                        text={isQuizFinished ? "Show Result" : "Next"}
                        disabled={!selectedAnswer}
                    />
                </div>
            )}

            <div className="flex gap-5 my-5 mx-5">
                {isQuizFinished && (
                    <div>
                        <div className="text-3xl font-bold">
                            {result.passed ? "Congratulations!" : "Sorry!"}
                        </div>
                        <div>
                            You got {result.correctAnswers} questions right.
                        </div>
                        <div>You got {result.score} out of {quiz.questions.length * 5} marks.</div>
                        {result.passed ? (
                            <div>
                                <p>Congratulations, you passed the quiz!</p>
                                <Button
                                    className="w-fit my-5 mx-5"
                                    action={onTryAgain}
                                    text="Try another Quiz"
                                    disabled={!selectedAnswer}
                                />
                            </div>
                        ) : (
                            <div>Unfortunately, you did not pass the quiz. Please try again.</div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex my-5 mx-5 gap-5">
                <Button
                    className="w-fit"
                    action={onShowResult}
                    text="Show Result"
                    disabled={result.showModal}
                />
                {
                    result.passed ?
                        null
                        :
                        <Button
                            className="w-fit"
                            action={onTryAgain}
                            text="Try Again"
                            disabled={!result.passed}
                        />
                }
            </div>
            <div className="flex gap-5 my-5 mx-5">
                <div className="flex-1 text-lg font-semibold">
                    Score: {result.score} marks
                </div>
                <div className="flex-1 text-lg font-semibold">
                    Correct Answers: {result.correctAnswers}
                </div>
                <div className="flex-1 text-lg font-semibold">
                    Wrong Answers: {result.wrongAnswers}
                </div>
            </div>

            {result.showModal && (
                <Modal
                    onClose={() => setResult((prev) => ({ ...prev, showModal: false }))}
                    score={result.score}
                    totalQuestions={quiz.questions.length}
                >
                    <div className="text-2xl font-bold">
                        {result.passed ? "Congratulations!" : "Sorry!"}
                    </div>
                    <div>
                        You got {result.correctAnswers} out of {quiz.questions.length} questions right.
                    </div>
                    <div>Your score is {result.score}.</div>
                    {result.passed ? (
                        <div>Congratulations, you passed the quiz!</div>
                    ) : (
                        <div>Unfortunately, you did not pass the quiz. Please try again.</div>
                    )}
                    <Button className="w-fit m-2" action={onTryAgain} text="Try Again" />
                </Modal>
            )}

        </div>
    );
};

export default Quiz;