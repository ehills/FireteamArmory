import { connectToDatabase, COLLECTIONS } from '../db';
import { Army } from '../../shared/schema';

// Get all armies
export async function getAllArmies(): Promise<Army[]> {
  const db = await connectToDatabase();
  const armies = await db.collection(COLLECTIONS.ARMIES).find().toArray();
  return armies as Army[];
}

// Get army by ID
export async function getArmyById(id: string): Promise<Army | null> {
  const db = await connectToDatabase();
  const army = await db.collection(COLLECTIONS.ARMIES).findOne({ id });
  return army as Army | null;
}

// Create a new army
export async function createArmy(army: Army): Promise<Army> {
  const db = await connectToDatabase();
  await db.collection(COLLECTIONS.ARMIES).insertOne(army);
  return army;
}

// Update an army
export async function updateArmy(id: string, army: Army): Promise<Army | null> {
  const db = await connectToDatabase();
  const result = await db.collection(COLLECTIONS.ARMIES).findOneAndUpdate(
    { id },
    { $set: army },
    { returnDocument: 'after' }
  );
  return result.value as Army | null;
}

// Delete an army
export async function deleteArmy(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  const result = await db.collection(COLLECTIONS.ARMIES).deleteOne({ id });
  return result.deletedCount === 1;
}