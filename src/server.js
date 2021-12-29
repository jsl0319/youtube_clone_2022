import express from "express"
import morgan from "morgan"
import globalRouter from "./routers/globalRouter"
import userRouter from "./routers/userRouter"
import videoRouter from "./routers/videoRouter"

const app = express();
const PORT = 4000; 
const logger = morgan('dev');

// view engine 설정 , views 디폴트 경로 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views")

// log 설정
app.use(logger);

// router 시작점
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

// server listener
const handleListener = () => console.log(`Server listening on http://172.30.1.180:${PORT} 🎉`);
app.listen(PORT, handleListener);

