import { Client, Storage } from 'react-native-appwrite';


const client = new Client()
    .setProject('67678ff80037c2cf1dee')
    .setPlatform('com.ak.usider');



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
