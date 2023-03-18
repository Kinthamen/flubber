<script lang="ts">
    import type {EdgeProps} from "../../types";

    export let edgeData: EdgeProps;

    $: path = edgeData.path;
    $: style = edgeData.style;
    $: markerStart = edgeData.markerStart;
    $: markerEnd = edgeData.markerEnd;

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