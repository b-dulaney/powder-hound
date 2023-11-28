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
          country: string | null
          display_name: string
          lat: number
          lon: number
          mountain_id: number
          region: string | null
          state_province: string | null
        }
        Insert: {
          country?: string | null
          display_name: string
          lat: number
          lon: number
          mountain_id?: number
          region?: string | null
          state_province?: string | null
        }
        Update: {
          country?: string | null
          display_name?: string
          lat?: number
          lon?: number
          mountain_id?: number
          region?: string | null
          state_province?: string | null
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
      [_ in never]: never
    }
    Functions: {
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
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
