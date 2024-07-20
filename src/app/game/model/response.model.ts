export interface ResponseOption {
    id: string;
    text: string;
    next?: string;
    requiredKnowledge?: string[];
    isLoop?: boolean;
}