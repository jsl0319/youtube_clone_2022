import express from "express"
import session from "express-session"
// import mongodbStore from "express-mongodb-session-session"
import morgan from "morgan"
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
const options = {
    secret : 'secret key',
    resave : false,
    saveUninitialized : false
}
app.use(session(options))
// test
app.use((req, res, next) => {
    req.sessionStore.all((error,sessions) => {
        console.log('쥬뗌므::', sessions);
        next();
    })
})

app.get("/add-one",(req, res, next) => {
req.session.potato += 1;
return res.send(`${req.session.id} ::: ${req.session.potato}`);
})
// router 시작점
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
//======================================

export default app