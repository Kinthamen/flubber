<script lang="ts">
    import type {EdgeProps} from "../../types";

    export let baseEdgeProps: EdgeProps;

    const {
        path,
        style,
        markerEnd,
        markerStart,
    } = baseEdgeProps;

</script>

<path
    style={style}
    d={path}
    fill="none"
    class="flubber__edge-path"
    markerEnd={markerEnd}
    markerStart={markerStart}
/>

<style>
    .flubber__edge-path {
        stroke: #b1b1b7;
        stroke-width: 1;
        fill: none;
    }
</style>