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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      brand_settings: {
        Row: {
          id: string
          pdf_logo_url: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          pdf_logo_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          pdf_logo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyer_company: string | null
          buyer_id: string | null
          created_at: string
          destination: string
          forwarder_token: string
          id: string
          incoterm: string
          origin_farm: string | null
          product_summary: string
          quantity_cartons: number
          quantity_kg: number | null
          status: string
          tracking_code: string
          updated_at: string
        }
        Insert: {
          buyer_company?: string | null
          buyer_id?: string | null
          created_at?: string
          destination?: string
          forwarder_token?: string
          id?: string
          incoterm?: string
          origin_farm?: string | null
          product_summary: string
          quantity_cartons?: number
          quantity_kg?: number | null
          status?: string
          tracking_code: string
          updated_at?: string
        }
        Update: {
          buyer_company?: string | null
          buyer_id?: string | null
          created_at?: string
          destination?: string
          forwarder_token?: string
          id?: string
          incoterm?: string
          origin_farm?: string | null
          product_summary?: string
          quantity_cartons?: number
          quantity_kg?: number | null
          status?: string
          tracking_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          caliber: string
          certifications: string[]
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          moq_cartons: number
          name: string
          net_weight_kg: number
          packaging: string
          price_per_carton_eur: number
          price_per_kg_eur: number
          season: string | null
          slug: string
          variety: string
        }
        Insert: {
          caliber: string
          certifications?: string[]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          moq_cartons?: number
          name: string
          net_weight_kg: number
          packaging: string
          price_per_carton_eur: number
          price_per_kg_eur: number
          season?: string | null
          slug: string
          variety?: string
        }
        Update: {
          caliber?: string
          certifications?: string[]
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          moq_cartons?: number
          name?: string
          net_weight_kg?: number
          packaging?: string
          price_per_carton_eur?: number
          price_per_kg_eur?: number
          season?: string | null
          slug?: string
          variety?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
        }
        Insert: {
          company?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
        }
        Update: {
          company?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          buyer_id: string | null
          company: string
          contact_name: string
          country: string | null
          created_at: string
          email: string
          id: string
          incoterm: string | null
          items: Json
          message: string | null
          status: string
        }
        Insert: {
          buyer_id?: string | null
          company: string
          contact_name: string
          country?: string | null
          created_at?: string
          email: string
          id?: string
          incoterm?: string | null
          items?: Json
          message?: string | null
          status?: string
        }
        Update: {
          buyer_id?: string | null
          company?: string
          contact_name?: string
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          incoterm?: string | null
          items?: Json
          message?: string | null
          status?: string
        }
        Relationships: []
      }
      tracking_events: {
        Row: {
          checkpoint: string
          created_at: string
          document_label: string | null
          document_url: string | null
          id: string
          location: string | null
          notes: string | null
          occurred_at: string
          order_id: string
          reference: string | null
          stage_index: number
          status: string
          temperature_c: number | null
        }
        Insert: {
          checkpoint: string
          created_at?: string
          document_label?: string | null
          document_url?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          occurred_at?: string
          order_id: string
          reference?: string | null
          stage_index?: number
          status?: string
          temperature_c?: number | null
        }
        Update: {
          checkpoint?: string
          created_at?: string
          document_label?: string | null
          document_url?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          occurred_at?: string
          order_id?: string
          reference?: string | null
          stage_index?: number
          status?: string
          temperature_c?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_order_by_code: {
        Args: { _code: string }
        Returns: {
          buyer_company: string
          created_at: string
          destination: string
          id: string
          incoterm: string
          origin_farm: string
          product_summary: string
          quantity_cartons: number
          quantity_kg: number
          status: string
          tracking_code: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "buyer"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "buyer"],
    },
  },
} as const
