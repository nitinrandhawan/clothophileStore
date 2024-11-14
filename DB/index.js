import mongoose from "mongoose"

export const ConnectDB=async()=>{
   
        try {
       const connect=  await  mongoose.connect(process.env.MONGODB_URI)
         console.log('DB is connected on: ' ,connect.connection.host );
         
        } catch (error) {
            console.log('DB Error',error.message);
            
        }
    
}