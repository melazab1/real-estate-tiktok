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
      jobs: {
        Row: {
          created_at: string | null
          current_step: number | null
          detailed_status: string | null
          display_id: string
          error_details: string | null
          estimated_completion: string | null
          id: string
          last_updated_at: string | null
          progress_percentage: number | null
          property_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          webhook_response: Json | null
        }
        Insert: {
          created_at?: string | null
          current_step?: number | null
          detailed_status?: string | null
          display_id: string
          error_details?: string | null
          estimated_completion?: string | null
          id?: string
          last_updated_at?: string | null
          progress_percentage?: number | null
          property_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_response?: Json | null
        }
        Update: {
          created_at?: string | null
          current_step?: number | null
          detailed_status?: string | null
          display_id?: string
          error_details?: string | null
          estimated_completion?: string | null
          id?: string
          last_updated_at?: string | null
          progress_percentage?: number | null
          property_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_response?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          additional_info: string | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          description: string | null
          id: string
          is_visible: Json | null
          job_id: string | null
          location: string | null
          price: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          additional_info?: string | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_visible?: Json | null
          job_id?: string | null
          location?: string | null
          price?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          additional_info?: string | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_visible?: Json | null
          job_id?: string | null
          location?: string | null
          price?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      property_images: {
        Row: {
          id: string
          image_url: string
          is_visible: boolean | null
          property_id: string | null
          sort_order: number | null
          uploaded_at: string | null
        }
        Insert: {
          id?: string
          image_url: string
          is_visible?: boolean | null
          property_id?: string | null
          sort_order?: number | null
          uploaded_at?: string | null
        }
        Update: {
          id?: string
          image_url?: string
          is_visible?: boolean | null
          property_id?: string | null
          sort_order?: number | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          videos_limit: number | null
          videos_used: number | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          videos_limit?: number | null
          videos_used?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          videos_limit?: number | null
          videos_used?: number | null
        }
        Relationships: []
      }
      video_scripts: {
        Row: {
          accent: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          job_id: string | null
          language: string | null
          script_text: string | null
          updated_at: string | null
          voice_id: string | null
        }
        Insert: {
          accent?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          job_id?: string | null
          language?: string | null
          script_text?: string | null
          updated_at?: string | null
          voice_id?: string | null
        }
        Update: {
          accent?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          job_id?: string | null
          language?: string | null
          script_text?: string | null
          updated_at?: string | null
          voice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_scripts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          created_at: string | null
          duration: number | null
          file_size: number | null
          id: string
          job_id: string | null
          status: string | null
          thumbnail_url: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: number | null
          file_size?: number | null
          id?: string
          job_id?: string | null
          status?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number | null
          file_size?: number | null
          id?: string
          job_id?: string | null
          status?: string | null
          thumbnail_url?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_settings: {
        Row: {
          created_at: string
          extraction_webhook_url: string | null
          id: string
          payment_webhook_url: string | null
          property_extraction_url: string | null
          script_generation_url: string | null
          script_webhook_url: string | null
          updated_at: string
          user_id: string
          video_generation_url: string | null
          video_webhook_url: string | null
        }
        Insert: {
          created_at?: string
          extraction_webhook_url?: string | null
          id?: string
          payment_webhook_url?: string | null
          property_extraction_url?: string | null
          script_generation_url?: string | null
          script_webhook_url?: string | null
          updated_at?: string
          user_id: string
          video_generation_url?: string | null
          video_webhook_url?: string | null
        }
        Update: {
          created_at?: string
          extraction_webhook_url?: string | null
          id?: string
          payment_webhook_url?: string | null
          property_extraction_url?: string | null
          script_generation_url?: string | null
          script_webhook_url?: string | null
          updated_at?: string
          user_id?: string
          video_generation_url?: string | null
          video_webhook_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_display_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: { role_name?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
