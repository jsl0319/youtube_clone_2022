import express from "express"
import {edit, remove, see, login, logout} from "../controller/usercontroller"

const usersRouter = express.Router();

usersRouter.get(":id(\\d+)", see)
usersRouter.get("/edit", edit)
usersRouter.get("/remove", remove)
usersRouter.get("/login", login)
usersRouter.get("/logout", logout)

export default usersRouter