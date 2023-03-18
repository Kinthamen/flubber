import type {
    Stores,
    CustomStore,
    Position,
    RawStore
} from '$lib/types';
import {flubberIdGenerator} from "../utils/generators";
import {writable} from "svelte/store";
import {Direction} from "$lib/types";

const _stores: Stores = {};

export function getStores(): Stores {
    return _stores;
}

export function getStore(id: string): CustomStore {

    const { subscribe: nodesSubscribe, set: nodesSet, update: nodesUpdate } = _stores[id].nodes;
    const { subscribe: edgesSubscribe, set: edgesSet, update: edgesUpdate } = _stores[id].edges;
    const { subscribe: viewSubscribe, set: viewSet, update: viewUpdate } = _stores[id].viewOptions;
    const { subscribe: pathSubscribe, set: pathSet, update: pathUpdate } = _stores[id].pathDraw;

    return {
        nodes: {
            subscribe: nodesSubscribe,
            set: nodesSet,
            update: nodesUpdate,
            add: (node, id) => {
                const nodeId = id || flubberIdGenerator();
                nodesUpdate(prev => ({...prev, [nodeId]: node}));
            },
            remove: (id) => {
                nodesUpdate(prev => {
                    delete prev[id];
                    return prev
                })
            },
            updatePosition: (id, pos) => {
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
            add: (edge) => {
                edgesUpdate(prev => ([...prev, edge]))
            },
            remove: (id) => {
                edgesUpdate(prev => prev.filter(edge => edge.sourceId !== id && edge.targetId !== id))
            },
            updatePosition: (id, pos) => {
                edgesUpdate(prev => prev.map(edge => {

                    const sourceId = edge.sourceId.split('_')[1];
                    const targetId = edge.targetId.split('_')[1];

                    if (sourceId === id) {
                        const connector = document.getElementById(edge.sourceId)
                        if (connector) {
                            const { height, width } = connector.getBoundingClientRect();
                            edge.sourcePosition = { x: pos.x + connector.offsetLeft + (width/2), y: pos.y + connector.offsetTop + (height/2) };
                        }
                    }
                    if (targetId === id) {
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
        pathDraw: {
            subscribe: pathSubscribe,
            set: pathSet,
            update: pathUpdate,
            drawingEvent: (e: MouseEvent) => {
                const graph = document.getElementById(`graph-${id}`);
                if (graph) {
                    const bounds = graph.getBoundingClientRect();
                    const x = e.clientX - bounds.left;
                    const y = e.clientY - bounds.top;
                    pathUpdate(prev => ({...prev, targetPosition: { x: x, y: y }}));
                }
            },
            getTargetDirection: () => {
                let sourceX, sourceY, targetX, targetY;

                const unsubscribe = pathSubscribe(path => {
                    sourceX = path.sourcePosition.x;
                    sourceY = path.sourcePosition.y;
                    targetX = path.targetPosition.x;
                    targetY = path.targetPosition.y;
                });

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const distanceX = sourceX - targetX;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const distanceY = sourceY - targetY;

                if (Math.abs(distanceX) > Math.abs(distanceY)) {
                    return distanceX > 0 ? Direction.Right : Direction.Left;
                } else {
                    return distanceY > 0 ? Direction.Bottom : Direction.Top;
                }
            },
        },
    }
}

export function createStore(id: string, store: RawStore): CustomStore {
    if (!(id in _stores)) {
        _stores[id] = {
            nodes: writable(store?.nodes || {}),
            edges: writable(store?.edges || []),
            viewOptions: writable(store?.viewOptions || {
                zoom: 3,
                graphDimensions: {
                    position: {
                        x: -2500,
                        y: -2500,
                    },
                    height: 5000,
                    width: 5000,
                    center: {
                        x: 2500,
                        y: 2500,
                    }
                },
                gridProperties: {
                    type: 'dots',
                    spacing: 40,
                    snap: false,
                },
            }),
            pathDraw: writable({
                enabled: false,
                sourceId: '',
                sourceType: '',
                sourceDirection: '',
                sourcePosition: {} as Position,
                targetPosition: {} as Position,
                targetDirection: '',
            }),
        }
    }
    return getStore(id);
}