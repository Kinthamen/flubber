<!-- Line.svelte -->
<script>
    export let nodes;
</script>

{#each nodes as node, index}
    {#if index > 0}
        <svg style="position: absolute; z-index: -1;">
            <line
                    x1={nodes[index - 1].x}
                    y1={nodes[index - 1].y}
                    x2={node.x}
                    y2={node.y}
                    stroke="black"
                    stroke-width="2"
            />
        </svg>
    {/if}
{/each}
