import { MongoClient, ServerApiVersion, Db } from 'mongodb';
import { log } from './vite';

// MongoDB connection string
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/warforge";

// Create a MongoClient with connection options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db: Db | null = null;

export async function connectToDatabase() {
  try {
    if (!db) {
      log('Connecting to MongoDB...', 'database');
      await client.connect();
      db = client.db('warforge');
      log('Connected to MongoDB successfully', 'database');
    }
    return db;
  } catch (error) {
    log(`Error connecting to MongoDB: ${error}`, 'database');
    throw error;
  }
}

export async function closeConnection() {
  if (client) {
    await client.close();
    db = null;
    log('MongoDB connection closed', 'database');
  }
}

// Collection names
export const COLLECTIONS = {
  CUSTOM_UNITS: 'customUnits',
  ARMIES: 'armies'
};

// Function to initialize collections with indexes if needed
export async function initializeCollections() {
  try {
    const database = await connectToDatabase();

    // Ensure indexes for customUnits collection
    await database.collection(COLLECTIONS.CUSTOM_UNITS).createIndex({ id: 1 }, { unique: true });
    log('Created index on customUnits.id', 'database');
    
    // Ensure indexes for armies collection
    await database.collection(COLLECTIONS.ARMIES).createIndex({ id: 1 }, { unique: true });
    log('Created index on armies.id', 'database');
  } catch (error) {
    log(`Error initializing collections: ${error}`, 'database');
  }
}