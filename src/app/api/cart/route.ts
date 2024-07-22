import { listItemOnCart } from "@/app/services/cart";

export async function GET() {
  const cartItems = await listItemOnCart();
  return Response.json({ data: cartItems });
}
