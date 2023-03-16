<script lang="ts">
    import {draggable, type DragOptions} from '../utils/dragging';
    import type {Position, StoreType} from "../types";
    import type {Writable} from "svelte/store";
    import {getStore} from "../store/api";

    export let flubberId: string;
    export let id: string;
    export let position = { x: 2500, y: 2500 } as Position;
    export let setDraggable;

    const thisStore: Writable<StoreType> = getStore(flubberId);

    const options: DragOptions = {
        axis: 'both',
        bounds: 'parent',
        onDragStart: e => setDraggable(true),
        onDragEnd: e => { $thisStore.nodes[id].position = { x: e.offsetX, y: e.offsetY }; setDraggable(false); },
        defaultPosition: position,
    };

</script>

<div
        class="node"
        use:draggable={options}
>
    <slot/>
</div>

<style>
    .node {
        position: absolute;
        user-select: none;
        justify-content: center;
        overscroll-behavior: auto;
        align-items: center;
        font-size: 14px;
        text-align: center;
        pointer-events: auto; /* this is needed for pointer events to work since we disable them in graphview */
    }
</style>