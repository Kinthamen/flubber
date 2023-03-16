<script lang="ts">
    import {draggable} from '../utils/dragging';
    import type {Writable} from "svelte/store";
    import type {StoreType} from "../types";
    import {getStore} from "../store/api";
    import type {CustomNodeType} from "../types";
    import Start from "../components/nodes/Start.svelte";
    import Node from "$lib/components/Node.svelte";

    const BuiltinNodes = {
        start: Start,
    } as CustomNodeType;

    export let customNodes = {} as CustomNodeType;
    export let flubberId: string;

    let disableDrag = false;
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

    $: options = {
        axis: 'both',
        defaultPosition: {x: -1000, y: -1000},
        disabled: disableDrag,
    };

</script>

<div id="graph-{flubberId}" {style} use:draggable={options}>
    {#each $thisStore.nodes as node}
        <Node on:setdraggable={(e) => { disableDrag = e.detail.flag }} position={node.position}>
        {#if node.type in customNodes}
            <svelte:component this={customNodes[node.type]} data={node.data} />
        {:else if node.type in BuiltinNodes}
            <svelte:component this={BuiltinNodes[node.type]} data={node.data} />
        {/if}
        </Node>
    {/each}
    <slot/>
</div>