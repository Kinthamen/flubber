import type { Writable } from 'svelte/store';
import type { SvelteComponentTyped } from 'svelte';

export enum Direction {
	Top = 'top',
	Bottom = 'bottom',
	Left = 'left',
	Right = 'right'
}

export enum MarkerType {
	Arrow = 'arrow',
	ArrowClosed = 'arrowclosed'
}

export interface Position {
	x: number;
	y: number;
	z?: number;
}

export interface Dimensions {
	position: Position;
	height: number;
	width: number;
	center: Position;
}

export interface GridProperties {
	type: 'dots' | 'lines';
	spacing: number;
	snap: boolean;
}

export interface NodeType {
	type: string;
	data: object;
	position: Position;
	isConnected: boolean;
}

export interface EdgeMarker {
	type: string;
	color?: string;
	width?: number;
	height?: number;
	markerUnits?: string;
	orient?: string;
	strokeWidth?: number;
}

export interface EdgeProps extends EdgeType {
	path: string;
	markerEnd?: string | EdgeMarker;
	markerStart?: string | EdgeMarker;
}

export interface EdgeType {
	type: 'straight' | 'smoothstep' | 'step' | 'bezier';
	sourceId: string;
	sourcePosition: Position;
	sourceDirection: string;
	targetId: string;
	targetPosition: Position;
	targetDirection: string;
	animate?: boolean;
	style?: string;
	className?: string;
}

export interface ViewOptions {
	zoom: number;
	graphDimensions: Dimensions;
	gridProperties: GridProperties;
}

export interface PathDraw {
	enabled: boolean;
	sourceId: string;
	sourceType: string;
	sourceDirection: string;
	sourcePosition: Position;
	targetPosition: Position;
	targetDirection: string;
}

export interface RawStore {
	nodes: { [key: string]: NodeType };
	edges: EdgeType[];
	viewOptions: ViewOptions;
}

export interface Store {
	nodes: Writable<{ [key: string]: NodeType }>; // better as object for searching
	edges: Writable<EdgeType[]>; // better as list since changes are based on internal data
	viewOptions: Writable<ViewOptions>;
	pathDraw: Writable<PathDraw>;
}

export interface CustomNode {
	[key: string]: any;
	add: (node: NodeType, id?: string) => void;
	remove: (id: string) => void;
	updatePosition: (id: string, pos: Position) => void;
}

export interface CustomEdge {
	[key: string]: any;
	add: (node: EdgeType) => void;
	remove: (id: string) => void;
	updatePosition: (id: string, pos: Position) => void;
}

export interface CustomPath {
	[key: string]: any;
	drawingEvent: (e: MouseEvent) => void;
}

export interface CustomStore {
	nodes: CustomNode;
	edges: CustomEdge;
	viewOptions: { [key: string]: any };
	pathDraw: CustomPath;
}

export interface Stores {
	[key: string]: Store;
}

export interface CustomComponentType {
	[key: string]: SvelteComponentTyped;
}
