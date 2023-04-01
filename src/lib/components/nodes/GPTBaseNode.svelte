<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { getStore } from '../../store/api';
	import type { Position } from '../../types';

	export let flubberId: string;
	export let id: string;

	const { nodes, edges } = getStore(flubberId);

	let node: SVGGElement;

	onMount(() => {
		const drag = d3.drag<SVGGElement, Position>().on('drag', (event) => {
			const { x, y } = event;
			d3.select(node).attr('transform', `translate(${x}, ${y})`);
			nodes.updatePosition(id, { x, y });
			if ($nodes[id].isConnected) {
				edges.updatePosition(id, { x, y });
			}
		});

		d3.select(node).call(drag);
	});
</script>

<svg>
	<g ref={node}>
		<slot />
	</g>
</svg>

<style>
	svg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	g {
		cursor: move;
		user-select: none;
		pointer-events: auto;
	}
</style>
