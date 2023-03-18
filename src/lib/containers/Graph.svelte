<script lang="ts">
    import {draggable} from '../utils/dragging';
    import type {CustomNodeType,CustomEdgeType} from "../types";
    import Start from "../components/nodes/Start.svelte";
    import BezierEdge from "../components/edges/BezierEdge.svelte";
    import {getOrCreateStore, drawStore} from "../store/store2";
    import {getBezierPath, relativeCoords} from "../utils/calculators";
    import {Direction} from "$lib/store/store2.js";

    const builtinNodes = {
        start: Start,
    } as CustomNodeType;

    const builtinEdges = {
        bezier: BezierEdge,
    } as CustomEdgeType;

    export let flubberId: string;
    export let customNodes = {} as CustomNodeType;
    export let customEdges = {} as CustomEdgeType;

    let self;

    $: ({ nodes, edges, viewOptions, gridOptions } = getOrCreateStore(flubberId));

    $: gridStyle = (() => {
        if ($gridOptions.gridStyle === 'dots') {
            return 'radial-gradient(circle, #000000 1px, rgba(0, 0, 0, 0) 1px);';
        } else if ($gridOptions.gridStyle === 'lines') {
            return 'linear-gradient(to right, grey 1px, transparent 1px),' +
                'linear-gradient(to bottom, grey 1px, transparent 1px);';
        } else {
            return 'unset;';
        }
    })()

    $: style = `
        height: ${$gridOptions.graphSize}px;
        width: ${$gridOptions.graphSize}px;
        background-size: ${$gridOptions.gridSize}px ${$gridOptions.gridSize}px;
        background-image: ${gridStyle}`

    $: edgeStyle = `
        z-index: -999;
        height: ${$gridOptions.graphSize}px;
        width: ${$gridOptions.graphSize}px;`

    $: options = {
        axis: 'both',
        defaultPosition: {x: -1000, y: -1000},
        cancel: '.node',
    };

    $: targetDirection = (() => {
        const distanceX = $drawStore.sourcePosition.x - $drawStore.mousePosition.x;
        const distanceY = $drawStore.sourcePosition.y - $drawStore.mousePosition.y;

        if (Math.abs(distanceX) > Math.abs(distanceY)) {
            return distanceX > 0 ? Direction.Right : Direction.Left;
        } else {
            return distanceY > 0 ? Direction.Bottom : Direction.Top;
        }
    })()

</script>

<div
        id="graph-{flubberId}"
        {style}
        use:draggable={options}
        bind:this={self}
        on:mouseup={() => {
            if ($drawStore.enabled) {
                $drawStore.enabled = false;
                $drawStore.sourceId = '';
                $drawStore.sourcePosition = {};
                $drawStore.targetId = '';
                $drawStore.targetPosition = {};
                $drawStore.mousePosition = {};
                self.removeEventListener('mousemove', $drawStore.mouseEventListener, false);
                $drawStore.mouseEventListener = (e) => {return};
            }
        }}
        on:mouseleave={() => {
            if ($drawStore.enabled) {
                $drawStore.enabled = false;
                $drawStore.sourceId = '';
                $drawStore.sourcePosition = {};
                $drawStore.targetId = '';
                $drawStore.targetPosition = {};
                $drawStore.mousePosition = {};
                self.removeEventListener('mousemove', $drawStore.mouseEventListener, false);
                $drawStore.mouseEventListener = (e) => {return};
            }
        }}
>
    {#each Object.entries($nodes) as [id, node]}
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
    {/each}
    <svg
        id="edges-{flubberId}"
        style={edgeStyle}
        viewBox="0 0 {$gridOptions.graphSize} {$gridOptions.graphSize}"
        on:contextmenu|preventDefault
    >
        {#each Object.entries($edges) as [id, edge]}
            {#if edge.type in customEdges}
                <svelte:component this={customEdges[edge.type]} data={edge} />
            {:else if edge.type in builtinEdges}
                <svelte:component this={builtinEdges[edge.type]} data={edge} />
            {/if}
        {/each}
        {#if $drawStore.enabled && $drawStore.mousePosition.x}
            <path
                d={getBezierPath({
                sourcePosition: $drawStore.sourcePosition,
                sourceDirection: $drawStore.sourceDirection,
                targetPosition: $drawStore.mousePosition,
                targetDirection: targetDirection,
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