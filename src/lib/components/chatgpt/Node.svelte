<!-- Node.svelte -->
<script>
    export let node;
    export let index;
    export let nodes;

    function handleDrag(event) {
        const newX = event.clientX - event.dataTransfer.getData('offsetX');
        const newY = event.clientY - event.dataTransfer.getData('offsetY');
        nodes = [
            ...nodes.slice(0, index),
            {...node, x: newX, y: newY},
            ...nodes.slice(index + 1)
        ];
    }
</script>

<div
        class="node"
        draggable="true"
        on:dragstart={(event) => event.dataTransfer.setData('text/plain', index)}
        on:drag={handleDrag}
        style={`transform: translate(${node.x}px, ${node.y}px)`}
>
    {index + 1}
</div>
