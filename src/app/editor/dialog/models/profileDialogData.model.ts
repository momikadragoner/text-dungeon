import { ContactProfile } from "../../../game/model/profile.model";

export interface ProfileDialogData {
  profile?: ContactProfile
  type: 'add' | 'edit';
}