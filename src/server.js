import express from "express"
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

// router 시작점
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
//======================================

export default app


