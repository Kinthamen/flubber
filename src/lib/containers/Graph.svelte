<script lang="ts">
    import {draggable} from '../utils/dragging';
    import type {Writable} from "svelte/store";
    import type {StoreType} from "../types";
    import {getStore} from "../store/api";
    import type {CustomNodeType} from "../types";
    import Start from "../components/nodes/Start.svelte";
    import Node from "$lib/components/Node.svelte";

    const builtinNodes = {
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

    const setDraggable = (flag: boolean) => {disableDrag = flag}

    const updateNodeData = (id: string | number, data: any) => {
        $thisStore.nodes[id].data = data;
    }

</script>

<div id="graph-{flubberId}" {style} use:draggable={options}>
    {#each Object.entries($thisStore.nodes) as [id, node]}
        <Node {id} {flubberId} {setDraggable} position={node.position}>
            {#if node.type in customNodes}
                <svelte:component this={customNodes[node.type]} id={id}  data={node.data} {updateNodeData} />
            {:else if node.type in builtinNodes}
                <svelte:component this={builtinNodes[node.type]} id={id}  data={node.data} {updateNodeData} />
            {/if}
        </Node>
    {/each}
</div>