import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { fr as frLocale } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatCreatedAt = (createdAt: Timestamp | Date | null | undefined) => {
    if (createdAt instanceof Timestamp) {
        return formatDistanceToNow(createdAt.toDate(), { addSuffix: true, locale: frLocale });
    } else if (createdAt instanceof Date && !isNaN(createdAt.getTime())) {
        return formatDistanceToNow(createdAt, { addSuffix: true, locale: frLocale });
    } else {
        return "Date inconnue";
    }
};
