import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Schema 생성.
const UserSchema = new mongoose.Schema({
    name : { type : String, required : true, unique : true },
    socialOnly : { type : Boolean, default : false },
    email : { type : String, required : true, unique : true },
    userName : { type : String, required : true, unique : true} ,
    password : { type : String },
    location : { type : String }
})

// Passowrd 해싱
UserSchema.pre("save", async function(){
    console.log('input password::', this.password);
    this.password = await bcrypt.hash(this.password, 5);
    console.log('hashed password::', this.password);
});

// Model 생성 - Video 모델 생성
const User = mongoose.model("User", UserSchema);

export default User