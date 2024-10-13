import { ELF_COLLECTION, POST_COLLECTION, USER_PROFILE_COLLECTION } from "@/constants";
import { Elf, Post, UserProfile } from "@/models";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, where } from "firebase/firestore";

import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage = getStorage(app);

/**
 * Profile Methods
 */
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

/**
 * Elf Methods
 */
export const createElf = async (userId: string, data: Partial<Elf>): Promise<Elf | null> => {
    try {
        const elfCollection = collection(db, ELF_COLLECTION);
        const newElf = await addDoc(elfCollection, {
            ownerId: userId,
            ...data
        });
        return { id: newElf.id, ...data } as Elf;
    } catch (error) {
        console.error("Error creating elf:", error);
        return null;
    }
};

export const fetchElf = async (elfId: string): Promise<Elf | null> => {
    try {
        const elfDoc = await getDoc(doc(db, ELF_COLLECTION, elfId));
        if (elfDoc.exists()) {
            return elfDoc.data() as Elf;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching elf:", error);
        return null;
    }
};

export const updateElf = async (elfId: string, data: Partial<Elf>) => {
    try {
        const elfDoc = doc(db, ELF_COLLECTION, elfId);
        await setDoc(elfDoc, data, { merge: true });
    } catch (error) {
        console.error("Error updating elf:", error);
    }
};

export const deleteElf = async (elfId: string) => {
    try {
        const elfDoc = doc(db, ELF_COLLECTION, elfId);
        await deleteDoc(elfDoc);
    } catch (error) {
        console.error("Error deleting elf:", error);
    }
};

export const fetchUserElves = async (userId: string): Promise<Elf[]> => {
    try {
        if (!userId) {
            console.error("Invalid userId provided", userId);
            return [];
        }
        const elfCollection = collection(db, ELF_COLLECTION);
        const q = query(elfCollection, where("ownerId", "==", userId));
        const querySnapshot = await getDocs(q);
        const elves: Elf[] = [];
        querySnapshot.forEach(doc => {
            const elfData = doc.data();
            if (elfData) {
                elves.push({ id: doc.id, ...elfData } as Elf);
            }
        });
        return elves;
    } catch (error) {
        console.error("Error fetching user elves:", error);
        return [];
    }
};

export const updateElfPhoto = async (userId: string, elfId: string, photo: File): Promise<string | null> => {
    try {
        const storageRef = ref(storage, `profiles/${userId}/elves/${elfId}/avatar`);
        const uploadResult = await uploadBytes(storageRef, photo);
        const url = await getDownloadURL(uploadResult.ref);
        await updateElf(elfId, { avatarUrl: url });
        return url;
    } catch (error) {
        console.error("Error updating elf photo:", error);
        return null;
    }
};

/**
 * Post Methods
 */
export const createPost = async (userId: string, data: Partial<Post>): Promise<Post | null> => {
    try {
        const postCollection = collection(db, POST_COLLECTION);
        const newPost = await addDoc(postCollection, {
            ownerId: userId,
            ...data
        });
        return { id: newPost.id, ...data } as Post;
    } catch (error) {
        console.error("Error creating post:", error);
        return null;
    }
};

export const listenToPublicPosts = (onChange: (posts: Post[]) => void) => {
    const postCollection = collection(db, POST_COLLECTION);
    const q = query(postCollection, where("isPublic", "==", true));
    const unsubscribe = onSnapshot(q, snapshot => {
        const posts: Post[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
        onChange(posts);
    });
    return unsubscribe;
};

export const fetchUserPosts = async (userId: string): Promise<Post[]> => {
    try {
        if (!userId) {
            console.error("Invalid userId provided", userId);
            return [];
        }
        const postCollection = collection(db, POST_COLLECTION);
        const q = query(postCollection, where("ownerId", "==", userId));
        const querySnapshot = await getDocs(q);
        const posts: Post[] = [];
        querySnapshot.forEach(doc => {
            const postData = doc.data();
            if (postData) {
                posts.push({ id: doc.id, ...postData } as Post);
            }
        });
        return posts;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return [];
    }
};

export const updatePost = async (postId: string, data: Partial<Post>) => {
    try {
        const postDoc = doc(db, POST_COLLECTION, postId);
        await setDoc(postDoc, data, { merge: true });
    } catch (error) {
        console.error("Error updating post:", error);
    }
};

export const deletePost = async (postId: string) => {
    try {
        const postDoc = doc(db, POST_COLLECTION, postId);
        await deleteDoc(postDoc);
    } catch (error) {
        console.error("Error deleting post:", error);
    }
};
