export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			avalanche_forecasts: {
				Row: {
					avalanche_summary: string | null;
					danger_levels: Json[] | null;
					forecast_url: string | null;
					issue_date: string | null;
					mountain_id: number;
					overall_danger_level: number | null;
					updated_at: string;
				};
				ComputedFields: never;
				Insert: {
					avalanche_summary?: string | null;
					danger_levels?: Json[] | null;
					forecast_url?: string | null;
					issue_date?: string | null;
					mountain_id?: number;
					overall_danger_level?: number | null;
					updated_at?: string;
				};
				Update: {
					avalanche_summary?: string | null;
					danger_levels?: Json[] | null;
					forecast_url?: string | null;
					issue_date?: string | null;
					mountain_id?: number;
					overall_danger_level?: number | null;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'avalanche_forecasts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'backcountry_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'avalanche_forecasts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'backcountry_overview';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'avalanche_forecasts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'mountains';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'avalanche_forecasts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'resort_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'avalanche_forecasts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'resort_overview';
						referencedColumns: ['mountain_id'];
					}
				];
			};
			caic_data: {
				Row: {
					cei: number | null;
					cnpcp_in: number | null;
					created_at: string;
					datetime: string;
					dew_point: number | null;
					mountain_id: number;
					ncpcp_in: number | null;
					relative_humidity: number | null;
					snowfall_in: number;
					temp: number;
					visbility_miles: number;
					weather_desc: string | null;
					wetbulb_temp: number | null;
					wind_deg_speed: string;
					wind_gust: number;
				};
				ComputedFields: never;
				Insert: {
					cei?: number | null;
					cnpcp_in?: number | null;
					created_at?: string;
					datetime: string;
					dew_point?: number | null;
					mountain_id: number;
					ncpcp_in?: number | null;
					relative_humidity?: number | null;
					snowfall_in: number;
					temp: number;
					visbility_miles: number;
					weather_desc?: string | null;
					wetbulb_temp?: number | null;
					wind_deg_speed: string;
					wind_gust: number;
				};
				Update: {
					cei?: number | null;
					cnpcp_in?: number | null;
					created_at?: string;
					datetime?: string;
					dew_point?: number | null;
					mountain_id?: number;
					ncpcp_in?: number | null;
					relative_humidity?: number | null;
					snowfall_in?: number;
					temp?: number;
					visbility_miles?: number;
					weather_desc?: string | null;
					wetbulb_temp?: number | null;
					wind_deg_speed?: string;
					wind_gust?: number;
				};
				Relationships: [];
			};
			debug_logs: {
				Row: {
					created_at: string;
					id: number;
					level: string;
					message: string;
					meta: Json | null;
				};
				ComputedFields: never;
				Insert: {
					created_at?: string;
					id?: number;
					level: string;
					message: string;
					meta?: Json | null;
				};
				Update: {
					created_at?: string;
					id?: number;
					level?: string;
					message?: string;
					meta?: Json | null;
				};
				Relationships: [];
			};
			mountains: {
				Row: {
					caic_code: string;
					display_name: string;
					lat: number;
					location_type: string;
					lon: number;
					model_elevation: number;
					mountain_id: number;
					pass: string | null;
					region: string;
					slug: string;
					state: string | null;
				};
				ComputedFields: never;
				Insert: {
					caic_code: string;
					display_name: string;
					lat: number;
					location_type: string;
					lon: number;
					model_elevation: number;
					mountain_id?: number;
					pass?: string | null;
					region: string;
					slug: string;
					state?: string | null;
				};
				Update: {
					caic_code?: string;
					display_name?: string;
					lat?: number;
					location_type?: string;
					lon?: number;
					model_elevation?: number;
					mountain_id?: number;
					pass?: string | null;
					region?: string;
					slug?: string;
					state?: string | null;
				};
				Relationships: [];
			};
			profile: {
				Row: {
					created_at: string;
					email: string;
					user_id: string;
				};
				ComputedFields: never;
				Insert: {
					created_at?: string;
					email: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					email?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			resort_conditions: {
				Row: {
					base_depth: number | null;
					display_name: string | null;
					expected_close_date: string | null;
					expected_open_date: string | null;
					lifts_open: number | null;
					lifts_url: string | null;
					mountain_id: number;
					runs_open: number | null;
					snow_overnight: number | null;
					snow_past_24h: number | null;
					snow_past_48h: number | null;
					snow_past_week: number | null;
					snow_stake_url: string | null;
					snow_total: number | null;
					snow_type: string | null;
					status: Database['public']['Enums']['resort_operating_status'];
					status_changed_at: string | null;
					status_evidence: string | null;
					status_source: string;
					total_lifts: number | null;
					total_runs: number | null;
					trails_url: string | null;
					updated_at: string | null;
				};
				ComputedFields: never;
				Insert: {
					base_depth?: number | null;
					display_name?: string | null;
					expected_close_date?: string | null;
					expected_open_date?: string | null;
					lifts_open?: number | null;
					lifts_url?: string | null;
					mountain_id: number;
					runs_open?: number | null;
					snow_overnight?: number | null;
					snow_past_24h?: number | null;
					snow_past_48h?: number | null;
					snow_past_week?: number | null;
					snow_stake_url?: string | null;
					snow_total?: number | null;
					snow_type?: string | null;
					status?: Database['public']['Enums']['resort_operating_status'];
					status_changed_at?: string | null;
					status_evidence?: string | null;
					status_source?: string;
					total_lifts?: number | null;
					total_runs?: number | null;
					trails_url?: string | null;
					updated_at?: string | null;
				};
				Update: {
					base_depth?: number | null;
					display_name?: string | null;
					expected_close_date?: string | null;
					expected_open_date?: string | null;
					lifts_open?: number | null;
					lifts_url?: string | null;
					mountain_id?: number;
					runs_open?: number | null;
					snow_overnight?: number | null;
					snow_past_24h?: number | null;
					snow_past_48h?: number | null;
					snow_past_week?: number | null;
					snow_stake_url?: string | null;
					snow_total?: number | null;
					snow_type?: string | null;
					status?: Database['public']['Enums']['resort_operating_status'];
					status_changed_at?: string | null;
					status_evidence?: string | null;
					status_source?: string;
					total_lifts?: number | null;
					total_runs?: number | null;
					trails_url?: string | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'resort_conditions_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'backcountry_detail';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'resort_conditions_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'backcountry_overview';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'resort_conditions_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'mountains';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'resort_conditions_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'resort_detail';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'resort_conditions_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'resort_overview';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'resort_conditions_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'backcountry_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'resort_conditions_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'backcountry_overview';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'resort_conditions_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'mountains';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'resort_conditions_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'resort_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'resort_conditions_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'resort_overview';
						referencedColumns: ['mountain_id'];
					}
				];
			};
			resort_snowfall_historical: {
				Row: {
					caic_snow_24h: number | null;
					created_at: string;
					date: string;
					mountain_id: number;
					resort_snow_24h: number | null;
				};
				ComputedFields: never;
				Insert: {
					caic_snow_24h?: number | null;
					created_at?: string;
					date: string;
					mountain_id: number;
					resort_snow_24h?: number | null;
				};
				Update: {
					caic_snow_24h?: number | null;
					created_at?: string;
					date?: string;
					mountain_id?: number;
					resort_snow_24h?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_resort_snowfall_historical_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'backcountry_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'public_resort_snowfall_historical_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'backcountry_overview';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'public_resort_snowfall_historical_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'mountains';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'public_resort_snowfall_historical_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'resort_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'public_resort_snowfall_historical_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'resort_overview';
						referencedColumns: ['mountain_id'];
					}
				];
			};
			resort_status_history: {
				Row: {
					changed_at: string;
					evidence: string | null;
					id: number;
					mountain_id: number;
					new_status: Database['public']['Enums']['resort_operating_status'];
					old_status: Database['public']['Enums']['resort_operating_status'] | null;
					source: string;
				};
				ComputedFields: never;
				Insert: {
					changed_at?: string;
					evidence?: string | null;
					id?: never;
					mountain_id: number;
					new_status: Database['public']['Enums']['resort_operating_status'];
					old_status?: Database['public']['Enums']['resort_operating_status'] | null;
					source: string;
				};
				Update: {
					changed_at?: string;
					evidence?: string | null;
					id?: never;
					mountain_id?: number;
					new_status?: Database['public']['Enums']['resort_operating_status'];
					old_status?: Database['public']['Enums']['resort_operating_status'] | null;
					source?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'resort_status_history_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'resort_conditions';
						referencedColumns: ['mountain_id'];
					}
				];
			};
			scraping_status: {
				Row: {
					display_name: string;
					error: string | null;
					id: number;
					success: boolean;
					time: string;
				};
				ComputedFields: never;
				Insert: {
					display_name: string;
					error?: string | null;
					id?: number;
					success: boolean;
					time?: string;
				};
				Update: {
					display_name?: string;
					error?: string | null;
					id?: number;
					success?: boolean;
					time?: string;
				};
				Relationships: [];
			};
			stale_snowfall_values: {
				Row: {
					mountain_id: number;
					stale_snow_past_24h: number | null;
					stale_snow_past_48h: number | null;
				};
				ComputedFields: never;
				Insert: {
					mountain_id: number;
					stale_snow_past_24h?: number | null;
					stale_snow_past_48h?: number | null;
				};
				Update: {
					mountain_id?: number;
					stale_snow_past_24h?: number | null;
					stale_snow_past_48h?: number | null;
				};
				Relationships: [
					{
						foreignKeyName: 'public_stale_snowfall_values_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'backcountry_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'public_stale_snowfall_values_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'backcountry_overview';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'public_stale_snowfall_values_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'mountains';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'public_stale_snowfall_values_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'resort_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'public_stale_snowfall_values_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'resort_overview';
						referencedColumns: ['mountain_id'];
					}
				];
			};
			user_alerts: {
				Row: {
					created_at: string;
					display_name: string | null;
					email: string;
					id: number;
					mountain_id: number | null;
					paused: boolean;
					threshold_inches: number;
					updated_at: string;
					user_id: string;
				};
				ComputedFields: never;
				Insert: {
					created_at?: string;
					display_name?: string | null;
					email: string;
					id?: number;
					mountain_id?: number | null;
					paused?: boolean;
					threshold_inches: number;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					display_name?: string | null;
					email?: string;
					id?: number;
					mountain_id?: number | null;
					paused?: boolean;
					threshold_inches?: number;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'user_alerts_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'backcountry_detail';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'user_alerts_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'backcountry_overview';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'user_alerts_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'mountains';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'user_alerts_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'resort_detail';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'user_alerts_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'resort_overview';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'user_alerts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'backcountry_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'user_alerts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'backcountry_overview';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'user_alerts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'mountains';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'user_alerts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'resort_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'user_alerts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: false;
						referencedRelation: 'resort_overview';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'user_alerts_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'profile';
						referencedColumns: ['user_id'];
					}
				];
			};
		};
		Views: {
			alert_thresholds: {
				Row: {
					display_name: string | null;
					mountain_id: number | null;
					snow_next_24h: number | null;
					snow_past_24h: number | null;
					snow_past_48h: number | null;
					updated_at: string | null;
				};
				ComputedFields: never;
				Relationships: [];
			};
			backcountry_detail: {
				Row: {
					avalanche_summary: string | null;
					current_temp: number | null;
					current_weather: string | null;
					daily_weather_conditions: Json | null;
					danger_levels: Json[] | null;
					display_name: string | null;
					forecast_url: string | null;
					hourly_forecast: Json | null;
					issue_date: string | null;
					location_type: string | null;
					mountain_id: number | null;
					next_24h_hourly_snowfall: Json | null;
					overall_danger_level: number | null;
					previous_snowfall_totals: Json | null;
					region: string | null;
					slug: string | null;
					snow_next_24h: number | null;
					snow_next_72h: number | null;
					snow_past_7d: number | null;
					state: string | null;
					temperature_range: Json | null;
					upcoming_snowfall_totals: Json | null;
				};
				ComputedFields: never;
				Relationships: [];
			};
			backcountry_overview: {
				Row: {
					display_name: string | null;
					location_type: string | null;
					mountain_id: number | null;
					overall_danger_level: number | null;
					region: string | null;
					slug: string | null;
					snow_next_24h: number | null;
					snow_next_72h: number | null;
					snow_past_24h: number | null;
					snow_past_48h: number | null;
					snow_past_7d: number | null;
					state: string | null;
				};
				ComputedFields: never;
				Relationships: [];
			};
			mountain_snowfall_forecast: {
				Row: {
					day: string | null;
					daytime_snowfall: number | null;
					mountain_id: number | null;
					nighttime_snowfall: number | null;
					prev_night_snowfall: number | null;
					slug: string | null;
				};
				ComputedFields: never;
				Relationships: [];
			};
			mountain_snowfall_historical: {
				Row: {
					day: string | null;
					daytime_snowfall: number | null;
					mountain_id: number | null;
					nighttime_snowfall: number | null;
					prev_night_snowfall: number | null;
					slug: string | null;
				};
				ComputedFields: never;
				Relationships: [];
			};
			resort_detail: {
				Row: {
					base_depth: number | null;
					closed: boolean | null;
					current_temp: number | null;
					current_weather: string | null;
					daily_weather_conditions: Json | null;
					display_name: string | null;
					expected_close_date: string | null;
					expected_open_date: string | null;
					hourly_forecast: Json | null;
					lifts_open: number | null;
					lifts_url: string | null;
					location_type: string | null;
					mountain_id: number | null;
					next_24h_hourly_snowfall: Json | null;
					previous_snowfall_totals: Json | null;
					region: string | null;
					runs_open: number | null;
					slug: string | null;
					snow_next_24h: number | null;
					snow_next_72h: number | null;
					snow_past_24h: number | null;
					snow_past_48h: number | null;
					snow_past_week: number | null;
					snow_stake_url: string | null;
					snow_total: number | null;
					snow_type: string | null;
					state: string | null;
					status: Database['public']['Enums']['resort_operating_status'] | null;
					temperature_range: Json | null;
					total_lifts: number | null;
					total_runs: number | null;
					trails_url: string | null;
					upcoming_snowfall_totals: Json | null;
					updated_at: string | null;
				};
				ComputedFields: never;
				Relationships: [];
			};
			resort_overview: {
				Row: {
					base_depth: number | null;
					closed: boolean | null;
					display_name: string | null;
					expected_close_date: string | null;
					expected_open_date: string | null;
					lifts_open: number | null;
					mountain_id: number | null;
					region: string | null;
					runs_open: number | null;
					slug: string | null;
					snow_next_24h: number | null;
					snow_next_72h: number | null;
					snow_past_24h: number | null;
					snow_past_48h: number | null;
					state: string | null;
					status: Database['public']['Enums']['resort_operating_status'] | null;
					total_lifts: number | null;
					total_runs: number | null;
				};
				ComputedFields: never;
				Relationships: [];
			};
			web_scraper_overview: {
				Row: {
					errors_per_day: Json[] | null;
					highest_failure_display_name: string | null;
					highest_failure_display_name_24h: string | null;
					highest_failure_percentage_failed: number | null;
					highest_failure_percentage_failed_24h: number | null;
					highest_failure_total_rows: number | null;
					highest_failure_total_rows_24h: number | null;
					overall_success_percentage: number | null;
					recent_scraping_status: Json | null;
					success_percentage_24h: number | null;
				};
				ComputedFields: never;
				Relationships: [];
			};
		};
		Functions: {
			count_errors_by_day: { Args: Record<PropertyKey, never>; Returns: Json[] };
			get_24_hour_snowfall_for_mountain: { Args: { id: number }; Returns: number };
			get_24h_alert_data: {
				Args: Record<PropertyKey, never>;
				Returns: {
					display_name: string;
					email: string;
					mountain_id: number;
					snow_next_24h: number;
					threshold_inches: number;
					updated_at: string;
					user_id: string;
				}[];
			};
			get_72_hour_snowfall_for_mountain: { Args: { id: number }; Returns: number };
			get_current_temperature_for_mountain: { Args: { id: number }; Returns: number };
			get_current_weather_desc: { Args: { id: number }; Returns: string };
			get_daily_weather_conditions: { Args: { mountain_id: number }; Returns: Json };
			get_display_name_with_highest_failure_count: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			get_display_name_with_highest_failure_count_last_24h: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			get_hourly_weather_data: { Args: { id: number }; Returns: Json };
			get_most_recent_timestamp: { Args: { mountain_id: number }; Returns: string };
			get_next_24h_hourly_snowfall: { Args: { id: number }; Returns: Json };
			get_overnight_alert_data: {
				Args: Record<PropertyKey, never>;
				Returns: {
					display_name: string;
					email: string;
					mountain_id: number;
					snow_past_24h: number;
					snow_past_48h: number;
					stale_snow_past_24h: number;
					stale_snow_past_48h: number;
					threshold_inches: number;
					updated_at: string;
					user_id: string;
				}[];
			};
			get_past_24_hour_snowfall_for_mountain: { Args: { id: number }; Returns: number };
			get_past_48_hour_snowfall_for_mountain: { Args: { id: number }; Returns: number };
			get_past_7_days_snowfall_for_mountain: { Args: { id: number }; Returns: number };
			get_previous_snowfall_total: { Args: { mountain_id: number }; Returns: Json };
			get_recent_scraping_status: { Args: Record<PropertyKey, never>; Returns: Json };
			get_success_percentage: { Args: Record<PropertyKey, never>; Returns: number };
			get_success_percentage_24h: { Args: Record<PropertyKey, never>; Returns: number };
			get_temperature_range: { Args: { id: number }; Returns: Json };
			get_upcoming_snowfall_total: { Args: { mountain_id: number }; Returns: Json };
			group_24h_forecast_alert_data: { Args: Record<PropertyKey, never>; Returns: Json };
			group_overnight_snowfall_alert_data: { Args: Record<PropertyKey, never>; Returns: Json };
			is_resort_closed: { Args: { resort_id: number }; Returns: boolean };
			set_resort_status: {
				Args: {
					p_evidence?: string;
					p_expected_close_date?: string;
					p_expected_open_date?: string;
					p_mountain_id: number;
					p_source: string;
					p_status: Database['public']['Enums']['resort_operating_status'];
				};
				Returns: boolean;
			};
			update_resort_snowfall_historical: { Args: Record<PropertyKey, never>; Returns: undefined };
			update_stale_snowfall_values: { Args: Record<PropertyKey, never>; Returns: undefined };
		};
		Enums: {
			alert_type: 'forecast' | 'overnight';
			resort_operating_status: 'open' | 'closed' | 'unknown';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			alert_type: ['forecast', 'overnight'],
			resort_operating_status: ['open', 'closed', 'unknown']
		}
	}
} as const;
