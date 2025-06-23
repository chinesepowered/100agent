import { Client, Databases, ID } from 'appwrite';
import { Developer } from '@/types';

// Simple client setup for demo purposes
const client = new Client();

if (process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);
}

export const databases = new Databases(client);

export const APPWRITE_CONFIG = {
  databaseId: process.env.APPWRITE_DATABASE_ID || '',
  collectionId: process.env.APPWRITE_COLLECTION_ID || '',
};

// For demo purposes, we'll use localStorage as fallback if Appwrite is not configured
const STORAGE_KEY = 'intellicrawl_developers';

// Helper to check if Appwrite is configured
const isAppwriteConfigured = () => {
  return !!(
    process.env.APPWRITE_ENDPOINT &&
    process.env.APPWRITE_PROJECT_ID &&
    process.env.APPWRITE_DATABASE_ID &&
    process.env.APPWRITE_COLLECTION_ID
  );
};

// Fallback localStorage functions for demo
const saveToLocalStorage = (developer: Developer) => {
  if (typeof window === 'undefined') return;
  
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  existing.push(developer);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
};

const getFromLocalStorage = (): Developer[] => {
  if (typeof window === 'undefined') return [];
  
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};

const deleteFromLocalStorage = (developerId: string) => {
  if (typeof window === 'undefined') return;
  
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const filtered = existing.filter((dev: Developer) => dev.id !== developerId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export async function saveDeveloper(developer: Developer) {
  try {
    if (isAppwriteConfigured()) {
      const response = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collectionId,
        ID.unique(),
        {
          ...developer,
          languages: developer.languages.join(','),
          repositories: JSON.stringify(developer.repositories),
        }
      );
      return response;
    } else {
      // Fallback to localStorage for demo
      saveToLocalStorage(developer);
      return developer;
    }
  } catch (error) {
    console.error('Error saving developer to Appwrite, falling back to localStorage:', error);
    saveToLocalStorage(developer);
    return developer;
  }
}

export async function getDevelopers(): Promise<Developer[]> {
  try {
    if (isAppwriteConfigured()) {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collectionId
      );
      
      return response.documents.map(doc => ({
        id: doc.$id,
        name: doc.name as string,
        githubUsername: doc.githubUsername as string,
        location: doc.location as string | undefined,
        bio: doc.bio as string | undefined,
        languages: doc.languages ? (doc.languages as string).split(',') : [],
        repositories: doc.repositories ? JSON.parse(doc.repositories as string) : [],
        profileUrl: doc.profileUrl as string,
        avatarUrl: doc.avatarUrl as string | undefined,
        followers: doc.followers as number | undefined,
        following: doc.following as number | undefined,
        publicRepos: doc.publicRepos as number | undefined,
        company: doc.company as string | undefined,
        blog: doc.blog as string | undefined,
        email: doc.email as string | undefined,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      })) as Developer[];
    } else {
      // Fallback to localStorage for demo
      return getFromLocalStorage();
    }
  } catch (error) {
    console.error('Error fetching developers from Appwrite, falling back to localStorage:', error);
    return getFromLocalStorage();
  }
}

export async function deleteDeveloper(developerId: string) {
  try {
    if (isAppwriteConfigured()) {
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collectionId,
        developerId
      );
    } else {
      // Fallback to localStorage for demo
      deleteFromLocalStorage(developerId);
    }
  } catch (error) {
    console.error('Error deleting developer from Appwrite, falling back to localStorage:', error);
    deleteFromLocalStorage(developerId);
  }
}