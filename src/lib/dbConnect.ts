import mongoose from "mongoose";


type ConnectionObject = {
    isConnected: boolean, connectionNumber?: number
}

const connection: ConnectionObject = { isConnected: false }

async function mongoConnect(): Promise<void> {

    if (connection.connectionNumber) {
        console.log("Already connected to the database");
        return
    }

    try {
        const myDb = await mongoose.connect(process.env.MONOGO_URI || "")
        console.log(myDb)
        
        connection.connectionNumber = myDb.connections[0].readyState;
        connection.isConnected = true
    } catch (err: any) {
        console.log("Error connecting to the database")
        process.exit(1)
    }
}

export default mongoConnect;