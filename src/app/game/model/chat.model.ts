import { Message } from "./message.model";
import { ContactProfile } from "./profile.model";

export interface Chat {
    chatName: string;
    messageTree: Message[];
}
