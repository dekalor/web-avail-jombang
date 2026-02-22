export function useApi() {
  function headers(withBody) {
    if (!withBody) return {}
    return {
      'Content-Type': 'application/json',
    }
  }

  async function request(method, path, body) {
    const res = await fetch(`/api${path}`, {
      method,
      credentials: 'include',
      headers: headers(body !== undefined),
      body: body ? JSON.stringify(body) : undefined,
    })
    return res.json().catch(() => ({ success: false, message: 'Invalid server response' }))
  }

  return {
    get: path => request('GET', path),
    post: (path, b) => request('POST', path, b),
    put: (path, b) => request('PUT', path, b),
    patch: (path, b) => request('PATCH', path, b),
    delete: path => request('DELETE', path),
  }
}
