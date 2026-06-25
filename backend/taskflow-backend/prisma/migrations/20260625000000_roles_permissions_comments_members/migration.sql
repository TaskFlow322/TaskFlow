-- Create roles and permissions tables.
CREATE TABLE IF NOT EXISTS "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "roles_name_key" ON "roles"("name");

CREATE TABLE IF NOT EXISTS "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "permissions_name_key" ON "permissions"("name");

CREATE TABLE IF NOT EXISTS "user_roles" (
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id")
);

CREATE TABLE IF NOT EXISTS "role_permissions" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id", "permission_id")
);

ALTER TABLE "user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_roles"
    ADD CONSTRAINT "user_roles_role_id_fkey"
    FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "role_permissions"
    ADD CONSTRAINT "role_permissions_role_id_fkey"
    FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "role_permissions"
    ADD CONSTRAINT "role_permissions_permission_id_fkey"
    FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "roles" ("id", "name", "description", "priority") VALUES
    ('role-admin', 'ADMIN', 'Full platform access', 100),
    ('role-manager', 'MANAGER', 'Project and task management access', 50),
    ('role-member', 'MEMBER', 'Default workspace member access', 10)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "permissions" ("id", "name", "resource", "action", "description") VALUES
    ('perm-users-read', 'users:read', 'users', 'read', 'Read user profiles'),
    ('perm-users-update', 'users:update', 'users', 'update', 'Update user profiles'),
    ('perm-projects-create', 'projects:create', 'projects', 'create', 'Create projects'),
    ('perm-projects-read', 'projects:read', 'projects', 'read', 'Read projects'),
    ('perm-projects-update', 'projects:update', 'projects', 'update', 'Update projects'),
    ('perm-projects-delete', 'projects:delete', 'projects', 'delete', 'Delete projects'),
    ('perm-tasks-create', 'tasks:create', 'tasks', 'create', 'Create tasks'),
    ('perm-tasks-read', 'tasks:read', 'tasks', 'read', 'Read tasks'),
    ('perm-tasks-update', 'tasks:update', 'tasks', 'update', 'Update tasks'),
    ('perm-tasks-delete', 'tasks:delete', 'tasks', 'delete', 'Delete tasks'),
    ('perm-comments-create', 'comments:create', 'comments', 'create', 'Create comments'),
    ('perm-comments-read', 'comments:read', 'comments', 'read', 'Read comments'),
    ('perm-comments-delete', 'comments:delete', 'comments', 'delete', 'Delete comments'),
    ('perm-analytics-read', 'analytics:read', 'analytics', 'read', 'Read analytics overview')
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT 'role-admin', "id" FROM "permissions"
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT 'role-manager', "id"
FROM "permissions"
WHERE "name" IN (
    'users:read',
    'projects:create', 'projects:read', 'projects:update', 'projects:delete',
    'tasks:create', 'tasks:read', 'tasks:update', 'tasks:delete',
    'comments:create', 'comments:read', 'comments:delete',
    'analytics:read'
)
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT 'role-member', "id"
FROM "permissions"
WHERE "name" IN (
    'users:read', 'users:update',
    'projects:read',
    'tasks:create', 'tasks:read', 'tasks:update',
    'comments:create', 'comments:read', 'comments:delete'
)
ON CONFLICT ("role_id", "permission_id") DO NOTHING;

INSERT INTO "user_roles" ("user_id", "role_id")
SELECT "id",
    CASE "role"::TEXT
        WHEN 'ADMIN' THEN 'role-admin'
        WHEN 'MANAGER' THEN 'role-manager'
        ELSE 'role-member'
    END
FROM "users"
ON CONFLICT ("user_id", "role_id") DO NOTHING;

ALTER TABLE "users" DROP COLUMN IF EXISTS "role";
DROP TYPE IF EXISTS "Role";

-- Create project membership table.
CREATE TABLE IF NOT EXISTS "project_members" (
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_members_pkey" PRIMARY KEY ("project_id", "user_id")
);

ALTER TABLE "project_members"
    ADD CONSTRAINT "project_members_project_id_fkey"
    FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "project_members"
    ADD CONSTRAINT "project_members_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "project_members" ("project_id", "user_id", "role")
SELECT DISTINCT "project_id", "assignee_id", 'MEMBER'
FROM "tasks"
WHERE "project_id" IS NOT NULL AND "assignee_id" IS NOT NULL
ON CONFLICT ("project_id", "user_id") DO NOTHING;

-- Create comments table.
CREATE TABLE IF NOT EXISTS "comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "task_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "comments"
    ADD CONSTRAINT "comments_task_id_fkey"
    FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "comments"
    ADD CONSTRAINT "comments_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "comments_task_id_idx" ON "comments"("task_id");
CREATE INDEX IF NOT EXISTS "comments_user_id_idx" ON "comments"("user_id");
