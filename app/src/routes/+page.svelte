<!--
// v0 by Vercel.
// https://v0.dev/t/RMJj8VEFsHd
-->

<script lang="ts">
	import { Avatar } from "@skeletonlabs/skeleton";
  import Logo from "../public/powder-hound-logo-new.png"
  import WRF from "../public/WRFExample.png"
</script>

<header class="py-8 xl:pt-16 bg-surface-100-800-token hero-gradient" id="hero">
  <div class="grid grid-cols-1 gap-4 md:gap-10 items-center">
    <div class="flex flex-col items-center text-center space-y-4 px-4">
      <img src={Logo} alt="Powder Hound Logo" class="w-28 h-28 lg:w-40 lg:h-40" />
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
  <div class="mx-auto w-full max-w-6xl pt-16 pb-8 px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-start">
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
           HRRR</a> forecasts to provide the most accurate snowfall predictions for Colorado's premier ski destinations.</p>
           <hr class="opacity-20">
           <p>Weather forecasts are available up to 72 hours in advance and are updated hourly. Accumulated snowfall is updated constantly, so you'll always have the full picture when deciding where to ride.
           </p>
          </div>
          <div class="card">
            <section class="p-4">
              <h3 class="h3">CAIC Point Forecasts</h3>
              <p>CAIC Point Forecasts are broken down into 1 hour data points for nearly every resort and mountain pass in the state. 
                For those interested in learning more about the underlying models and methods, check out the CAIC's 
                <a class="anchor" rel="no-referrer" target="_blank" href="https://avalanche.state.co.us/weather/forecast-models/about">about</a>
                page.</p>
            </section>
            <footer class="card-footer mt-2 flex justify-center"><img src={WRF} alt="CAIC forecast graph" class="rounded-lg max-h-56"/></footer>
          </div>
    </div>
  </div>
</section>

<section id="alerts" class="bg-surface-100-800-token alerts-gradient">
  <div class="mx-auto w-full max-w-6xl py-8 px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-start">
      <div class="space-y-4 md:order-last">
        <h2 class="h2">Tailored Alerts</h2>      
<p>Sign up for alerts and you'll get a text when it's piling up on your favorite tree runs. Just pick the locations and snowfall thresholds, and we'll let you know when it's going to be a pow day.</p>

      </div>
      <div class="grid grid-cols-[auto_1fr] gap-2 py-2">
        <Avatar src={Logo} width="w-12" />
        <div class="card p-4 variant-filled-tertiary rounded-tl-none space-y-2">
          <header class="flex justify-between items-center">
            <p class="font-bold">Powder Hound</p>
            <small class="opacity-50">5:00 am</small>
          </header>
          <p>It's coming down! Copper Mountain has received 12" of snow since midnight.</p>
        </div>
      </div>


    </div>
  </div>
</section>

<section id="passes" class="bg-surface-100-800-token passes-gradient">
  <div class="mx-auto w-full max-w-6xl py-8 px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-start">
      <div class="space-y-4">
        <h2 class="h2">Beyond Passes</h2>   
        <p>Whether you ride a season pass, an independent mountain, or something a little more out there - we've got you covered. Powder Hound currently provides forecasts for 20+ mountains and backcountry zones across Colorado .</p>
      </div>
      <div class="flex justify-center gap-2 md:py-16">
        <a class="btn variant-ghost-primary" href="/conditions">
          <div class="flex items-center gap-2">
            <span>View Mountains</span>
            <i class="fa-solid fa-chevron-right" style="color: variant-filled-primary;"></i>
          </div>
        </a>
        </div>
      </section>
