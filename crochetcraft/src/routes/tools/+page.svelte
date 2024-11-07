<script lang="ts">
    type ToolData = {
        name: string;
        route: string;
    };

    const toolList: ToolData[] = [
        {
            name: 'Curve Builder',
            route: '/curveBuilder',
        },
    ];
</script>

<div id="wrapper">
    <h3 class="h3" id="main-title">Tools</h3>

    <p>A collection of tools:</p>
    <ul class="list-disc">
        {#each toolList as tool}
            <li><a class="anchor" href={`/tools${tool.route}`}>{tool.name}</a></li>
        {/each}
    </ul>

    <p>Return back to the home page:</p>
    <a class="anchor" href={`/`}>← Go Home</a>
</div>

<style>
    #wrapper {
        margin: 1em 2em;
    }
    ul {
        padding: 20px;
    }
    h3 {
        padding-bottom: 20px;
    }
</style>
