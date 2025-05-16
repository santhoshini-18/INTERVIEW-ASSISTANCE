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
      assessments: {
        Row: {
          category_scores: Json
          created_at: string | null
          id: string
          recommendations: Json
          score: number
          status: string
          user_id: string
        }
        Insert: {
          category_scores: Json
          created_at?: string | null
          id?: string
          recommendations: Json
          score: number
          status: string
          user_id: string
        }
        Update: {
          category_scores?: Json
          created_at?: string | null
          id?: string
          recommendations?: Json
          score?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available: boolean | null
          created_at: string | null
          full_name: string
          id: string
          location: string
          rating: number | null
          specialization: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string | null
          full_name: string
          id?: string
          location: string
          rating?: number | null
          specialization: string
        }
        Update: {
          available?: boolean | null
          created_at?: string | null
          full_name?: string
          id?: string
          location?: string
          rating?: number | null
          specialization?: string
        }
        Relationships: []
      }
      interview_sessions: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          end_time: string | null
          feedback: Json | null
          id: string
          role: string
          score: number | null
          start_time: string | null
          status: string | null
          violations: Json | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          end_time?: string | null
          feedback?: Json | null
          id?: string
          role: string
          score?: number | null
          start_time?: string | null
          status?: string | null
          violations?: Json | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          end_time?: string | null
          feedback?: Json | null
          id?: string
          role?: string
          score?: number | null
          start_time?: string | null
          status?: string | null
          violations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_sessions_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          interview_credits: number | null
          position: string | null
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          interview_credits?: number | null
          position?: string | null
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          interview_credits?: number | null
          position?: string | null
          role?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string
          created_at: string | null
          difficulty: string | null
          evaluation_criteria: Json | null
          id: string
          ideal_answer: string | null
          question: string
          role: string
        }
        Insert: {
          category: string
          created_at?: string | null
          difficulty?: string | null
          evaluation_criteria?: Json | null
          id?: string
          ideal_answer?: string | null
          question: string
          role: string
        }
        Update: {
          category?: string
          created_at?: string | null
          difficulty?: string | null
          evaluation_criteria?: Json | null
          id?: string
          ideal_answer?: string | null
          question?: string
          role?: string
        }
        Relationships: []
      }
      responses: {
        Row: {
          answer: string | null
          created_at: string | null
          duration: number | null
          feedback: Json | null
          id: string
          question_id: string | null
          score: number | null
          session_id: string | null
        }
        Insert: {
          answer?: string | null
          created_at?: string | null
          duration?: number | null
          feedback?: Json | null
          id?: string
          question_id?: string | null
          score?: number | null
          session_id?: string | null
        }
        Update: {
          answer?: string | null
          created_at?: string | null
          duration?: number | null
          feedback?: Json | null
          id?: string
          question_id?: string | null
          score?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "interview_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_responses: {
        Row: {
          clarity_score: number | null
          completion_score: number | null
          confidence_score: number | null
          created_at: string | null
          feedback_details: Json | null
          id: string
          is_correct: boolean | null
          keywords_used: string[] | null
          question_text: string
          session_id: string | null
          technical_score: number | null
          time_taken: number | null
          user_answer: string
        }
        Insert: {
          clarity_score?: number | null
          completion_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          feedback_details?: Json | null
          id?: string
          is_correct?: boolean | null
          keywords_used?: string[] | null
          question_text: string
          session_id?: string | null
          technical_score?: number | null
          time_taken?: number | null
          user_answer: string
        }
        Update: {
          clarity_score?: number | null
          completion_score?: number | null
          confidence_score?: number | null
          created_at?: string | null
          feedback_details?: Json | null
          id?: string
          is_correct?: boolean | null
          keywords_used?: string[] | null
          question_text?: string
          session_id?: string | null
          technical_score?: number | null
          time_taken?: number | null
          user_answer?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          correct_answers: number | null
          created_at: string | null
          domain: string
          end_time: string | null
          id: string
          session_type: string
          start_time: string | null
          total_questions: number | null
          total_time: number | null
          user_id: string | null
        }
        Insert: {
          correct_answers?: number | null
          created_at?: string | null
          domain: string
          end_time?: string | null
          id?: string
          session_type: string
          start_time?: string | null
          total_questions?: number | null
          total_time?: number | null
          user_id?: string | null
        }
        Update: {
          correct_answers?: number | null
          created_at?: string | null
          domain?: string
          end_time?: string | null
          id?: string
          session_type?: string
          start_time?: string | null
          total_questions?: number | null
          total_time?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_nearby_doctors: {
        Args: {
          user_location: string
          limit_count?: number
        }
        Returns: {
          available: boolean | null
          created_at: string | null
          full_name: string
          id: string
          location: string
          rating: number | null
          specialization: string
        }[]
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
