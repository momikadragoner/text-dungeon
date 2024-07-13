import { Node } from "./node.model";

export interface VisualNode extends Node {
    distance?:number;
    parent?:string;
    color?:string;
    group?: number;
    x?:string;
    y?:string;
    width?:string;
    height?:string;
    midX?:string;
    midY?:string;
    classList?:string;
}