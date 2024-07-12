import { ResponseOption } from "./response.model";

export interface Message {
    id:string;
    sender:string;
    body:string;
    next:string;
    wait:number;
    showOptions:boolean;
    responseOptions:ResponseOption[];
}
