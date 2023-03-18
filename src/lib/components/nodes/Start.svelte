<script lang="ts">
    import Node from "../Node.svelte";
    import Connector from "../connectors/Connector.svelte";

    export let id;
    export let data;
    export let flubberId;

</script>

<Node {id} {flubberId}>
    <div class="start-node">
        Start {data.hello}
        <Connector style="height: 50px; flex: 1 0 auto; border: unset; border-radius: unset;" connType="source" direction="right" nodeId={id} {flubberId} />
    </div>
</Node>

<style>
    .start-node {
        display: flex;
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
        gap: 10px;
    }
</style>