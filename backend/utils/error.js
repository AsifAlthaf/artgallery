export class APIError extends Error {
    constructor(statuscode, message){
        super(message);
        this.statuscode = statuscode;
    }
}