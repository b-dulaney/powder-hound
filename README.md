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

![A-Basin Snow Report Screenshot](https://github.com/b-dulaney/powder-hound/assets/52844767/2c5134b5-3b52-4088-8f0e-127d76fc23a2)

![Snowfall Alert Screenshot](https://github.com/b-dulaney/powder-hound/assets/52844767/dc23ceaf-39f9-477d-b214-8d6c6568c8dc)


## Tech Stack

SvelteKit, Go, Supabase, TypeScript, SkeletonUI, TailwindCSS, Vercel

## How It Works

- Weather data for each location is collected hourly from the CAIC point forecast [API](https://avalanche.state.co.us/weather/point-forecasts) via scheduled Supabase edge function
- Resort terrain data and avalanche forecasts are collected on regular intervals via web scrapers
  - See [PowderHound Go](https://github.com/b-dulaney/powder-hound-go) for details
- Emails are sent with [Resend](https://resend.com/overview)

## Roadmap

This is pretty informal for now as I'm building this project out in my spare time. With that said, here's a list of things that I would like to include eventually:

- More locations

- SMS OTP login

- SMS alerts

- Additional SSO providers

- CDOT road conditions

- Resort live feeds (lift cams, snow stakes, etc.)

- User-uploaded reports (think along the lines of AllTrails reviews - conditions reports, images, links to CAIC observations, etc)

## Feedback

If you have any feedback or features that you would like to see, please reach out to contact@powderhound.io or open an issue here.
