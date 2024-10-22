import { COMMENT_COLLECTION, ELF_COLLECTION, LAST_NEWS_COLLECTION, POST_COLLECTION, USER_PROFILE_COLLECTION } from "@/constants";
import { Comment, Elf, Post, UserProfile } from "@/models";
import { LastNews } from "@/models/LastNews";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";

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

/**
 * Post Methods
 */
export const createPost = async (userId: string, data: Partial<Post>): Promise<Post | null> => {
    try {
        const postCollection = collection(db, POST_COLLECTION);
        const newPost = await addDoc(postCollection, {
            ownerId: userId,
            ...data,
            createdAt: new Date()
        });
        return { id: newPost.id, ...data } as Post;
    } catch (error) {
        console.error("Error creating post:", error);
        return null;
    }
};

export const listenToPosts = (onChange: (posts: Post[]) => void) => {
    const postCollection = collection(db, POST_COLLECTION);
    const postQuery = query(postCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(postQuery, async postSnapshot => {
        const posts: Post[] = postSnapshot.docs.map(
            doc =>
                ({
                    id: doc.id,
                    ...doc.data()
                } as Post)
        );
        onChange(posts);
    });

    return unsubscribe;
};

export const listenToPublicPosts = (onChange: (posts: Post[]) => void) => {
    const elfCollection = collection(db, ELF_COLLECTION);
    const publicElvesQuery = query(elfCollection, where("isPrivate", "==", false));

    const unsubscribe = onSnapshot(publicElvesQuery, async elfSnapshot => {
        const publicElfIds = elfSnapshot.docs.map(doc => doc.id);

        if (publicElfIds.length === 0) {
            onChange([]);
            return;
        }

        const postCollection = collection(db, POST_COLLECTION);
        const postQuery = query(
            postCollection,
            where("ownerId", "in", publicElfIds), // Filters posts where the ownerId is in the publicElfIds list
            orderBy("createdAt", "desc") // Orders the posts by the createdAt field in descending order
        );
        const postSnapshot = await getDocs(postQuery);
        const posts: Post[] = postSnapshot.docs.map(
            doc =>
                ({
                    id: doc.id,
                    ...doc.data()
                } as Post)
        );

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

export const fetchPost = async (postId: string): Promise<Post | null> => {
    try {
        const postDoc = await getDoc(doc(db, POST_COLLECTION, postId));
        if (postDoc.exists()) {
            return postDoc.data() as Post;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
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

export const updatePostLike = async (userId: string, postId: string) => {
    try {
        const post = await fetchPost(postId);
        if (!post) {
            console.error("Invalid post id provided", postId);
            return;
        }
        const likes = post.likedByUserIds ?? [];
        const isLiked = likes.includes(userId) ?? false;
        const updatedLikes = isLiked ? likes.filter(id => id !== userId) : [...likes, userId];
        await updatePost(postId, { likedByUserIds: updatedLikes });
    } catch (error) {
        console.error("Error updating post like:", error);
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

export const uploadPostAssets = async (userId: string, elfId: string, postId: string, files: File[]) => {
    try {
        for (const file of files) {
            const storageRef = ref(storage, `profiles/${userId}/elves/${elfId}/posts/${postId}/assets`);
            const uploadResult = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(uploadResult.ref);
            const post = await fetchPost(postId);
            if (post) {
                await updatePost(postId, { assets: [...post.assets, { type: file.type.startsWith("image/") ? "image" : "video", url }] });
            }
        }
    } catch (error) {
        console.error("Error updating user photo:", error);
    }
};

/**
 * Last News Methods
 */
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

/**
 * Comments Methods
 */
export const createComment = async (userId: string, postId: string, data: Partial<Comment>, commentId?: string) => {
    try {
        if (commentId && commentId !== "") {
            const parentComment = await fetchComment(postId, commentId);
            if (parentComment) {
                await updateComment(postId, commentId, { replies: [...parentComment.replies, data as Comment] });
                return { id: commentId, ...data, replies: [...parentComment.replies, data as Comment] } as Comment;
            }
        } else {
            const commentCollection = collection(db, POST_COLLECTION, postId, COMMENT_COLLECTION);
            const newComment = await addDoc(commentCollection, {
                userId,
                createdAt: new Date(),
                ...data
            });
            return { id: newComment.id, ...data } as Comment;
        }
    } catch (error) {
        console.error("Error creating comment:", error);
        return null;
    }
};

export const fetchComment = async (postId: string, commentId: string): Promise<Comment | null> => {
    try {
        const commentDoc = await getDoc(doc(db, POST_COLLECTION, postId, COMMENT_COLLECTION, commentId));
        if (commentDoc.exists()) {
            return commentDoc.data() as Comment;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching comment:", error);
        return null;
    }
};

export const updateComment = async (postId: string, commentId: string, data: Partial<Comment>) => {
    try {
        const commentDoc = doc(db, POST_COLLECTION, postId, COMMENT_COLLECTION, commentId);
        await setDoc(commentDoc, data, { merge: true });
    } catch (error) {
        console.error("Error updating comment:", error);
    }
};

export const listenToPostComments = (postId: string, onChange: (cmts: Comment[]) => void) => {
    const commentCollection = collection(db, POST_COLLECTION, postId, COMMENT_COLLECTION);
    const commentQuery = query(commentCollection, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(commentQuery, async commentSnapshot => {
        const comments: Comment[] = commentSnapshot.docs.map(
            doc =>
                ({
                    id: doc.id,
                    ...doc.data()
                } as Comment)
        );
        onChange(comments);
    });

    return unsubscribe;
};
