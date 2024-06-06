<script lang="ts">
    import '../../styles/global.css';

    type DemoData = {
        name: string;
        route: string;
    };

    const demos: DemoData[] = [
        {
            name: 'Chain Stitch (ch)',
            route: '/chain',
        },
    ];
</script>

<div id="wrapper">
    <h1 id="main-title">Demos</h1>
    <p>A collection of demonstration crochet patterns.</p>

    {#each demos as demo}
        <div>
            <a href={`/demos${demo.route}`}>{demo.name}</a>
        </div>
    {/each}
</div>

<style>
    #wrapper {
        margin: 1em 2em;
    }
</style>
