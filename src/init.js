import "./db"
import "./models/Video"
import "./models/User"
import app from "./server"

const PORT = 4000;

// server listener
const handleListener = () => console.log(`✅ Server listening on http://172.30.1.180:${PORT} 🎉`);
app.listen(PORT, handleListener);