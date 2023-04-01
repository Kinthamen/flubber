<!-- <script lang="ts">
    import Node from './Node.svelte';
    import ChildOfNode from "./ChildOfNode.svelte";

    const name = 'Abi';
    const email = 'kinthamen@gmail.com';

</script>

<div>
    <Node let:data {name} {email}>
        <ChildOfNode {data}/>
    </Node>
</div> -->
<script lang="ts">
	import NodeElementContainer from '../components/nodes/GPTBaseNode.svelte';
	import { nodesStore } from '../store/gptStore';

	const nodes = $nodesStore;

	// Example 1: A simple rectangle node
	const node1 = {
		id: 'node1',
		width: 100,
		height: 50,
		body: '<rect width="100" height="50" fill="blue" />'
	};

	// Example 2: A circle node with text
	const node2 = {
		id: 'node2',
		width: 100,
		height: 100,
		body: `
            <svg width="100" height="100">
            <circle cx="50" cy="50" r="40" fill="green" />
            <text x="50" y="50" text-anchor="middle" alignment-baseline="middle" fill="white">Node 2</text>
            </svg>
        `
	};

	// // Example 3: A custom Svelte component as the node body
	// import CustomNode from '../components/nodes/GPTCustomNode.svelte';

	// const node3 = {
	//     id: 'node3',
	//     width: 200,
	//     height: 100,
	//     body: `<CustomNode />`
	// };
</script>

<NodeElementContainer>
	{#each nodes as node (node.id)}
		{@html node.body}
	{/each}
</NodeElementContainer>
