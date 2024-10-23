import { LAST_NEWS_COLLECTION } from "@/constants";
import { db } from "@/lib/firebase";
import { LastNews } from "@/models/LastNews";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { fetchUserProfile } from "./userProfile.service";

export const fetchLastNewsForUser = async (userId: string): Promise<LastNews[]> => {
    const userProfile = await fetchUserProfile(userId);
    if (!userProfile) {
        return [];
    }
    const lastNewsCollection = collection(db, LAST_NEWS_COLLECTION);
    const q = query(lastNewsCollection, where("createdAt", ">", userProfile.readNewsAt ?? new Date("01-01-1970")), orderBy("createdAt", "asc"));
    const querySnapshot = await getDocs(q);
    const lastNews: LastNews[] = [];
    querySnapshot.forEach(doc => {
        const newsData = doc.data();
        if (newsData) {
            lastNews.push({ id: doc.id, ...newsData } as LastNews);
        }
    });
    return lastNews;
};
