import express from "express"
import {
watch,
getEdit,
postEdit,
deleteVideo,
upload} from "../controller/videoController"

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch)
videoRouter.get("/:id(\\d+)/edit", getEdit);
videoRouter.post("/:id(\\d+)/edit", postEdit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", upload)

export default videoRouter