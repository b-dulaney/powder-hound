import type { PostgrestError } from '@supabase/supabase-js';
import type { Database as DatabaseGenerated } from './supabase-generated.types';
import type { MergeDeep } from 'type-fest';
import type dayjs from 'dayjs';

export type TemperatureRange = {
	date: string;
	low_temp: number;
	high_temp: number;
	snowfall: number;
};

export type AlertThreshold = {
	id: number;
	name: string;
	threshold: number;
};

export type DailyWeatherCondition = {
	date: string;
	daily_weather: string;
};

export type SnowfallTotal = {
	date: string;
	snowfall_total: number;
};

export type HourlyWeatherData = {
	datetime: string;
	temp: number;
	wind_gust: number;
	snowfall: number;
	weather_desc: string;
	wind_deg_speed: string;
};

export type AvalancheRating = {
	level: 0 | 1 | 2 | 3 | 4 | 5;
	rating: 'No Rating' | 'Low' | 'Moderate' | 'Considerable' | 'High' | 'Extreme';
};

export type AvalancheDangerLevel = {
	date: string | dayjs.Dayjs;
	above_treeline: AvalancheRating;
	near_treeline: AvalancheRating;
	below_treeline: AvalancheRating;
};

export type Database = MergeDeep<
	DatabaseGenerated,
	{
		public: {
			Views: {
				resort_overview: {
					Row: {
						mountain_id: number;
						display_name: string;
						slug: string;
						location_type: string;
						current_temp: number;
						current_weather: string;
						base_depth: number;
						runs_open: number;
						total_runs: number;
						lifts_open: number;
						total_lifts: number;
						snow_past_24h: number;
						snow_past_48h: number;
						snow_next_24h: number;
						region: string;
					};
				};
				backcountry_overview: {
					Row: {
						mountain_id: number;
						display_name: string;
						slug: string;
						location_type: string;
						current_temp: number;
						current_weather: string;
						snow_next_24h: number;
						snow_next_72h: number;
						snow_past_24h: number;
						snow_past_7d: number;
						region: string;
						overall_danger_level: number;
					};
				};
				backcountry_detail: {
					Row: {
						current_temperature: number;
						current_weather: string;
						display_name: string;
						location_type: string;
						snow_past_7d: number;
						snow_next_72h: number;
						mountain_id: number;
						region: string;
						slug: string;
						hourly_forecast: HourlyWeatherData[];
						daily_weather_conditions: DailyWeatherCondition[];
						previous_snowfall_totals: SnowfallTotal[];
						upcoming_snowfall_totals: SnowfallTotal[];
						temperature_range: TemperatureRange[];
						avalanche_summary: string | null;
						issue_date: string | null;
						overall_danger_level: number;
						danger_levels: AvalancheDangerLevel[];
						forecast_url: string;
					};
				};
				resort_detail: {
					Row: {
						current_temp: number;
						current_weather: string;
						display_name: string;
						location_type: string;
						snow_next_72h: number;
						snow_past_7d: number;
						mountain_id: number;
						region: string;
						slug: string;
						base_depth: number;
						total_lifts: number;
						lifts_open: number;
						total_runs: number;
						runs_open: number;
						snow_past_24h: number;
						snow_past_48h: number;
						snow_past_week: number | null;
						snow_total: number | null;
						snow_type: string | null;
						snow_stake_url: string | null;
						updated_at: string;
						lifts_url: string;
						trails_url: string;
						hourly_forecast: HourlyWeatherData[];
						daily_weather_conditions: DailyWeatherCondition[];
						previous_snowfall_totals: SnowfallTotal[];
						upcoming_snowfall_totals: SnowfallTotal[];
						temperature_range: TemperatureRange[];
					};
				};
			};
			Tables: {
				profile: {
					Row: {
						id: number;
						fist_name: string | null;
						last_name: string | null;
						email: string | null;
						user_id: string | null;
						favorites: number[];
						alert_thresholds: AlertThreshold[];
					};
				};
				resort_conditions: {
					Row: {
						mountain_id: number;
						display_name: string;
						base_depth: number;
						total_lifts: number;
						lifts_open: number;
						lifts_open_percent: number;
						total_runs: number;
						runs_open: number;
						runs_open_percent: number;
						snow_past_24h: number;
						snow_past_48h: number;
						snow_past_week: number | null;
						snow_total: number | null;
						snow_type: string | null;
						website_url: string;
						lifts_url: string;
						trails_url: string;
						snow_stake_url: string | null;
						updated_at: string;
					};
				};
				resort_web_elements: {
					Row: {
						mountain_id: number;
						conditions_url: string;
						trail_report_url: string | null;
						base_depth_el: string;
						lifts_open_el: string | null;
						runs_open_el: string | null;
						snow_past_24h_el: string;
						snow_past_48h_el: string;
						snow_past_week_el: string | null;
						snow_total_el: string | null;
						snow_type_el: string | null;
					};
				};
				avalanche_forecasts: {
					Row: {
						mountain_id: number;
						avalanche_summary: string | null;
						issue_date: string | null;
						overall_danger_level: number | null;
						danger_levels: AvalancheDangerLevel[];
						forecast_url: string | null;
						updated_at: string;
					};
					Update: {
						avalanche_summary?: string | null;
						danger_levels?: AvalancheDangerLevel[] | null;
						forecast_url?: string | null;
						issue_date?: string | null;
						mountain_id?: number;
						overall_danger_level?: number | null;
						updated_at?: string;
					};
				};
			};
		};
	}
>;

export type Tables<T extends keyof Database['public']['Tables']> =
	Database['public']['Tables'][T]['Row'];

export type Views<T extends keyof Database['public']['Views']> =
	Database['public']['Views'][T]['Row'];

export type Mountain = Tables<'mountains'>;
export type CaicData = Tables<'caic_data'>;
export type Profile = Tables<'profile'>;
export type AvalancheForecast = Tables<'avalanche_forecasts'>;
export type ResortConditions = Tables<'resort_conditions'>;
export type ResortWebElements = Tables<'resort_web_elements'>;
export type ResortOverview = Views<'resort_overview'>;
export type ResortDetail = Views<'resort_detail'>;
export type BackcountryOverview = Views<'backcountry_overview'>;
export type BackcountryDetail = Views<'backcountry_detail'>;

type TableTypes =
	| AvalancheForecast
	| Mountain
	| CaicData
	| ResortConditions
	| ResortWebElements
	| Profile;

export type DbResult<T extends TableTypes> = {
	data: T[] | null;
	error: PostgrestError | null;
};
