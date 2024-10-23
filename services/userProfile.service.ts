import { USER_PROFILE_COLLECTION } from "@/constants";
import { db, storage } from "@/lib/firebase";
import { UserProfile } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const checkUserSlugIsAvailable = async (slug: string): Promise<boolean> => {
    const userProfileCollection = collection(db, USER_PROFILE_COLLECTION);
    const q = query(userProfileCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const userDoc = await getDoc(doc(db, USER_PROFILE_COLLECTION, userId));
        if (userDoc.exists()) {
            return userDoc.data() as UserProfile;
        } else {
            console.log("No such user data!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>) => {
    try {
        const userDoc = doc(db, USER_PROFILE_COLLECTION, userId);
        await setDoc(userDoc, data, { merge: true });
    } catch (error) {
        console.error("Error updating user data:", error);
    }
};

export const updateUserProfilePhoto = async (userId: string, photo: File) => {
    try {
        const storageRef = ref(storage, `profiles/${userId}/photo`);
        const uploadResult = await uploadBytes(storageRef, photo);
        const url = await getDownloadURL(uploadResult.ref);
        await updateUserProfile(userId, { avatarUrl: url });
    } catch (error) {
        console.error("Error updating user photo:", error);
    }
};
