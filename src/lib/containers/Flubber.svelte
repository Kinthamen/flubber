<script lang="ts">
    import {flubberIdGenerator} from "../utils/generators";
    import type {
        CustomNodeType,
        EdgeArrayType,
        GridOptionsType,
        NodeArrayType,
        viewOptionType
    } from "../types";
    import {initStore} from "$lib/store/api.js";
    import Graph from "$lib/containers/Graph.svelte";

    export let flubberId = flubberIdGenerator();
    export let nodes: NodeArrayType;
    export let edges: EdgeArrayType;
    export let viewOptions: viewOptionType;
    export let gridOptions: GridOptionsType;
    export let customNodes: CustomNodeType;

    initStore(flubberId, {
        nodes: nodes,
        edges: edges,
        viewOptions: viewOptions,
        gridOptions: gridOptions,
    });

</script>

<div
        id="flubber-{flubberId}"
        class="flubber {$$props.class}"
        style={$$props.style}
>
    <Graph {flubberId} {customNodes} />
    <slot />
</div>

<style>
    .flubber {
        overflow: hidden;
        font-family: 'Segoe UI', sans-serif;
    }
</style>