import mongoose from "mongoose";


export const DBconnection = async() =>{
    return await mongoose.connect(process.env.LOCAL_DATA_BASE_URI as string)
    .then(() =>{
        console.log("Database connect successfully");
    })
    .catch(err => {
        console.log("DB Error => ", err);
        
    })
}

export default DBconnection;



// import mongoose from "mongoose";


// const connectDB = async () =>{
//     const DB_URI = (process.env.LOCAL_DATA_BASE_URI)
  
// await mongoose
//   .connect(DB_URI)
//   .then((conn) => {
//     console.log(`Database Connected ${conn.connection.host}`);
//   })
//   .catch((err) => {
//     console.error(`Database Error ${err}`);
//   });
// }


// export default connectDB;