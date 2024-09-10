<script>
    import MainEditor from "../../components/main/MainEditor.svelte";
	import MainToolbar from "../../components/main/MainToolbar.svelte";
    import MainPreview from "../../components/main/MainPreview.svelte";
    import MainProperties from "../../components/main/MainProperties.svelte";

</script>

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body,html) {
		height: 100%;
		width: 100%;
		min-height: 100%;
		margin: 0;
		padding: 0;
	}

	#app {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.row {
		display: flex;
		flex-direction: row;
		flex: auto;
	}
</style>

<div id="app">
	<MainToolbar/>
	<div class="row">
		<MainEditor/>
		<MainPreview/>
		<MainProperties/>
	</div>
</div>