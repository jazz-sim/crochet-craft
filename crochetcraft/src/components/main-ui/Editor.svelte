<script>
    let text = '';
    function submitText() {
        console.log(`sussy baka: ${text}`);
    }
</script>

<div id="editor">
    <p>Enter your pattern below:</p>
    <textarea bind:value={text}></textarea>
    <button on:click={submitText}>Submit</button>
</div>

<style>
    #editor {
        background-color: lightblue;
    }
</style>
