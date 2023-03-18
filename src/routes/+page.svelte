<script lang="ts">
    import {Flubber} from "../lib";
    import Stop from "$lib/components/nodes/Stop.svelte";

    const customNodes = {
        stop: Stop
    }

    const nodes = {
        0: {
            type: 'start',
            data: { hello:'world' },
            position: { x: 1010, y: 1010 },
        },
        1: {
            type: 'stop',
            data: { hello:'world' },
            position: { x:1010, y: 1070 }
        }
    }

    const edges = []
</script>

<Flubber
        style="height: 500px; border: 2px solid slategray; border-radius: 5px; box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);"
        {nodes}
        {edges}
        {customNodes}
/>