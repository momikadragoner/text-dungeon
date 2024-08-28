import { Chat } from "./chat.model";
import { ContactProfile } from "./profile.model";

export interface GameData {
    profiles: ContactProfile[];
    chats: Chat[];
}
