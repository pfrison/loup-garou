
type Callback = (result: any) => void;
type ErrorCallback = (errorCode: number) => void;
type FinallyCallback = () => void;
export type Auth = {username: string, sessionId: string};

export function callApi(method: string, path: string, toSend: any,
        callback: Callback, errorCallback: ErrorCallback,
        finallyCallback?: FinallyCallback, auth?: Auth): void {
    method = method.toUpperCase();
    const requestOptions = {
        method: method,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            "auth.username": auth ? auth.username : "",
            "auth.session": auth ? auth.sessionId : ""
        },
        body: JSON.stringify(toSend)
    };
    console.log(requestOptions)
    console.log("Trying " + method + " on " + path);
    fetch("http://localhost:8080" + path, requestOptions)
        .then(res => {
            if ( !res.ok ) {
                errorCallback(res.status);
                throw new Error("Server responded with code " + res.status + " for " + method + " " + path);
            }
            if ( res.headers.get("Content-Type") === "application/json" )
                return res.json();
            return undefined;
        }).then(callback)
        .finally(() => {
            if ( finallyCallback )
                finallyCallback();
        });
}
