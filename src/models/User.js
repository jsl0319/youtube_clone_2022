import mongoose from 'mongoose';

// Schema 생성.
const UserSchema = new mongoose.Schema({
    name : { type : String, required : true, unique : true },
    email : { type : String, required : true, unique : true },
    userName : { type : String, required : true, unique : true} ,
    password : { type : String, required : true },
    location : { type : String }
})

// Model 생성 - Video 모델 생성
const User = mongoose.model("User", UserSchema);

export default User