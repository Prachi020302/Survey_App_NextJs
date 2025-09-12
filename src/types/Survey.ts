export type FieldType = "text" | "number" | "checkbox" | "select" | "radio";

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  options?: string[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Field[];
  isActive: boolean;
}

export interface SurveyListResponse {
  surveyList: Survey[];
  count: number;
}

export interface SurveyState {
  surveys: SurveyListResponse;
  currentSurvey: Survey | null;
  loading: boolean;
  error: { statusCode: string; message: string } | null;
}
