import { apiClient } from './apiClient';

interface ChatResponse {
  success: boolean;
  data: { reply: string };
}

export const chatApi = {
  enviar: async (sessionId: string, message: string) => {
    // El agente puede consultar herramientas (programas, pre-inscripción, WhatsApp): damos margen
    const response = await apiClient.post<ChatResponse>(
      '/api/chat',
      { sessionId, message },
      { timeout: 120_000 },
    );
    return response.data.data.reply;
  },
};
