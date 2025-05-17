<script lang="ts">
    import { getCurrentWindow } from '@tauri-apps/api/window';
    const appWindow = getCurrentWindow();

    let maximize: HTMLElement;
    let maximized: boolean = false;

    function handleMax() {
        maximized = !maximized;
        maximize.innerHTML = maximized ? '&#xE923;' : '&#xE922;';
        appWindow.toggleMaximize()
    }
</script>



<div data-tauri-drag-region class="titlebar">
    <button onclick={() => appWindow.minimize()}>
        &#xE921;
    </button>
    <button bind:this={maximize} onclick={handleMax}>
        &#xE922;
    </button>
    <button id="close" onclick={() => appWindow.close()}>
        &#xE8BB;
    </button>
</div>

<style>
    .titlebar {
        height: 40px;
        background: #16161657;
        user-select: none;
        display: flex;
        justify-content: flex-end;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
    }

    button {
        font-family: 'Segoe MDL2 Assets';
        display: inline-flex;
        background-color: transparent;
        border: none;
        color: white;
        justify-content: center;
        align-items: center;
        width: 45px;
        height: 40px;
        font-size: 10px;
        user-select: none;
        -webkit-user-select: none;
    }


    button:hover {
        background: #ffffff3e;
    }

    button#close:hover {
        background: rgba(255, 0, 0, 0.573);
    }
</style>