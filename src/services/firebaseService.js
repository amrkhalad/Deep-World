import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class FirebaseService {
  async saveContent(content, type) {
    try {
      const collectionRef = collection(db, type);
      const promises = content.map(item => addDoc(collectionRef, {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      await Promise.all(promises);
      console.log(`Successfully saved ${content.length} ${type} items to Firebase`);
    } catch (error) {
      console.error(`Error saving ${type} to Firebase:`, error);
      throw error;
    }
  }

  async getContent(type, limit = 20) {
    try {
      const collectionRef = collection(db, type);
      const q = query(collectionRef, orderBy('createdAt', 'desc'), limit(limit));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Error getting ${type} from Firebase:`, error);
      throw error;
    }
  }

  async getGames() {
    return this.getContent('games');
  }

  async getNews() {
    return this.getContent('news');
  }

  async getCourses() {
    return this.getContent('courses');
  }

  async getTrainings() {
    return this.getContent('trainings');
  }
}

export const firebaseService = new FirebaseService(); 