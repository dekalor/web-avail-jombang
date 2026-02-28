import { useErrorModal } from "./useErrorModal"

export function useApi() {
  const { showError } = useErrorModal()

  function headers(withBody) {
    if (!withBody) return {}
    return {
      'Content-Type': 'application/json',
    }
  }

  async function request(method, path, body) {
    try {
      const res = await fetch(`/api${path}`, {
        method,
        credentials: 'include',
        headers: headers(body !== undefined),
        body: body ? JSON.stringify(body) : undefined,
      })
      const data = await res.json()

      if (!data.success) {
        showError(data.message || 'Terjadi kesalahan, silahkan coba beberapa saat lagi')
        return { success: false }
      }

      return { success: true, data: data.data }
    } catch (err) {
      showError('Tidak dapat terhubung ke server. Periksa koneksi Anda.')
      return { success: false }
    }
  }

  return {
    get: path => request('GET', path),
    post: (path, b) => request('POST', path, b),
    put: (path, b) => request('PUT', path, b),
    patch: (path, b) => request('PATCH', path, b),
    delete: path => request('DELETE', path),
  }
}
