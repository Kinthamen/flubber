<script lang="ts">

    import Connector from "$lib/components/handles/Connector.svelte";

    export let id;
    export let data;
    export let flubberId;

</script>

<div class="start-node">
    Stop {data.hello}
    <Connector nodeId={id} {flubberId} />
</div>

<style>
    .start-node {
        background-color: white;
        min-width: 100px;
        min-height: 50px;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        text-align: center;
        border: solid 1px black;
        border-radius: 5px;
        box-shadow: 1px 1px 3px 1px rgba(0, 0, 0, 0.2);
    }
</style>