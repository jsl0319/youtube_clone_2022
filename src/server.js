import express from "express"
import session from "express-session"
import morgan from "morgan"
import { localMiddlware } from "./middlewares/localMiddlware"
import MongoStore from "connect-mongo"
import rootRouter from "./routers/rootRouter"
import userRouter from "./routers/userRouter"
import videoRouter from "./routers/videoRouter"

const app = express(); 
const logger = morgan('dev');

//========= Middleware ================
// view engine 설정 , views 디폴트 경로 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views")

// req.body, log 사용, 
app.use(express.urlencoded({extended : true }));
app.use(logger);

// session 설정
app.use(session({
    secret : "secret key",
    resave : true,
    saveUninitialized : true,
    store : MongoStore.create({ mongoUrl : "mongodb://127.0.0.1:27017/wetube"})    
}))

// test
app.use((req, res, next) => {
    req.sessionStore.all((error,sessions) => {
    console.log('req sessionStore::', sessions);
        next();
    })
})

// router 시작점 => 미들웨어
app.use(localMiddlware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
//======================================

export default app