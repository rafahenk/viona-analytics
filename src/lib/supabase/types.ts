// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4'
  }
  public: {
    Tables: {
      analytics_catalog: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          price_model: string | null
          slug: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          price_model?: string | null
          slug: string
          unit_price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          price_model?: string | null
          slug?: string
          unit_price?: number
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'audit_logs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      camera_analytics_config: {
        Row: {
          activated_at: string
          analytic_id: string
          camera_id: string
          id: string
          is_active: boolean | null
        }
        Insert: {
          activated_at?: string
          analytic_id: string
          camera_id: string
          id?: string
          is_active?: boolean | null
        }
        Update: {
          activated_at?: string
          analytic_id?: string
          camera_id?: string
          id?: string
          is_active?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'camera_analytics_config_analytic_id_fkey'
            columns: ['analytic_id']
            isOneToOne: false
            referencedRelation: 'analytics_catalog'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'camera_analytics_config_camera_id_fkey'
            columns: ['camera_id']
            isOneToOne: false
            referencedRelation: 'cameras'
            referencedColumns: ['id']
          },
        ]
      }
      cameras: {
        Row: {
          connection_url: string | null
          created_at: string
          id: string
          name: string
          organization_id: string
          status: string | null
        }
        Insert: {
          connection_url?: string | null
          created_at?: string
          id?: string
          name: string
          organization_id: string
          status?: string | null
        }
        Update: {
          connection_url?: string | null
          created_at?: string
          id?: string
          name?: string
          organization_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'cameras_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      events: {
        Row: {
          analytic_id: string
          camera_id: string
          created_at: string
          id: string
          metadata: Json | null
          thumbnail_url: string | null
        }
        Insert: {
          analytic_id: string
          camera_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          thumbnail_url?: string | null
        }
        Update: {
          analytic_id?: string
          camera_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'events_analytic_id_fkey'
            columns: ['analytic_id']
            isOneToOne: false
            referencedRelation: 'analytics_catalog'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'events_camera_id_fkey'
            columns: ['camera_id']
            isOneToOne: false
            referencedRelation: 'cameras'
            referencedColumns: ['id']
          },
        ]
      }
      organizations: {
        Row: {
          billing_email: string | null
          cnpj: string | null
          created_at: string
          id: string
          name: string
          plan_id: string | null
          status: string | null
          trial_until: string | null
        }
        Insert: {
          billing_email?: string | null
          cnpj?: string | null
          created_at?: string
          id?: string
          name: string
          plan_id?: string | null
          status?: string | null
          trial_until?: string | null
        }
        Update: {
          billing_email?: string | null
          cnpj?: string | null
          created_at?: string
          id?: string
          name?: string
          plan_id?: string | null
          status?: string | null
          trial_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'organizations_plan_id_fkey'
            columns: ['plan_id']
            isOneToOne: false
            referencedRelation: 'plans'
            referencedColumns: ['id']
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name: string
          price?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          is_super_admin: boolean | null
          organization_id: string | null
          role: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          is_super_admin?: boolean | null
          organization_id?: string | null
          role?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_super_admin?: boolean | null
          organization_id?: string | null
          role?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      usage_logs: {
        Row: {
          amount: number
          analytic_id: string | null
          camera_id: string | null
          id: string
          organization_id: string
          timestamp: string
        }
        Insert: {
          amount?: number
          analytic_id?: string | null
          camera_id?: string | null
          id?: string
          organization_id: string
          timestamp?: string
        }
        Update: {
          amount?: number
          analytic_id?: string | null
          camera_id?: string | null
          id?: string
          organization_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: 'usage_logs_analytic_id_fkey'
            columns: ['analytic_id']
            isOneToOne: false
            referencedRelation: 'analytics_catalog'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'usage_logs_camera_id_fkey'
            columns: ['camera_id']
            isOneToOne: false
            referencedRelation: 'cameras'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'usage_logs_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth_user_organization_id: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: analytics_catalog
//   id: uuid (not null, default: gen_random_uuid())
//   slug: text (not null)
//   name: text (not null)
//   description: text (nullable)
//   price_model: text (nullable)
//   unit_price: numeric (not null, default: 0)
//   created_at: timestamp with time zone (not null, default: now())
// Table: audit_logs
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   action: text (not null)
//   entity_type: text (not null)
//   entity_id: uuid (nullable)
//   details: jsonb (nullable, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
// Table: camera_analytics_config
//   id: uuid (not null, default: gen_random_uuid())
//   camera_id: uuid (not null)
//   analytic_id: uuid (not null)
//   is_active: boolean (nullable, default: true)
//   activated_at: timestamp with time zone (not null, default: now())
// Table: cameras
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   name: text (not null)
//   connection_url: text (nullable)
//   status: text (nullable, default: 'offline'::text)
//   created_at: timestamp with time zone (not null, default: now())
// Table: events
//   id: uuid (not null, default: gen_random_uuid())
//   camera_id: uuid (not null)
//   analytic_id: uuid (not null)
//   metadata: jsonb (nullable, default: '{}'::jsonb)
//   thumbnail_url: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: organizations
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   cnpj: text (nullable)
//   billing_email: text (nullable)
//   status: text (nullable, default: 'trial'::text)
//   trial_until: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   plan_id: uuid (nullable)
// Table: plans
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (nullable)
//   price: numeric (not null, default: 0)
//   features: jsonb (nullable, default: '{}'::jsonb)
//   created_at: timestamp with time zone (not null, default: now())
// Table: profiles
//   id: uuid (not null)
//   organization_id: uuid (nullable)
//   full_name: text (nullable)
//   role: text (nullable, default: 'viewer'::text)
//   created_at: timestamp with time zone (not null, default: now())
//   is_super_admin: boolean (nullable, default: false)
//   username: text (nullable)
// Table: usage_logs
//   id: uuid (not null, default: gen_random_uuid())
//   organization_id: uuid (not null)
//   camera_id: uuid (nullable)
//   analytic_id: uuid (nullable)
//   amount: numeric (not null, default: 0)
//   timestamp: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: analytics_catalog
//   PRIMARY KEY analytics_catalog_pkey: PRIMARY KEY (id)
//   CHECK analytics_catalog_price_model_check: CHECK ((price_model = ANY (ARRAY['per_event'::text, 'monthly'::text])))
//   UNIQUE analytics_catalog_slug_key: UNIQUE (slug)
// Table: audit_logs
//   PRIMARY KEY audit_logs_pkey: PRIMARY KEY (id)
//   FOREIGN KEY audit_logs_user_id_fkey: FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL
// Table: camera_analytics_config
//   FOREIGN KEY camera_analytics_config_analytic_id_fkey: FOREIGN KEY (analytic_id) REFERENCES analytics_catalog(id) ON DELETE CASCADE
//   UNIQUE camera_analytics_config_camera_id_analytic_id_key: UNIQUE (camera_id, analytic_id)
//   FOREIGN KEY camera_analytics_config_camera_id_fkey: FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE CASCADE
//   PRIMARY KEY camera_analytics_config_pkey: PRIMARY KEY (id)
// Table: cameras
//   FOREIGN KEY cameras_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   PRIMARY KEY cameras_pkey: PRIMARY KEY (id)
//   CHECK cameras_status_check: CHECK ((status = ANY (ARRAY['online'::text, 'offline'::text])))
// Table: events
//   FOREIGN KEY events_analytic_id_fkey: FOREIGN KEY (analytic_id) REFERENCES analytics_catalog(id) ON DELETE CASCADE
//   FOREIGN KEY events_camera_id_fkey: FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE CASCADE
//   PRIMARY KEY events_pkey: PRIMARY KEY (id)
// Table: organizations
//   UNIQUE organizations_cnpj_key: UNIQUE (cnpj)
//   PRIMARY KEY organizations_pkey: PRIMARY KEY (id)
//   FOREIGN KEY organizations_plan_id_fkey: FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL
//   CHECK organizations_status_check: CHECK ((status = ANY (ARRAY['active'::text, 'trial'::text, 'past_due'::text, 'canceled'::text])))
// Table: plans
//   PRIMARY KEY plans_pkey: PRIMARY KEY (id)
// Table: profiles
//   FOREIGN KEY profiles_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   FOREIGN KEY profiles_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   PRIMARY KEY profiles_pkey: PRIMARY KEY (id)
//   CHECK profiles_role_check: CHECK ((role = ANY (ARRAY['admin'::text, 'operator'::text, 'viewer'::text])))
// Table: usage_logs
//   FOREIGN KEY usage_logs_analytic_id_fkey: FOREIGN KEY (analytic_id) REFERENCES analytics_catalog(id) ON DELETE SET NULL
//   FOREIGN KEY usage_logs_camera_id_fkey: FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE SET NULL
//   FOREIGN KEY usage_logs_organization_id_fkey: FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
//   PRIMARY KEY usage_logs_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: analytics_catalog
//   Policy "Analytics Catalog SELECT" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
// Table: audit_logs
//   Policy "AuditLogs INSERT" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (auth.uid() IS NOT NULL)
//   Policy "AuditLogs SELECT Admin" (SELECT, PERMISSIVE) roles={public}
//     USING: is_super_admin()
// Table: camera_analytics_config
//   Policy "CameraAnalyticsConfig DELETE" (DELETE, PERMISSIVE) roles={public}
//     USING: (camera_id IN ( SELECT cameras.id    FROM cameras   WHERE (cameras.organization_id = get_auth_user_organization_id())))
//   Policy "CameraAnalyticsConfig INSERT" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (camera_id IN ( SELECT cameras.id    FROM cameras   WHERE (cameras.organization_id = get_auth_user_organization_id())))
//   Policy "CameraAnalyticsConfig SELECT" (SELECT, PERMISSIVE) roles={public}
//     USING: (camera_id IN ( SELECT cameras.id    FROM cameras   WHERE (cameras.organization_id = get_auth_user_organization_id())))
//   Policy "CameraAnalyticsConfig UPDATE" (UPDATE, PERMISSIVE) roles={public}
//     USING: (camera_id IN ( SELECT cameras.id    FROM cameras   WHERE (cameras.organization_id = get_auth_user_organization_id())))
// Table: cameras
//   Policy "Cameras DELETE" (DELETE, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_user_organization_id())
//   Policy "Cameras INSERT" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id = get_auth_user_organization_id())
//   Policy "Cameras SELECT" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_user_organization_id())
//   Policy "Cameras UPDATE" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_user_organization_id())
// Table: events
//   Policy "Events DELETE" (DELETE, PERMISSIVE) roles={public}
//     USING: (camera_id IN ( SELECT cameras.id    FROM cameras   WHERE (cameras.organization_id = get_auth_user_organization_id())))
//   Policy "Events INSERT" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (camera_id IN ( SELECT cameras.id    FROM cameras   WHERE (cameras.organization_id = get_auth_user_organization_id())))
//   Policy "Events SELECT" (SELECT, PERMISSIVE) roles={public}
//     USING: (camera_id IN ( SELECT cameras.id    FROM cameras   WHERE (cameras.organization_id = get_auth_user_organization_id())))
//   Policy "Events UPDATE" (UPDATE, PERMISSIVE) roles={public}
//     USING: (camera_id IN ( SELECT cameras.id    FROM cameras   WHERE (cameras.organization_id = get_auth_user_organization_id())))
// Table: organizations
//   Policy "Organizations INSERT" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
//   Policy "Organizations SELECT" (SELECT, PERMISSIVE) roles={public}
//     USING: ((id = get_auth_user_organization_id()) OR is_super_admin())
//   Policy "Organizations UPDATE" (UPDATE, PERMISSIVE) roles={public}
//     USING: (((id = get_auth_user_organization_id()) AND is_admin()) OR is_super_admin())
// Table: plans
//   Policy "Plans ALL Admin" (ALL, PERMISSIVE) roles={public}
//     USING: is_super_admin()
//   Policy "Plans SELECT" (SELECT, PERMISSIVE) roles={public}
//     USING: true
// Table: profiles
//   Policy "Profiles DELETE" (DELETE, PERMISSIVE) roles={public}
//     USING: ((organization_id = get_auth_user_organization_id()) AND is_admin())
//   Policy "Profiles INSERT" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: true
//   Policy "Profiles SELECT" (SELECT, PERMISSIVE) roles={public}
//     USING: ((id = auth.uid()) OR (organization_id = get_auth_user_organization_id()) OR is_super_admin())
//   Policy "Profiles UPDATE" (UPDATE, PERMISSIVE) roles={public}
//     USING: ((id = auth.uid()) OR ((organization_id = get_auth_user_organization_id()) AND is_admin()) OR is_super_admin())
// Table: usage_logs
//   Policy "UsageLogs DELETE" (DELETE, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_user_organization_id())
//   Policy "UsageLogs INSERT" (INSERT, PERMISSIVE) roles={public}
//     WITH CHECK: (organization_id = get_auth_user_organization_id())
//   Policy "UsageLogs SELECT" (SELECT, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_user_organization_id())
//   Policy "UsageLogs UPDATE" (UPDATE, PERMISSIVE) roles={public}
//     USING: (organization_id = get_auth_user_organization_id())

// --- DATABASE FUNCTIONS ---
// FUNCTION get_auth_user_organization_id()
//   CREATE OR REPLACE FUNCTION public.get_auth_user_organization_id()
//    RETURNS uuid
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO ''
//   AS $function$
//     SELECT organization_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
//   $function$
//
// FUNCTION is_admin()
//   CREATE OR REPLACE FUNCTION public.is_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO ''
//   AS $function$
//     SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid() LIMIT 1;
//   $function$
//
// FUNCTION is_super_admin()
//   CREATE OR REPLACE FUNCTION public.is_super_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO ''
//   AS $function$
//     SELECT is_super_admin FROM public.profiles WHERE id = auth.uid() LIMIT 1;
//   $function$
//

// --- INDEXES ---
// Table: analytics_catalog
//   CREATE UNIQUE INDEX analytics_catalog_slug_key ON public.analytics_catalog USING btree (slug)
// Table: camera_analytics_config
//   CREATE UNIQUE INDEX camera_analytics_config_camera_id_analytic_id_key ON public.camera_analytics_config USING btree (camera_id, analytic_id)
// Table: organizations
//   CREATE UNIQUE INDEX organizations_cnpj_key ON public.organizations USING btree (cnpj)
