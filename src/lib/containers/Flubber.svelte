<script lang="ts">
    import {flubberIdGenerator} from "../utils/generators";
    import type {CustomEdgeType, CustomNodeType} from "../types";
    // import {initStore} from "$lib/store/api.js";
    import Graph from "$lib/containers/Graph.svelte";
    import type {EdgeType, NodeArrayType, ViewOptionsType, GridOptionsType} from "../store/store2";
    import {getOrCreateStore} from "../store/store2";

    export let flubberId = flubberIdGenerator();
    export let nodes: NodeArrayType;
    export let edges: EdgeType[];
    export let viewOptions: ViewOptionsType;
    export let gridOptions: GridOptionsType;
    export let customNodes: CustomNodeType;
    export let customEdges: CustomEdgeType;

    // initStore(flubberId, {
    //     nodes: nodes,
    //     edges: edges,
    //     viewOptions: viewOptions,
    //     gridOptions: gridOptions,
    // });

    getOrCreateStore(flubberId, {
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
    <Graph {flubberId} {customNodes} {customEdges} />
    <slot />
</div>

<style>
    .flubber {
        overflow: hidden;
        font-family: 'Segoe UI', sans-serif;
    }
</style>