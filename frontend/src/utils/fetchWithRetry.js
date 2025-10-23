/**
 * Faz um fetch com re-tentativa (retry) para mitigar a latência do Cold Start da DB.
 * @param {string} url - O endpoint da API (ex: '/maquinas').
 * @param {number} maxRetries - O número máximo de tentativas.
 * @param {number} delayMs - O atraso em milissegundos entre tentativas.
 * @returns {Promise<Response>} A resposta da API (se for bem-sucedida).
 */
async function fetchWithRetry(url, maxRetries = 2, delayMs = 3000) {
  let lastError;
  const RETRY_CODES = [503, 504]; // Service Unavailable ou Gateway Timeout

  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return response; // Sucesso
      }

      // Se for um código de erro que podemos tentar de novo
      if (RETRY_CODES.includes(response.status)) {
        throw new Error(`Tentativa ${i + 1}: Erro ${response.status} - Provável Cold Start.`);
      }

      // Se for um erro HTTP definitivo (4xx, 5xx), falha imediatamente
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);

    } catch (error) {
      lastError = error;
      console.warn(error.message);

      if (i === maxRetries) {
        throw lastError; // Lança o erro se for a última tentativa
      }

      // Espera antes de tentar de novo
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
}

export default fetchWithRetry;