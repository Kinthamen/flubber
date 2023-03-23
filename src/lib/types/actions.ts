export const enum DEFAULT_CLASS {
	MAIN = 'drag',
	DRAGGING = 'drag-dragging',
	DRAGGED = 'drag-dragged'
}

export interface Position {
	x: number;
	y: number;
	z?: number;
}

export interface DragBoundsCoords {
	left: number;
	top: number;
	right: number;
	bottom: number;
}

export interface DragOptions {
	defaultPosition?: Position;
	legacyTranslate?: boolean;
	gpuAcceleration?: boolean;
	handle?: string;
	noDrag?: string;
	connector?: string;
}
