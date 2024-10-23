import { ELF_COLLECTION, POST_COLLECTION } from "@/constants";
import { db, storage } from "@/lib/firebase";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Post } from "../models";

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
