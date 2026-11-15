export function requireSameOrigin(request: Request, localDevelopment=false) {
  const url=new URL(request.url);
  const origin=request.headers.get('origin');
  if (origin !== url.origin) {
    // Next normalizes loopback NextRequest URLs to localhost. This exception is
    // limited to the local dev server and still requires the actual Host match.
    let loopback=false;
    try {
      const incoming=new URL(origin || '');
      loopback=localDevelopment && url.hostname==='localhost' && incoming.hostname==='127.0.0.1'
        && incoming.protocol===url.protocol && incoming.port===url.port
        && request.headers.get('host')===incoming.host;
    } catch { /* Missing, null or malformed origins fail closed. */ }
    if(!loopback) throw new Error('FORBIDDEN');
  }
  if (request.headers.get('sec-fetch-site') === 'cross-site') throw new Error('FORBIDDEN');
}

/** Bound the streamed bytes too: Content-Length is controlled by the caller. */
export async function readJson(request: Request, maximum = 32768): Promise<unknown> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new Error('INVALID_INPUT');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('INVALID_INPUT');
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      total += part.value.byteLength;
      if (total > maximum) { await reader.cancel(); throw new Error('INVALID_INPUT'); }
      chunks.push(part.value);
    }
    const bytes = new Uint8Array(total);
    let position = 0;
    for (const chunk of chunks) { bytes.set(chunk,position); position += chunk.byteLength; }
    return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  } catch { throw new Error('INVALID_INPUT'); }
  finally { reader.releaseLock(); }
}
