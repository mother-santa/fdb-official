"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppContext } from "@/contexts";
import { fetchLastNewsForUser, updateUserProfile } from "@/lib/firebase";
import { LastNews } from "@/models/LastNews";
import { Timestamp } from "firebase/firestore";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { TouchEvent, useEffect, useRef, useState } from "react";

export const LastNewsModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { clerkUser } = useAppContext();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [newsData, setNewsData] = useState<LastNews[]>([]);
    const minSwipeDistance = 50;
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

    const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        setTouchEnd(0); // Reset
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe && currentSlide < newsData.length - 1) {
            handleNextSlide();
        }
        if (isRightSwipe && currentSlide > 0) {
            handlePrevSlide();
        }
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
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Nos dernières infos</DialogTitle>
                        <DialogDescription>Quelques infos depuis votre derniere connexion</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        <div className="relative">
                            <div ref={contentRef} className="overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                                <div
                                    className="flex transition-transform duration-300 ease-in-out"
                                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
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
                        </div>
                        <div className="flex justify-center mt-4">
                            {newsData.length > 1 &&
                                newsData.map((_, index) => (
                                    <div key={index} className={`h-2 w-2 rounded-full mx-1 ${index === currentSlide ? "bg-primary" : "bg-gray-300"}`} />
                                ))}
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className={`absolute -left-5 top-1/2 -translate-y-1/2 ${currentSlide === 0 ? "hidden" : ""}`}
                        onClick={handlePrevSlide}
                        disabled={currentSlide === 0}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className={`absolute -right-5 top-1/2 -translate-y-1/2 z-10 ${currentSlide === newsData.length - 1 ? "hidden" : ""}`}
                        onClick={handleNextSlide}
                        disabled={currentSlide === newsData.length - 1}
                        hidden={currentSlide < newsData.length - 1}
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                </DialogContent>
            </Dialog>
        )
    );
};
