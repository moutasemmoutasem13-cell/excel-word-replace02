import type { GoogleSheetsData, FormData, SubmitResponse } from '../types';

const GOOGLE_APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

export async function fetchGoogleSheetsData(): Promise<GoogleSheetsData> {
  if (!GOOGLE_APPS_SCRIPT_URL) {
    throw new Error('Google Apps Script URL is not configured');
  }

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
}

export async function submitFormToN8n(formData: FormData): Promise<SubmitResponse> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('n8n Webhook URL is not configured');
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit form: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting form to n8n:', error);
    throw error;
  }
}
