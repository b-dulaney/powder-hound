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
          snowfall_in: number | null
          temp: number | null
          visbility_miles: number | null
          weather_desc: string | null
          wetbulb_temp: number | null
          wind_deg_speed: string | null
          wind_gust: number | null
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
          snowfall_in?: number | null
          temp?: number | null
          visbility_miles?: number | null
          weather_desc?: string | null
          wetbulb_temp?: number | null
          wind_deg_speed?: string | null
          wind_gust?: number | null
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
          snowfall_in?: number | null
          temp?: number | null
          visbility_miles?: number | null
          weather_desc?: string | null
          wetbulb_temp?: number | null
          wind_deg_speed?: string | null
          wind_gust?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "caic_data_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "mountains"
            referencedColumns: ["mountain_id"]
          }
        ]
      }
      daily_forecasts: {
        Row: {
          current_temp: number | null
          daily_high: number | null
          daily_low: number | null
          feels_like: number | null
          id: number
          mountain_id: number | null
          snow_today: number | null
          snow_tomorrow: number | null
          updated_at: string | null
          uv_index: number | null
          weather_code: number | null
          weather_desc: string | null
          wind_speed: number | null
        }
        Insert: {
          current_temp?: number | null
          daily_high?: number | null
          daily_low?: number | null
          feels_like?: number | null
          id?: number
          mountain_id?: number | null
          snow_today?: number | null
          snow_tomorrow?: number | null
          updated_at?: string | null
          uv_index?: number | null
          weather_code?: number | null
          weather_desc?: string | null
          wind_speed?: number | null
        }
        Update: {
          current_temp?: number | null
          daily_high?: number | null
          daily_low?: number | null
          feels_like?: number | null
          id?: number
          mountain_id?: number | null
          snow_today?: number | null
          snow_tomorrow?: number | null
          updated_at?: string | null
          uv_index?: number | null
          weather_code?: number | null
          weather_desc?: string | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_forecasts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "mountains"
            referencedColumns: ["mountain_id"]
          }
        ]
      }
      mountains: {
        Row: {
          caic_code: string | null
          display_name: string
          lat: number
          lon: number
          model_elevation: number | null
          mountain_id: number
          region: string | null
        }
        Insert: {
          caic_code?: string | null
          display_name: string
          lat: number
          lon: number
          model_elevation?: number | null
          mountain_id?: number
          region?: string | null
        }
        Update: {
          caic_code?: string | null
          display_name?: string
          lat?: number
          lon?: number
          model_elevation?: number | null
          mountain_id?: number
          region?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          phone_number: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_phone_number_fkey"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["phone"]
          }
        ]
      }
      snow_accumulation: {
        Row: {
          created_at: string
          date: string
          mountain_id: number
          precip_total: number | null
        }
        Insert: {
          created_at?: string
          date: string
          mountain_id: number
          precip_total?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          mountain_id?: number
          precip_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "snow_accumulation_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "mountains"
            referencedColumns: ["mountain_id"]
          }
        ]
      }
      weekly_forecasts: {
        Row: {
          daily_high: number | null
          daily_low: number | null
          date: string
          mountain_id: number
          snow: number | null
          updated_at: string | null
          uv_index: number | null
          weather_code: number | null
          weather_desc: string | null
          wind_speed: number | null
        }
        Insert: {
          daily_high?: number | null
          daily_low?: number | null
          date: string
          mountain_id: number
          snow?: number | null
          updated_at?: string | null
          uv_index?: number | null
          weather_code?: number | null
          weather_desc?: string | null
          wind_speed?: number | null
        }
        Update: {
          daily_high?: number | null
          daily_low?: number | null
          date?: string
          mountain_id?: number
          snow?: number | null
          updated_at?: string | null
          uv_index?: number | null
          weather_code?: number | null
          weather_desc?: string | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_forecasts_mountain_id_fkey"
            columns: ["mountain_id"]
            isOneToOne: false
            referencedRelation: "mountains"
            referencedColumns: ["mountain_id"]
          }
        ]
      }
    }
    Views: {
      mountain_overview: {
        Row: {
          display_name: string | null
          next24hoursnowfall: number | null
          next72hoursnowfall: number | null
          past24hoursnowfall: number | null
          past5daysnowfall: number | null
        }
        Insert: {
          display_name?: string | null
          next24hoursnowfall?: never
          next72hoursnowfall?: never
          past24hoursnowfall?: never
          past5daysnowfall?: never
        }
        Update: {
          display_name?: string | null
          next24hoursnowfall?: never
          next72hoursnowfall?: never
          past24hoursnowfall?: never
          past5daysnowfall?: never
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
      get_daily_weather: {
        Args: {
          lat: number
          lon: number
        }
        Returns: Json
      }
      get_past_24_hour_snowfall_for_mountain: {
        Args: {
          id: number
        }
        Returns: number
      }
      get_past_5_days_snowfall_for_mountain: {
        Args: {
          id: number
        }
        Returns: number
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
