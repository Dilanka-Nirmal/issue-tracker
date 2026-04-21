import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;  // throw instead of process.exit — lets the caller handle it
  }
};

export default connectDB;

// -- Before deploy to Vercel --------------------------------------------

// import mongoose from 'mongoose';
// import dns from 'dns';

// dns.setServers(['8.8.8.8', '8.8.4.4']);
// dns.setDefaultResultOrder('ipv4first');

// const connectDB = async (): Promise<void> => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI as string, {
//       serverSelectionTimeoutMS: 10000,
//       socketTimeoutMS: 45000,
//       family: 4,
//     });
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// export default connectDB;