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
  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) {
    console.warn("[GA] missing env", {
      GA_MEASUREMENT_ID: !!GA_MEASUREMENT_ID,
      GA_API_SECRET: !!GA_API_SECRET,
    });
    return { success: false, reason: "missing_env" };
  }

  if (!name) {
    console.warn("[GA] missing event name");
    return { success: false, reason: "missing_event_name" };
  }

  const clientId = getUserId();

  console.log("[GA] trackEvent called", {
    event: name,
    clientId,
    params,
  });

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
          platform: "Desktop",
          app_version: app.getVersion(),
        },
      },
    ],
  };

  // ⚠️ body 전체는 찍지 말고 요약만
  console.log("[GA] request prepared", {
    url,
    bodyPreview: {
      client_id: body.client_id,
      event: body.events[0].name,
    },
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("[GA] request sent", {
      status: res.status,
      ok: res.ok,
    });

    return { success: true };
  } catch (e) {
    console.error("[GA] network error", e);
    return { success: false, reason: "network_error" };
  }
}