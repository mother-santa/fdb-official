import { USER_PROFILE_COLLECTION } from "@/constants";
import { db, listenToPublicPosts } from "@/lib/firebase";
import { AppUserContextType, Elf, Post, UserProfile } from "@/models";
import { useAuth } from "@clerk/nextjs";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface UserProviderProps {
    children: ReactNode;
    value?: AppUserContextType;
}

const defaultValue: AppUserContextType = {
    isConnected: false,
    isLoadingUserProfile: true,
    userProfile: null,
    posts: [],
    clerckUserId: ""
};

const AppUserContext = createContext(defaultValue);

export const AppUserProvider: React.FC<UserProviderProps> = ({ children, value = defaultValue }) => {
    const { isLoaded, userId } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoadingUserProfile, setIsLoadingUserProfile] = useState(true);
    const isConnected: boolean = !isLoadingUserProfile && !!userId;

    useEffect(() => {
        if (isLoaded && userId) {
            const checkUserProfile = async () => {
                const docRef = doc(db, USER_PROFILE_COLLECTION, userId);
                const docSnapshot = await getDoc(docRef);
                if (docSnapshot.exists()) {
                    setUserProfile({ id: docSnapshot.id, ...docSnapshot.data() } as UserProfile);
                }
                setIsLoadingUserProfile(false);
            };
            checkUserProfile();
        }
    }, [isLoaded, userId]);

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
                    setUserElves(spacesData as Elf[]);
                } catch (error) {
                    console.error("Error fetching elf spaces: ", error);
                }
            };
            fetchElfSpaces();
        }
    }, [userProfile]);

    useEffect(() => {
        const unsubscribe = listenToPublicPosts(newPosts => {
            setPosts(newPosts);
        });

        return () => unsubscribe();
    }, [userId]);

    return (
        <AppUserContext.Provider
            value={{
                ...value,
                isLoadingUserProfile,
                isConnected,
                userProfile: userProfile,
                posts,
                clerckUserId: userId ?? ""
            }}
        >
            {children}
        </AppUserContext.Provider>
    );
};

export const useAppUserContext = () => {
    return useContext(AppUserContext);
};
