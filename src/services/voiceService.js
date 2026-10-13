import api from './api';

export const voiceService = {
  async processVoiceQuery(query, language = 'en') {
    const res = await api.post('/voice/process', { query, language });
    return res.data;
  },
};
