<script>
    let { type = "", onclick = null, abutton = "false", ahref = "", children } = $props();
</script>

{#if abutton === "true"}
    <a class={type} href={ahref}>
        {@render children()}
    </a>
{:else}
    <button class={type} onclick={onclick}>
        {@render children()}
    </button>
{/if}

<style>
    button, a {
        border: 0;
        border-radius: var(--border-radius-s);
        padding: 4px 5px;
        cursor: pointer;
        :global(p) {
            word-wrap: normal;
        }
        
    }
    a {
        color: var(--neutral-100);
        text-decoration: none;
        display: flex;
        align-items: center;
        
        gap: var(--space-2xs);
        :global(.icon) {
            color: var(--color-neutral-300);
            height: 1.25rem;
            margin-block: 0.25rem;
        }
    }

    .grow {
        width: 100%;
        padding-top: var(--space-s);
        padding-bottom: var(--space-s);
        display: flex;
        justify-content: center;
    }

    .warning {
        background-color: var(--color-accent-red-500);
        &:hover, &:focus-within {
            background-color: var(--color-accent-red-100);
        }
    }
    .accent {
        background-color: var(--color-accent-700);
        &:hover, &:focus-within {
            background-color: var(--color-accent-500);
        }
    }
    .accent-low {
        background-color: var(--color-accent-900);
        &:hover, &:focus-within {
            background-color: var(--color-neutral-600);
        }
    }
    .neutral {
        background-color: var(--color-neutral-700);
        &:hover, &:focus-within {
            background-color: var(--color-neutral-500);
        }
    }
    .transparent {
        background-color: transparent;
        &:hover, &:focus-within {
            background-color: var(--color-neutral-800);
        }
    }

    .card-neutral {
        background-color: var(--color-neutral-700);
    }
    .block-neutral {
        background-color: var(--color-neutral-700);
        &:hover {
            background-color: var(--color-neutral-600);
        }
    }
    .selected {
        background-color: var(--color-accent-700);
    }
</style>