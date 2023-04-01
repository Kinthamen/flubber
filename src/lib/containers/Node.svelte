<script lang="ts">
    export let name: string;
    export let email: string;

    const data = {
        name: name,
        email: email,
    }
</script>

<div>
    <slot {data}/>
</div>