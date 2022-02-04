import express from "express"
import {
edit,
remove,
see,
startGithubLogin,
finishGithubLogin,
logout } from "../controller/usercontroller"

const usersRouter = express.Router();

usersRouter.get(":id(\\d+)", see)
usersRouter.get("/edit", edit)
usersRouter.get("/remove", remove)
usersRouter.get("/github/start", startGithubLogin)
usersRouter.get("/github/finish", finishGithubLogin)
usersRouter.get("/logout", logout)

export default usersRouter