"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBconnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DBconnection = async () => {
    return await mongoose_1.default.connect(process.env.LOCAL_DATA_BASE_URI)
        .then(() => {
        console.log("Database connect successfully");
    })
        .catch(err => {
        console.log("DB Error => ", err);
    });
};
exports.DBconnection = DBconnection;
exports.default = exports.DBconnection;
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
