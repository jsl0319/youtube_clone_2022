import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { isEmpty } from "../../utils";

// Schema 생성.
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatarUrl: { type: String },
  socialOnly: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String },
  location: { type: String },
});

// 가입시 Password 해싱
UserSchema.pre("save", async function() {
  // 깃헙 회원가입은 패스
  if(!isEmpty(this.password))
    this.password = await bcrypt.hash(this.password, 5);
});

// Model 생성 - User 모델 생성
const User = mongoose.model("User", UserSchema);

export default User;
