import type {SvelteComponentTyped} from "svelte";
import type {Writable} from "svelte/store";

export interface Position {
    x: number;
    y: number;
    z?: number;
}

export interface viewOptionType {
    zoom: number;
    startPosition: Position;
}

export interface GridOptionsType {
    graphSize: number;
    gridSize: number;
    gridStyle: string;
    snap: boolean;
}

export interface NodeType {
    type: string;
    data: object;
    position: Position;
}

export interface NodeArrayType {
    [key: string | number]: NodeType
}

export interface EdgeType {
    id: string | number;
    source: string;
    sourcePosition: Position;
    target: string;
    targetPosition: Position;
}

export interface EdgeArrayType {
    [key: string | number]: EdgeType
}

export interface CustomNodeType {
    [key: string]: SvelteComponentTyped;
}

export interface StoreType {
    nodes: NodeArrayType;
    edges: EdgeArrayType;
    viewOptions: viewOptionType;
    gridOptions: GridOptionsType;
}

export interface Store {
    [key: string]: Writable<StoreType>;
}
