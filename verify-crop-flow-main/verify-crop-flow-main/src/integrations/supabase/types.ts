export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_events: {
        Row: {
          actor_id: string | null
          actor_name: string | null
          actor_role: string
          created_at: string
          event_type: string
          id: string
          metadata: Json
          transaction_id: string
        }
        Insert: {
          actor_id?: string | null
          actor_name?: string | null
          actor_role?: string
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          transaction_id: string
        }
        Update: {
          actor_id?: string | null
          actor_name?: string | null
          actor_role?: string
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          transaction_id?: string
        }
        Relationships: []
      }
      farmers: {
        Row: {
          created_at: string
          fpo_id: string
          id: string
          name: string
          phone: string
          qr_identifier: string
          updated_at: string
          village: string | null
        }
        Insert: {
          created_at?: string
          fpo_id: string
          id?: string
          name: string
          phone: string
          qr_identifier: string
          updated_at?: string
          village?: string | null
        }
        Update: {
          created_at?: string
          fpo_id?: string
          id?: string
          name?: string
          phone?: string
          qr_identifier?: string
          updated_at?: string
          village?: string | null
        }
        Relationships: []
      }
      operators: {
        Row: {
          collection_center: string
          created_at: string
          email: string | null
          id: string
          language: string
          name: string
          operator_code: string
          phone: string | null
          role: string
          updated_at: string
          voice_enabled: boolean
        }
        Insert: {
          collection_center?: string
          created_at?: string
          email?: string | null
          id: string
          language?: string
          name?: string
          operator_code?: string
          phone?: string | null
          role?: string
          updated_at?: string
          voice_enabled?: boolean
        }
        Update: {
          collection_center?: string
          created_at?: string
          email?: string | null
          id?: string
          language?: string
          name?: string
          operator_code?: string
          phone?: string | null
          role?: string
          updated_at?: string
          voice_enabled?: boolean
        }
        Relationships: []
      }
      transactions: {
        Row: {
          approval_code: string | null
          approval_method: string | null
          approved_at: string | null
          audit_photo_path: string | null
          created_at: string
          crop_type: string
          dispute_note: string | null
          dispute_reason: string | null
          dispute_status: string | null
          farmer_fpo_id: string | null
          farmer_id: string | null
          farmer_name: string
          grade: string
          id: string
          is_demo: boolean
          offline_created: boolean
          operator_id: string | null
          operator_name: string | null
          status: string
          sync_status: string
          transaction_id: string
          updated_at: string
          verified_at: string | null
          weight: number
        }
        Insert: {
          approval_code?: string | null
          approval_method?: string | null
          approved_at?: string | null
          audit_photo_path?: string | null
          created_at?: string
          crop_type?: string
          dispute_note?: string | null
          dispute_reason?: string | null
          dispute_status?: string | null
          farmer_fpo_id?: string | null
          farmer_id?: string | null
          farmer_name: string
          grade?: string
          id?: string
          is_demo?: boolean
          offline_created?: boolean
          operator_id?: string | null
          operator_name?: string | null
          status?: string
          sync_status?: string
          transaction_id: string
          updated_at?: string
          verified_at?: string | null
          weight?: number
        }
        Update: {
          approval_code?: string | null
          approval_method?: string | null
          approved_at?: string | null
          audit_photo_path?: string | null
          created_at?: string
          crop_type?: string
          dispute_note?: string | null
          dispute_reason?: string | null
          dispute_status?: string | null
          farmer_fpo_id?: string | null
          farmer_id?: string | null
          farmer_name?: string
          grade?: string
          id?: string
          is_demo?: boolean
          offline_created?: boolean
          operator_id?: string | null
          operator_name?: string | null
          status?: string
          sync_status?: string
          transaction_id?: string
          updated_at?: string
          verified_at?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "farmers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
