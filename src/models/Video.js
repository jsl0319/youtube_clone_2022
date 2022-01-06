import mongoose from "mongoose"

// Schema 생성
const videoSchema = new mongoose.Schema({
    title: {type : String, required:true, trim:true, maxlength:80},
    description: {type : String, required:true, trim:true, minlength:20},
    createdAt: {type : Date, required : true, default : Date.now},
    hashtags: [{ type: String , trim:true}],
    meta: {
      views: {type:Number, required:true, default:0},
      rating: {type:Number, required:true, default:0},
    }
})

// Model 생성 - Video 모델 생성
const Video = mongoose.model("Video", videoSchema);

export default Video