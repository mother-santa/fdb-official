"use client";

import { useEffect, useState } from "react";

export function Countdown() {
    const [isLaunched, setIsLaunched] = useState(false);
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const targetDate = new Date("2024-12-01T00:00:00");

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
                setIsLaunched(false);
            }
            setIsLaunched(true);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        !isLaunched && (
            <div className="bg-white rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-center mb-4">Time until launch</h2>
                <div className="flex justify-center gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{timeLeft.days}</div>
                        <div className="text-sm text-gray-600">Days</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{timeLeft.hours}</div>
                        <div className="text-sm text-gray-600">Hours</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                        <div className="text-sm text-gray-600">Minutes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                        <div className="text-sm text-gray-600">Seconds</div>
                    </div>
                </div>
            </div>
        )
    );
}
