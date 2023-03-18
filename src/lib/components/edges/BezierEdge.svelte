<script lang="ts">
    import {Direction} from "../../types";
    import BaseEdge from "$lib/components/edges/BaseEdge.svelte";

    export let data;

    function calculateControlOffset(distance, curvature) {
        if (distance >= 0) {
            return 0.5 * distance;
        } else {
            return curvature * 25 * Math.sqrt(-distance);
        }
    }

    function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
        let ctX, ctY;
        switch (pos) {
            case Direction.Left:
            {
                ctX = x1 - calculateControlOffset(x1 - x2, c);
                ctY = y1;
            }
                break;
            case Direction.Right:
            {
                ctX = x1 + calculateControlOffset(x2 - x1, c);
                ctY = y1;
            }
                break;
            case Direction.Top:
            {
                ctX = x1;
                ctY = y1 - calculateControlOffset(y1 - y2, c);
            }
                break;
            case Direction.Bottom:
            {
                ctX = x1;
                ctY = y1 + calculateControlOffset(y2 - y1, c);
            }
                break;
        }
        return [ctX, ctY];
    }

    function getBezierPath({
        sourcePosition,
        sourceDirection = Direction.Bottom,
        targetPosition,
        targetDirection = Direction.Top,
        curvature = 0.5,
    }) {

        const [sourceControlX, sourceControlY] = getControlWithCurvature({
            pos: sourceDirection,
            x1: sourcePosition.x,
            y1: sourcePosition.y,
            x2: targetPosition.x,
            y2: targetPosition.y,
            c: curvature,
        });
        const [targetControlX, targetControlY] = getControlWithCurvature({
            pos: targetDirection,
            x1: targetPosition.x,
            y1: targetPosition.y,
            x2: sourcePosition.x,
            y2: sourcePosition.y,
            c: curvature,
        });

        return `M${sourcePosition.x},${sourcePosition.y} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetPosition.x},${targetPosition.y}`;
    }

    $: edgeData = {...data, path: getBezierPath(data)}

</script>

<BaseEdge {edgeData} />