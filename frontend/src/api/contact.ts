import api from "./axios";

export type ContactPayload = {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export type ContactResponse = {
  status: string;
  submitted_at: string;
};

export async function sendContactMessage(payload: ContactPayload): Promise<ContactResponse> {
  const response = await api.post<ContactResponse>("/contact", payload);
  return response.data;
}

