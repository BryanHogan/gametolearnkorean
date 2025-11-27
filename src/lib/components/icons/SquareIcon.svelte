<script>
    let { ...rest } = $props();
    let strokeWidth = 2;
</script>

<svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    stroke="currentColor"
    stroke-width={strokeWidth}
    {...rest}
>
    <rect width="18" height="18" x="3" y="3" rx="2" fill="currentColor" />
</svg>
