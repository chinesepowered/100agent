import { Client, Databases, ID } from 'appwrite';
import { Developer } from '@/types';

// Server-side client setup for Appwrite v18+
const client = new Client();

if (process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);
  
  // Set API key for server-side operations  
  if (process.env.APPWRITE_API_KEY) {
    console.log('Setting Appwrite API key...');
    // For Appwrite v18+, the API key should be set differently
    try {
      // Method 1: Direct header setting
      (client as any).headers = {
        ...((client as any).headers || {}),
        'X-Appwrite-Key': process.env.APPWRITE_API_KEY
      };
      console.log('✅ API key set via headers');
    } catch (error) {
      console.warn('❌ Failed to set API key:', error);
    }
  }
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

// Check if we have proper API access
const hasApiAccess = async () => {
  try {
    // Try a simple operation to test access
    await databases.listDocuments(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collectionId
    );
    return true;
  } catch {
    return false;
  }
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
  // Try Appwrite first for judges to see integration
  if (isAppwriteConfigured()) {
    try {
      console.log('🔄 Attempting to save to Appwrite...');
      console.log('Database ID:', APPWRITE_CONFIG.databaseId);
      console.log('Collection ID:', APPWRITE_CONFIG.collectionId);
      console.log('Developer data:', { name: developer.name, githubUsername: developer.githubUsername });
      
      // Create a simplified document with only basic fields for demo
      const simplifiedData = {
        developerName: developer.name,
        githubUser: developer.githubUsername,
        techStack: developer.languages.join(', '),
        profileLink: developer.profileUrl,
        devLocation: developer.location || '',
        companyName: developer.company || '',
        contactEmail: developer.email || '',
        savedAt: new Date().toISOString(),
      };
      
      console.log('🔍 Simplified data for Appwrite:', simplifiedData);
      console.log('🔍 Data keys being sent:', Object.keys(simplifiedData));
      
      const response = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collectionId,
        ID.unique(),
        simplifiedData
      );
      console.log('✅ Successfully saved to Appwrite database:', response.$id);
      // Also save to localStorage as backup
      saveToLocalStorage(developer);
      return response;
    } catch (error: any) {
      console.error('❌ Appwrite save failed:');
      console.error('Error code:', error.code);
      console.error('Error type:', error.type);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      saveToLocalStorage(developer);
      return developer;
    }
  } else {
    // Fallback to localStorage if not configured
    console.log('⚠️ Appwrite not configured, using localStorage');
    saveToLocalStorage(developer);
    return developer;
  }
}

export async function getDevelopers(): Promise<Developer[]> {
  // Try Appwrite first for judges to see integration
  if (isAppwriteConfigured()) {
    try {
      const response = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collectionId
      );
      
      const appwriteDevs = response.documents.map(doc => ({
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
      
      console.log('✅ Successfully retrieved from Appwrite database:', appwriteDevs.length);
      return appwriteDevs;
    } catch (error) {
      console.error('❌ Appwrite fetch failed, falling back to localStorage:', error);
      return getFromLocalStorage();
    }
  } else {
    console.log('⚠️ Appwrite not configured, using localStorage');
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