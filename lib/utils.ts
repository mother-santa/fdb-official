import { clsx, type ClassValue } from "clsx";
import { differenceInMonths, format, formatDistanceToNow } from "date-fns";
import { fr as frLocale } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatCreatedAt = (createdAt: Timestamp | Date | null | undefined) => {
    const formatDate = (date: Date) => {
        const monthsDifference = differenceInMonths(new Date(), date);
        if (monthsDifference > 1) {
            return formatDistanceToNow(date, { addSuffix: true, locale: frLocale }) + " - " + format(date, "d MMMM yyyy", { locale: frLocale });
        }
        return formatDistanceToNow(date, { addSuffix: true, locale: frLocale });
    };

    if (createdAt instanceof Timestamp) {
        return formatDate(createdAt.toDate());
    } else if (createdAt instanceof Date && !isNaN(createdAt.getTime())) {
        return formatDate(createdAt);
    } else {
        return "Date inconnue";
    }
};
