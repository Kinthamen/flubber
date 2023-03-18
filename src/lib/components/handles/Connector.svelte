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

    const { nodes, edges, pathDraw } = getStore(flubberId);

    const calculateCenter = (offsetX, offsetY, width, height) => {
        return { x: offsetX + (width/2), y: offsetY + (height/2)}
    }

    const calculateStartPosition = () => {
        const { height, width } = elm.getBoundingClientRect();
        const localCenter = calculateCenter(elm.offsetLeft, elm.offsetTop, width, height);
        return { x: $nodes[nodeId].position.x + localCenter.x, y: $nodes[nodeId].position.y + localCenter.y };
    }

    const enableDraw = (e) => {
        e.preventDefault();
        $pathDraw.sourceId = connectorId;
        $pathDraw.sourceType = connType;
        $pathDraw.sourceDirection = direction;
        $pathDraw.sourcePosition = calculateStartPosition();
        const graph = document.getElementById(`graph-${flubberId}`);
        graph.addEventListener('mousemove', $pathDraw.drawingEvent, false);
        $pathDraw.enabled = true;
    }

    const disableDraw = () => {
        if ($pathDraw.enabled && $pathDraw.sourceId !== connectorId && $pathDraw.sourceType !== connType) {

            const newEdge = {
                type: "bezier",
                sourceId: $pathDraw.sourceType === 'source' ? $pathDraw.sourceId : connectorId,
                sourcePosition: $pathDraw.sourceType === 'source' ? $pathDraw.sourcePosition : calculateStartPosition(),
                sourceDirection: $pathDraw.sourceType === 'source' ? $pathDraw.sourceDirection : direction,
                targetId: $pathDraw.sourceType === 'source' ? connectorId : $pathDraw.sourceId,
                targetPosition: $pathDraw.sourceType === 'source' ? calculateStartPosition() : $pathDraw.sourcePosition,
                targetDirection: $pathDraw.sourceType === 'source' ? direction : $pathDraw.sourceDirection,
            } as EdgeType;

            const duplicates = $edges.filter(edge => edge.targetId === newEdge.targetId && edge.sourceId === newEdge.sourceId);

            if (duplicates !== []) {
                $nodes[$pathDraw.sourceId.split('_')[1]].isConnected = true;
                $nodes[connectorId.split('_')[1]].isConnected = true;
                edges.add(newEdge);
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
