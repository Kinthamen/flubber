<script lang="ts">
    import {flubberIdGenerator} from "../../utils/generators";
    import {Direction, type EdgeType} from "../../types";
    import {getStore} from "../../store/api";

    export let id = flubberIdGenerator();
    export let nodeId: string;
    export let flubberId: string;
    export let direction: Direction;
    export let connType: 'source' | 'target';

    let elm;

    const connectorId = `${flubberId}_${nodeId}_${id}`;

    const { nodes, pathDraw } = getStore(flubberId);

    const calculateStartPosition = () => {
        const { height, width } = elm.getBoundingClientRect();
        const localCenter = { x: elm.offsetLeft + (width/2), y: elm.offsetTop + (height/2)};
        return { x: $nodes[nodeId].position.x + localCenter.x, y: $nodes[nodeId].position.y + localCenter.y };
    }

</script>

<div
    id={connectorId}
    style={$$props.style}
    class="connector {$$props.class}"
    bind:this={elm}
    on:mousedown={(e) => pathDraw.enableDraw(e, connectorId, connType, direction, calculateStartPosition())}
    on:mouseup={() => pathDraw.disableDraw(connectorId, connType, direction, calculateStartPosition())}
>
    <slot />
</div>

<style>
    .connector {
        position: relative;
        height: 10px;
        width: 10px;
        border: 1px solid black;
        border-radius: 50%;
        background-color: gray;
    }
</style>
