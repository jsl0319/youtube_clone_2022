import express from "express"
import {see, edit, deleteVideo, upload} from "../controller/videoController"

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", see)
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", upload)

export default videoRouter