export const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; ${
    process.env.NODE_ENV === 'production' ? 'Secure;' : ''
  } SameSite=Lax`
}

export const getCookie = (name: string): string | undefined => {
  // if (typeof document === 'undefined') return undefined
  const value = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')[1]
  return value ? decodeURIComponent(value) : undefined
}

export const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}