"use client";

import { useAppContext } from "@/contexts";
import { useEffect, useState } from "react";

export function Countdown() {
    const { isLaunched, targetDate } = useAppContext();
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
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
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        !isLaunched &&
        timeLeft.days > 0 && (
            <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-500/80">
                <h2 className="text-lg font-semibold text-center mb-4">Temps avant le lancement</h2>
                <div className="flex justify-center gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{timeLeft.days}</div>
                        <div className="text-sm text-gray-600">Jours</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{timeLeft.hours}</div>
                        <div className="text-sm text-gray-600">Heures</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                        <div className="text-sm text-gray-600">Minutes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                        <div className="text-sm text-gray-600">Secondes</div>
                    </div>
                </div>
            </div>
        )
    );
}
