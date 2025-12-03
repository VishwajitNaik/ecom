export function getUserFromToken() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    // Decode JWT payload without importing heavy libraries in the browser
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decodedJson = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const decoded = JSON.parse(decodeURIComponent(escape(decodedJson)));
    return decoded;
  } catch (error) {
    console.error('Failed to decode token in getUserFromToken:', error);
    return null;
  }
}

export function getGuestId() {
  if (typeof window === 'undefined') return null;
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    try {
      guestId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `guest-${Date.now()}-${Math.floor(Math.random()*100000)}`;
    } catch (e) {
      guestId = `guest-${Date.now()}-${Math.floor(Math.random()*100000)}`;
    }
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
}