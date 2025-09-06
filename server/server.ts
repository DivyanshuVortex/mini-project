import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import routes from "./routes/route.ts"
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", routes);

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});