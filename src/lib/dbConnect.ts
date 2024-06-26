import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  //* First checking if there already is a connection

  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  //* if not

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    console.log("db.connections", db.connections[0].readyState);

    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Database connection failed", error);

    process.exit(1);
  }
}

export default dbConnect;

//? IMPORTANT TO KNOW

/**
     * *Connection ready state

     0 = disconnected
     1 = connected
     2 = connecting
     3 = disconnecting
     99 = uninitialized
    

     //* Calling process.exit() will force the process to exit as quickly as possible even if there are still asynchronous operations pending that have not yet completed fully, including I/O operations to process.stdout and process.stderr.
*/
