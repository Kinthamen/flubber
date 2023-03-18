<script lang="ts">
    import {draggable, type DragOptions} from '../utils/dragging';
    import {getOrCreateStore} from "../store/store2";

    export let flubberId: string;
    export let id: string | number;

    const { nodes, edges } = getOrCreateStore(flubberId);

    const options: DragOptions = {
        axis: 'both',
        bounds: 'parent',
        onDrag: (e) => {
            nodes.updateNodePosition(id, { x: e.offsetX, y: e.offsetY });
            if ($nodes[id].isConnected) {
                edges.updateEdgePosition(id, { x: e.offsetX, y: e.offsetY });
            }
        },
        defaultPosition: $nodes[id].position,
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