import { connectToDatabase, COLLECTIONS } from '../db';
import { Unit } from '../../shared/schema';

// Get all custom units
export async function getAllCustomUnits(): Promise<Unit[]> {
  const db = await connectToDatabase();
  const customUnits = await db.collection(COLLECTIONS.CUSTOM_UNITS).find().toArray();
  return customUnits as Unit[];
}

// Get a custom unit by ID
export async function getCustomUnitById(id: string): Promise<Unit | null> {
  const db = await connectToDatabase();
  const customUnit = await db.collection(COLLECTIONS.CUSTOM_UNITS).findOne({ id });
  return customUnit as Unit | null;
}

// Create a new custom unit
export async function createCustomUnit(unit: Unit): Promise<Unit> {
  const db = await connectToDatabase();
  await db.collection(COLLECTIONS.CUSTOM_UNITS).insertOne(unit);
  return unit;
}

// Update a custom unit by ID
export async function updateCustomUnit(id: string, unit: Unit): Promise<Unit | null> {
  const db = await connectToDatabase();
  const result = await db.collection(COLLECTIONS.CUSTOM_UNITS).findOneAndUpdate(
    { id },
    { $set: unit },
    { returnDocument: 'after' }
  );
  return result.value as Unit | null;
}

// Delete a custom unit by ID
export async function deleteCustomUnit(id: string): Promise<boolean> {
  const db = await connectToDatabase();
  const result = await db.collection(COLLECTIONS.CUSTOM_UNITS).deleteOne({ id });
  return result.deletedCount === 1;
}