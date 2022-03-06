import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false
    });
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDB;
