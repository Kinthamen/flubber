import type { Node, Edge } from '../types';
import {writable} from 'svelte/store';

export const nodesStore = writable([] as Node[]);
export const edgesStore = writable([] as Edge[]);

export function addNode(node: Node) {
	nodesStore.update((nodes) => [...nodes, node]);
}

export function removeNode(id: string) {
	nodesStore.update((nodes) => nodes.filter((node) => node.id !== id));
	edgesStore.update((edges) =>
		edges.filter((edge) => edge.sourceId !== id && edge.targetId !== id)
	);
}

export function updateNodePosition(id: string, x: number, y: number) {
	nodesStore.update((nds) =>
		nds.map((n) => {
			if (n.id === id) {
				n.position = { x, y };
			}
			return n;
		})
	);
}

export function updateNodeDimensions(node: HTMLElement) {
	const { height, width } = node.getBoundingClientRect();
	nodesStore.update((nds) =>
		nds.map((n) => {
			if (n.id === node.id) {
				n.dimensions = {
					height: height,
					width: width
				};
			}
			return n;
		})
	);
}

function _updateSourceEdgePosition(this: Edge, x: number, y: number) {
	edgesStore.update((eds) =>
		eds.map((e) => {
			if (e.id === this.id) {
				e.sourcePosition = { x, y };
			}
			return e;
		})
	);
}

function _updateTargetEdgePosition(this: Edge, x: number, y: number) {
	edgesStore.update((eds) =>
		eds.map((e) => {
			if (e.id === this.id) {
				e.targetPosition = { x, y };
			}
			return e;
		})
	);
}

export function initEdgesStore(edges: Edge[]) {
	edges.forEach((edge) => {
		edge.updateSourcePosition = _updateSourceEdgePosition;
		edge.udpateTargetPosition = _updateTargetEdgePosition;
		return edge;
	});

	edgesStore.set(edges);
}

export function addEdge(edge: Edge) {
	edge.updateSourcePosition = _updateSourceEdgePosition;
	edge.udpateTargetPosition = _updateTargetEdgePosition;
	edgesStore.update((edges) => [...edges, edge]);
}

export function removeEdge(id: string) {
	edgesStore.update((edges) => edges.filter((edge) => edge.id !== id));
}
