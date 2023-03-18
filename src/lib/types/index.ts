import type {SvelteComponentTyped} from "svelte";
import type {Writable} from "svelte/store";

export interface Position {
    x: number;
    y: number;
    z?: number;
}

export enum Direction {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
}

export interface NodeType {
    type: string;
    data: object;
    position: Position;
    isConnected: boolean;
}

export interface EdgeType {
    type: 'straight' | 'smoothstep' | 'step' | 'bezier';
    sourceId: string;
    sourcePosition: Position;
    sourceDirection: Direction;
    targetId: string;
    targetPosition: Position;
    targetDirection: Direction;
    animate?: boolean;
    style?: string;
    className?: string;
}

export interface ViewOptionsType {
    zoom: number;
    startPosition: Position;
}

export interface GridOptionsType {
    graphSize: number;
    gridSize: number;
    gridStyle: string;
    snap: boolean;
}

export interface PathDrawType {
    enabled: boolean;
    sourceId: string;
    sourceType: string;
    sourceDirection: string;
    sourcePosition: Position;
    mousePosition: Position;
    drawingEvent: (e: MouseEvent) => void;
}

export interface CustomComponentType {
    [key: string]: SvelteComponentTyped;
}

export type RawStoreType = {
    nodes: {[key: string]: NodeType},
    edges: EdgeType[],
    viewOptions: ViewOptionsType,
    gridOptions: GridOptionsType,
}

export type StoreType = {
    nodes: Writable<{ [key: string]: NodeType }>;
    edges: Writable<EdgeType[]>;
    viewOptions: Writable<ViewOptionsType>;
    gridOptions: Writable<GridOptionsType>;
    pathDraw: Writable<PathDrawType>;
}

export interface StoresType {
    [key: string]: Writable<StoreType>;
}
