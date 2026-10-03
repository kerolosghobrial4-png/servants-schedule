import type { Role } from "@/db/schema";

/**
 * Role-based access control. Every server action and staff page checks a
 * permission here — hiding a button is never the security boundary.
 */
export const PERMISSIONS = {
  // Student capabilities
  "quiz.take": ["student"],
  // Staff (leader + admin)
  "admin.access": ["leader", "admin"],
  "students.view": ["leader", "admin"],
  "quizzes.manage": ["leader", "admin"],
  "questions.manage": ["leader", "admin"],
  "submissions.review": ["leader", "admin"],
  "points.manage": ["leader", "admin"],
  "achievements.grant": ["leader", "admin"],
  // Admin only
  "students.manage": ["admin"],
  "staff.manage": ["admin"],
  "seasons.manage": ["admin"],
  "achievements.manage": ["admin"],
  "settings.manage": ["admin"],
  "audit.view": ["admin"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

export function isStaff(role: Role): boolean {
  return role === "leader" || role === "admin";
}

export const ROLE_LABELS: Record<Role, string> = {
  student: "Student",
  leader: "Leader",
  admin: "Admin",
};
