<script lang="ts">
	import type { CustomComponentType, EdgeType, NodeType, ViewOptions } from '../types';
	import { flubberIdGenerator } from '../utils/generators';
	import { createStore } from '../store/api';
	import Graph from './Graph.svelte';

	export let flubberId = flubberIdGenerator();
	export let nodes: { [key: string]: NodeType };
	export let edges: EdgeType[];
	export let viewOptions: ViewOptions;
	export let customNodes: CustomComponentType;
	export let customEdges: CustomComponentType;

	createStore(flubberId, {
		nodes: nodes,
		edges: edges,
		viewOptions: viewOptions
	});
</script>

<div id="flubber-{flubberId}" class="flubber {$$props.class}" style={$$props.style}>
	<Graph {flubberId} {customNodes} {customEdges} />
	<slot />
</div>

<style>
	.flubber {
		overflow: hidden;
		font-family: 'Segoe UI', sans-serif;
	}
</style>
