import React, { useState, useEffect } from 'react';

const Timer = ({ timeLimit, testId, onTimeUp }) => {
    const [timeLeft, setTimeLeft] = useState(() => {
        const testStartTime = localStorage.getItem(`test_${testId}_start_time`);

        // If no start time exists, this is a new test
        if (!testStartTime) {
            localStorage.setItem(`test_${testId}_start_time`, Date.now().toString());
            return timeLimit * 60;
        }

        // Calculate remaining time based on start time
        const startTime = parseInt(testStartTime);
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const remainingSeconds = Math.max(0, (timeLimit * 60) - elapsedSeconds);

        // If time is already up, trigger submission
        if (remainingSeconds <= 0) {
            setTimeout(onTimeUp, 0);
        }

        return remainingSeconds;
    });

    const [isWarning, setIsWarning] = useState(timeLeft <= 300 && timeLeft > 60);

    useEffect(() => {
        // Don't start timer if time is already up
        if (timeLeft <= 0) {
            return;
        }

        const timer = setInterval(() => {
            const startTime = parseInt(localStorage.getItem(`test_${testId}_start_time`));
            if (!startTime) {
                clearInterval(timer);
                return;
            }

            const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
            const newTimeLeft = Math.max(0, (timeLimit * 60) - elapsedSeconds);

            setTimeLeft(newTimeLeft);

            if (newTimeLeft <= 0) {
                clearInterval(timer);
                onTimeUp();
            }
        }, 1000);

        // Cleanup timer on unmount
        return () => clearInterval(timer);
    }, [testId, timeLimit, onTimeUp]);

    // Set warning state when 5 minutes remaining
    useEffect(() => {
        if (timeLeft <= 300 && timeLeft > 60) {
            setIsWarning(true);
        } else if (timeLeft <= 60) {
            setIsWarning(false);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const parts = [];
        if (hours > 0) {
            parts.push(`${hours.toString().padStart(2, '0')}h`);
        }
        if (minutes > 0 || hours > 0) {
            parts.push(`${minutes.toString().padStart(2, '0')}m`);
        }
        parts.push(`${remainingSeconds.toString().padStart(2, '0')}s`);

        return parts.join(' ');
    };

    const getTimerStyles = () => {
        if (timeLeft <= 60) {
            return 'bg-red-100 text-red-800 border-red-300';
        }
        if (isWarning) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        }
        return 'bg-blue-100 text-blue-800 border-blue-300';
    };

    return (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg border ${getTimerStyles()} font-medium shadow-md`}>
            <div className="flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                    />
                </svg>
                Time Remaining: {formatTime(timeLeft)}
            </div>
        </div>
    );
};

export default Timer;