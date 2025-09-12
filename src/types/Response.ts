export interface ResponseAnswer {
  questionId: string;
  selectedOptions: string[];
  questionLabel?: string;
}

export interface ResponseDetailData {
  id: string;
  surveyId: {
    id: string;
    title: string;
    description?: string;
  };
  userId: string;
  submittedAt: string;
  answers: ResponseAnswer[];
}

export interface IField {
  id: string;
  label: string;
  type: "text" | "number" | "checkbox" | "select" | "radio";
  options?: string[];
}

export interface FormData {
  [key: string]: string | string[];
}
