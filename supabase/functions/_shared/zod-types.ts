import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

// All types and schemas below were generated from the OpenWeather API responses for the OneCall API forecast and aggregation endpoints.
// https://openweathermap.org/api/one-call-3

export const TempSchema = z.object({
    "day": z.number(),
    "min": z.number(),
    "max": z.number(),
    "night": z.number(),
    "eve": z.number(),
    "morn": z.number(),
});
export type Temp = z.infer<typeof TempSchema>;

export const FeelsLikeSchema = z.object({
    "day": z.number(),
    "night": z.number(),
    "eve": z.number(),
    "morn": z.number(),
});
export type FeelsLike = z.infer<typeof FeelsLikeSchema>;

export const WeatherSchema = z.object({
    "id": z.number(),
    "main": z.string(),
    "description": z.string(),
    "icon": z.string(),
});
export type Weather = z.infer<typeof WeatherSchema>;

export const DailySchema = z.object({
    "dt": z.number(),
    "sunrise": z.number(),
    "sunset": z.number(),
    "moonrise": z.number(),
    "moonset": z.number(),
    "moon_phase": z.number(),
    "summary": z.string(),
    "temp": TempSchema,
    "feels_like": FeelsLikeSchema,
    "pressure": z.number(),
    "humidity": z.number(),
    "dew_point": z.number(),
    "wind_speed": z.number(),
    "wind_deg": z.number(),
    "wind_gust": z.number().optional(),
    "weather": z.array(WeatherSchema),
    "clouds": z.number(),
    "pop": z.number(),
    "uvi": z.number(),
    "snow": z.union([z.number(), z.null()]).optional(),
});
export type Daily = z.infer<typeof DailySchema>;

export const CurrentSchema = z.object({
    "dt": z.number(),
    "sunrise": z.number(),
    "sunset": z.number(),
    "temp": z.number(),
    "feels_like": z.number(),
    "pressure": z.number(),
    "humidity": z.number(),
    "dew_point": z.number(),
    "uvi": z.number(),
    "clouds": z.number(),
    "visibility": z.number(),
    "wind_speed": z.number(),
    "wind_deg": z.number(),
    "wind_gust": z.number().optional(),
    "weather": z.array(WeatherSchema),
});
export type Current = z.infer<typeof CurrentSchema>;

export const DailyForecastSchema = z.object({
    "lat": z.number(),
    "lon": z.number(),
    "timezone": z.string(),
    "timezone_offset": z.number(),
    "current": CurrentSchema,
    "daily": z.array(DailySchema),
});
export type DailyForecast = z.infer<typeof DailyForecastSchema>;

export const MaxSchema = z.object({
    "speed": z.number(),
    "direction": z.number(),
});
export type Max = z.infer<typeof MaxSchema>;

export const WindSchema = z.object({
    "max": MaxSchema,
});
export type Wind = z.infer<typeof WindSchema>;

export const TemperatureSchema = z.object({
    "min": z.number(),
    "max": z.number(),
    "afternoon": z.number(),
    "night": z.number(),
    "evening": z.number(),
    "morning": z.number(),
});
export type Temperature = z.infer<typeof TemperatureSchema>;

export const PrecipitationSchema = z.object({
    "total": z.number(),
});
export type Precipitation = z.infer<typeof PrecipitationSchema>;

export const CloudCoverSchema = z.object({
    "afternoon": z.number(),
});
export type CloudCover = z.infer<typeof CloudCoverSchema>;

export const DailyAggregateSchema = z.object({
    "lat": z.number(),
    "lon": z.number(),
    "tz": z.string(),
    "date": z.string(),
    "units": z.string(),
    "cloud_cover": CloudCoverSchema,
    "humidity": CloudCoverSchema,
    "precipitation": PrecipitationSchema,
    "temperature": TemperatureSchema,
    "pressure": CloudCoverSchema,
    "wind": WindSchema,
});
export type DailyAggregate = z.infer<typeof DailyAggregateSchema>;
