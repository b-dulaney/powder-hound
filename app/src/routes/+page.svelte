<!--
// v0 by Vercel.
// https://v0.dev/t/RMJj8VEFsHd
-->

<script>
    import logo from '../public/powder-hound-logo.png';
    export let data 
</script>

<section class="w-full h-full bg-gray-900 text-white p-6">
    <div class="flex flex-row w-full justify-start items-center">
        <img src={logo} alt="Powder Hound Logo" class="w-24 h-24 mx-4 mb-4" />
        <h1 class="text-4xl font-bold">Powder Hound</h1>
    </div>

    <div class="grid grid-cols-4 gap-4 text-center p-8">
        <h2 class="text-xl font-semibold">Resort Name</h2>
        <h2 class="text-xl font-semibold">Recent Snowfall</h2>
        <h2 class="text-xl font-semibold">Upcoming Snowfall</h2>
        <h2 class="text-xl font-semibold">Base Depth</h2>
      </div>
    
    {#if data?.mountainsAndSnowfall?.length}
	<div class="grid grid-cols-1 gap-4 px-8">
        {#each data.mountainsAndSnowfall as {name, snowfall24Hours, snowfall72Hours}}
        <div class="bg-gray-800 p-4 rounded-lg cursor-pointer transform transition-all hover:scale-105">
            <div class="grid grid-cols-4 items-center">
              <h3 class="text-2xl font-semibold text-left">{name}</h3>
              <p class="text-gray-300 text-center">{snowfall24Hours} inches</p>
              <p class="text-gray-300 text-center">{snowfall72Hours} inches</p>
              <p class="text-gray-300 text-center">{Math.round((Math.random() * 100))} inches</p>
            </div>
          </div>
        {/each}
	</div>
    {/if}
	<div class="mt-6">
		<button
			class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
			>View More Resorts</button
		>
	</div>
</section>
