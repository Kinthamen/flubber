<script lang="ts">
    import {flubberIdGenerator} from "../../utils/generators";

    export let id = flubberIdGenerator();
    export let nodeId: string | number;

    let elm;

    const calculateCenter = (offsetX, offsetY, { width, height }) => {
        return { x: offsetX + (width/2), y: offsetY + (height/2)}
    }

</script>

<div
    style={$$props.style}
    class="connector {$$props.class}"
    bind:this={elm}
    on:mousedown={() => console.log(calculateCenter(elm.offsetLeft, elm.offsetTop, elm.getBoundingClientRect()))}
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

<!--on:mousedown={() => console.log('mouse down')}-->
<!--on:mouseup={() => console.log('mouse up')}-->