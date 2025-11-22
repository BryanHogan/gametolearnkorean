<script>
    let isMenuOpen = $state(false);
    let isInfoOpen = $state(false);
    let isSettingsOpen = $state(false);
    let headerEl;
    let infoModalEl = $state(false);
    let settingsModalEl = $state(false);

    const toggleMenu = (event) => {
        event.stopPropagation();
        isMenuOpen = !isMenuOpen;
    };

    const openInfo = () => {
        isInfoOpen = true;
        isSettingsOpen = false;
        isMenuOpen = false;
    };

    const openSettings = () => {
        isSettingsOpen = true;
        isInfoOpen = false;
        isMenuOpen = false;
    };

    const closeAll = () => {
        isMenuOpen = false;
        isInfoOpen = false;
        isSettingsOpen = false;
    };

    const handleWindowClick = (event) => {
        const target = event.target;
        if (headerEl?.contains(target)) return;
        if (infoModalEl?.contains(target)) return;
        if (settingsModalEl?.contains(target)) return;
        closeAll();
    };

    const handleEscape = (event) => {
        if (event.key === "Escape") {
            closeAll();
        }
    };
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleEscape} />

<div class="backdrop-area">
    <div class="header-container" bind:this={headerEl}>
        <header>
            <p class="brand">Game To Learn Korean</p>

            <button
                aria-controls="primary-navigation"
                aria-expanded={isMenuOpen}
                class="menu-toggle-button"
                onclick={toggleMenu}
                type="button"
            >
                <span class="visually-hidden">{isMenuOpen ? "Close menu" : "Open menu"}</span>
                <svg class="hamburger-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M4 6.5h16M4 12h16M4 17.5h16"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                </svg>
                <svg class="close-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M5.5 5.5 18.5 18.5M18.5 5.5 5.5 18.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                </svg>
            </button>

            <nav class="primary-navigation" id="primary-navigation">
                <ul role="list">
                    <li>
                        <button type="button" onclick={openInfo}>
                            Info
                        </button>
                    </li>
                    <li>
                        <button type="button" onclick={openSettings}>
                            Settings
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    </div>
</div>

{#if isInfoOpen}
    <div class="modal-backdrop">
        <section
            class="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Info"
            bind:this={infoModalEl}
        >
            <header class="modal-header">
                <h2>Info</h2>
                <button type="button" class="close" onclick={closeAll}>X</button>
            </header>
            <p>
                Practice Korean vocabulary with quick, mobile-friendly rounds.
            </p>
        </section>
    </div>
{/if}

{#if isSettingsOpen}
    <div class="modal-backdrop">
        <section
            class="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Settings"
            bind:this={settingsModalEl}
        >
            <header class="modal-header">
                <h2>Settings</h2>
                <button type="button" class="close" onclick={closeAll}>X</button>
            </header>
            <p>
                Settings are coming soon.
            </p>
        </section>
    </div>
{/if}

<style>
    .backdrop-area {
        width: 100%;
        height: var(--navbar-height);
    }

    .header-container {
        width: 100%;
        position: fixed;
        z-index: 10;
        background-color: color-mix(in srgb, var(--color-neutral-900) 95%, transparent);
    }

    .header-container::before {
        content: "";
        position: absolute;
        inset: 0;
        backdrop-filter: blur(5px);
        z-index: -1;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-inline: auto;
        max-width: var(--base-layout-max-width);
        padding-inline: var(--side-gap-padding);
        padding-block: var(--space-xs);
        height: var(--navbar-height);
    }

    .brand {
        margin: 0;
        color: var(--color-neutral-100);
        font-weight: var(--font-weight-semi-bold);
        letter-spacing: 0.01em;
        font-size: var(--font-size-base);
    }

    .primary-navigation ul {
        display: flex;
        gap: var(--space-m);
    }

    .primary-navigation button {
        padding: var(--space-s);
        color: var(--color-neutral-300);
        background: transparent;
        border: 0;
        cursor: pointer;
        transition: var(--transition-normal) color, var(--transition-normal) transform;
        font-weight: var(--font-weight-semi-bold);
        font-size: var(--font-size-base);
    }

    .primary-navigation button:hover,
    .primary-navigation button:focus-visible {
        color: var(--color-accent-500);
        transform: translateY(-1px);
    }

    .menu-toggle-button {
        display: none;
        background-color: transparent;
        padding: 0.5rem 0 0.5rem 0.5rem;
        border: 0;
        cursor: pointer;
        color: var(--color-neutral-100);
        align-items: center;
        justify-content: center;
        transition: var(--transition-normal) color;
    }

    .menu-toggle-button:hover,
    .menu-toggle-button:focus-visible {
        color: var(--color-accent-500);
    }

    .menu-toggle-button svg {
        width: 1.5rem;
        height: 1.5rem;
    }

    .close-icon {
        display: none;
    }

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

    .modal p {
        margin: 0;
        color: var(--color-neutral-200);
        line-height: var(--font-line-height);
    }

    .close {
        background: transparent;
        border: 0;
        color: var(--color-neutral-300);
        cursor: pointer;
        font-size: 1.5rem;
        line-height: 1;
    }

    .close:hover,
    .close:focus-visible {
        color: var(--color-accent-500);
    }

    @media only screen and (max-width: 27.999rem) {
        header {
            position: relative;
        }

        .primary-navigation ul {
            display: none;
        }

        .menu-toggle-button {
            display: inline-flex;
            position: absolute;
            z-index: 30;
            right: 1rem;
        }

        .menu-toggle-button[aria-expanded="true"] .close-icon {
            display: block;
        }

        .menu-toggle-button[aria-expanded="true"] .hamburger-icon {
            display: none;
        }

        .menu-toggle-button[aria-expanded="true"] ~ .primary-navigation {
            display: block;
            position: fixed;
            top: 0;
            right: 0;
            bottom: 0;
            width: 80%;
            margin-left: auto;
            box-shadow: 0 0 0 100vmax hsl(0 0% 0% / 0.7);
            background-color: var(--color-neutral-900);
            z-index: 20;
        }

        .menu-toggle-button[aria-expanded="true"] ~ .primary-navigation ul {
            margin-top: 20vh;
            display: grid;
            gap: 2rem;
            margin-left: max(3rem, 20vw);
        }
    }
</style>
