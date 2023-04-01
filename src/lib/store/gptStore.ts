import { writable } from 'svelte/store';
import type { Node } from '../types/gptTypes';

// Define the initial state of the store
const initialNodes: Node[] = [
	{
		id: 'node1',
		width: 100,
		height: 50,
		body: '<rect width="100" height="50" fill="blue" />'
	},
	{
		id: 'node2',
		width: 100,
		height: 100,
		body: `
            <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" fill="green" />
            <text x="50" y="50" text-anchor="middle" alignment-baseline="middle" fill="white">Node 2</text>
            </svg>
        `
	}
];

// Create the store using the writable function
export const nodesStore = writable<Node[]>(initialNodes);

// Define functions to add/update/remove nodes
export function addNode(node: Node) {
	nodesStore.update((nodes) => {
		// Generate a unique ID for the new node
		const nodeId = generateNodeId();
		// Add the new node to the store
		return { ...nodes, [nodeId]: node };
	});
}

export function updateNode(nodeId: string, updatedNode: Node) {
	nodesStore.update((nodes) => {
		// Update the node with the given ID
		return [...nodes, updatedNode];
	});
}

export function removeNode(nodeId: string) {
	nodesStore.update((nodes) => {
		// Remove the node with the given ID
		return nodes.map((node) => {
			if (node.id !== nodeId) {
				return node;
			}
		});
	});
}

// Helper function to generate a unique node ID
function generateNodeId() {
	return `node-${Math.random().toString(36).substr(2, 9)}`;
}
