import mongoose from 'mongoose';

const MONGODB_URI: string = process.env.MONGODB_URI as string;
let isConnected: any = null;

async function connect() {
  if (isConnected) {
    console.log('already connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    isConnected = mongoose.connections[0].readyState;
    if (isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(MONGODB_URI);
  console.log('new connection');
  isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      isConnected = false;
    } else {
      console.log('not disconnected');
    }
  }
}
// function convertDocToObj(doc) {
//   doc._id = doc._id.toString();
//   doc.createdAt = doc.createdAt.toString();
//   doc.updatedAt = doc.updatedAt.toString();
//   return doc;
// }

const db = { connect, disconnect };
export default db;