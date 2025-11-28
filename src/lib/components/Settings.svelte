<script>
    import { settings, updateSetting } from "$lib/util/settings.svelte.js";
    
    function handleTtsToggle(event) {
        updateSetting('ttsEnabled', event.target.checked);
    }
</script>

<div class="settings-list">
    <div class="setting-item">
        <div class="setting-info">
            <span class="setting-label">Text-to-Speech</span>
            <span class="setting-description">Play Korean pronunciation on correct answers</span>
        </div>
        <label class="toggle-switch">
            <input 
                type="checkbox" 
                checked={settings.ttsEnabled}
                onchange={handleTtsToggle}
            />
            <span class="toggle-slider"></span>
        </label>
    </div>
</div>

<style>
    .settings-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
    }
    
    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-m);
        padding: var(--space-s);
        background-color: var(--color-neutral-700);
        border-radius: var(--border-radius-s);
    }
    
    .setting-info {
        display: flex;
        flex-direction: column;
        gap: var(--space-3xs);
    }
    
    .setting-label {
        color: var(--color-neutral-100);
        font-weight: var(--font-weight-semi-bold);
    }
    
    .setting-description {
        color: var(--color-neutral-400);
        font-size: var(--font-size-small);
    }
    
    /* Toggle switch styles */
    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 26px;
        flex-shrink: 0;
    }
    
    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .toggle-slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background-color: var(--color-neutral-600);
        border-radius: 26px;
        transition: var(--transition-normal);
    }
    
    .toggle-slider::before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 3px;
        bottom: 3px;
        background-color: var(--color-neutral-200);
        border-radius: 50%;
        transition: var(--transition-normal);
    }
    
    .toggle-switch input:checked + .toggle-slider {
        background-color: var(--color-accent-500);
    }
    
    .toggle-switch input:checked + .toggle-slider::before {
        transform: translateX(22px);
    }
    
    .toggle-switch input:focus-visible + .toggle-slider {
        outline: 2px solid var(--color-accent-400);
        outline-offset: 2px;
    }
</style>
