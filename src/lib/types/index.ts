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

export enum MarkerType {
    Arrow = 'arrow',
    ArrowClosed = 'arrowclosed',
}

export type EdgeMarker = {
    type: MarkerType;
    color?: string;
    width?: number;
    height?: number;
    markerUnits?: string;
    orient?: string;
    strokeWidth?: number;
};

export type EdgeMarkerType = string | EdgeMarker;

export type EdgeProps = EdgeType & {
    path: string;
    markerEnd?: EdgeMarkerType;
    markerStart?: EdgeMarkerType;
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

export interface EdgeArrayType {
    [key: string | number]: EdgeType
}

export interface CustomNodeType {
    [key: string]: SvelteComponentTyped;
}

export interface CustomEdgeType {
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
