<script lang="ts">
    import {draggable, type DragOptions} from '../utils/dragging';
    import {createEventDispatcher} from "svelte";
    import type {Position} from "../types";

    const dispatch = createEventDispatcher();

    export let position = { x: 2500, y: 2500 } as Position;

    const options: DragOptions = {
        axis: 'both',
        bounds: 'parent',
        onDragStart: e => dispatch('setdraggable', { flag: true }),
        onDragEnd: e => dispatch('setdraggable', { flag: false }),
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