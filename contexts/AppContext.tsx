"use client";

import { USER_PROFILE_COLLECTION } from "@/constants";
import { db } from "@/lib/firebase";
import { AppContextType, Post, UserProfile } from "@/models";
import { useAuth, useUser } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface UserProviderProps {
    children: ReactNode;
    value?: AppContextType;
}
const defaultValue: AppContextType = {
    userProfile: null,
    posts: [],
    clerkUser: null
};

const AppContext = createContext(defaultValue);

export const AppUserProvider: React.FC<UserProviderProps> = ({ children, value = defaultValue }) => {
    const { isLoaded } = useAuth();
    const { user: clerkUser } = useUser();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }
        if (clerkUser) {
            loadUserProfile();
        }
    }, [clerkUser, isLoaded]);

    const loadUserProfile = async () => {
        const docRef = doc(db, USER_PROFILE_COLLECTION, clerkUser?.id ?? "");
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            setUserProfile({ id: docSnapshot.id, ...docSnapshot.data() } as UserProfile);
        }
    };

    // useEffect(() => {
    //     if (!isLoaded) {
    //         return;
    //     }
    //     if (clerkUser) {
    //         const checkUserProfile = async () => {
    //             const docRef = doc(db, USER_PROFILE_COLLECTION, clerkUser.id);
    //             const docSnapshot = await getDoc(docRef);
    //             if (docSnapshot.exists()) {
    //                 setUserProfile({ id: docSnapshot.id, ...docSnapshot.data() } as UserProfile);
    //             }
    //         };
    //         checkUserProfile();
    //     } else {
    //         setUserProfile(null);
    //     }
    //     setCtx({ ...ctx, clerkUser: clerkUser ?? null });
    // }, [isLoaded, clerkUser?.id]);

    // useEffect(() => {
    //     const unsubscribe = listenToPublicPosts(newPosts => {
    //         setPosts(newPosts);
    //     });
    //     setCtx({ ...ctx, posts: posts });
    //     return () => unsubscribe();
    // }, [clerkUser?.id]);

    return <AppContext.Provider value={{ ...value, clerkUser: clerkUser ?? null, userProfile, loadUserProfile }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};
