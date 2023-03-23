<script lang="ts">
	import type { EdgeProps } from '../../types';

	export let edgeData: EdgeProps;

	$: path = edgeData.path;
	$: style = edgeData.style;
	$: markerStart = edgeData.markerStart;
	$: markerEnd = edgeData.markerEnd;
</script>

<path {style} d={path} fill="none" class="flubber__edge-path" {markerEnd} {markerStart} />

<style>
	.flubber__edge-path {
		stroke: #b1b1b7;
		stroke-width: 1;
		fill: none;
	}
</style>
