import admin from "firebase-admin";

let app;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
} else {
  app = admin.app();
}

export const adminMessaging = admin.messaging();

export const getFirebaseAdmin = () => app;

// Function to send notification to all admins
export async function sendNotificationToAllAdmins(title, body, data = {}) {
  try {
    // Call the admin notification API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/notify/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        data,
      }),
    });

    const result = await response.json();
    console.log('Notification to all admins result:', result);
    return result;
  } catch (error) {
    console.error('Error sending notification to all admins:', error);
    return { success: false, error: error.message };
  }
}

// Function to send order notification to all admins
export async function sendOrderNotificationToAdmins(orderData) {
  try {
    const { userName, items, total, paymentMethod, paymentStatus, orderId } = orderData;

    // Build product names string
    const productNames = items.map(item => item.name || 'Product').join(', ');
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const title = '🛒 New Order Received!';
    const body = `${userName} ordered ${totalQuantity} item(s) - ₹${total} (${paymentMethod === 'COD' ? 'Cash on Delivery' : paymentStatus === 'success' ? 'Paid' : 'Payment Pending'})`;

    // Call the admin notification API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/notify/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        data: {
          orderId: orderId || '',
          userName,
          total: total.toString(),
          paymentMethod,
          paymentStatus,
        },
      }),
    });

    const result = await response.json();
    console.log('Order notification to admins result:', result);
    return result;
  } catch (error) {
    console.error('Error sending order notification to admins:', error);
    return { success: false, error: error.message };
  }
}
