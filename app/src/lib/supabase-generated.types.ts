export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
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
						referencedRelation: 'mountain_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'avalanche_forecasts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'mountain_overview';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'avalanche_forecasts_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'mountains';
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
			mountains: {
				Row: {
					caic_code: string;
					display_name: string;
					lat: number;
					location_type: string;
					lon: number;
					model_elevation: number;
					mountain_id: number;
					region: string;
					slug: string;
				};
				Insert: {
					caic_code: string;
					display_name: string;
					lat: number;
					location_type: string;
					lon: number;
					model_elevation: number;
					mountain_id?: number;
					region: string;
					slug: string;
				};
				Update: {
					caic_code?: string;
					display_name?: string;
					lat?: number;
					location_type?: string;
					lon?: number;
					model_elevation?: number;
					mountain_id?: number;
					region?: string;
					slug?: string;
				};
				Relationships: [];
			};
			profile: {
				Row: {
					alert_thresholds: Json[] | null;
					email: string | null;
					favorites: number[] | null;
					first_name: string | null;
					id: number;
					last_name: string | null;
					user_id: string | null;
				};
				Insert: {
					alert_thresholds?: Json[] | null;
					email?: string | null;
					favorites?: number[] | null;
					first_name?: string | null;
					id?: number;
					last_name?: string | null;
					user_id?: string | null;
				};
				Update: {
					alert_thresholds?: Json[] | null;
					email?: string | null;
					favorites?: number[] | null;
					first_name?: string | null;
					id?: number;
					last_name?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'profile_user_id_fkey';
						columns: ['user_id'];
						isOneToOne: false;
						referencedRelation: 'users';
						referencedColumns: ['id'];
					}
				];
			};
			resort_conditions: {
				Row: {
					base_depth: number | null;
					display_name: string | null;
					lifts_open: number | null;
					lifts_url: string | null;
					mountain_id: number;
					runs_open: number | null;
					snow_past_24h: number | null;
					snow_past_48h: number | null;
					snow_past_week: number | null;
					snow_stake_url: string | null;
					snow_total: number | null;
					snow_type: string | null;
					total_lifts: number | null;
					total_runs: number | null;
					trails_url: string | null;
					updated_at: string | null;
				};
				Insert: {
					base_depth?: number | null;
					display_name?: string | null;
					lifts_open?: number | null;
					lifts_url?: string | null;
					mountain_id: number;
					runs_open?: number | null;
					snow_past_24h?: number | null;
					snow_past_48h?: number | null;
					snow_past_week?: number | null;
					snow_stake_url?: string | null;
					snow_total?: number | null;
					snow_type?: string | null;
					total_lifts?: number | null;
					total_runs?: number | null;
					trails_url?: string | null;
					updated_at?: string | null;
				};
				Update: {
					base_depth?: number | null;
					display_name?: string | null;
					lifts_open?: number | null;
					lifts_url?: string | null;
					mountain_id?: number;
					runs_open?: number | null;
					snow_past_24h?: number | null;
					snow_past_48h?: number | null;
					snow_past_week?: number | null;
					snow_stake_url?: string | null;
					snow_total?: number | null;
					snow_type?: string | null;
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
						referencedRelation: 'mountain_detail';
						referencedColumns: ['display_name'];
					},
					{
						foreignKeyName: 'resort_conditions_display_name_fkey';
						columns: ['display_name'];
						isOneToOne: false;
						referencedRelation: 'mountain_overview';
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
						referencedRelation: 'mountain_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'resort_conditions_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'mountain_overview';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'resort_conditions_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'mountains';
						referencedColumns: ['mountain_id'];
					}
				];
			};
			resort_web_elements: {
				Row: {
					base_depth_el: string | null;
					conditions_url: string | null;
					lifts_open_el: string | null;
					mountain_id: number;
					runs_open_el: string | null;
					snow_past_24h_el: string | null;
					snow_past_48h_el: string | null;
					snow_past_week_el: string | null;
					snow_total_el: string | null;
					snow_type_el: string | null;
					trail_report_url: string | null;
				};
				Insert: {
					base_depth_el?: string | null;
					conditions_url?: string | null;
					lifts_open_el?: string | null;
					mountain_id: number;
					runs_open_el?: string | null;
					snow_past_24h_el?: string | null;
					snow_past_48h_el?: string | null;
					snow_past_week_el?: string | null;
					snow_total_el?: string | null;
					snow_type_el?: string | null;
					trail_report_url?: string | null;
				};
				Update: {
					base_depth_el?: string | null;
					conditions_url?: string | null;
					lifts_open_el?: string | null;
					mountain_id?: number;
					runs_open_el?: string | null;
					snow_past_24h_el?: string | null;
					snow_past_48h_el?: string | null;
					snow_past_week_el?: string | null;
					snow_total_el?: string | null;
					snow_type_el?: string | null;
					trail_report_url?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'resort_web_elements_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'backcountry_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'resort_web_elements_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'backcountry_overview';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'resort_web_elements_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'mountain_detail';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'resort_web_elements_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'mountain_overview';
						referencedColumns: ['mountain_id'];
					},
					{
						foreignKeyName: 'resort_web_elements_mountain_id_fkey';
						columns: ['mountain_id'];
						isOneToOne: true;
						referencedRelation: 'mountains';
						referencedColumns: ['mountain_id'];
					}
				];
			};
		};
		Views: {
			backcountry_detail: {
				Row: {
					avalanche_summary: string | null;
					currenttemp: number | null;
					danger_levels: Json[] | null;
					display_name: string | null;
					forecast_url: string | null;
					issue_date: string | null;
					location_type: string | null;
					mountain_id: number | null;
					next24hoursnowfall: number | null;
					next72hoursnowfall: number | null;
					overall_danger_level: number | null;
					past24hoursnowfall: number | null;
					past7daysnowfall: number | null;
					region: string | null;
					slug: string | null;
					weather_desc: string | null;
				};
				Relationships: [];
			};
			backcountry_overview: {
				Row: {
					currenttemp: number | null;
					display_name: string | null;
					location_type: string | null;
					mountain_id: number | null;
					next24hoursnowfall: number | null;
					next72hoursnowfall: number | null;
					overall_danger_level: number | null;
					past24hoursnowfall: number | null;
					past7daysnowfall: number | null;
					region: string | null;
					slug: string | null;
					weather_desc: string | null;
				};
				Relationships: [];
			};
			mountain_detail: {
				Row: {
					current_temperature: number | null;
					current_weather: string | null;
					daily_weather_conditions: Json | null;
					display_name: string | null;
					elevation: number | null;
					hourly_forecast: Json | null;
					lat: number | null;
					location_type: string | null;
					lon: number | null;
					mountain_id: number | null;
					next72hoursnowfall: number | null;
					past7daysnowfall: number | null;
					previous_snowfall_totals: Json | null;
					region: string | null;
					slug: string | null;
					temperature_range: Json | null;
					upcoming_snowfall_totals: Json | null;
				};
				Insert: {
					current_temperature?: never;
					current_weather?: never;
					daily_weather_conditions?: never;
					display_name?: string | null;
					elevation?: number | null;
					hourly_forecast?: never;
					lat?: number | null;
					location_type?: string | null;
					lon?: number | null;
					mountain_id?: number | null;
					next72hoursnowfall?: never;
					past7daysnowfall?: never;
					previous_snowfall_totals?: never;
					region?: string | null;
					slug?: string | null;
					temperature_range?: never;
					upcoming_snowfall_totals?: never;
				};
				Update: {
					current_temperature?: never;
					current_weather?: never;
					daily_weather_conditions?: never;
					display_name?: string | null;
					elevation?: number | null;
					hourly_forecast?: never;
					lat?: number | null;
					location_type?: string | null;
					lon?: number | null;
					mountain_id?: number | null;
					next72hoursnowfall?: never;
					past7daysnowfall?: never;
					previous_snowfall_totals?: never;
					region?: string | null;
					slug?: string | null;
					temperature_range?: never;
					upcoming_snowfall_totals?: never;
				};
				Relationships: [];
			};
			mountain_overview: {
				Row: {
					currenttemp: number | null;
					display_name: string | null;
					location_type: string | null;
					mountain_id: number | null;
					next24hoursnowfall: number | null;
					next72hoursnowfall: number | null;
					past24hoursnowfall: number | null;
					past7daysnowfall: number | null;
					region: string | null;
					slug: string | null;
					weather_desc: string | null;
				};
				Insert: {
					currenttemp?: never;
					display_name?: string | null;
					location_type?: string | null;
					mountain_id?: number | null;
					next24hoursnowfall?: never;
					next72hoursnowfall?: never;
					past24hoursnowfall?: never;
					past7daysnowfall?: never;
					region?: string | null;
					slug?: string | null;
					weather_desc?: never;
				};
				Update: {
					currenttemp?: never;
					display_name?: string | null;
					location_type?: string | null;
					mountain_id?: number | null;
					next24hoursnowfall?: never;
					next72hoursnowfall?: never;
					past24hoursnowfall?: never;
					past7daysnowfall?: never;
					region?: string | null;
					slug?: string | null;
					weather_desc?: never;
				};
				Relationships: [];
			};
		};
		Functions: {
			get_24_hour_snowfall_for_mountain: {
				Args: {
					id: number;
				};
				Returns: number;
			};
			get_72_hour_snowfall_for_mountain: {
				Args: {
					id: number;
				};
				Returns: number;
			};
			get_all_weather: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			get_current_temperature_for_mountain: {
				Args: {
					id: number;
				};
				Returns: number;
			};
			get_current_weather_desc: {
				Args: {
					id: number;
				};
				Returns: string;
			};
			get_daily_weather: {
				Args: {
					lat: number;
					lon: number;
				};
				Returns: Json;
			};
			get_daily_weather_conditions: {
				Args: {
					mountain_id: number;
				};
				Returns: Json;
			};
			get_hourly_weather_data: {
				Args: {
					id: number;
				};
				Returns: Json;
			};
			get_past_24_hour_snowfall_for_mountain: {
				Args: {
					id: number;
				};
				Returns: number;
			};
			get_past_7_days_snowfall_for_mountain: {
				Args: {
					id: number;
				};
				Returns: number;
			};
			get_previous_snowfall_total: {
				Args: {
					mountain_id: number;
				};
				Returns: Json;
			};
			get_temperature_range: {
				Args: {
					id: number;
				};
				Returns: Json;
			};
			get_upcoming_snowfall_total: {
				Args: {
					mountain_id: number;
				};
				Returns: Json;
			};
			process_avalanche_forecast: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			process_resort_web_elements: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (Database['public']['Tables'] & Database['public']['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
				Database['public']['Views'])
		? (Database['public']['Tables'] &
				Database['public']['Views'])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
		? Database['public']['Tables'][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
		? Database['public']['Tables'][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof Database['public']['Enums']
		? Database['public']['Enums'][PublicEnumNameOrOptions]
		: never;
