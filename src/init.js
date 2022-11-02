/** 진입점 */
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const PORT = process.env.PORT || 4000;

// server listener
const handleListener = () =>
  console.log(`✅ Server listening on http://localhost:${PORT} 🎉`);
app.listen(PORT, handleListener);
