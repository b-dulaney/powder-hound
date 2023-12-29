export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
        Relationships: [
          {
            foreignKeyName: "caic_data_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "mountain_detail"
            referencedColumns: ["mountain_id"]
          },
          {
            foreignKeyName: "caic_data_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "mountains"
            referencedColumns: ["mountain_id"]
          }
        ]
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
          region: string
          slug: string | null
        }
        Insert: {
          caic_code: string
          display_name: string
          lat: number
          location_type: string
          lon: number
          model_elevation: number
          mountain_id?: number
          region: string
          slug?: string | null
        }
        Update: {
          caic_code?: string
          display_name?: string
          lat?: number
          location_type?: string
          lon?: number
          model_elevation?: number
          mountain_id?: number
          region?: string
          slug?: string | null
        }
        Relationships: []
      }
      profile: {
        Row: {
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          user_id: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: number
          last_name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      mountain_detail: {
        Row: {
          current_temperature: number | null
          current_weather: string | null
          daily_weather_conditions: Json | null
          display_name: string | null
          elevation: number | null
          hourly_forecast: Json | null
          lat: number | null
          location_type: string | null
          lon: number | null
          mountain_id: number | null
          next72hoursnowfall: number | null
          past7daysnowfall: number | null
          previous_snowfall_totals: Json | null
          region: string | null
          slug: string | null
          temperature_range: Json | null
          upcoming_snowfall_totals: Json | null
        }
        Insert: {
          current_temperature?: never
          current_weather?: never
          daily_weather_conditions?: never
          display_name?: string | null
          elevation?: number | null
          hourly_forecast?: never
          lat?: number | null
          location_type?: string | null
          lon?: number | null
          mountain_id?: number | null
          next72hoursnowfall?: never
          past7daysnowfall?: never
          previous_snowfall_totals?: never
          region?: string | null
          slug?: string | null
          temperature_range?: never
          upcoming_snowfall_totals?: never
        }
        Update: {
          current_temperature?: never
          current_weather?: never
          daily_weather_conditions?: never
          display_name?: string | null
          elevation?: number | null
          hourly_forecast?: never
          lat?: number | null
          location_type?: string | null
          lon?: number | null
          mountain_id?: number | null
          next72hoursnowfall?: never
          past7daysnowfall?: never
          previous_snowfall_totals?: never
          region?: string | null
          slug?: string | null
          temperature_range?: never
          upcoming_snowfall_totals?: never
        }
        Relationships: []
      }
      mountain_overview: {
        Row: {
          currenttemp: number | null
          display_name: string | null
          location_type: string | null
          next24hoursnowfall: number | null
          next72hoursnowfall: number | null
          past24hoursnowfall: number | null
          past7daysnowfall: number | null
          region: string | null
          slug: string | null
          weather_desc: string | null
        }
        Insert: {
          currenttemp?: never
          display_name?: string | null
          location_type?: string | null
          next24hoursnowfall?: never
          next72hoursnowfall?: never
          past24hoursnowfall?: never
          past7daysnowfall?: never
          region?: string | null
          slug?: string | null
          weather_desc?: never
        }
        Update: {
          currenttemp?: never
          display_name?: string | null
          location_type?: string | null
          next24hoursnowfall?: never
          next72hoursnowfall?: never
          past24hoursnowfall?: never
          past7daysnowfall?: never
          region?: string | null
          slug?: string | null
          weather_desc?: never
        }
        Relationships: []
      }
    }
    Functions: {
      get_24_hour_snowfall_for_mountain: {
        Args: {
          id: number
        }
        Returns: number
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
      get_hourly_weather_data: {
        Args: {
          id: number
        }
        Returns: Json
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
