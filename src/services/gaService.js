/**
 * @fileoverview
 * GA4 Measurement Protocol 전송 서비스
 * - client_id로 기존 userId(UUID)를 그대로 사용
 * - API Secret은 Main 프로세스에서만 사용
 */

import { app } from "electron";
import { getUserId } from "./settingService.js";

/**
 * GA4 이벤트 전송
 * @param {string} name 이벤트 이름
 * @param {Record<string, any>} [params] 이벤트 파라미터
 * @returns {Promise<{success: boolean, reason?: string}>}
 */
export async function trackEvent(name, params = {}) {
  const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
  const GA_API_SECRET = process.env.GA_API_SECRET;

  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) return { success: false, reason: "missing_env" };
  if (!name) return { success: false, reason: "missing_event_name" };

  const clientId = getUserId();

  const url =
    `https://www.google-analytics.com/mp/collect` +
    `?measurement_id=${encodeURIComponent(GA_MEASUREMENT_ID)}` +
    `&api_secret=${encodeURIComponent(GA_API_SECRET)}`;

  const body = {
    client_id: clientId,
    events: [
      {
        name,
        params: {
          ...params,
          platform: "electron",
          app_version: app.getVersion(),
        },
      },
    ],
  };

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { success: true };
  } catch {
    return { success: false, reason: "network_error" };
  }
}