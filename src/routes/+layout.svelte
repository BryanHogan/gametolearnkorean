<script>
    import "../styles/reset.css";
    import "../styles/var.css";
    import "../styles/global.css";
    import "../styles/util.css";
    import Header from "$lib/components/Header.svelte";
    let { children } = $props();
</script>

<Header />
{@render children()}
