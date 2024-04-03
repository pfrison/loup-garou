
type Callback = (result: any) => void;
type ErrorCallback = (errorCode: number) => void;
type FinallyCallback = () => void;

export function callApi(method: string, path: string, toSend: any,
        callback: Callback, errorCallback: ErrorCallback,
        finallyCallback?: FinallyCallback): void {
    method = method.toUpperCase();
    const requestOptions: any = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: method === "GET" ? undefined : JSON.stringify(toSend)
    };
    if ( method === "GET" && toSend )
        path += "?" + new URLSearchParams(toSend);
    console.log(requestOptions)
    console.log("Trying " + method + " on " + path);
    fetch("http://127.0.0.1:8080" + path, requestOptions)
        .then(res => {
            console.log(res);
            if ( !res.ok ) {
                errorCallback(res.status);
                throw new Error("Server responded with code " + res.status + " for " + method + " " + path);
            }
            if ( res.headers.get("Content-Type") === "application/json" )
                return res.json();
            if ( res.headers.get("Content-Type") === "image/png" )
                return res.blob();
            return undefined;
        }).then(callback)
        .finally(() => {
            if ( finallyCallback )
                finallyCallback();
        });
}
