import { Message } from "./message.model";
import { ContactProfile } from "./profile.model";

export interface GameState {
    messageTree: Message[];
    profiles: ContactProfile[];
}