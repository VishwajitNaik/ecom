import connectDB from '../../../../dbconfig/dbconfig';
import Cart from '../../../../models/cart';
import Product from '../../../../models/products';
import ProductPack from '../../../../models/productPack';
export async function POST(request) {
  try {
    await connectDB();
    const { userId, guestId } = await request.json();

    // Build owner query: prefer userId, else guestId
    const ownerQuery = userId ? { userId } : (guestId ? { guestId } : null);
    if (!ownerQuery) return Response.json([]);

    // Get cart items without population first
    const cartItems = await Cart.find(ownerQuery);

    // Manually populate based on itemType or detect by checking collections
    const populatedItems = await Promise.all(
      cartItems.map(async (item) => {
        let populatedItem = item.toObject();

        // First, determine the itemId to check
        const itemIdToCheck = item.itemId || item.productId;

        if (!itemIdToCheck) {
          return null; // Invalid item
        }

        // Check if this ID exists in ProductPack collection
        const productPack = await ProductPack.findById(itemIdToCheck).populate('productId');
        if (productPack) {
          // This is a ProductPack
          populatedItem.productId = productPack;
          populatedItem.itemType = 'productPack';
          populatedItem.itemId = itemIdToCheck;
        } else {
          // Check if this ID exists in Product collection
          const product = await Product.findById(itemIdToCheck);
          if (product) {
            // This is a regular Product
            populatedItem.productId = product;
            populatedItem.itemType = 'product';
            populatedItem.itemId = itemIdToCheck;
          } else {
            // Neither ProductPack nor Product found, skip this item
            return null;
          }
        }

        return populatedItem;
      })
    );

    // Filter out null items (products/packs that couldn't be found)
    const validItems = populatedItems.filter(item => item !== null);

    return Response.json(validItems);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}