<script>
    export let word;
    export let isFlipped = false;
    export let onClick;
  
    const handleClick = () => {
      if (!isFlipped) {
        onClick();
      }
    };
  </script>
  
  <button class="card" on:click={handleClick} type="button">
    {#if isFlipped}
      <p>{word}</p>
    {:else}
      <p>?</p>
    {/if}
  </button>
  
  <style>
    .card {
      cursor: pointer;
      width: 100px;
      height: 150px;
      text-align: center;
      border: 1px solid black;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #eee;
    }
  </style>
  