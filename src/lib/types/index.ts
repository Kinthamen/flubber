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
    id: string | number;
    type: string;
    data: object;
    position: Position;
}

export interface CustomNodeType {
    [key: string]: SvelteComponentTyped;
}

export interface EdgeType {
    id: string | number;
    source: string;
    sourcePosition: Position;
    target: string;
    targetPosition: Position;
}

export interface StoreType {
    nodes: NodeType[];
    edges: EdgeType[];
    viewOptions: viewOptionType;
    gridOptions: GridOptionsType;
}

export interface Store {
    [key: string]: Writable<StoreType>;
}
