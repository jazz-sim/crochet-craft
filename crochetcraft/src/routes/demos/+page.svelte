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
            name: 'Sample UI',
            route: '/sample-ui',
        },
        {
            name: 'Iterative Forces',
            route: '/forces',
        },
        {
            name: '3D Shear',
            route: '/shear3d',
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
    <h3 class="h3" id="main-title">Demos</h3>

    <p>A collection of rendering demos:</p>
    <ul class="list-disc">
        {#each renderDemos as demo}
            <li><a class="anchor" href={`/demos${demo.route}`}>{demo.name}</a></li>
        {/each}
    </ul>

    <p>A collection of demonstration crochet patterns:</p>
    <ul class="list-disc">
        {#each crochetDemos as demo}
            <li><a class="anchor" href={`/demos${demo.route}`}>{demo.name}</a></li>
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
