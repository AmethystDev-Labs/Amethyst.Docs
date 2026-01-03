'use client';

import { useMemo, useState } from 'react';

type EndpointKey =
  | 'health'
  | 'item_id'
  | 'chapter_get'
  | 'chapter_post'
  | 'batch_ids'
  | 'batch_range';

type EndpointDef = {
  key: EndpointKey;
  label: string;
  method: 'GET' | 'POST';
  pathTemplate: string;
  defaultBody?: string;
  expectsText?: boolean;
};

const endpoints: EndpointDef[] = [
  {
    key: 'health',
    label: '健康检查: GET /api/fqnovel/health',
    method: 'GET',
    pathTemplate: '/api/fqnovel/health',
  },
  {
    key: 'item_id',
    label: '单章(新增): GET /api/fqnovel/item_id/{itemId}',
    method: 'GET',
    pathTemplate: '/api/fqnovel/item_id/{itemId}',
    expectsText: true,
  },
  {
    key: 'chapter_get',
    label: '章节(兼容): GET /api/fqnovel/chapter/{bookId}/{chapterId}',
    method: 'GET',
    pathTemplate: '/api/fqnovel/chapter/{bookId}/{chapterId}',
    expectsText: true,
  },
  {
    key: 'chapter_post',
    label: '章节(兼容): POST /api/fqnovel/chapter',
    method: 'POST',
    pathTemplate: '/api/fqnovel/chapter',
    defaultBody: JSON.stringify({ bookId: '', chapterId: '' }, null, 2),
    expectsText: true,
  },
  {
    key: 'batch_ids',
    label: '批量(更新): POST /api/fqnovel/chapters/batch (chapterIds)',
    method: 'POST',
    pathTemplate: '/api/fqnovel/chapters/batch',
    defaultBody: JSON.stringify(
      { bookId: '7276384138653862966', chapterIds: ['7282975997584998953'] },
      null,
      2,
    ),
  },
  {
    key: 'batch_range',
    label: '批量(新增): POST /api/fqnovel/chapters/batch (chapterRange)',
    method: 'POST',
    pathTemplate: '/api/fqnovel/chapters/batch',
    defaultBody: JSON.stringify(
      { bookId: '7276384138653862966', chapterRange: '1-30' },
      null,
      2,
    ),
  },
];

function normalizeBaseUrl(input: string) {
  return input.trim().replace(/\/+$/, '');
}

function getRequiredParams(pathTemplate: string) {
  return Array.from(pathTemplate.matchAll(/{([^}]+)}/g)).map((match) => match[1]);
}

function buildUrl(baseUrl: string, pathTemplate: string, params: Record<string, string>) {
  const normalized = normalizeBaseUrl(baseUrl);
  const path = pathTemplate.replace(/{([^}]+)}/g, (_, name: string) =>
    encodeURIComponent(params[name] ?? `{${name}}`),
  );
  return `${normalized}${path}`;
}

export default function ApiPlayground() {
  const [endpointKey, setEndpointKey] = useState<EndpointKey>('health');
  const endpoint = useMemo(
    () => endpoints.find((e) => e.key === endpointKey) ?? endpoints[0],
    [endpointKey],
  );

  const [baseUrl, setBaseUrl] = useState('https://fq.amethysty.dev');
  const requiredParams = useMemo(
    () => getRequiredParams(endpoint.pathTemplate),
    [endpoint.pathTemplate],
  );

  const [params, setParams] = useState<Record<string, string>>({
    itemId: '7282975997584998953',
    bookId: '7276384138653862966',
    chapterId: '7282975997584998953',
  });

  const [body, setBody] = useState(endpoint.defaultBody ?? '');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseMeta, setResponseMeta] = useState<{
    status: number;
    statusText: string;
    durationMs: number;
    contentType: string | null;
  } | null>(null);
  const [responseText, setResponseText] = useState<string>('');

  const url = useMemo(
    () => buildUrl(baseUrl, endpoint.pathTemplate, params),
    [baseUrl, endpoint.pathTemplate, params],
  );

  const missingParams = requiredParams.filter((name) => !params[name]?.trim());
  const canSend = missingParams.length === 0 && !sending && normalizeBaseUrl(baseUrl).length > 0;

  return (
    <div className="not-prose my-6 rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="text-base font-semibold">API Playground</div>
          <div className="text-sm text-muted-foreground">
            在浏览器里直接发起请求；若遇到跨域限制，请确认服务端已开启 CORS。
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          onClick={async () => {
            setError(null);
            setResponseMeta(null);
            setResponseText('');
            setSending(true);
            const startedAt = performance.now();

            try {
              const headers: Record<string, string> = {};
              let requestBody: string | undefined;

              if (endpoint.method !== 'GET') {
                headers['content-type'] = 'application/json';
                requestBody = body.trim().length > 0 ? body : '{}';
                JSON.parse(requestBody);
              }

              const res = await fetch(url, {
                method: endpoint.method,
                headers,
                body: requestBody,
              });

              const durationMs = Math.round(performance.now() - startedAt);
              const contentType = res.headers.get('content-type');
              const text = await res.text();

              setResponseMeta({
                status: res.status,
                statusText: res.statusText,
                durationMs,
                contentType,
              });

              if (!endpoint.expectsText && contentType?.includes('application/json')) {
                try {
                  setResponseText(JSON.stringify(JSON.parse(text), null, 2));
                } catch {
                  setResponseText(text);
                }
              } else {
                setResponseText(text);
              }
            } catch (e) {
              setError(e instanceof Error ? e.message : String(e));
            } finally {
              setSending(false);
            }
          }}
          disabled={!canSend}
        >
          {sending ? 'Sending…' : 'Send'}
        </button>
      </div>

      <div className="grid gap-4 border-t p-4 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block space-y-1">
            <div className="text-sm font-medium">Endpoint</div>
            <select
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              value={endpointKey}
              onChange={(e) => {
                const nextKey = e.target.value as EndpointKey;
                const nextEndpoint = endpoints.find((x) => x.key === nextKey);
                setEndpointKey(nextKey);
                setBody(nextEndpoint?.defaultBody ?? '');
              }}
            >
              {endpoints.map((e) => (
                <option key={e.key} value={e.key}>
                  {e.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <div className="text-sm font-medium">Base URL</div>
            <input
              className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://fq.amethysty.dev"
              inputMode="url"
            />
          </label>

          {requiredParams.length > 0 ? (
            <div className="space-y-2">
              <div className="text-sm font-medium">Path Params</div>
              <div className="grid gap-2">
                {requiredParams.map((name) => (
                  <label key={name} className="grid grid-cols-[120px_1fr] items-center gap-2">
                    <div className="text-sm text-muted-foreground">{name}</div>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono"
                      value={params[name] ?? ''}
                      onChange={(e) => setParams((p) => ({ ...p, [name]: e.target.value }))}
                      placeholder={name}
                    />
                  </label>
                ))}
              </div>
              {missingParams.length > 0 ? (
                <div className="text-xs text-destructive">
                  缺少参数：{missingParams.join(', ')}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-1">
            <div className="text-sm font-medium">Request</div>
            <div className="rounded-md border bg-muted px-3 py-2 text-xs font-mono">
              {endpoint.method} {url}
            </div>
          </div>

          {endpoint.method === 'POST' ? (
            <label className="block space-y-1">
              <div className="text-sm font-medium">JSON Body</div>
              <textarea
                className="min-h-40 w-full resize-y rounded-md border bg-background px-3 py-2 text-sm font-mono"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                spellCheck={false}
              />
              <div className="text-xs text-muted-foreground">
                发送前会先进行 JSON 校验；无内容时会用 {'{}'}。
              </div>
            </label>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium">Response</div>

          {error ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {responseMeta ? (
            <div className="rounded-md border bg-muted p-3 text-xs">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <div>
                  Status: <span className="font-mono">{responseMeta.status}</span>{' '}
                  <span className="text-muted-foreground">{responseMeta.statusText}</span>
                </div>
                <div>
                  Time: <span className="font-mono">{responseMeta.durationMs}ms</span>
                </div>
                <div className="truncate">
                  Content-Type:{' '}
                  <span className="font-mono">{responseMeta.contentType ?? 'unknown'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border bg-muted p-3 text-xs text-muted-foreground">
              点击 Send 获取响应
            </div>
          )}

          <pre className="max-h-[420px] overflow-auto rounded-md border bg-background p-3 text-xs font-mono">
            {responseText || ' '}
          </pre>
        </div>
      </div>
    </div>
  );
}

