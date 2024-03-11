import express, { Express, NextFunction, Request, Response } from "express"
import * as Login from "./login"

const app: Express = express();

app.use(express.json());

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

// Log request end and/or 404
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
