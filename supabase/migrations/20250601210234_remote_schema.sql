create sequence "public"."product_audit_log_id_seq";

drop policy "Allow admin users to manage products" on "public"."products";

create table "public"."debug_tokens" (
    "id" uuid not null default gen_random_uuid(),
    "jwt" jsonb,
    "created_at" timestamp without time zone default now()
);


create table "public"."product_audit_log" (
    "id" integer not null default nextval('product_audit_log_id_seq'::regclass),
    "product_id" uuid,
    "user_id" text,
    "event" text,
    "created_at" timestamp without time zone default now()
);


create table "public"."users" (
    "id" text not null,
    "email" text,
    "is_admin" boolean default false
);


alter table "public"."users" enable row level security;

alter table "public"."products" add column "created_by" text;

alter sequence "public"."product_audit_log_id_seq" owned by "public"."product_audit_log"."id";

CREATE UNIQUE INDEX debug_tokens_pkey ON public.debug_tokens USING btree (id);

CREATE UNIQUE INDEX product_audit_log_pkey ON public.product_audit_log USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."debug_tokens" add constraint "debug_tokens_pkey" PRIMARY KEY using index "debug_tokens_pkey";

alter table "public"."product_audit_log" add constraint "product_audit_log_pkey" PRIMARY KEY using index "product_audit_log_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.log_jwt()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  insert into debug_tokens (jwt)
  values (auth.jwt());
  return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.log_product_creation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  clerk_user_id TEXT;
BEGIN
  -- Extract Clerk user ID (sub from JWT)
  BEGIN
    clerk_user_id := auth.jwt() ->> 'sub';
  EXCEPTION WHEN OTHERS THEN
    clerk_user_id := NULL;
  END;

  -- Log the creation
  INSERT INTO public.product_audit_log (
    product_id,
    user_id,
    event
  )
  VALUES (
    NEW.id,
    clerk_user_id,
    'created'
  );

  RETURN NEW;
END;
$function$
;

grant delete on table "public"."debug_tokens" to "anon";

grant insert on table "public"."debug_tokens" to "anon";

grant references on table "public"."debug_tokens" to "anon";

grant select on table "public"."debug_tokens" to "anon";

grant trigger on table "public"."debug_tokens" to "anon";

grant truncate on table "public"."debug_tokens" to "anon";

grant update on table "public"."debug_tokens" to "anon";

grant delete on table "public"."debug_tokens" to "authenticated";

grant insert on table "public"."debug_tokens" to "authenticated";

grant references on table "public"."debug_tokens" to "authenticated";

grant select on table "public"."debug_tokens" to "authenticated";

grant trigger on table "public"."debug_tokens" to "authenticated";

grant truncate on table "public"."debug_tokens" to "authenticated";

grant update on table "public"."debug_tokens" to "authenticated";

grant delete on table "public"."debug_tokens" to "service_role";

grant insert on table "public"."debug_tokens" to "service_role";

grant references on table "public"."debug_tokens" to "service_role";

grant select on table "public"."debug_tokens" to "service_role";

grant trigger on table "public"."debug_tokens" to "service_role";

grant truncate on table "public"."debug_tokens" to "service_role";

grant update on table "public"."debug_tokens" to "service_role";

grant delete on table "public"."product_audit_log" to "anon";

grant insert on table "public"."product_audit_log" to "anon";

grant references on table "public"."product_audit_log" to "anon";

grant select on table "public"."product_audit_log" to "anon";

grant trigger on table "public"."product_audit_log" to "anon";

grant truncate on table "public"."product_audit_log" to "anon";

grant update on table "public"."product_audit_log" to "anon";

grant delete on table "public"."product_audit_log" to "authenticated";

grant insert on table "public"."product_audit_log" to "authenticated";

grant references on table "public"."product_audit_log" to "authenticated";

grant select on table "public"."product_audit_log" to "authenticated";

grant trigger on table "public"."product_audit_log" to "authenticated";

grant truncate on table "public"."product_audit_log" to "authenticated";

grant update on table "public"."product_audit_log" to "authenticated";

grant delete on table "public"."product_audit_log" to "service_role";

grant insert on table "public"."product_audit_log" to "service_role";

grant references on table "public"."product_audit_log" to "service_role";

grant select on table "public"."product_audit_log" to "service_role";

grant trigger on table "public"."product_audit_log" to "service_role";

grant truncate on table "public"."product_audit_log" to "service_role";

grant update on table "public"."product_audit_log" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Admins full access to products"
on "public"."products"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = (auth.jwt() ->> 'sub'::text)) AND (users.is_admin = true)))))
with check ((EXISTS ( SELECT 1
   FROM users
  WHERE ((users.id = (auth.jwt() ->> 'sub'::text)) AND (users.is_admin = true)))));


create policy "Allow self visibility for role checks"
on "public"."users"
as permissive
for select
to authenticated
using ((id = (auth.jwt() ->> 'sub'::text)));


CREATE TRIGGER log_jwt_trigger BEFORE INSERT ON public.products FOR EACH ROW EXECUTE FUNCTION log_jwt();

CREATE TRIGGER trg_log_product_creation AFTER INSERT ON public.products FOR EACH ROW EXECUTE FUNCTION log_product_creation();


