import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';

const Timer = ({ timeLimit, testId, onTimeUp }) => {
    const { t } = useTranslation('common');
    const [timeLeft, setTimeLeft] = useState(() => {
        const testStartTime = localStorage.getItem(`test_${testId}_start_time`);

        if (!testStartTime) {
            localStorage.setItem(`test_${testId}_start_time`, Date.now().toString());
            localStorage.setItem(`test_${testId}_time`, timeLimit.toString());
            return timeLimit * 60;
        }

        const startTime = parseInt(testStartTime);
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const remainingSeconds = Math.max(0, (timeLimit * 60) - elapsedSeconds);

        if (remainingSeconds <= 0) {
            setTimeout(onTimeUp, 0);
        }

        return remainingSeconds;
    });

    const [isWarning, setIsWarning] = useState(timeLeft <= 300 && timeLeft > 60);

    useEffect(() => {
        if (timeLeft <= 0) return;

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

        return () => clearInterval(timer);
    }, [testId, timeLimit, onTimeUp]);

    useEffect(() => {
        if (timeLeft <= 300 && timeLeft > 60) {
            setIsWarning(true);
        } else if (timeLeft <= 60) {
            setIsWarning(false);
        }
    }, [timeLeft]);

    useEffect(() => {
        const updateLastActivity = () => {
            localStorage.setItem(`test_${testId}_lastUpdate`, Date.now().toString());
        };

        updateLastActivity();
        const interval = setInterval(updateLastActivity, 30000);
        return () => clearInterval(interval);
    }, [testId]);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const parts = [];
        if (hours > 0) {
            parts.push(t('timer.hours', { hours: hours.toString().padStart(2, '0') }));
        }
        if (minutes > 0 || hours > 0) {
            parts.push(t('timer.minutes', { minutes: minutes.toString().padStart(2, '0') }));
        }
        parts.push(t('timer.seconds', { seconds: remainingSeconds.toString().padStart(2, '0') }));

        return parts.join(' ');
    };

    const getTimerStyles = () => {
        if (timeLeft <= 60) {
            return 'bg-red-100 text-red-800 border-red-300 animate-pulse';
        }
        if (isWarning) {
            return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        }
        return 'bg-blue-100 text-blue-800 border-blue-300';
    };

    return (
        <div className={`fixed top-20 right-4 px-4 py-2 rounded-lg border ${getTimerStyles()} font-medium shadow-md transition-colors duration-200`}>
            <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>
                    {t('timer.remaining')}: {formatTime(timeLeft)}
                </span>
            </div>
        </div>
    );
};

export default Timer;