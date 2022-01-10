import mongoose from "mongoose"

// Schema 생성
const videoSchema = new mongoose.Schema({
    title: {type : String, required : true, trim : true, maxlength:80},
    description: {type : String, required : true, trim : true, minlength:20},
    createdDat: {type : Date, required : true, default : Date.now},
    hashtags: [{ type: String , trim : true}],
    meta: {
      views: {type : Number, required : true, default : 0},
      rating: {type : Number, required : true, default : 0},
    }
})

// // Middleware : 모델 생성 전-후처리
// videoSchema.pre("save", async function() {
//   console.log('디스가 있늬??', this);
//   this.hashtags = this.hashtags[0]
//                   .split(",")
//                   .map(word => word.startsWith("#") ? word : `#${word}`);
// })

// static 함수
videoSchema.static("formatHashtags", (hashtags) => {
  console.log('해쉬태그 어케들어 오닠::', hashtags);
  return hashtags
        .split(",")
        .map(word => word.startsWith("#") ? word : `#${word}`);
})

// Model 생성 - Video 모델 생성
const Video = mongoose.model("Video", videoSchema);

export default Video