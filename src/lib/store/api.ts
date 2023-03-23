import type { Stores, CustomStore, Position, RawStore, EdgeType } from '../types';
import { flubberIdGenerator } from '../utils/generators';
import { writable, get } from 'svelte/store';

const _stores: Stores = {};
let active = '';

export function getActive(): string {
	return active;
}

export function setActive(id: string): void {
	active = id;
}

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
			add: (node, nodeId = flubberIdGenerator()) => {
				nodesUpdate((prev) => ({ ...prev, [nodeId]: node }));
			},
			remove: (nodeId) => {
				nodesUpdate((prev) => {
					delete prev[nodeId];
					return prev;
				});
			},
			updatePosition: (nodeId, pos) => {
				nodesUpdate((prev) => {
					prev[nodeId].position = pos;
					return prev;
				});
			}
		},
		edges: {
			subscribe: edgesSubscribe,
			set: edgesSet,
			update: edgesUpdate,
			add: (edge) => {
				edgesUpdate((prev) => [...prev, edge]);
			},
			remove: (nodeId) => {
				edgesUpdate((prev) =>
					prev.filter((edge) => edge.sourceId !== nodeId && edge.targetId !== nodeId)
				);
			},
			updatePosition: (nodeId, pos) => {
				edgesUpdate((prev) =>
					prev.map((edge) => {
						const sourceId = edge.sourceId.split('_')[1];
						const targetId = edge.targetId.split('_')[1];

						if (sourceId === nodeId) {
							const connector = document.getElementById(edge.sourceId);
							if (connector) {
								const { height, width } = connector.getBoundingClientRect();
								edge.sourcePosition = {
									x: pos.x + connector.offsetLeft + width / 2,
									y: pos.y + connector.offsetTop + height / 2
								};
							}
						}
						if (targetId === nodeId) {
							const connector = document.getElementById(edge.targetId);
							if (connector) {
								const { height, width } = connector.getBoundingClientRect();
								edge.targetPosition = {
									x: pos.x + connector.offsetLeft + width / 2,
									y: pos.y + connector.offsetTop + height / 2
								};
							}
						}
						return edge;
					})
				);
			}
		},
		viewOptions: {
			subscribe: viewSubscribe,
			set: viewSet,
			update: viewUpdate
		},
		pathDraw: {
			subscribe: pathSubscribe,
			set: pathSet,
			update: pathUpdate,
			enableDraw: (
				e: MouseEvent,
				connectorId: string,
				connectionType: 'source' | 'target',
				direction: string,
				startPosition: Position
			) => {
				e.preventDefault();
				const path = get(_stores[id].pathDraw);

				path.sourceId = connectorId;
				path.sourceType = connectionType;
				path.sourceDirection = direction;
				path.sourcePosition = startPosition;

				const graph = document.getElementById(`graph-${id}`);
				if (graph) {
					graph.addEventListener('mousemove', getStore(id).pathDraw.drawingEvent, false);
				}

				path.enabled = true;
			},
			disableDraw: (
				connectorId: string,
				connectionType: 'source' | 'target',
				direction: string,
				startPosition: Position
			) => {
				const path = get(_stores[id].pathDraw);

				if (path.enabled && path.sourceId !== connectorId && path.sourceType !== connectionType) {
					const newEdge: EdgeType = {
						type: 'bezier',
						sourceId: path.sourceType === 'source' ? path.sourceId : connectorId,
						sourcePosition: path.sourceType === 'source' ? path.sourcePosition : startPosition,
						sourceDirection: path.sourceType === 'source' ? path.sourceDirection : direction,
						targetId: path.sourceType === 'source' ? connectorId : path.sourceId,
						targetPosition: path.sourceType === 'source' ? startPosition : path.sourcePosition,
						targetDirection: path.sourceType === 'source' ? direction : path.sourceDirection
					};

					const duplicates = get(_stores[id].edges).filter(
						(edge) => edge.targetId === newEdge.targetId && edge.sourceId === newEdge.sourceId
					);

					if (!duplicates.length) {
						const nodes = get(_stores[id].nodes);

						const sourceId = newEdge.sourceId.split('_')[1];
						const targetId = newEdge.targetId.split('_')[1];

						nodes[sourceId].isConnected = nodes[targetId].isConnected = true;
						getStore(id).edges.add(newEdge);
					}
				}
			},
			drawingEvent: (e: MouseEvent) => {
				const graph = document.getElementById(`graph-${id}`);
				if (graph) {
					const bounds = graph.getBoundingClientRect();
					const x = e.clientX - bounds.left;
					const y = e.clientY - bounds.top;
					pathUpdate((prev) => ({ ...prev, targetPosition: { x: x, y: y } }));
				}
			}
		}
	};
}

export function createStore(id: string, store: RawStore): CustomStore {
	if (!(id in _stores)) {
		_stores[id] = {
			nodes: writable(store?.nodes || {}),
			edges: writable(store?.edges || []),
			viewOptions: writable(
				store?.viewOptions || {
					zoom: 3,
					graphDimensions: {
						position: {
							x: -2500,
							y: -2500
						},
						height: 5000,
						width: 5000,
						center: {
							x: 2500,
							y: 2500
						}
					},
					gridProperties: {
						type: 'dots',
						spacing: 40,
						snap: false
					}
				}
			),
			pathDraw: writable({
				enabled: false,
				sourceId: '',
				sourceType: '',
				sourceDirection: '',
				sourcePosition: {} as Position,
				targetPosition: {} as Position,
				targetDirection: ''
			})
		};
	}
	return getStore(id);
}
