<script lang="ts">
    import {flubberIdGenerator} from "../../utils/generators";
    import {getOrCreateStore, drawStore, Direction, type EdgeType} from "../../store/store2";
    import {relativeCoords} from "../../utils/calculators";

    export let id = flubberIdGenerator();
    export let nodeId: string | number
    export let flubberId: string;
    export let direction: Direction;
    export let connType: 'source' | 'target';

    let elm;

    const connectorId = `${flubberId}_${nodeId}_${id}`;
    const graphId = `graph-${flubberId}`;

    const { nodes, edges } = getOrCreateStore(flubberId);

    const calculateCenter = (offsetX, offsetY, width, height) => {
        return { x: offsetX + (width/2), y: offsetY + (height/2)}
    }

    const calculateStartPosition = () => {
        const { height, width } = elm.getBoundingClientRect();
        const localCenter = calculateCenter(elm.offsetLeft, elm.offsetTop, width, height);
        return { x: $nodes[nodeId].position.x + localCenter.x, y: $nodes[nodeId].position.y + localCenter.y };
    }

    function getMousePosition(e: MouseEvent) {
        relativeCoords(graphId, e);
    }

    const enableDraw = (e) => {
        e.preventDefault();
        $drawStore.sourceId = connectorId;
        $drawStore.sourceType = connType;
        $drawStore.sourceDirection = direction;
        $drawStore.sourcePosition = calculateStartPosition();
        $drawStore.mouseEventListener = getMousePosition;
        const graph = document.getElementById(`graph-${flubberId}`);
        graph.addEventListener('mousemove', $drawStore.mouseEventListener, false);
        $drawStore.enabled = true;
    }

    const disableDraw = () => {
        if ($drawStore.enabled && $drawStore.sourceId !== connectorId && $drawStore.sourceType !== connType) {

            const newEdge = {
                type: "bezier",
                sourceId: $drawStore.sourceType === 'source' ? $drawStore.sourceId : connectorId,
                sourcePosition: $drawStore.sourceType === 'source' ? $drawStore.sourcePosition : calculateStartPosition(),
                sourceDirection: $drawStore.sourceType === 'source' ? $drawStore.sourceDirection : direction,
                targetId: $drawStore.sourceType === 'source' ? connectorId : $drawStore.sourceId,
                targetPosition: $drawStore.sourceType === 'source' ? calculateStartPosition() : $drawStore.sourcePosition,
                targetDirection: $drawStore.sourceType === 'source' ? direction : $drawStore.sourceDirection,
            } as EdgeType;

            const duplicates = $edges.filter(edge => edge.targetId === newEdge.targetId && edge.sourceId === newEdge.sourceId);

            if (duplicates !== []) {
                $nodes[$drawStore.sourceId.split('_')[1]].isConnected = true;
                $nodes[connectorId.split('_')[1]].isConnected = true;
                edges.addEdge(newEdge);
            }
        }
    }

</script>

<div
    id={connectorId}
    style={$$props.style}
    class="connector {$$props.class}"
    bind:this={elm}
    on:mousedown={enableDraw}
    on:mouseup={disableDraw}
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
