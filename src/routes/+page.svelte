<script lang='ts'>
	import { onMount } from "svelte";
	import main from "./main";

    let canvas:HTMLCanvasElement;

    onMount(( ) => main(canvas))
</script>

<canvas width="1280" height="720" bind:this={canvas}></canvas>

<style>
    :global(html) {
        background-color: #999;
    }

    canvas {
        display: block;
        border: 1px solid black;
    }
</style>