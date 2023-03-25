import React, { useState, useEffect } from "react";
import { quiz } from ".";
import { Button } from "../components/Buttons/button";
import Modal from "../components/Modal/modal";

interface Result {
    score: number;
    correctAnswers: number;
    wrongAnswers: number;
    questionCount: number;
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
        questionCount: 0,
        passed: false,
        showModal: false,
    }); const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

    useEffect(() => {
        // Shuffle questions array and set to state
        setShuffledQuestions(shuffleArray(quiz.questions));
    }, []);

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
                questionCount: prev.questionCount + 1,
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
            questionCount: 0,
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
            <div className="text-3xl font-bold">Quiz</div>
            {question && (
                <div>
                    <div className="text-xl font-semibold">{question}</div>
                    {shuffledQuestions[activeQuestion].choices.map((val: string, key: number) => {
                        return (
                            <div className="m-2" key={key}>
                                <input
                                    className="m-2"
                                    type="radio"
                                    name={question}
                                    onClick={() => onAnswerSelected(val)}
                                    value={val}
                                    checked={selectedAnswer === val}
                                />
                                {val}
                            </div>
                        );
                    })}
                </div>
            )}
            <Button
                className="m-5 w-fit"
                action={onClickNext}
                text="Next"
                disabled={!selectedAnswer}
            />
            {isQuizFinished && (
                <Button
                    action={onShowResult}
                    text="Show Result"
                    disabled={result.showModal}
                />
            )}
            {result.showModal && (
                <Modal
                    onClose={() => setResult((prev) => ({ ...prev, showModal: false }))}
                    score={result.score}
                    totalQuestions={result.questionCount}
                >
                    <div className="text-2xl font-bold">
                        {result.passed ? "Congratulations!" : "Sorry!"}
                    </div>
                    <div>
                        You got {result.correctAnswers} out of {result.questionCount} questions right.
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
    )
}

export default Quiz