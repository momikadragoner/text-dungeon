import { Message } from "../../../game/model/message.model";
import { UserProfile } from "../../../game/model/profile.model";

export interface EditMessageDialogData {
  message: Message;
  tree: Message[];
  profiles: UserProfile[]
}