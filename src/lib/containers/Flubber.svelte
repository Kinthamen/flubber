<script lang="ts">
	import type { CustomComponentType, EdgeType, NodeType, ViewOptions } from '../types';
	import { flubberIdGenerator } from '../utils/generators';
	import { createStore } from '../store/api';
	// import Graph from './Graph.svelte';
	import {setActive} from "../store/api.js";
	import {dragAction} from "../utils/actions";

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

<div
	id="flubber-{flubberId}"
	class="flubber {$$props.class}"
	style={$$props.style}
	on:mouseenter={() => setActive(flubberId)}
	on:mouseleave={() => setActive('')}
>
<!--	<Graph {flubberId} {customNodes} {customEdges} />-->
	<div style="height: 50px; width: 120px; background-color: red;" use:dragAction={{noDrag: '.noDrag', connector: '.connector'}}>
		<span class="noDrag">Drag Me</span>
		<span class="connector">()</span>
	</div>
	<slot />
</div>

<style>
	.flubber {
		overflow: hidden;
		font-family: 'Segoe UI', sans-serif;
	}
</style>
