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
    <circle cx="12" cy="12" r="10" /> <path d="M8 12h8" /> <path d="M12 8v8" />
</svg>
