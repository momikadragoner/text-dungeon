import { Node } from "./node.model";

export interface VisualEdge {
    start?: Node;
    end?: Node;
    path?: string;
    strokeColor?: string;
    strokeWidth?: string;
}