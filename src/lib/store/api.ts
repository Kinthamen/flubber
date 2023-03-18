import type {NodeArrayType, Position, StoreType} from "../types";
import {store} from "./store";
import {type Writable, writable} from "svelte/store";

export function createStore(id: string): Writable<StoreType> {
    store[id] = writable({
        nodes: {},
        edges: {},
        viewOptions: {
            zoom: 3,
            startPosition: {
                x: 0,
                y: 0
            }
        },
        gridOptions: {
            graphSize: 5000,
            gridSize: 40,
            gridStyle: 'dots',
            snap: false,
        },
        updateNodePosition: (nodeId, pos) => {
            const thisStore = getStore(id);
            thisStore.nodes[nodeId].position = pos;
        },
    } as StoreType);
    return store[id];
}

export function initStore(id: string, data: StoreType): Writable<StoreType> {
    store[id] = writable({
        nodes: data.nodes || {},
        edges: data.edges || {},
        viewOptions: data.viewOptions || {
            zoom: 3,
            startPosition: {
                x: 0,
                y: 0
            }},
        gridOptions: data.gridOptions || {
            graphSize: 5000,
            gridSize: 40,
            gridStyle: 'dots',
            snap: false,
        },
    } as StoreType);
    return store[id];
}

export function getStore(id: string): Writable<StoreType> {
    return store[id];
}

export function getStoreNodes(id: string): NodeArrayType {
    let nodes;
    const unsubscribe = store[id].subscribe(n => nodes = n);
}