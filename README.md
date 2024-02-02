![Logo](https://powderhound-static-images.s3.us-east-2.amazonaws.com/logo-256px.png)

# PowderHound

Get the latest conditions and snow forecasts for Colorado's premier ski destinations. Receive customized snowfall alerts for your favorite resorts and backcountry spots. Built on top of high resolution weather data from the Colorado Avalanche Information Center (CAIC).

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

Live app: https://powderhound.io

Dev Preview: https://dev.powderhound.io

## Author

- [@b-dulaney](https://github.com/b-dulaney)

## Features

- Hourly weather forecasts for nearly 30 ski locations across Colorado
- Terrain conditions for resorts (base depth, lifts open, etc.)
- Avalanche info for backcountry locations
- Email alerts for snowfall thresholds at your favorite locations

## Tech Stack

SvelteKit, Supabase, Vite, Typescript, SkeletonUI, TailwindCSS, Vercel

## How It Works
- Weather data for each location is collected hourly from the CAIC point forecast [API](https://avalanche.state.co.us/weather/point-forecasts) via scheduled Supabase edge function
- Resort conditions data and Avalanche forecasts are collected with a web scraper
  - Web scraping is done via SvelteKit API route (AWS lambda function) using [Puppeteer](https://pptr.dev/)
- Cron jobs kick off email-alert edge functions at 4:30pm and 5:30am to send out forecast and overnight snowfall alerts when user-defined thresholds are met

## Roadmap

This is pretty informal for now as I'm building this project out in my spare time. With that said, here's a list of things that I would like to include eventually:

- Email/SMS OTP login

- SMS alerts

- Additional SSO providers

- Resort live feeds (lift cams, snow stakes, etc.)

- User-uploaded reports (think along the lines of AllTrails reviews - conditions reports, images, links to CAIC observations, etc)

## Feedback

If you have any feedback or features that you would like to see, please reach out to contact@powderhound.io or open an issue here.
