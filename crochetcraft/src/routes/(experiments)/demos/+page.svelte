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
            name: '2D Shears',
            route: '/shear',
        },
        {
            name: 'Iterative Forces',
            route: '/forces',
        },
        {
            name: '3D Shear (Inefficient - click at your own risk)',
            route: '/shear3d',
        },
        {
            name: 'Efficient Rendering - 3D Shear',
            route: '/efficient-shear3d',
        },
        {
            name: 'End to end testing purgatory',
            route: '/e2e-hell',
        },
    ];

    const crochetDemos: DemoData[] = [
        {
            name: 'Stitch Models',
            route: '/models',
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
