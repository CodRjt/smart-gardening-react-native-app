import { Account, Client, Databases} from 'react-native-appwrite';
export let client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT!)
    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!)

export const account = new Account(client);
export const databases = new Databases(client);
export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
export const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
export const WATERING_ID=process.env.EXPO_PUBLIC_APPWRITE_WATERING_COLLECTION_ID!;
// export interface RealTimeProcess{
//     events:string[];
//     payloads:any
// }