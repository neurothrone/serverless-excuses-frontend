import type ApiResponse from "../types/api-response";
import type Excuse from "../types/excuse.ts";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || import.meta.env.VITE_BASE_API_URL_LOCAL;
const FUNCTION_KEY = import.meta.env.VITE_FUNCTION_KEY;

const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    "x-functions-key": FUNCTION_KEY
  };
};

async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      return { error: errorText || `Error: ${response.status}` };
    }

    if (response.status === 204) {
      return { data: undefined as T };
    }


    const data = await response.json();
    return { data };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
}

// API functions
export const api = {
  getAllExcuses: async (): Promise<ApiResponse<Excuse[]>> => {
    return fetchWithErrorHandling<Excuse[]>(`${BASE_API_URL}/excuses`, {
      headers: getHeaders()
    });
  },

  getExcuseById: async (id: string): Promise<ApiResponse<Excuse>> => {
    return fetchWithErrorHandling<Excuse>(`${BASE_API_URL}/excuses/${id}`, {
      headers: getHeaders()
    });
  },

  getRandomExcuse: async (): Promise<ApiResponse<Excuse>> => {
    return fetchWithErrorHandling<Excuse>(`${BASE_API_URL}/excuses/random`, {
      headers: getHeaders()
    });
  },

  createExcuse: async (text: string): Promise<ApiResponse<Excuse>> => {
    return fetchWithErrorHandling<Excuse>(`${BASE_API_URL}/excuses`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
  },

  updateExcuse: async (id: string, text: string): Promise<ApiResponse<Excuse>> => {
    return fetchWithErrorHandling<Excuse>(`${BASE_API_URL}/excuses/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
  },

  deleteExcuse: async (id: string): Promise<ApiResponse<void>> => {
    return fetchWithErrorHandling<void>(`${BASE_API_URL}/excuses/${id}`, {
      method: "DELETE",
      headers: getHeaders()
    });
  }
};
