import dotenv from "dotenv";
import mongoose from "mongoose";
import UserModel from "./User.js";
import SleepInfoModel from "./SleepInfo.js";
import NewsModel from './News.js'


const db = {}
db.mongoose = mongoose
db.url = dotenv.MONGO_URI
db.User=new UserModel(mongoose)
db.Sleep=new SleepInfoModel(mongoose)
db.News=new NewsModel(mongoose)




export default db
