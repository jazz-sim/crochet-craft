<script lang="ts">
    import IconCard from '$components/icon-card/IconCard.svelte';
    import type { Snippet } from 'svelte';

    // Routes for all the demos/tools:
    type ExperimentData = {
        name: string;
        icon: string;
        content: Snippet;
    };

    const ExperimentDemos: ExperimentData[] = [
        {
            name: 'Debug Spheres',
            icon: 'fi fi-br-sphere',
            content: debugSphere,
        },
        {
            name: 'Cubic Spline (2D) Example',
            icon: 'fi fi-br-circle-nodes',
            content: cubicSpline,
        },
        {
            name: 'Curve Builder',
            icon: 'fi fi-br-curve-alt',
            content: curveBuilder,
        },
        {
            name: 'Stitch Models',
            icon: 'fi fi-br-model-cube',
            content: stitchModels,
        },
        {
            name: 'Iterative Forces Example',
            icon: 'fi fi-br-magnet',
            content: iterativeForces,
        },
        {
            name: '2D Shears Example',
            icon: 'fi fi-br-angle',
            content: TwoDShears,
        },
        {
            name: '3D Shears Example (Inefficient)',
            icon: 'fi fi-br-tachometer-slow',
            content: ThreeDShearsSlow,
        },
        {
            name: '3D Shears Example (Efficient)',
            icon: 'fi fi-br-tachometer-fast',
            content: ThreeDShearsFast,
        },
        {
            name: 'E2E Tests',
            icon: 'fi fi-br-quiz',
            content: E2E,
        },
    ];
</script>

{#snippet debugSphere()}<p>Placing 3D points on a Three.js canvas.</p>
    <a class="anchor" href={'experiments/debug-sphere'}>Go →</a>{/snippet}
{#snippet cubicSpline()}<p>
        Plot of a cubic spline - which is made of piecewise third-order polynomials that pass
        through control points.
    </p>
    <a class="anchor" href={'experiments/spline'}>Go →</a>{/snippet}
{#snippet curveBuilder()}<p>
        Visualize different curves; by choosing the function type and the interpolation count.
    </p>
    <a class="anchor" href={'experiments/curve-builder'}>Go →</a>{/snippet}
{#snippet stitchModels()}<p>View each individual stitch model!</p>
    <a class="anchor" href={'experiments/models'}> Go →</a>{/snippet}
{#snippet iterativeForces()}<p>Shaping models through physics...</p>
    <a class="anchor" href={'experiments/forces'}>Go →</a>{/snippet}
{#snippet TwoDShears()}<p>Demonstration of a kind of an affine transformation.</p>
    <a class="anchor" href={'experiments/shear'}>Go →</a>{/snippet}
{#snippet ThreeDShearsSlow()}
    <p><i>Warning: this example is super slow, so click at your own risk.</i></p>
    <a class="anchor" href={'experiments/shear3d'}>Go →</a>
{/snippet}
{#snippet ThreeDShearsFast()}<p>3D shear mapping with a ton of points.</p>
    <a class="anchor" href={'experiments/efficient-shear3d'}>Go →</a>{/snippet}
{#snippet E2E()}<p>Basic crochet patterns for debugging.</p>
    <a class="anchor" href={'experiments/e2e-testing'}>Go →</a>{/snippet}

<div
    class="flex h-full min-h-full flex-row flex-wrap content-start items-center justify-center gap-5 overflow-y-scroll"
>
    {#each ExperimentDemos as { name, icon, content }}
        <IconCard {icon} title={name} {content} />
    {/each}
</div>
