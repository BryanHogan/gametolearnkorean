<script>
    import Icons from "$lib/components/icons/index.js";
    
    let { isOpen = false, title = "", onClose = () => {}, size = "default", children } = $props();
    
    let modalEl = $state(null);
    
    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };
    
    const handleKeydown = (event) => {
        if (event.key === "Escape" && isOpen) {
            onClose();
        }
        if (event.key === "Enter" || event.key === " ") {
            if (event.target === event.currentTarget) {
                onClose();
            }
        }
    };
    
    const handleClose = () => {
        onClose();
    };
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" onclick={handleBackdropClick}>
        <section
            class="modal"
            class:modal-large={size === "large"}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            bind:this={modalEl}
        >
            <header class="modal-header">
                <h2>{title}</h2>
                <button type="button" class="close" onclick={handleClose}>
                    <Icons.x class="close-icon" />
                </button>
            </header>
            
            {@render children()}
        </section>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background-color: hsl(0 0% 0% / 0.65);
        display: grid;
        place-items: center;
        padding: var(--space-m);
        z-index: 40;
    }

    .modal {
        background-color: var(--color-neutral-800);
        color: var(--color-neutral-100);
        padding: var(--space-l);
        border-radius: var(--border-radius-m);
        box-shadow: var(--box-shadow-m);
        width: min(24rem, 100%);
        display: grid;
        gap: var(--space-m);
        max-height: 80vh;
        overflow: hidden;
    }
    
    .modal-large {
        width: min(32rem, 100%);
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-s);
    }

    .modal h2 {
        margin: 0;
        font-size: var(--text-size-xl);
    }

    .close {
        background: transparent;
        border: 0;
        color: var(--color-neutral-300);
        cursor: pointer;
        padding: var(--space-xs);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--border-radius-s);
        transition: var(--transition-normal) color, var(--transition-normal) background-color;
    }

    .close:hover,
    .close:focus-visible {
        color: var(--color-accent-500);
        background-color: var(--color-neutral-700);
    }
    
    .close :global(.close-icon) {
        width: 1.25rem;
        height: 1.25rem;
    }
</style>
