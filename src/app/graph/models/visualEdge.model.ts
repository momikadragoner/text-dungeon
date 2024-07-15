import { VisualNode } from "./visualNode.model";

export interface VisualEdge {
    start: VisualNode;
    end: VisualNode;
    path?: string;
    strokeColor?: string;
    strokeWidth?: string;
}