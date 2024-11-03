import mongoose from 'mongoose'


type connectionObject = {
    isConnected?: number
}

// IN next-js we need to connect db only when request arrives 
// because unlike express here server is not in running always 
// so we have to connect db on each req where required 
// but if the connection is there we dont want to connect it again -- It will choke the db 
// so we have to keep track of connection status--i.e to check that is old connection is there or not 

const connection : connectionObject  =  {}


export const  connectToDb  =  async () : Promise<void> => {

    if(connection.isConnected){
        console.log('already connected to db')
        return
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