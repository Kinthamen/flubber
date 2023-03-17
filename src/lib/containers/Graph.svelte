<script lang="ts">
    import {draggable} from '../utils/dragging';
    import type {Writable} from "svelte/store";
    import type {Position, StoreType} from "../types";
    import {getStore} from "../store/api";
    import type {CustomNodeType,CustomEdgeType} from "../types";
    import Start from "../components/nodes/Start.svelte";
    import Node from "$lib/components/Node.svelte";
    import BezierEdge from "../components/edges/BezierEdge.svelte";

    const builtinNodes = {
        start: Start,
    } as CustomNodeType;

    const builtinEdges = {
        bezier: BezierEdge,
    } as CustomEdgeType;

    export let customNodes = {} as CustomNodeType;
    export let customEdges = {} as CustomEdgeType;
    export let flubberId: string;

    let tempPath;
    const thisStore: Writable<StoreType> = getStore(flubberId);

    $: gridStyle = (() => {
        if ($thisStore?.gridOptions.gridStyle === 'dots') {
            return 'radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px);';
        } else if ($thisStore?.gridOptions.gridStyle === 'lines') {
            return 'linear-gradient(to right, grey 1px, transparent 1px),' +
                'linear-gradient(to bottom, grey 1px, transparent 1px);';
        } else {
            return 'unset;';
        }
    })()

    $: style = `
        height: ${$thisStore.gridOptions.graphSize}px;
        width: ${$thisStore.gridOptions.graphSize}px;
        background-size: ${$thisStore.gridOptions.gridSize}px ${$thisStore.gridOptions.gridSize}px;
        background-image: ${gridStyle}`

    $: edgeStyle = `
        z-index: -999;
        height: ${$thisStore.gridOptions.graphSize}px;
        width: ${$thisStore.gridOptions.graphSize}px;`

    $: options = {
        axis: 'both',
        defaultPosition: {x: -1000, y: -1000},
        cancel: '.node',
    };

    function updatePosition(id: string, position: Position, height: number, width: number) {
        $thisStore.nodes[id].position = position;
        Object.entries($thisStore.edges).map(([_, edge]) => {
            if (edge.sourceId === id) {
                edge.sourcePosition = { x: position.x + (width/2), y: position.y + (height/2)};
            }
            if (edge.targetId === id) {
                edge.targetPosition = { x: position.x + (width/2), y: position.y + (height/2)};
            }
        })
    }

</script>

<div
        id="graph-{flubberId}"
        {style}
        use:draggable={options}
>
    {#each Object.entries($thisStore.nodes) as [id, node]}
        <Node
                {id}
                {updatePosition}
                position={node.position}
        >
            {#if node.type in customNodes}
                <svelte:component
                        this={customNodes[node.type]}
                        {id}
                        {flubberId}
                        bind:data={node.data}
                />
            {:else if node.type in builtinNodes}
                <svelte:component
                        this={builtinNodes[node.type]}
                        {id}
                        {flubberId}
                        bind:data={node.data}
                />
            {/if}
        </Node>
    {/each}
    <svg
        id="edges-{flubberId}"
        style={edgeStyle}
        viewBox="0 0 {$thisStore.gridOptions.graphSize} {$thisStore.gridOptions.graphSize}"
        on:contextmenu|preventDefault
    >
        {#each Object.entries($thisStore.edges) as [id, edge]}
            {#if edge.type in customEdges}
                <svelte:component this={customEdges[edge.type]} data={edge} />
            {:else if edge.type in builtinEdges}
                <svelte:component this={builtinEdges[edge.type]} data={edge} />
            {/if}
        {/each}
        {tempPath}
    </svg>
</div>

<!--on:mouseup={(e) => {-->
<!--    const classes = [...e.target.classList, ...e.target.parentElement.classList];-->
<!--    if (classes.includes('node') || classes.includes('connector')) {-->
<!--        console.log('its a node');-->
<!--    } else {-->
<!--        console.log('must be graph');-->
<!--    }-->
<!--}}-->