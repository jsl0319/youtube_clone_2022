import express from "express"
import {
        getEdit,
        postEdit,
        remove,
        see,
        startGithubLogin,
        finishGithubLogin,
        logout,
        getChangePassword,
        postChangePassword } from "../controller/usercontroller"
import {
        protectorMiddleware,
        publicMiddleware,
        uploadFiles } from "../middlewares/localMiddlware";

const usersRouter = express.Router();

usersRouter.get("/github/start", publicMiddleware, startGithubLogin)
usersRouter.get("/github/finish", publicMiddleware, finishGithubLogin)
usersRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(uploadFiles.single('avatar'),postEdit);
usersRouter.route('/change-password').all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
usersRouter.get(":id(\\d+)", see)
usersRouter.get("/logout", logout)
usersRouter.get("/remove", remove)

export default usersRouter