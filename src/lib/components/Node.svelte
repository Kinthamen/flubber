<script lang="ts">
    import {draggable, type DragOptions} from '../utils/dragging';
    import type {Position} from "../types";

    export let id: string | number;
    export let position = { x: 2500, y: 2500 } as Position;
    export let updatePosition;

    const options: DragOptions = {
        axis: 'both',
        bounds: 'parent',
        onDrag: (e) => {updatePosition(id, { x: e.offsetX, y: e.offsetY }, e.currentNode.offsetHeight, e.currentNode.offsetWidth)},
        defaultPosition: position,
        cancel: '.connector',
    };

</script>

<div
        id={id}
        class="node"
        use:draggable={options}
>
    <slot />
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