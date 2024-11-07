<script lang="ts">
    type DemoData = {
        name: string;
        route: string;
    };

    const renderDemos: DemoData[] = [
        {
            name: 'Debug sphere list',
            route: '/debug-sphere',
        },
        {
            name: 'Cubic Spline (1-dimensional)',
            route: '/spline',
        },
        {
            name: 'Iterative Forces',
            route: '/forces',
        },
    ];

    const crochetDemos: DemoData[] = [
        {
            name: 'Chain Stitch (ch)',
            route: '/chain',
        },
    ];
</script>

<div id="wrapper">
    <h1 id="main-title">Demos</h1>

    <p>A collection of rendering demos.</p>
    {#each renderDemos as demo}
        <div>
            <a class="anchor" href={`/demos${demo.route}`}>{demo.name}</a>
        </div>
    {/each}

    <p>A collection of demonstration crochet patterns.</p>
    {#each crochetDemos as demo}
        <div>
            <a class="anchor" href={`/demos${demo.route}`}>{demo.name}</a>
        </div>
    {/each}
</div>

<style>
    #wrapper {
        margin: 1em 2em;
    }
</style>
