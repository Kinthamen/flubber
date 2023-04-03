<script lang="ts">
    import { draggable } from './actions';
    import type { Node } from "../../types";

    export let node: Node;
</script>

<div id={node.id} class="start" use:draggable>
    Hello from {node.id}!
    Position: {JSON.stringify(node.position)}
</div>

<style>
    .start {
        display: flex;
        text-align: center;
        justify-content: center;
        align-items: center;
        padding: 15px;
        border-radius: 50%;
        background-color: blue;
    }
</style>