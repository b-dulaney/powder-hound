export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      avalanche_forecasts: {
        Row: {
          avalanche_summary: string | null
          danger_levels: Json[] | null
          forecast_url: string | null
          issue_date: string | null
          mountain_id: number
          overall_danger_level: number | null
          updated_at: string
        }
        Insert: {
          avalanche_summary?: string | null
          danger_levels?: Json[] | null
          forecast_url?: string | null
          issue_date?: string | null
          mountain_id?: number
          overall_danger_level?: number | null
          updated_at?: string
        }
        Update: {
          avalanche_summary?: string | null
          danger_levels?: Json[] | null
          forecast_url?: string | null
          issue_date?: string | null
          mountain_id?: number
          overall_danger_level?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "avalanche_forecasts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: true
            referencedRelation: "backcountry_detail"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "avalanche_forecasts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: true
            referencedRelation: "backcountry_overview"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "avalanche_forecasts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: true
            referencedRelation: "mountains"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "avalanche_forecasts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: true
            referencedRelation: "resort_detail"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "avalanche_forecasts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: true
            referencedRelation: "resort_overview"
            referencedColumns: ["mountain_id"]
          },
        ]
      }
      caic_data: {
        Row: {
          cei: number | null
          cnpcp_in: number | null
          created_at: string
          datetime: string
          dew_point: number | null
          mountain_id: number
          ncpcp_in: number | null
          relative_humidity: number | null
          snowfall_in: number
          temp: number
          visbility_miles: number
          weather_desc: string | null
          wetbulb_temp: number | null
          wind_deg_speed: string
          wind_gust: number
        }
        Insert: {
          cei?: number | null
          cnpcp_in?: number | null
          created_at?: string
          datetime: string
          dew_point?: number | null
          mountain_id: number
          ncpcp_in?: number | null
          relative_humidity?: number | null
          snowfall_in: number
          temp: number
          visbility_miles: number
          weather_desc?: string | null
          wetbulb_temp?: number | null
          wind_deg_speed: string
          wind_gust: number
        }
        Update: {
          cei?: number | null
          cnpcp_in?: number | null
          created_at?: string
          datetime?: string
          dew_point?: number | null
          mountain_id?: number
          ncpcp_in?: number | null
          relative_humidity?: number | null
          snowfall_in?: number
          temp?: number
          visbility_miles?: number
          weather_desc?: string | null
          wetbulb_temp?: number | null
          wind_deg_speed?: string
          wind_gust?: number
        }
        Relationships: []
      }
      mountains: {
        Row: {
          caic_code: string
          display_name: string
          lat: number
          location_type: string
          lon: number
          model_elevation: number
          mountain_id: number
          pass: string | null
          region: string
          slug: string
        }
        Insert: {
          caic_code: string
          display_name: string
          lat: number
          location_type: string
          lon: number
          model_elevation: number
          mountain_id?: number
          pass?: string | null
          region: string
          slug: string
        }
        Update: {
          caic_code?: string
          display_name?: string
          lat?: number
          location_type?: string
          lon?: number
          model_elevation?: number
          mountain_id?: number
          pass?: string | null
          region?: string
          slug?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          created_at: string
          email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      resort_conditions: {
        Row: {
          base_depth: number | null
          display_name: string | null
          lifts_open: number | null
          lifts_url: string | null
          mountain_id: number
          runs_open: number | null
          snow_overnight: number | null
          snow_past_24h: number | null
          snow_past_48h: number | null
          snow_past_week: number | null
          snow_stake_url: string | null
          snow_total: number | null
          snow_type: string | null
          total_lifts: number | null
          total_runs: number | null
          trails_url: string | null
          updated_at: string | null
        }
        Insert: {
          base_depth?: number | null
          display_name?: string | null
          lifts_open?: number | null
          lifts_url?: string | null
          mountain_id: number
          runs_open?: number | null
          snow_overnight?: number | null
          snow_past_24h?: number | null
          snow_past_48h?: number | null
          snow_past_week?: number | null
          snow_stake_url?: string | null
          snow_total?: number | null
          snow_type?: string | null
          total_lifts?: number | null
          total_runs?: number | null
          trails_url?: string | null
          updated_at?: string | null
        }
        Update: {
          base_depth?: number | null
          display_name?: string | null
          lifts_open?: number | null
          lifts_url?: string | null
          mountain_id?: number
          runs_open?: number | null
          snow_overnight?: number | null
          snow_past_24h?: number | null
          snow_past_48h?: number | null
          snow_past_week?: number | null
          snow_stake_url?: string | null
          snow_total?: number | null
          snow_type?: string | null
          total_lifts?: number | null
          total_runs?: number | null
          trails_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resort_conditions_display_name_fkey"
            columns: ["display_name"]
            isOneToOne: false
            referencedRelation: "backcountry_detail"
            referencedColumns: ["display_name"]
          },
          {
            foreignKeyName: "resort_conditions_display_name_fkey"
            columns: ["display_name"]
            isOneToOne: false
            referencedRelation: "backcountry_overview"
            referencedColumns: ["display_name"]
          },
          {
            foreignKeyName: "resort_conditions_display_name_fkey"
            columns: ["display_name"]
            isOneToOne: false
            referencedRelation: "mountains"
            referencedColumns: ["display_name"]
          },
          {
            foreignKeyName: "resort_conditions_display_name_fkey"
            columns: ["display_name"]
            isOneToOne: false
            referencedRelation: "resort_detail"
            referencedColumns: ["display_name"]
          },
          {
            foreignKeyName: "resort_conditions_display_name_fkey"
            columns: ["display_name"]
            isOneToOne: false
            referencedRelation: "resort_overview"
            referencedColumns: ["display_name"]
          },
          {
            foreignKeyName: "resort_conditions_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: true
            referencedRelation: "backcountry_detail"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "resort_conditions_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: true
            referencedRelation: "backcountry_overview"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "resort_conditions_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: true
            referencedRelation: "mountains"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "resort_conditions_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: true
            referencedRelation: "resort_detail"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "resort_conditions_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: true
            referencedRelation: "resort_overview"
            referencedColumns: ["mountain_id"]
          },
        ]
      }
      scraping_status: {
        Row: {
          display_name: string
          error: string | null
          id: number
          success: boolean
          time: string
        }
        Insert: {
          display_name: string
          error?: string | null
          id?: number
          success: boolean
          time?: string
        }
        Update: {
          display_name?: string
          error?: string | null
          id?: number
          success?: boolean
          time?: string
        }
        Relationships: []
      }
      user_alerts: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: number
          mountain_id: number | null
          paused: boolean
          threshold_inches: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: number
          mountain_id?: number | null
          paused?: boolean
          threshold_inches: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: number
          mountain_id?: number | null
          paused?: boolean
          threshold_inches?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_alerts_display_name_fkey"
            columns: ["display_name"]
            isOneToOne: false
            referencedRelation: "backcountry_detail"
            referencedColumns: ["display_name"]
          },
          {
            foreignKeyName: "user_alerts_display_name_fkey"
            columns: ["display_name"]
            isOneToOne: false
            referencedRelation: "backcountry_overview"
            referencedColumns: ["display_name"]
          },
          {
            foreignKeyName: "user_alerts_display_name_fkey"
            columns: ["display_name"]
            isOneToOne: false
            referencedRelation: "mountains"
            referencedColumns: ["display_name"]
          },
          {
            foreignKeyName: "user_alerts_display_name_fkey"
            columns: ["display_name"]
            isOneToOne: false
            referencedRelation: "resort_detail"
            referencedColumns: ["display_name"]
          },
          {
            foreignKeyName: "user_alerts_display_name_fkey"
            columns: ["display_name"]
            isOneToOne: false
            referencedRelation: "resort_overview"
            referencedColumns: ["display_name"]
          },
          {
            foreignKeyName: "user_alerts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "backcountry_detail"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "user_alerts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "backcountry_overview"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "user_alerts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "mountains"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "user_alerts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "resort_detail"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "user_alerts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "resort_overview"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "user_alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      alert_thresholds: {
        Row: {
          display_name: string | null
          mountain_id: number | null
          snow_next_24h: number | null
          snow_past_24h: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      backcountry_detail: {
        Row: {
          avalanche_summary: string | null
          current_temperature: number | null
          current_weather: string | null
          daily_weather_conditions: Json | null
          danger_levels: Json[] | null
          display_name: string | null
          forecast_url: string | null
          hourly_forecast: Json | null
          issue_date: string | null
          location_type: string | null
          mountain_id: number | null
          next_24h_hourly_snowfall: Json | null
          overall_danger_level: number | null
          previous_snowfall_totals: Json | null
          region: string | null
          slug: string | null
          snow_next_24h: number | null
          snow_next_72h: number | null
          snow_past_7d: number | null
          temperature_range: Json | null
          upcoming_snowfall_totals: Json | null
        }
        Relationships: []
      }
      backcountry_overview: {
        Row: {
          current_temp: number | null
          current_weather: string | null
          display_name: string | null
          location_type: string | null
          mountain_id: number | null
          overall_danger_level: number | null
          region: string | null
          slug: string | null
          snow_next_24h: number | null
          snow_next_72h: number | null
          snow_past_24h: number | null
          snow_past_7d: number | null
        }
        Relationships: []
      }
      resort_detail: {
        Row: {
          base_depth: number | null
          current_temp: number | null
          current_weather: string | null
          daily_weather_conditions: Json | null
          display_name: string | null
          hourly_forecast: Json | null
          lifts_open: number | null
          lifts_url: string | null
          location_type: string | null
          mountain_id: number | null
          next_24h_hourly_snowfall: Json | null
          previous_snowfall_totals: Json | null
          region: string | null
          runs_open: number | null
          slug: string | null
          snow_next_24h: number | null
          snow_next_72h: number | null
          snow_past_24h: number | null
          snow_past_48h: number | null
          snow_past_week: number | null
          snow_stake_url: string | null
          snow_total: number | null
          temperature_range: Json | null
          total_lifts: number | null
          total_runs: number | null
          trails_url: string | null
          upcoming_snowfall_totals: Json | null
          updated_at: string | null
        }
        Relationships: []
      }
      resort_overview: {
        Row: {
          base_depth: number | null
          current_temp: number | null
          current_weather: string | null
          display_name: string | null
          lifts_open: number | null
          location_type: string | null
          mountain_id: number | null
          region: string | null
          runs_open: number | null
          slug: string | null
          snow_next_24h: number | null
          snow_next_72h: number | null
          snow_past_24h: number | null
          snow_past_48h: number | null
          total_lifts: number | null
          total_runs: number | null
        }
        Relationships: []
      }
      web_scraper_overview: {
        Row: {
          errors_per_day: Json[] | null
          highest_failure_display_name: string | null
          highest_failure_display_name_24h: string | null
          highest_failure_percentage_failed: number | null
          highest_failure_percentage_failed_24h: number | null
          highest_failure_total_rows: number | null
          highest_failure_total_rows_24h: number | null
          overall_success_percentage: number | null
          recent_scraping_status: Json | null
          success_percentage_24h: number | null
        }
        Relationships: []
      },
      mountain_snowfall_forecast: {
        Row: {
          mountain_id: number
          slug: string
          day: string
          daytime_snowfall: number
          nighttime_snowfall: number
          prev_night_snowfall: number
        }
      },
      mountain_snowfall_historical: {
        Row: {
          mountain_id: number
          slug: string
          day: string
          daytime_snowfall: number
          nighttime_snowfall: number
          prev_night_snowfall: number
        }
      }
    }
    Functions: {
      check_user_alerts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      count_errors_by_day: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
      }
      get_24_hour_snowfall_for_mountain: {
        Args: {
          id: number
        }
        Returns: number
      }
      get_24h_alert_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          email: string
          mountain_id: number
          display_name: string
          threshold_inches: number
          snow_next_24h: number
          updated_at: string
        }[]
      }
      get_72_hour_snowfall_for_mountain: {
        Args: {
          id: number
        }
        Returns: number
      }
      get_all_weather: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_current_temperature_for_mountain: {
        Args: {
          id: number
        }
        Returns: number
      }
      get_current_weather_desc: {
        Args: {
          id: number
        }
        Returns: string
      }
      get_daily_weather: {
        Args: {
          lat: number
          lon: number
        }
        Returns: Json
      }
      get_daily_weather_conditions: {
        Args: {
          mountain_id: number
        }
        Returns: Json
      }
      get_display_name_with_highest_failure_count: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_display_name_with_highest_failure_count_last_24h: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_hourly_weather_data: {
        Args: {
          id: number
        }
        Returns: Json
      }
      get_most_recent_timestamp: {
        Args: {
          mountain_id: number
        }
        Returns: string
      }
      get_next_24h_hourly_snowfall: {
        Args: {
          id: number
        }
        Returns: Json
      }
      get_overnight_alert_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          user_id: string
          email: string
          mountain_id: number
          display_name: string
          threshold_inches: number
          snow_past_24h: number
          updated_at: string
        }[]
      }
      get_past_24_hour_snowfall_for_mountain: {
        Args: {
          id: number
        }
        Returns: number
      }
      get_past_7_days_snowfall_for_mountain: {
        Args: {
          id: number
        }
        Returns: number
      }
      get_previous_snowfall_total: {
        Args: {
          mountain_id: number
        }
        Returns: Json
      }
      get_recent_scraping_status: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_success_percentage: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_success_percentage_24h: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_temperature_range: {
        Args: {
          id: number
        }
        Returns: Json
      }
      get_upcoming_snowfall_total: {
        Args: {
          mountain_id: number
        }
        Returns: Json
      }
      get_worst_scraping_job_overall: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      group_24h_forecast_alert_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      group_overnight_snowfall_alert_data: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      process_avalanche_forecast: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_resort_web_elements: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      process_resort_web_elements_am: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      send_forecast_alert_emails: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      send_overnight_alert_emails: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      send_post_request: {
        Args: {
          mountain_name_param: string
        }
        Returns: undefined
      }
    }
    Enums: {
      alert_type: "forecast" | "overnight"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
