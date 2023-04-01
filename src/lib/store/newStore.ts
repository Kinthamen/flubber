import { writable } from 'svelte/store';

interface Position {
	x: number;
	y: number;
	z?: number;
}

interface Dimensions {
	height: number;
	width: number;
}

interface Node {
	id: string;
	type: string;
	data: any;
	position: Position;
	dimensions: Dimensions;
	updatePosition?: (x: number, y: number) => void;
	updateDimensions?: (height: number, width: number) => void;
}

interface Edge {
	id: string;
	type: string;
	sourceId: string;
	sourcePosition: Position;
	sourceDirection: 'Top' | 'Bottom' | 'Left' | 'Right';
	targetId: string;
	targetPosition: Position;
	targetDirection: 'Top' | 'Bottom' | 'Left' | 'Right';
	updateSourcePosition?: (x: number, y: number) => void;
	udpateTargetPosition?: (x: number, y: number) => void;
}

const nodesStore = writable([] as Node[]);
const edgesStore = writable([] as Edge[]);

function _updateNodePosition(this: Node, x: number, y: number) {
	nodesStore.update((nds) =>
		nds.map((n) => {
			if (n.id === this.id) {
				n.position = { x: x, y: y };
			}
			return n;
		})
	);
}

function _updateNodeDimensions(this: Node, height: number, width: number) {
	nodesStore.update((nds) =>
		nds.map((n) => {
			if (n.id === this.id) {
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
				e.sourcePosition = { x: x, y: y };
			}
			return e;
		})
	);
}

function _updateTargetEdgePosition(this: Edge, x: number, y: number) {
	edgesStore.update((eds) =>
		eds.map((e) => {
			if (e.id === this.id) {
				e.targetPosition = { x: x, y: y };
			}
			return e;
		})
	);
}

export function initNodesStore(nodes: Node[]) {
	nodes.forEach((node) => {
		node.updatePosition = _updateNodePosition;
		node.updateDimensions = _updateNodeDimensions;
		return node;
	});

	nodesStore.set(nodes);
}

export function initEdgesStore(edges: Edge[]) {
	edges.forEach((edge) => {
		edge.updateSourcePosition = _updateSourceEdgePosition;
		edge.udpateTargetPosition = _updateTargetEdgePosition;
		return edge;
	});

	edgesStore.set(edges);
}

export function addNode(node: Node) {
	node.updatePosition = _updateNodePosition;
	node.updateDimensions = _updateNodeDimensions;
	nodesStore.update((nodes) => [...nodes, node]);
}

export function removeNode(id: string) {
	nodesStore.update((nodes) => nodes.filter((node) => node.id !== id));
	edgesStore.update((edges) =>
		edges.filter((edge) => edge.sourceId !== id && edge.targetId !== id)
	);
}

export function addEdge(edge: Edge) {
	edge.updateSourcePosition = _updateSourceEdgePosition;
	edge.udpateTargetPosition = _updateTargetEdgePosition;
	edgesStore.update((edges) => [...edges, edge]);
}

export function removeEdge(id: string) {
	edgesStore.update((edges) => edges.filter((edge) => edge.id !== id));
}
