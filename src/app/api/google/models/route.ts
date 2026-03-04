import { NextRequest, NextResponse } from 'next/server';

interface RawGoogleModel {
  name: string;
  displayName?: string;
  description?: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
  supportedGenerationMethods?: string[];
}

/**
 * Probe a single model to check free-tier availability.
 * Sends a minimal generateContent request (1 output token).
 *
 * - 200          → model is accessible (free tier or billing active)
 * - 429 limit: 0 → model has NO free tier
 * - 429 limit: N → model has free tier, just rate-limited right now
 * - other error  → unknown
 */
async function probeFreeTier(
  modelId: string,
  apiKey: string,
): Promise<{ modelId: string; freeTier: boolean | null }> {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'hi' }] }],
          generationConfig: { maxOutputTokens: 1 },
        }),
        signal: AbortSignal.timeout(15000),
      },
    );

    if (res.ok) return { modelId, freeTier: true };

    if (res.status === 429) {
      const err = await res.json().catch(() => ({}));
      const message: string = err.error?.message || '';

      // Check top-level error message for "free_tier" + "limit: 0"
      // Google formats it as: "Quota exceeded for metric: .../free_tier_requests, limit: 0, model: ..."
      if (message.includes('free_tier') && message.includes('limit: 0')) {
        return { modelId, freeTier: false };
      }

      // Also check violation details as fallback
      const violations: { quotaMetric?: string; description?: string }[] =
        err.error?.details?.find(
          (d: { '@type'?: string }) => d['@type']?.includes('QuotaFailure'),
        )?.violations ?? [];

      const hasZeroFreeLimit = violations.some(
        (v) =>
          v.quotaMetric?.includes('free_tier') &&
          (v.description?.includes('limit: 0') || true),
      );

      if (hasZeroFreeLimit) {
        return { modelId, freeTier: false };
      }

      // 429 with free_tier mention but limit > 0 → has free tier, just rate-limited
      if (message.includes('free_tier')) {
        return { modelId, freeTier: true };
      }

      // Generic rate limiting — can't determine
      return { modelId, freeTier: null };
    }

    // 400 / 403 / other – can't determine tier
    return { modelId, freeTier: null };
  } catch {
    return { modelId, freeTier: null };
  }
}

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-google-api-key');
  if (!apiKey) {
    return NextResponse.json({ error: 'API key required' }, { status: 401 });
  }

  try {
    // 1. Fetch full model catalogue
    const listRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000&key=${apiKey}`,
    );

    if (!listRes.ok) {
      const err = await listRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error?.message || 'Failed to fetch models' },
        { status: listRes.status },
      );
    }

    const { models: rawModels = [] }: { models: RawGoogleModel[] } =
      await listRes.json();

    // 2. Keep only models that support content generation
    const contentModels = rawModels.filter((m) =>
      m.supportedGenerationMethods?.includes('generateContent'),
    );

    // 3. Probe every model for free-tier availability (parallel, per-request timeout)
    const probeResults = await Promise.allSettled(
      contentModels.map((m) =>
        probeFreeTier(m.name.replace('models/', ''), apiKey),
      ),
    );

    const freeTierMap = new Map<string, boolean | null>();
    for (const result of probeResults) {
      if (result.status === 'fulfilled') {
        freeTierMap.set(result.value.modelId, result.value.freeTier);
      }
    }

    // 4. Build response
    const models = contentModels.map((m) => {
      const id = m.name.replace('models/', '');
      return {
        id,
        name: m.displayName || id,
        description: m.description || '',
        type: id.includes('image') ? 'image' : 'text',
        freeTier: freeTierMap.get(id) ?? null,
        inputTokenLimit: m.inputTokenLimit,
        outputTokenLimit: m.outputTokenLimit,
      };
    });

    return NextResponse.json({ models });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch models' },
      { status: 500 },
    );
  }
}
