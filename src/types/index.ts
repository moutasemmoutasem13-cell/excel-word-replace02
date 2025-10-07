export interface FormData {
  studentName: string;
  group: string;
  planType: string;
  planElement: string;
  day1: string;
  day2: string;
  startDay: number;
  startMonth: number;
  startYear: number;
  planDuration: number;
  requesterName: string;
}

export interface GoogleSheetsData {
  groups: string[];
  plans: string[];
  planElements: Record<string, string[]>;
  requesters: string[];
}

export interface SubmitResponse {
  success: boolean;
  pdfUrl?: string;
  message?: string;
  error?: string;
}
