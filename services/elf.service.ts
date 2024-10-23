import { ELF_COLLECTION } from "@/constants";
import { db, storage } from "@/lib/firebase";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Elf } from "../models";
import { updateUserProfile } from "./userProfile.service";

export const createElf = async (userId: string, data: Partial<Elf>) => {
    try {
        const elfDoc = doc(db, ELF_COLLECTION, data.slug ?? "");
        await setDoc(
            elfDoc,
            {
                ownerId: userId,
                ...data
            },
            { merge: true }
        );
        await updateUserProfile(userId, { currentElfId: data.slug });
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

export const checkElfSlugIsAvailable = async (slug: string): Promise<boolean> => {
    const elfCollection = collection(db, ELF_COLLECTION);
    const q = query(elfCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
};
