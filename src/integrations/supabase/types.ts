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
      director_subscriptions: {
        Row: {
          created_at: string
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      funeral_home_settings: {
        Row: {
          created_at: string | null
          email_address: string | null
          id: string
          logo_url: string | null
          name: string
          phone_number: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          email_address?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone_number?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          email_address?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone_number?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      memorial_activity_log: {
        Row: {
          action_type: string
          actor_id: string | null
          created_at: string
          details: Json | null
          id: string
          memorial_id: string | null
          target_email: string | null
          target_role: string | null
        }
        Insert: {
          action_type: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          memorial_id?: string | null
          target_email?: string | null
          target_role?: string | null
        }
        Update: {
          action_type?: string
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          memorial_id?: string | null
          target_email?: string | null
          target_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memorial_activity_log_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_collaborators: {
        Row: {
          created_at: string
          email: string
          id: string
          invitation_accepted: boolean | null
          invitation_token: string | null
          memorial_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          invitation_accepted?: boolean | null
          invitation_token?: string | null
          memorial_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          invitation_accepted?: boolean | null
          invitation_token?: string | null
          memorial_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memorial_collaborators_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "memorial_image_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          photo_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          photo_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          photo_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memorial_comments_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "memorial_photos"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_image_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          photo_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          photo_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          photo_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_image_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "memorial_image_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memorial_image_comments_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "memorial_photos"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_links: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          memorial_id: string
          token: string
          type: Database["public"]["Enums"]["link_type"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          memorial_id: string
          token?: string
          type: Database["public"]["Enums"]["link_type"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          memorial_id?: string
          token?: string
          type?: Database["public"]["Enums"]["link_type"]
        }
        Relationships: [
          {
            foreignKeyName: "memorial_links_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_photos: {
        Row: {
          ai_reflection: string | null
          caption: string
          contributor_name: string
          created_at: string
          id: string
          image_url: string
          memorial_id: string
          position: number
          relationship: string
        }
        Insert: {
          ai_reflection?: string | null
          caption: string
          contributor_name: string
          created_at?: string
          id?: string
          image_url: string
          memorial_id: string
          position: number
          relationship: string
        }
        Update: {
          ai_reflection?: string | null
          caption?: string
          contributor_name?: string
          created_at?: string
          id?: string
          image_url?: string
          memorial_id?: string
          position?: number
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_photos_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_presence: {
        Row: {
          id: string
          last_seen_at: string
          memorial_id: string
          user_id: string
        }
        Insert: {
          id?: string
          last_seen_at?: string
          memorial_id: string
          user_id: string
        }
        Update: {
          id?: string
          last_seen_at?: string
          memorial_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_presence_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_surveys: {
        Row: {
          created_at: string
          family_messages: string | null
          id: string
          key_memories: string | null
          memorial_id: string
          name: string
          personality_traits: string | null
          preferred_tone: string | null
        }
        Insert: {
          created_at?: string
          family_messages?: string | null
          id?: string
          key_memories?: string | null
          memorial_id: string
          name: string
          personality_traits?: string | null
          preferred_tone?: string | null
        }
        Update: {
          created_at?: string
          family_messages?: string | null
          id?: string
          key_memories?: string | null
          memorial_id?: string
          name?: string
          personality_traits?: string | null
          preferred_tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_memorial"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memorial_surveys_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
      memorials: {
        Row: {
          banner_image_url: string | null
          birth_year: string | null
          created_at: string
          death_year: string | null
          id: string
          is_complete: boolean | null
          name: string
          summary: string | null
        }
        Insert: {
          banner_image_url?: string | null
          birth_year?: string | null
          created_at?: string
          death_year?: string | null
          id?: string
          is_complete?: boolean | null
          name: string
          summary?: string | null
        }
        Update: {
          banner_image_url?: string | null
          birth_year?: string | null
          created_at?: string
          death_year?: string | null
          id?: string
          is_complete?: boolean | null
          name?: string
          summary?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          relationship: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          relationship: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          relationship?: string
        }
        Relationships: []
      }
      signup_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          memorial_id: string
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["token_status"]
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          memorial_id: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["token_status"]
          token?: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          memorial_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["token_status"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "signup_tokens_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorials"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_director: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      validate_uuid: {
        Args: {
          str: string
        }
        Returns: boolean
      }
    }
    Enums: {
      link_type: "collaborator" | "viewer"
      token_status: "pending" | "used" | "expired"
      user_role: "admin" | "contributor" | "viewer"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
