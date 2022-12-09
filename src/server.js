import express from "express";
import session from "express-session";
import morgan from "morgan";
import { localMiddlware } from "./middlewares";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

//========= Middleware ================
// view engine 설정 , views 디폴트 경로 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

// req.body, log 사용,
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// session 설정
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 30, // 30분
    },
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

// router 진입점 => 미들웨어
app.use(localMiddlware);

// 경로 , 저장폴더명
app.use("/uploads", express.static("uploads"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
//======================================

export default app;
