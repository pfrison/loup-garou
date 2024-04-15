import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import * as Login from "./login";
import * as Games from "./games";
import * as Account from "./accounts";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app: Express = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// Log request start
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    console.log("Request " + req.method + " on " + req.url + " called");
    next();
})

// up test
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.write("Server is running");
    res.statusCode = 200;
    res.end();
    next();
});

// loging page
Login.install(app);

// games page
//Games.install(app);

// account page
//Account.install(app);

// Log request end and/or 404
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    console.log("Request " + req.method + " on " + req.url + " ended with " + res.statusCode);
});
app.use((req: Request, res: Response, next: NextFunction) => {
    if ( !res.writableEnded ) {
        res.statusCode = 404;
        res.end();
    }
    console.log("Request " + req.method + " on " + req.url + " ended with " + res.statusCode);
});

app.listen(8080, () => console.log("Server running on 8080"));
