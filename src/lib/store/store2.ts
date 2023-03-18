import {type Writable, writable} from "svelte/store";
import {flubberIdGenerator} from "../utils/generators";

export const drawStore = writable({
    enabled: false,
    sourceId: '',
    sourceType: '',
    sourceDirection: '',
    sourcePosition: {},
    mousePosition: {},
    mouseEventListener: (e: MouseEvent) => {return},
});

export type StoresType = {
    [key: string]: StoreType;
}

export type StoreType = {
    nodes: Writable<NodeArrayType>;
    edges: Writable<EdgeType[]>;
    viewOptions: Writable<ViewOptionsType>;
    gridOptions: Writable<GridOptionsType>;
}

export type RawStoreType = {
    nodes: {[key: string]: NodeType},
    edges: EdgeType[],
    viewOptions: ViewOptionsType,
    gridOptions: GridOptionsType,
}

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

export interface NodeArrayType {
    [key: string | number]: NodeType
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

const stores: StoresType = {};

export function getOrCreateStore(id: string, store?: RawStoreType) {
    if (!(id in stores)) {
        stores[id] = {
            nodes: writable(store?.nodes || {}),
            edges: writable(store?.edges || []),
            viewOptions: writable(store?.viewOptions || {
                zoom: 0,
                startPosition: {
                    x: -2500,
                    y: -2500,
                }}),
            gridOptions: writable(store?.gridOptions || {
                graphSize: 5000,
                gridSize: 40,
                gridStyle: 'dots',
                snap: false,
            }),
        }
    }

    const { subscribe: nodesSubscribe, set: nodesSet, update: nodesUpdate } = stores[id].nodes;
    const { subscribe: edgesSubscribe, set: edgesSet, update: edgesUpdate } = stores[id].edges;
    const { subscribe: viewSubscribe, set: viewSet, update: viewUpdate } = stores[id].viewOptions;
    const { subscribe: gridSubscribe, set: gridSet, update: gridUpdate } = stores[id].gridOptions;

    return {
        nodes: {
            subscribe: nodesSubscribe,
            set: nodesSet,
            update: nodesUpdate,
            addNode: (data: NodeType): void => {
                const nodeId = flubberIdGenerator();
                nodesUpdate(prev => ({...prev, [nodeId]: data}));
            },
            removeNode: (id: string | number): void => {
                nodesUpdate(prev => {delete prev[id]; return prev})
            },
            updateNodePosition: (id: string | number, pos: Position) => {
                nodesUpdate(prev => {
                    prev[id].position = pos;
                    return prev;
                })
            }
        },
        edges: {
            subscribe: edgesSubscribe,
            set: edgesSet,
            update: edgesUpdate,
            addEdge: (data: EdgeType) => {
                edgesUpdate(prev => ([...prev, data]))
            },
            removeEdge: (id: string | number) => {
                edgesUpdate(prev => prev.filter(edge => edge.sourceId !== id && edge.targetId !== id))
            },
            updateEdgePosition: (id: string | number, pos: Position) => {
                edgesUpdate(prev => prev.map(edge => {
                    if (edge.sourceId.split('_')[1] === id) {
                        const connector = document.getElementById(edge.sourceId)
                        if (connector) {
                            const { height, width } = connector.getBoundingClientRect();
                            edge.sourcePosition = { x: pos.x + connector.offsetLeft + (width/2), y: pos.y + connector.offsetTop + (height/2) };
                        }
                    }
                    if (edge.targetId.split('_')[1] === id) {
                        const connector = document.getElementById(edge.targetId)
                        if (connector) {
                            const { height, width } = connector.getBoundingClientRect();
                            edge.targetPosition = { x: pos.x + connector.offsetLeft + (width/2), y: pos.y + connector.offsetTop + (height/2) };
                        }
                    }
                    return edge;
                }))
            }
        },
        viewOptions: {
            subscribe: viewSubscribe,
            set: viewSet,
            update: viewUpdate,
        },
        gridOptions: {
            subscribe: gridSubscribe,
            set: gridSet,
            update: gridUpdate,
        }
    }
}