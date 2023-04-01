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
	sourcePosition: Position;
	sourceDirection: 'Top' | 'Bottom' | 'Left' | 'Right';
	targetPosition: Position;
	targetDirection: 'Top' | 'Bottom' | 'Left' | 'Right';
	updateSourcePosition?: (x: number, y: number) => void;
	udpateTargetPosition?: (x: number, y: number) => void;
}

const nodesStore = writable([] as Node[]);
const edgesStore = writable([] as Edge[]);

export function initNodesStore(nodes: Node[]) {
	nodes.forEach((node) => {
		node.updatePosition = function (x: number, y: number) {
			nodesStore.update((nds) =>
				nds.map((n) => {
					if (n.id === this.id) {
						n.position = { x: x, y: y };
					}
					return n;
				})
			);
		};
		node.updateDimensions = function (height: number, width: number) {
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
		};
		return node;
	});

	nodesStore.set(nodes);
}

export function initEdgesStore(edges: Edge[]) {
	edges.forEach((edge) => {
		edge.updateSourcePosition = function (x: number, y: number) {
			edgesStore.update((eds) =>
				eds.map((e) => {
					if (e.id === this.id) {
						e.sourcePosition = { x: x, y: y };
					}
					return e;
				})
			);
		};
		edge.udpateTargetPosition = function (x: number, y: number) {
			edgesStore.update((eds) =>
				eds.map((e) => {
					if (e.id === this.id) {
						e.targetPosition = { x: x, y: y };
					}
					return e;
				})
			);
		};
		return edge;
	});

	edgesStore.set(edges);
}
