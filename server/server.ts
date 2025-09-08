import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import routes from "./routes/route"
import cors from 'cors'

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api", routes);

app.listen(4000,()=>{
    console.log("Server is running on port 4000");
});