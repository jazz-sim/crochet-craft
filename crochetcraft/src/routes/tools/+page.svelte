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
    <h1 id="main-title">Tools</h1>

    <p>A collection of tools.</p>
    {#each toolList as tool}
        <div>
            <a class="anchor" href={`/tools${tool.route}`}>{tool.name}</a>
        </div>
    {/each}
</div>

<style>
    #wrapper {
        margin: 1em 2em;
    }
</style>
