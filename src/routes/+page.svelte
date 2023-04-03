<script lang="ts">
    import {Flubber} from '../lib';

    const nodes = [
        {
            id: "one",
            type: "start",
            data: {},
            position: { x: 30, y: 30 },
        },
        {
            id: "two",
            type: "start",
            data: {},
            position: { x: 30, y: 90 },
        },
        {
            id: "three",
            type: "start",
            data: {},
            position: { x: 30, y: 150 },
        }
    ];

    const edges = [];
</script>

<Flubber {nodes} {edges} />
