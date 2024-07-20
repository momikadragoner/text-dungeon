import { ResponseOption } from "./response.model";
import { Node } from "../../graph/models/node.model";

export interface Message {
    id: string;
    sender: string;
    body: string;
    next?: string;
    wait: number;
    showOptions: boolean;
    responseOptions: ResponseOption[];
    isLoop?: boolean;
    knowledge?:string;
    flags?:string[];
}
