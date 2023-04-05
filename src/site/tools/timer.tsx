import { useState, useEffect } from 'react';
export const Timer = () => {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div>
            <h1></h1>
            <div>Remaining Time: {seconds}</div>
        </div>
    );
};