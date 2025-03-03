import mongoose from "mongoose";
import {DB_NAME} from '../constant.js'


const connectDb = async () => {
    try {
        const dbInstance = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        console.log("Database connected successfully on HOST:",dbInstance.connection.host)
        
    } catch (error) {
        console.log(error)
        throw new Error(500,"Error in connecting database")
    }
}

export {connectDb}