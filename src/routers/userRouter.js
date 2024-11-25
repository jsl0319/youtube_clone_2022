import express from "express";
import {
  getEdit,
  postEdit,
  getProfile,
  startGithubLogin,
  finishGithubLogin,
  getKakaoOauthCode,
  getKakaoOauthToken,
  startNaverLogin,
  finishNaverLogin,
  logout,
  getChangePassword,
  postChangePassword,
} from "../controller/userController";
import {
  protectorMiddleware,
  publicMiddleware,
  avatarUpload,
} from "../middlewares";

const usersRouter = express.Router();

// github login
usersRouter.get("/github/start", publicMiddleware, startGithubLogin);
usersRouter.get("/github/finish", publicMiddleware, finishGithubLogin);
// kakao login
usersRouter.get("/kakao/start", publicMiddleware, getKakaoOauthCode);
usersRouter.get("/kakao/finish", publicMiddleware, getKakaoOauthToken);
// naver login
usersRouter.get("/naver/start", publicMiddleware, startNaverLogin);
usersRouter.get("/naver/finish", publicMiddleware, finishNaverLogin);
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
usersRouter.get("/:id([0-9a-f]{24})", getProfile);

export default usersRouter;