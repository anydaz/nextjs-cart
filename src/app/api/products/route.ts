import { listProducts } from "@/app/services/product";

export async function GET() {
  const products = await listProducts();
  return Response.json({ data: products });
}
