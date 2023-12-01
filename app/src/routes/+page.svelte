<!--
// v0 by Vercel.
// https://v0.dev/t/RMJj8VEFsHd
-->

<script lang="ts">
	import { Avatar } from "@skeletonlabs/skeleton";
  import Logo from "../public/powder-hound-logo-new.png"
  import WRF from "../public/WRFExample.png"
</script>

<header class="py-8 bg-surface-100-800-token hero-gradient" id="hero">
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-10 items-center">
    <div class="flex flex-col items-center xl:items-start text-center xl:text-left space-y-4 px-4">
      <img src={Logo} alt="Powder Hound Logo" class="w-28 h-28" />
      <h1 class="h1 text-5xl">You'll never miss another powder day.</h1>
      <p class="text-xl">View the latest conditions, get accurate predictions, and receive customized snowfall alerts - all 100% free.</p>
      <div class="flex gap-4">
        <a class="btn variant-ghost-primary" href="/conditions">
          <div class="flex items-center gap-2">
            <span>View Conditions</span>
            <i class="fa-solid fa-chevron-right" style="color: variant-filled-primary;"></i>
          </div>
        </a>
        <a class="btn bg-gradient-to-br variant-gradient-primary-secondary" href="/signup">Sign Up</a>
      </div>
      </div>
    </div>
</header>

<section id="forecasts" class="bg-surface-100-800-token built-for-gradient">
  <div class="mx-auto w-full max-w-7xl py-16 px-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-10 items-start">
      <div class="space-y-4">
        <h2 class="h2">Built for Colorado</h2>
        <p>Powder Hound sources weather data directly from the 
          <a class="anchor" target="_blank" rel="no-referrer" href="https://avalanche.state.co.us/">Colorado Avalanche Information Center</a> (CAIC) in combination
          with NOAA 
          <a class="anchor" target="_blank" rel="no-referrer"
           href="https://www.ncei.noaa.gov/products/weather-climate-models/global-forecast">
           GFS</a>
           and <a class="anchor" target="_blank" rel="no-referrer"
           href="https://rapidrefresh.noaa.gov/hrrr/">
           HRRR</a> forecasts to provide the most accurate snowfall predictions for Colorado's ski resorts and backcountry.</p>  
           <div class="card">
            <header class="card-header"><img src={WRF} alt="CAIC forecast graph" class="w-96 h-48"/></header>
            <section class="p-4">
              <h3 class="h3">CAIC Point Forecasts</h3>
              <p>CAIC Point Forecasts are broken down into 1 hour timesteps for nearly every resort and mountain pass in the state. 
                For those interested in learning more about the underlying models and methods, check out the CAIC's 
                <a class="anchor" rel="no-referrer" target="_blank" href="https://avalanche.state.co.us/weather/forecast-models/about">about</a>
                page.</p>
            </section>
          </div>
          </div>
    </div>
  </div>
</section>

<section id="alerts" class="bg-surface-100-800-token alerts-gradient">
  <div class="mx-auto w-full max-w-7xl py-8 px-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-10 items-start">
      <div class="space-y-4">
        <h2 class="h2">Tailored Alerts</h2>      
<div class="grid grid-cols-[auto_1fr] gap-2">
	<Avatar src={Logo} width="w-12" />
	<div class="card p-4 variant-filled-tertiary rounded-tl-none space-y-2">
		<header class="flex justify-between items-center">
			<p class="font-bold">Powder Hound</p>
			<small class="opacity-50">5:00 am</small>
		</header>
		<p>It's coming down! Copper Mountain has received 12" of snow since midnight.</p>
	</div>
</div>
<p>Sign up for alerts and we'll send you a text when its piling up on your favorite tree runs.</p>
  <p>Pick the locations and snowfall thresholds, and we'll let you know when its going to be a pow day.</p>

      </div>
    </div>
  </div>
</section>

<section id="passes" class="bg-surface-100-800-token">
  <div class="mx-auto w-full max-w-7xl py-8 px-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-10 items-start">
      <div class="space-y-4">
        <h2 class="h2">Beyond Passes</h2>   
        <p>Whether you ride a big name pass or a small independent mountain - we've got you covered. We currently provide forecasts for 20 mountains and counting across Colroado.</p>
        <div class="flex justify-center gap-2">
        <a class="btn variant-ghost-primary" href="/conditions">
          <div class="flex items-center gap-2">
            <span>View Mountains</span>
            <i class="fa-solid fa-chevron-right" style="color: variant-filled-primary;"></i>
          </div>
        </a>
        </div>
      </section>