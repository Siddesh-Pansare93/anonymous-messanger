import mongoose from 'mongoose'


type connectionObject = {
    isConnected?: number
}


const connection : connectionObject  =  {}


const  connectToDb  =  async () : Promise<void> => {

    if(connection.isConnected){
        console.log('already connected to db')
    }

    try {
        const connectionInstance  = await mongoose.connect(process.env.MONGODB_URI || "" , {})
        connection.isConnected = connectionInstance.connections[0].readyState

        console.log(connectionInstance)
        console.log(connectionInstance.connections)
    } catch (error : any ) {
        console.log("failed to connect to database : " , error.message)
        process.exit(1)
    }
} 