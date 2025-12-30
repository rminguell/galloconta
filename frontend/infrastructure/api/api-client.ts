import { config } from "@/core/config";

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.backendUrl;
    if (!this.baseUrl) {
      throw new Error("Missing BACKEND_URL environment variable");
    }
  }

  async post<T>(endpoint: string, body: FormData | object): Promise<T> {
    const isFormData = body instanceof FormData;

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? body : JSON.stringify(body),
    });

    return response.json();
  }

  getFullUrl(path: string): string {
    return this.baseUrl + path.slice(1);
  }
}

export const apiClient = new ApiClient();
