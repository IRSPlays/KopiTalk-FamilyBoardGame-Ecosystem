/**
 * @file This file contains functions for interacting with the backend server API.
 * It abstracts the fetch calls into reusable functions for different endpoints.
 */

/**
 * Represents the expected result from the `processTurn` API call.
 */
export interface ProcessTurnResult {
  /** The status of the request, e.g., "success". */
  status: string;
  /** The data processed by the model, if the turn was successful. */
  processed_data?: any;
  /** The raw response from the Gemini model, for debugging. */
  raw_gemini_response?: string;
}

/** The base URL for the backend server, configured via environment variables. */
const SERVER_BASE = import.meta.env.VITE_SERVER_BASE || 'http://localhost:8000';

/**
 * Submits an image from an ESP32 device to the server.
 * @param {string} esp32Id - The unique identifier of the ESP32 device.
 * @param {Blob} image - The image data to submit.
 * @returns {Promise<{ status: string; message: string }>} A promise that resolves with the server's response.
 * @throws {Error} If the fetch request fails.
 */
export async function submitEsp32Image(esp32Id: string, image: Blob): Promise<{ status: string; message: string }> {
  const url = `${SERVER_BASE}/esp32/submit-image?esp32_id=${encodeURIComponent(esp32Id)}`;
  const res = await fetch(url, { method: 'POST', body: image });
  if (!res.ok) throw new Error(`submit-image failed: ${res.status}`);
  return res.json();
}

/**
 * Sends the game state to the server to be processed by the AI model.
 * This includes the latest board image (fetched by the server) and a character image.
 * @param {string} esp32Id - The ID of the ESP32 providing the board image.
 * @param {string} gameSessionId - The ID of the current game session.
 * @param {File} characterImage - The image file of the character piece.
 * @returns {Promise<ProcessTurnResult>} A promise that resolves with the processed turn data.
 * @throws {Error} If the fetch request fails.
 */
export async function processTurn(esp32Id: string, gameSessionId: string, characterImage: File): Promise<ProcessTurnResult> {
  const url = `${SERVER_BASE}/admin/process-turn?esp32_id=${encodeURIComponent(esp32Id)}&game_session_id=${encodeURIComponent(
    gameSessionId,
  )}`;
  const form = new FormData();
  form.append('character_image', characterImage);
  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`process-turn failed: ${res.status} ${text}`);
  }
  return res.json();
}

/**
 * Fetches the current status of all connected ESP32 devices from the admin endpoint.
 * @returns {Promise<any>} A promise that resolves with the admin status data.
 * @throws {Error} If the fetch request fails.
 */
export async function getAdminStatus() {
  const res = await fetch(`${SERVER_BASE}/admin/status`);
  if (!res.ok) throw new Error(`admin/status failed: ${res.status}`);
  return res.json();
}
