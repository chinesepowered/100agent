import { Client, Databases, ID } from 'appwrite';
import { Developer } from '@/types';

const client = new Client();

if (process.env.APPWRITE_ENDPOINT && process.env.APPWRITE_PROJECT_ID) {
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID);

  if (process.env.APPWRITE_API_KEY) {
    // Server-side API key setup for backend operations
    (client as any).setKey(process.env.APPWRITE_API_KEY);
  }
}

export const databases = new Databases(client);

export const APPWRITE_CONFIG = {
  databaseId: process.env.APPWRITE_DATABASE_ID || '',
  collectionId: process.env.APPWRITE_COLLECTION_ID || '',
};

export async function saveDeveloper(developer: Developer) {
  try {
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
  } catch (error) {
    console.error('Error saving developer:', error);
    throw error;
  }
}

export async function getDevelopers() {
  try {
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
  } catch (error) {
    console.error('Error fetching developers:', error);
    throw error;
  }
}

export async function deleteDeveloper(developerId: string) {
  try {
    await databases.deleteDocument(
      APPWRITE_CONFIG.databaseId,
      APPWRITE_CONFIG.collectionId,
      developerId
    );
  } catch (error) {
    console.error('Error deleting developer:', error);
    throw error;
  }
}