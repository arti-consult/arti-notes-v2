export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "admin_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      chat_messages: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          recording_id: string;
          role: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: string;
          recording_id: string;
          role: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          recording_id?: string;
          role?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_recording_id_fkey";
            columns: ["recording_id"];
            isOneToOne: false;
            referencedRelation: "recordings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      credit_packages: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          description: string | null;
          id: string;
          minutes: number;
          name: string;
          price: number;
          stripe_price_id: string;
          updated_at: string | null;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          minutes: number;
          name: string;
          price: number;
          stripe_price_id: string;
          updated_at?: string | null;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          minutes?: number;
          name?: string;
          price?: number;
          stripe_price_id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      folders: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "folders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "folders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      permissions: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      pricing_plans: {
        Row: {
          created_at: string | null;
          description: string | null;
          features: Json;
          id: string;
          interval: string;
          minutes: number | null;
          name: string;
          price: number;
          stripe_price_id: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          features?: Json;
          id?: string;
          interval: string;
          minutes?: number | null;
          name: string;
          price: number;
          stripe_price_id: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          features?: Json;
          id?: string;
          interval?: string;
          minutes?: number | null;
          name?: string;
          price?: number;
          stripe_price_id?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          bio: string | null;
          created_at: string | null;
          full_name: string | null;
          id: string;
          last_sign_in_at: string | null;
          stripe_customer_id: string | null;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id: string;
          last_sign_in_at?: string | null;
          stripe_customer_id?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          bio?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          last_sign_in_at?: string | null;
          stripe_customer_id?: string | null;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      recording_participants: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          recording_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          recording_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          recording_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recording_participants_recording_id_fkey";
            columns: ["recording_id"];
            isOneToOne: false;
            referencedRelation: "recordings";
            referencedColumns: ["id"];
          }
        ];
      };
      recording_tags: {
        Row: {
          created_at: string;
          recording_id: string;
          tag_id: string;
        };
        Insert: {
          created_at?: string;
          recording_id: string;
          tag_id: string;
        };
        Update: {
          created_at?: string;
          recording_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recording_tags_recording_id_fkey";
            columns: ["recording_id"];
            isOneToOne: false;
            referencedRelation: "recordings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recording_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      recordings: {
        Row: {
          created_at: string;
          duration: number;
          error_message: string | null;
          file_size: number | null;
          file_url: string | null;
          folder_id: string | null;
          id: string;
          status: string;
          title: string;
          transcription_id: string | null;
          transcription_status: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          duration?: number;
          error_message?: string | null;
          file_size?: number | null;
          file_url?: string | null;
          folder_id?: string | null;
          id?: string;
          status?: string;
          title?: string;
          transcription_id?: string | null;
          transcription_status?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          duration?: number;
          error_message?: string | null;
          file_size?: number | null;
          file_url?: string | null;
          folder_id?: string | null;
          id?: string;
          status?: string;
          title?: string;
          transcription_id?: string | null;
          transcription_status?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recordings_folder_id_fkey";
            columns: ["folder_id"];
            isOneToOne: false;
            referencedRelation: "folders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recordings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "recordings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      role_permissions: {
        Row: {
          created_at: string | null;
          permission_id: string;
          role_id: string;
        };
        Insert: {
          created_at?: string | null;
          permission_id: string;
          role_id: string;
        };
        Update: {
          created_at?: string | null;
          permission_id?: string;
          role_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey";
            columns: ["permission_id"];
            isOneToOne: false;
            referencedRelation: "permissions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          }
        ];
      };
      roles: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null;
          created_at: string | null;
          current_period_end: string | null;
          current_period_start: string | null;
          id: string;
          minutes_remaining: number | null;
          minutes_reset_at: string | null;
          minutes_used: number | null;
          plan_id: string;
          status: string;
          stripe_subscription_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          cancel_at_period_end?: boolean | null;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          minutes_remaining?: number | null;
          minutes_reset_at?: string | null;
          minutes_used?: number | null;
          plan_id: string;
          status: string;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          cancel_at_period_end?: boolean | null;
          created_at?: string | null;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          minutes_remaining?: number | null;
          minutes_reset_at?: string | null;
          minutes_used?: number | null;
          plan_id?: string;
          status?: string;
          stripe_subscription_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "pricing_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tags_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "tags_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      tracking_data: {
        Row: {
          anonymous_id: string | null;
          created_at: string | null;
          first_visit: string | null;
          id: string;
          landing_page: string | null;
          referrer: string | null;
          updated_at: string | null;
          user_id: string | null;
          utm_campaign: string | null;
          utm_content: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          utm_term: string | null;
        };
        Insert: {
          anonymous_id?: string | null;
          created_at?: string | null;
          first_visit?: string | null;
          id?: string;
          landing_page?: string | null;
          referrer?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
        };
        Update: {
          anonymous_id?: string | null;
          created_at?: string | null;
          first_visit?: string | null;
          id?: string;
          landing_page?: string | null;
          referrer?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          utm_campaign?: string | null;
          utm_content?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          utm_term?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tracking_data_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "tracking_data_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      transcriptions: {
        Row: {
          action_items: Json | null;
          api_job_id: string | null;
          api_recording_id: string | null;
          confidence_score: number | null;
          content: Json | null;
          created_at: string;
          id: string;
          language: string;
          recording_id: string | null;
          speaker_count: number | null;
          status: string;
          summary_text: string | null;
          summary_topics: Json | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          action_items?: Json | null;
          api_job_id?: string | null;
          api_recording_id?: string | null;
          confidence_score?: number | null;
          content?: Json | null;
          created_at?: string;
          id?: string;
          language?: string;
          recording_id?: string | null;
          speaker_count?: number | null;
          status?: string;
          summary_text?: string | null;
          summary_topics?: Json | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          action_items?: Json | null;
          api_job_id?: string | null;
          api_recording_id?: string | null;
          confidence_score?: number | null;
          content?: Json | null;
          created_at?: string;
          id?: string;
          language?: string;
          recording_id?: string | null;
          speaker_count?: number | null;
          status?: string;
          summary_text?: string | null;
          summary_topics?: Json | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_recording";
            columns: ["recording_id"];
            isOneToOne: true;
            referencedRelation: "recordings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transcriptions_recording_id_fkey";
            columns: ["recording_id"];
            isOneToOne: true;
            referencedRelation: "recordings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transcriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "transcriptions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      usage_records: {
        Row: {
          ai_tools_used: Json | null;
          created_at: string | null;
          id: string;
          minutes_used: number;
          recording_id: string | null;
          user_id: string;
        };
        Insert: {
          ai_tools_used?: Json | null;
          created_at?: string | null;
          id?: string;
          minutes_used: number;
          recording_id?: string | null;
          user_id: string;
        };
        Update: {
          ai_tools_used?: Json | null;
          created_at?: string | null;
          id?: string;
          minutes_used?: number;
          recording_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "usage_records_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "usage_records_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      user_calendar_tokens: {
        Row: {
          access_token: string;
          created_at: string;
          expires_at: number | null;
          id: string;
          provider: string;
          refresh_token: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          access_token: string;
          created_at?: string;
          expires_at?: number | null;
          id?: string;
          provider: string;
          refresh_token?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          access_token?: string;
          created_at?: string;
          expires_at?: number | null;
          id?: string;
          provider?: string;
          refresh_token?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_calendar_tokens_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "user_calendar_tokens_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      user_credits: {
        Row: {
          amount: number;
          created_at: string | null;
          expires_at: string | null;
          id: string;
          package_id: string | null;
          remaining: number;
          stripe_payment_id: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          package_id?: string | null;
          remaining: number;
          stripe_payment_id?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          expires_at?: string | null;
          id?: string;
          package_id?: string | null;
          remaining?: number;
          stripe_payment_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_credits_package_id_fkey";
            columns: ["package_id"];
            isOneToOne: false;
            referencedRelation: "credit_packages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_credits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "user_credits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      user_onboarding: {
        Row: {
          audio_purpose: string | null;
          completed_at: string | null;
          created_at: string | null;
          id: string;
          mic_permission: boolean | null;
          referral_source: string | null;
          referrer: string | null;
          team_size: string;
          tracking_data_id: string | null;
          updated_at: string | null;
          user_id: string;
          user_type: string;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          audio_purpose?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          id?: string;
          mic_permission?: boolean | null;
          referral_source?: string | null;
          referrer?: string | null;
          team_size: string;
          tracking_data_id?: string | null;
          updated_at?: string | null;
          user_id: string;
          user_type: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          audio_purpose?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          id?: string;
          mic_permission?: boolean | null;
          referral_source?: string | null;
          referrer?: string | null;
          team_size?: string;
          tracking_data_id?: string | null;
          updated_at?: string | null;
          user_id?: string;
          user_type?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_onboarding_tracking_data_id_fkey";
            columns: ["tracking_data_id"];
            isOneToOne: false;
            referencedRelation: "tracking_data";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_onboarding_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "user_onboarding_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
      user_roles: {
        Row: {
          created_at: string | null;
          role_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          role_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          role_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_available_minutes";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users_summary";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      user_available_minutes: {
        Row: {
          credit_minutes: number | null;
          subscription_minutes: number | null;
          total_available_minutes: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
      users_summary: {
        Row: {
          created_at: string | null;
          email: string | null;
          file_storage: number | null;
          id: string | null;
          last_sign_in_at: string | null;
          recordings_count: number | null;
          transcription_storage: number | null;
        };
        Insert: {
          created_at?: string | null;
          email?: string | null;
          file_storage?: never;
          id?: string | null;
          last_sign_in_at?: string | null;
          recordings_count?: never;
          transcription_storage?: never;
        };
        Update: {
          created_at?: string | null;
          email?: string | null;
          file_storage?: never;
          id?: string | null;
          last_sign_in_at?: string | null;
          recordings_count?: never;
          transcription_storage?: never;
        };
        Relationships: [];
      };
    };
    Functions: {
      add_admin_user: {
        Args: { p_email: string; p_name: string };
        Returns: string;
      };
      check_recording_ownership: {
        Args: { recording_id: string };
        Returns: boolean;
      };
      create_admin_user: {
        Args: { p_email: string; p_password: string };
        Returns: string;
      };
      deduct_minutes: {
        Args: { p_user_id: string; p_minutes: number };
        Returns: boolean;
      };
      dmetaphone: {
        Args: { "": string };
        Returns: string;
      };
      dmetaphone_alt: {
        Args: { "": string };
        Returns: string;
      };
      generate_recording_search_text: {
        Args: { title: string; summary: string; transcription: Json };
        Returns: string;
      };
      get_admin_stats: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_admin_user_stats: {
        Args: { sort_field?: string; sort_order?: string };
        Returns: {
          id: string;
          created_at: string;
          last_sign_in_at: string;
          is_blocked: boolean;
          recordings_count: number;
          storage_used: number;
        }[];
      };
      get_user_growth_data: {
        Args: { p_start_date: string; p_end_date: string };
        Returns: Json;
      };
      gtrgm_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gtrgm_options: {
        Args: { "": unknown };
        Returns: undefined;
      };
      gtrgm_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      has_permission: {
        Args: { permission_name: string };
        Returns: boolean;
      };
      log_admin_action: {
        Args: {
          p_action: string;
          p_entity_type: string;
          p_entity_id: string;
          p_details?: Json;
        };
        Returns: undefined;
      };
      manual_cleanup_chat_messages: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      remove_admin_user: {
        Args: { p_email: string };
        Returns: undefined;
      };
      reset_subscription_minutes: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      search_recordings: {
        Args: { search_query: string };
        Returns: {
          id: string;
          title: string;
          created_at: string;
          duration: number;
          status: string;
          folder_id: string;
          relevance: number;
        }[];
      };
      search_transcription_content: {
        Args: { content: Json; search_query: string };
        Returns: boolean;
      };
      set_limit: {
        Args: { "": number };
        Returns: number;
      };
      show_limit: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      show_trgm: {
        Args: { "": string };
        Returns: string[];
      };
      soundex: {
        Args: { "": string };
        Returns: string;
      };
      text_soundex: {
        Args: { "": string };
        Returns: string;
      };
      toggle_user_block: {
        Args: { user_id: string; block_status: boolean };
        Returns: undefined;
      };
      unaccent: {
        Args: { "": string };
        Returns: string;
      };
      unaccent_init: {
        Args: { "": unknown };
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
