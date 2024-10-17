"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppContext } from "@/contexts";
import { fetchLastNewsForUser, updateUserProfile } from "@/lib/firebase";
import { LastNews } from "@/models/LastNews";
import { Timestamp } from "firebase/firestore";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const LastNewsModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { clerkUser } = useAppContext();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [newsData, setNewsData] = useState<LastNews[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchLastNewsForUser(clerkUser?.id ?? "");
            setNewsData(data);
        };
        fetchData();
    }, [clerkUser?.id]);

    useEffect(() => {
        if (newsData.length) {
            setIsOpen(true);
        }
    }, [newsData]);

    const handleDismiss = () => {
        updateUserProfile(clerkUser?.id ?? "", { readNewsAt: new Date() });
        setIsOpen(false);
    };

    const handlePrevSlide = () => {
        setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
    };

    const handleNextSlide = () => {
        setCurrentSlide(prev => (prev < newsData.length - 1 ? prev + 1 : prev));
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        const touch = e.touches[0];
        const startX = touch.pageX;
        const startY = touch.pageY;

        const handleTouchMove = (e: TouchEvent) => {
            if (!startX || !startY) return;

            const touch = e.touches[0];
            const moveX = touch.pageX - startX;
            const moveY = touch.pageY - startY;

            if (Math.abs(moveX) > Math.abs(moveY)) {
                e.preventDefault();
                if (moveX > 50 && currentSlide > 0) {
                    handlePrevSlide();
                } else if (moveX < -50 && currentSlide < newsData.length - 1) {
                    handleNextSlide();
                }
            }
        };

        const handleTouchEnd = () => {
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleTouchEnd);
        };

        document.addEventListener("touchmove", handleTouchMove, { passive: false });
        document.addEventListener("touchend", handleTouchEnd);
    };

    const formattedDate = (date: Timestamp | Date) => {
        return new Intl.DateTimeFormat("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric"
        }).format(date instanceof Timestamp ? date.toDate() : date);
    };

    return (
        isOpen && (
            <Dialog open={isOpen} onOpenChange={() => {}}>
                <DialogContent className="w-[95vw] max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Nos dernières infos</DialogTitle>
                        <DialogDescription>Quelques infos depuis votre derniere connexion</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <div className="relative overflow-hidden">
                            <div
                                ref={contentRef}
                                className="flex touch-pan-y"
                                onTouchStart={handleTouchStart}
                                style={{
                                    transform: `translateX(-${currentSlide * 100}%)`,
                                    transition: "transform 0.3s ease-in-out",
                                    width: `${newsData.length * 100}%`
                                }}
                            >
                                {newsData.map((news, index) => (
                                    <div key={news.id} className="w-full flex-shrink-0 p-4 relative min-h-[200px]">
                                        <h3 className="text-lg font-semibold mb-2">
                                            {news.title} <span className="text-sm text-gray-400 m-2"> - le {formattedDate(news.createdAt)}</span>
                                        </h3>
                                        <p className="mb-12">{news.content}</p>
                                        {index === newsData.length - 1 && (
                                            <Button className="absolute bottom-4 right-4" onClick={handleDismiss}>
                                                Ok
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            {newsData.length > 1 &&
                                newsData.map((_, index) => (
                                    <div key={index} className={`h-2 w-2 rounded-full mx-1 ${index === currentSlide ? "bg-primary" : "bg-gray-300"}`} />
                                ))}
                        </div>
                    </div>
                    {currentSlide > 0 && (
                        <Button variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 z-10" onClick={handlePrevSlide}>
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Button>
                    )}
                    {currentSlide < newsData.length - 1 && (
                        <Button variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 z-10" onClick={handleNextSlide}>
                            <ChevronRightIcon className="h-4 w-4" />
                        </Button>
                    )}
                </DialogContent>
            </Dialog>
        )
    );
};
