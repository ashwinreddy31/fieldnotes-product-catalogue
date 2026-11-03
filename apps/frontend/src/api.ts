export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface EnquiryInput {
  name: string;
  email: string;
  phone: string;
  message: string;
  productTitle?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

function useBackendImages(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    image: `${API_BASE_URL}/products/${product.id}/image`
  }));
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers }
    });
  } catch {
    throw new Error("Can't reach the catalogue right now. Check that the backend is running.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => undefined) as { error?: string } | undefined;
    throw new Error(body?.error ?? `Request failed (${response.status}). Please try again.`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  featured: async () => useBackendImages(await request<Product[]>("/products/featured")),
  categories: () => request<string[]>("/categories"),
  products: async (search?: string, category?: string) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    const query = params.size > 0 ? `?${params.toString()}` : "";
    return useBackendImages(await request<Product[]>(`/products${query}`));
  },
  product: async (id: string) => {
    const product = await request<Product>(`/products/${encodeURIComponent(id)}`);
    return useBackendImages([product])[0];
  },
  submitEnquiry: (enquiry: EnquiryInput) => request<{ message: string }>("/enquiries", {
    method: "POST",
    body: JSON.stringify(enquiry)
  })
};
