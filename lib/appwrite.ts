import { Client, Account, Storage, OAuthProvider, Databases } from 'react-native-appwrite';

let client : Client;

client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('67678ff80037c2cf1dee'); 

export { OAuthProvider, Account, Databases }; 
const storage = new Storage(client);

export const getRandomFileFromBucket = async (bucketId: string) => {
  try {
    const files = await storage.listFiles(bucketId);
    if (files.total === 0) {
      throw new Error('No files found in the bucket');
    }
    const randomIndex = Math.floor(Math.random() * files.total);
    const file = files.files[randomIndex];
    const fileUrl = storage.getFileView(bucketId, file.$id);
    return { ...file, url: fileUrl.href };
  } catch (error) {
    console.error('Error fetching random file:', error);
    throw error;
  }
};

let streakCollectionId = '67712c550012a4888594';
export { client, streakCollectionId };
