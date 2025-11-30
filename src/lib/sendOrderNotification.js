// Helper function to send order notification to admin
export async function sendOrderNotification(orderData) {
  try {
    const { userName, items, total, paymentMethod, paymentStatus } = orderData;
    
    // Build product names string
    const productNames = items.map(item => item.name || 'Product').join(', ');
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const title = '🛒 New Order Received!';
    const body = `${userName} ordered ${totalQuantity} item(s) - ₹${total} (${paymentMethod === 'COD' ? 'Cash on Delivery' : paymentStatus === 'success' ? 'Paid' : 'Payment Pending'})`;
    
    const response = await fetch('/api/notify/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        data: {
          orderId: orderData.orderId || '',
          userName,
          total: total.toString(),
          paymentMethod,
          paymentStatus,
        },
      }),
    });

    const result = await response.json();
    console.log('Order notification sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending order notification:', error);
    return { success: false, error: error.message };
  }
}

// Server-side function to send notification (for API routes)
export async function sendOrderNotificationServer(orderData) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const { userName, items, total, paymentMethod, paymentStatus } = orderData;
    
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    const title = '🛒 New Order Received!';
    const body = `${userName} ordered ${totalQuantity} item(s) - ₹${total} (${paymentMethod === 'COD' ? 'Cash on Delivery' : paymentStatus === 'success' ? 'Paid' : 'Payment Pending'})`;
    
    const response = await fetch(`${baseUrl}/api/notify/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        body,
        data: {
          orderId: orderData.orderId || '',
          userName,
          total: total.toString(),
          paymentMethod,
          paymentStatus,
        },
      }),
    });

    const result = await response.json();
    console.log('Order notification sent (server):', result);
    return result;
  } catch (error) {
    console.error('Error sending order notification (server):', error);
    return { success: false, error: error.message };
  }
}