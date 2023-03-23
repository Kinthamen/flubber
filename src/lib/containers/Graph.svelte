<script lang="ts">
	import { type CustomComponentType, Direction } from '../types';
	import { draggable } from '@neodrag/svelte';
	import { Start, Stop } from '../components/nodes';
	import { BezierEdge } from '../components/edges';
	import { getBezierPath } from '../utils/calculators';
	import { getStore } from '../store/api';

	const builtins = {
		nodes: {
			start: Start,
			stop: Stop
		} as CustomComponentType,
		edges: {
			bezier: BezierEdge
		} as CustomComponentType
	};

	export let flubberId: string;
	export let customNodes = {} as CustomComponentType;
	export let customEdges = {} as CustomComponentType;

	let self;

	const { nodes, edges, viewOptions, pathDraw } = getStore(flubberId);

	$: graphHeight = $viewOptions.graphDimensions.height;
	$: graphWidth = $viewOptions.graphDimensions.width;
	$: graphPosition = $viewOptions.graphDimensions.position;
	$: gridSpacing = $viewOptions.gridProperties.spacing;
	$: gridType = $viewOptions.gridProperties.type;

	$: gridStyle = (() => {
		if (gridType === 'dots') {
			return 'radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px);';
		} else if (gridType === 'lines') {
			return (
				'linear-gradient(to right, grey 1px, transparent 1px),' +
				'linear-gradient(to bottom, grey 1px, transparent 1px);'
			);
		} else {
			return 'unset;';
		}
	})();

	$: nodeStyle = `
        height: ${graphHeight}px;
        width: ${graphWidth}px;
        background-size: ${gridSpacing}px ${gridSpacing}px;
        background-image: ${gridStyle}`;

	$: svgStyle = `
        z-index: -999;
        height: ${graphHeight}px;
        width: ${graphWidth}px;`;

	$: options = {
		axis: 'both',
		defaultPosition: graphPosition,
		cancel: '.node'
	};

	$: targetDirection = () => {
		const distanceX = $pathDraw.sourcePosition.x - $pathDraw.targetPosition.x;
		const distanceY = $pathDraw.sourcePosition.y - $pathDraw.targetPosition.y;

		if (Math.abs(distanceX) > Math.abs(distanceY)) {
			return distanceX > 0 ? Direction.Right : Direction.Left;
		} else {
			return distanceY > 0 ? Direction.Bottom : Direction.Top;
		}
	};
</script>

<div
	id="graph-{flubberId}"
	style={nodeStyle}
	use:draggable={options}
	bind:this={self}
	on:mouseup={() => {
		if ($pathDraw.enabled) {
			$pathDraw.enabled = false;
			$pathDraw.sourceId = '';
			$pathDraw.sourceType = '';
			$pathDraw.sourceDirection = '';
			$pathDraw.sourcePosition = {};
			$pathDraw.targetPosition = {};
			$pathDraw.targetDirection = '';
			self.removeEventListener('mousemove', $pathDraw.drawingEvent, false);
		}
	}}
	on:mouseleave={() => {
		if ($pathDraw.enabled) {
			$pathDraw.enabled = false;
			$pathDraw.sourceId = '';
			$pathDraw.sourceType = '';
			$pathDraw.sourceDirection = '';
			$pathDraw.sourcePosition = {};
			$pathDraw.targetPosition = {};
			$pathDraw.targetDirection = '';
			self.removeEventListener('mousemove', $pathDraw.drawingEvent, false);
		}
	}}
>
	{#each Object.entries($nodes) as [id, node]}
		{#if node.type in customNodes}
			<svelte:component this={customNodes[node.type]} {id} {flubberId} bind:data={node.data} />
		{:else if node.type in builtins.nodes}
			<svelte:component this={builtins.nodes[node.type]} {id} {flubberId} bind:data={node.data} />
		{/if}
	{/each}
	<svg
		id="edges-{flubberId}"
		style={svgStyle}
		viewBox="0 0 {graphHeight} {graphWidth}"
		on:contextmenu|preventDefault
	>
		{#each $edges as edge}
			{#if edge.type in customEdges}
				<svelte:component this={customEdges[edge.type]} data={edge} />
			{:else if edge.type in builtins.edges}
				<svelte:component this={builtins.edges[edge.type]} data={edge} />
			{/if}
		{/each}
		{#if $pathDraw.enabled && $pathDraw.targetPosition.x}
			<path
				d={getBezierPath({
					sourcePosition: $pathDraw.sourcePosition,
					sourceDirection: $pathDraw.sourceDirection,
					targetPosition: $pathDraw.targetPosition,
					targetDirection: targetDirection()
				})}
				fill="none"
				class="flubber__edge-path"
			/>
		{/if}
	</svg>
</div>

<style>
	.flubber__edge-path {
		stroke: #b1b1b7;
		stroke-width: 1;
		fill: none;
	}
</style>
