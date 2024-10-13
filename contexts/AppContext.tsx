"use client";

import { USER_PROFILE_COLLECTION } from "@/constants";
import { db, listenToPublicPosts } from "@/lib/firebase";
import { AppContextType, Post, UserProfile } from "@/models";
import { useAuth, useUser } from "@clerk/nextjs";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface UserProviderProps {
    children: ReactNode;
    value?: AppContextType;
}
const defaultValue: AppContextType = {
    isConnected: false,
    isLoadingUserProfile: true,
    userProfile: null,
    posts: [],
    clerkUser: null
};

const AppContext = createContext(defaultValue);

export const AppUserProvider: React.FC<UserProviderProps> = ({ children, value = defaultValue }) => {
    const { isLoaded } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(true);
    const { user: clerkUser } = useUser();
    const isConnected: boolean = !isLoadingUserProfile && !!clerkUser;

    const [ctx, setCtx] = useState<AppContextType>({
        ...defaultValue
    });

    useEffect(() => {
        if (isLoaded && clerkUser) {
            const checkUserProfile = async () => {
                const docRef = doc(db, USER_PROFILE_COLLECTION, clerkUser.id);
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    setUserProfile({ id: docSnapshot.id, ...docSnapshot.data() } as UserProfile);
                }
                setIsLoadingUserProfile(false);
            };
            checkUserProfile();
        }
        setCtx({ ...ctx, clerkUser: clerkUser ?? null });
    }, [isLoaded, clerkUser?.id]);

    useEffect(() => {
        if (userProfile) {
            const fetchElfSpaces = async () => {
                try {
                    const spacesCollection = userProfile?.id ? collection(db, USER_PROFILE_COLLECTION, userProfile?.id, ELFE_COLLECTION) : null;
                    if (!spacesCollection) {
                        return;
                    }
                    const spacesSnapshot = await getDocs(spacesCollection);
                    const spacesData = spacesSnapshot.docs.map(doc => ({
                        id: doc.id,
                        name: doc.data().name ?? "",
                        description: doc.data().description ?? "",
                        ...doc.data()
                    }));
                    // setUserElves(spacesData as Elf[]);
                } catch (error) {
                    console.error("Error fetching elf spaces: ", error);
                }
            };
            fetchElfSpaces();
        }
        setCtx({ ...ctx, userProfile: userProfile });
    }, [userProfile]);

    useEffect(() => {
        const unsubscribe = listenToPublicPosts(newPosts => {
            setPosts(newPosts);
        });
        setCtx({ ...ctx, posts: posts });
        return () => unsubscribe();
    }, [clerkUser?.id]);

    return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};
