import { type DragOptions, DEFAULT_CLASS } from '../types/actions';

export function dragAction(node: HTMLElement, options: DragOptions = {}) {
	let {
		// eslint-disable-next-line prefer-const
		defaultPosition = { x: 0, y: 0 },
		gpuAcceleration = true,
		legacyTranslate = true
		// handle,
		// noDrag,
		// connector
	} = options;

	// const handles = handle ? node.querySelectorAll<HTMLElement>(handle).values() : [node];
	// const notDraggables = noDrag ? node.querySelectorAll<HTMLElement>(noDrag).values() : [];
	// const connectors = connector ? node.querySelectorAll<HTMLElement>(connector).values() : [];

	let active = false;

	let startDragX: number, startDragY: number;

	let { x: xOffset, y: yOffset } = defaultPosition;

	setTranslate(xOffset, yOffset);

	let bodyOriginalUserSelectVal = '';
	const nodeRect = node.getBoundingClientRect();
	const bodyStyle = document.body.style;
	const nodeClassList = node.classList;
	// let currentlyDraggedEl: HTMLElement;

	function setTranslate(xPos: number, yPos: number) {
		if (legacyTranslate) {
			const common = `${+xPos}px, ${+yPos}px`;
			return setStyle(
				node,
				'transform',
				gpuAcceleration ? `translate3d(${common}, 0)` : `translate(${common})`
			);
		}

		return setStyle(node, 'translate', `${+xPos}px ${+yPos}px ${gpuAcceleration ? '1px' : ''}`);
	}

	addEventListener('pointerdown', dragStart, false);
	addEventListener('pointerup', dragEnd, false);
	addEventListener('pointermove', drag, false);

	function dragStart(e: PointerEvent) {
		nodeClassList.add(DEFAULT_CLASS.MAIN);

		bodyOriginalUserSelectVal = bodyStyle.userSelect;
		bodyStyle.userSelect = 'none';

		startDragX = e.clientX;
		startDragY = e.clientY;

		active = true;
	}

	function dragEnd() {
		if (!active) return;

		nodeClassList.remove(DEFAULT_CLASS.DRAGGING);
		nodeClassList.add(DEFAULT_CLASS.DRAGGED);

		bodyStyle.userSelect = bodyOriginalUserSelectVal;

		active = false;
	}

	function drag(e: PointerEvent) {
		if (!active) return;

		e.preventDefault();

		nodeClassList.add(DEFAULT_CLASS.DRAGGING);

		xOffset = xOffset + (e.clientX - startDragX);
		yOffset = yOffset + (e.clientY - startDragY);

		setTranslate(xOffset, yOffset);
	}

	return {
		destroy: () => {
			const unlisten = removeEventListener;

			unlisten('pointerdown', dragStart, false);
			unlisten('pointerup', dragEnd, false);
			unlisten('pointermove', drag, false);
		},
		update: (options: DragOptions) => {
			// Update all the values that need to be changed
			// handle = options.handle;
			// noDrag = options.noDrag;
			gpuAcceleration = options.gpuAcceleration ?? true;
			legacyTranslate = options.legacyTranslate ?? true;

			const dragged = nodeClassList.contains(DEFAULT_CLASS.DRAGGED);

			nodeClassList.remove(DEFAULT_CLASS.MAIN, DEFAULT_CLASS.DRAGGED);

			nodeClassList.add(DEFAULT_CLASS.MAIN);

			if (dragged) nodeClassList.add(DEFAULT_CLASS.DRAGGED);
		}
	};
}

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

const isString = (val: unknown): val is string => typeof val === 'string';

const setStyle = (el: HTMLElement, style: string, value: string) =>
	el.style.setProperty(style, value);
