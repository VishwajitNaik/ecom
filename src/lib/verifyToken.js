import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  // Fallback: check cookies for `token=` (Set by login route as HttpOnly cookie)
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('token='));
    if (match) return match.split('=')[1];
  }
  return null;
}


// username - Shanu_J
// pass - Dadda,877
// acc_id - 998457201995