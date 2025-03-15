<script lang="ts">
    import type { SvelteComponent } from 'svelte';
    import IconCard from '$components/icon-card/IconCard.svelte';

    // Style + variables for the modal:
    const cBase = 'card p-4 w-modal shadow-xl space-y-4 rounded-lg';
    const cHeader = 'text-2xl font-bold';
    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
    export let parent: SvelteComponent;
</script>

{#snippet use()}
    <p>
        Check out the user guide on the <a
            class="anchor"
            href="https://github.com/jazz-sim/crochet-craft/wiki">CrochetCraft GitHub wiki</a
        >!
    </p>
{/snippet}

{#snippet contribute()}
    <p>
        If you would like to request a feature, report a bug, or improve CrochetCraft, see
        documentation and guidelines at the <a
            class="anchor"
            href="https://github.com/jazz-sim/crochet-craft">CrochetCraft GitHub repository</a
        >.
    </p>
{/snippet}

{#snippet learn()}
    <p>
        There are many tutorials online for learning - a large collection of resources can be found
        in the <a class="anchor" href="https://www.reddit.com/r/crochet/wiki/quick_beginner_guide/"
            >r/crochet Reddit community wiki</a
        >.
    </p>
{/snippet}

{#snippet experiments()}
    While building the first version of CrochetCraft, the team made some <a
        class="anchor"
        href="/experiments"
        onclick={parent.onClose}>demos and tools</a
    >. These "mini-programs" are not production-ready.
{/snippet}

<div class={cBase}>
    <header class={cHeader}>
        <div class="flex items-center justify-center">
            <img src="/cc-logo-new-1-purple.png" width="65%" alt="CrochetCraft logo." />
        </div>
    </header>
    <div id="aboutBody">
        <div class="flex flex-col items-center justify-center">
            <p>
                CrochetCraft is a <a
                    class="anchor"
                    href="https://uwaterloo.ca/capstone-design/project-abstracts/2025-capstone-design-projects"
                    >Final Year Design Project (FYDP)</a
                > from a team of University of Waterloo Software Engineering 2025 students.
            </p>
        </div>
        <div class="mt-2 h-40 overflow-auto">
            <IconCard icon="fi fi-br-question" title="How do I use CrochetCraft?" content={use} />
            <IconCard
                icon="fi fi-br-code-simple"
                title="How can I contribute to CrochetCraft?"
                content={contribute}
            />
            <IconCard
                icon="fi fi-br-book-alt"
                title="Where can I learn to crochet?"
                content={learn}
            />
            <IconCard
                icon="fi fi-br-wrench-simple"
                title="I heard there's experiments..."
                content={experiments}
            />
        </div>
    </div>
    <footer class={parent.regionFooter}>
        <button class="btn {parent.buttonNeutral}" onclick={parent.onClose}>Close</button>
    </footer>
</div>
