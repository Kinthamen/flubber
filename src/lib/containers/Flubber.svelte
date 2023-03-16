<script lang="ts">
    import {flubberIdGenerator} from "../utils/generators";
    import type {CustomNodeType, EdgeType, GridOptionsType, NodeType, viewOptionType} from "../types";
    import {initStore} from "$lib/store/api.js";
    import Graph from "$lib/containers/Graph.svelte";

    let flubberId = flubberIdGenerator();
    let style: string;
    let className: string;

    let nodes: NodeType[];
    let edges: EdgeType[];
    let viewOptions: viewOptionType;
    let gridOptions: GridOptionsType;
    let customNodes: CustomNodeType;

    export {
        flubberId,
        nodes,
        edges,
        style,
        className as class,
        viewOptions,
        gridOptions,
        customNodes,
    }

    initStore(flubberId, {
        nodes: nodes,
        edges: edges,
        viewOptions: viewOptions,
        gridOptions: gridOptions,
    });

</script>

<div
        id="flubber-{flubberId}"
        class="flubber {className}"
        {style}
>
    <Graph {flubberId} {customNodes} />
</div>

<style>
    .flubber {
        overflow: hidden;
        font-family: 'Segoe UI', sans-serif;
    }
</style>