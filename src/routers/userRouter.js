import express from "express";
import {
  getEdit,
  postEdit,
  remove,
  see,
  startGithubLogin,
  finishGithubLogin,
  logout,
  getChangePassword,
  postChangePassword,
} from "../controller/usercontroller";
import {
  protectorMiddleware,
  publicMiddleware,
  avatarUpload,
} from "../middlewares";

const usersRouter = express.Router();

usersRouter.get("/github/start", publicMiddleware, startGithubLogin);
usersRouter.get("/github/finish", publicMiddleware, finishGithubLogin);
usersRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
usersRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
usersRouter.get("/logout", logout);
usersRouter.get("/remove", remove);
usersRouter.get("/:id", see);

export default usersRouter;
