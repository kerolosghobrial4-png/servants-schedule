export type FormState = {
  ok?: boolean;
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
  /** One-time secrets (e.g. a temporary password) shown once after an action. */
  secret?: string;
};

export const initialFormState: FormState = {};
