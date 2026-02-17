import type { FormFieldType, FormPurpose } from '@/config/constants';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldValidation {
  required: boolean;
  minLength: number | null;
  maxLength: number | null;
  min: number | null;
  max: number | null;
  pattern: string | null;
  customMessage: string;
}

export interface FormField {
  fieldId: string;
  type: FormFieldType;
  label: string;
  name: string;
  placeholder: string;
  defaultValue: unknown;
  validation: FormFieldValidation;
  options: FormFieldOption[];
  order: number;
  conditionalOn: {
    fieldName: string | null;
    value: unknown;
  };
  leadFieldMapping: string | null;
}

export interface DynamicForm {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  purpose: FormPurpose;
  fields: FormField[];
  postSubmitAction: 'message' | 'redirect' | 'both';
  successMessage: string;
  redirectUrl: string;
  assignedPages: { pageType: string; entityId: string | null }[];
  visibility: {
    requiresAuth: boolean;
    allowedRoles: string[];
  };
  isPublished: boolean;
  version: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFormRequest {
  title: string;
  description?: string;
  purpose?: FormPurpose;
  fields?: FormField[];
  postSubmitAction?: string;
  successMessage?: string;
  redirectUrl?: string;
}

export interface UpdateFormRequest extends Partial<CreateFormRequest> {}

export interface FormSubmission {
  _id: string;
  id: string;
  form: string | DynamicForm;
  formVersion: number;
  formSnapshot: unknown;
  data: Record<string, unknown>;
  submittedBy: string | null;
  ip: string;
  userAgent: string;
  pageContext: {
    pageType: string;
    entityId: string | null;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}
