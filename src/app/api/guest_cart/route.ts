import { addToGuestCart, listItemOnGuestCart } from "@/app/services/cart";
import errorHandler from "@/app/utils/error-handler";

export async function GET() {
  const cartItems = await listItemOnGuestCart();
  return Response.json({ data: cartItems });
}

export async function POST(req: Request) {
  const { product_id, quantity } = await req.json();

  try {
    const item = await addToGuestCart({ product_id, quantity });

    return Response.json({
      data: item,
    });
  } catch (error) {
    return errorHandler(error);
  }
}
