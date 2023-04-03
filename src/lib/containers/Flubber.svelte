<script lang="ts">
    import {beforeUpdate, SvelteComponentTyped} from "svelte";
	import type { Node, Edge } from '../types';
    import { edgesStore, nodesStore, initEdgesStore } from '../store';
    import Start from "../components/nodes/Start.svelte";

	export let nodes: Node[];
	export let edges: Edge[];
    export let customNodes: {[key: string]: SvelteComponentTyped} = {};
    export let customEdges: {[key: string]: SvelteComponentTyped} = {};

    beforeUpdate(() => {
        nodesStore.set(nodes);
        initEdgesStore(edges);
    })

    const usableNodes = {
        start: Start,
        ...customNodes
    }
    const usableEdges = {
        ...customEdges
    }

</script>

<div class="flubber {$$props.class}" style={$$props.style}>
    {#each $nodesStore as node}
        {#if node.type in usableNodes}
            <svelte:component this={usableNodes[node.type]} {node} />
        {/if}
    {/each}
    {#each $edgesStore as edge}
        <div>{JSON.stringify(edge)}</div>
    {/each}
</div>
<svg>

</svg>

<style>
	.flubber {
		overflow: hidden;
		font-family: 'Segoe UI', sans-serif;
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
	}
</style>
