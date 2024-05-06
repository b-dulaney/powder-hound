<picture>
  <img alt="PowderHound Logo" src="https://powderhound-static-images.s3.us-east-2.amazonaws.com/logo-256px.png" width="150px">
</picture>

# PowderHound

Get the latest conditions and snow forecasts for Colorado's premier ski destinations. Receive customized snowfall alerts for your favorite resorts and backcountry spots. Built on top of high resolution weather data from the Colorado Avalanche Information Center (CAIC).

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

Live app: https://powderhound.io

Dev Preview: https://dev.powderhound.io

## Author

- [@b-dulaney](https://github.com/b-dulaney)

## Features

- Hourly weather forecasts for more than 30 ski locations across Colorado
- Terrain conditions for resorts (base depth, lifts open, etc.)
- Avalanche info for backcountry locations
- Email alerts for snowfall thresholds at your favorite locations

![A-Basin Snow Report Screenshot](https://github.com/b-dulaney/powder-hound/assets/52844767/36e01461-2c40-41e1-a957-7810ecd706ca)

![Snowfall Alert Screenshot](https://github.com/b-dulaney/powder-hound/assets/52844767/4781a9c1-b4c4-4bad-ae2e-c69642732588)

## Tech Stack

SvelteKit, Go, Supabase, Flowbite, TailwindCSS, Vercel

## How It Works

- Weather data for each location is collected hourly from the CAIC point forecast [API](https://avalanche.state.co.us/weather/point-forecasts) via scheduled Supabase edge function
- Resort terrain data and avalanche forecasts are collected on regular intervals via web scrapers
  - Terrain reports vary from resort to resort, but you'll always have the lift and run status, previous 24 hour snowfall, previous 48 hour snowfall, and base depth at a minimum
  - See [PowderHound Go](https://github.com/b-dulaney/powder-hound-go) for details
- Emails are sent with [Resend](https://resend.com/overview)
  - Forecast alert emails are sent at 4:30pm MT when snowfall over the next 24 hours is predicted to hit your threshold
  - Overnight alert emails are sent at 6:00am MT when recent snowfall hits your threshold (this can be overnight or previous 24 hour snowfall depending on how the resort reports it)

## Roadmap

This is pretty informal for now as I'm building this project out in my spare time. With that said, here's a list of things that I would like to include eventually:

- Resort and backcountry locations across the rest of the western US
- SMS OTP login
- SMS alerts
- Additional SSO providers
- Road conditions
- PWA functionality and notifications
- Resort live feeds (lift cams, snow stakes, etc.)
- User-uploaded reports (think along the lines of AllTrails reviews - conditions reports, images, links to CAIC observations, etc)

## Feedback

If you have any feedback or features that you would like to see, please reach out to contact@powderhound.io or open an issue here.
