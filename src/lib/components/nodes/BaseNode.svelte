<script lang="ts">
	import { draggable, type DragOptions } from '@neodrag/svelte';
	import { getStore } from '../../store/api';
	import type {Position} from "../../types";

	export let flubberId: string;
	export let id: string;

	const { nodes, edges } = getStore(flubberId);

	const options: DragOptions = {
		axis: 'both',
		bounds: 'parent',
		onDrag: (e) => {
			nodes.updatePosition(id, { x: e.offsetX, y: e.offsetY });
			if ($nodes[id].isConnected) {
				edges.updatePosition(id, { x: e.offsetX, y: e.offsetY });
			}
		},
		defaultPosition: $nodes[id].position,
		cancel: '.connector'
	};
</script>

<div {id} class="node" use:draggable={options}>
	<slot />
</div>

<style>
	.node {
		position: absolute;
		user-select: none;
		justify-content: center;
		overscroll-behavior: auto;
		align-items: center;
		font-size: 14px;
		text-align: center;
		pointer-events: auto; /* this is needed for pointer events to work since we disable them in graphview */
	}
</style>
