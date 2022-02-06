import express from "express"
import {
getEdit,
postEdit,
remove,
see,
startGithubLogin,
finishGithubLogin,
logout } from "../controller/usercontroller"
import { protectorMiddleware, publicMiddleware } from "../middlewares/localMiddlware";

const usersRouter = express.Router();

usersRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
usersRouter.get("/github/start", publicMiddleware, startGithubLogin)
usersRouter.get("/github/finish", publicMiddleware, finishGithubLogin)
usersRouter.get("/logout", logout)
usersRouter.get(":id(\\d+)", see)
usersRouter.get("/remove", remove)

export default usersRouter