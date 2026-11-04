export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export class ProductApiError extends Error {
  constructor(message: string, readonly statusCode = 502) {
    super(message);
    this.name = "ProductApiError";
  }
}

export class ProductDataService {
  constructor(private readonly baseUrl: string) {}

  async getAllProducts(): Promise<Product[]> {
    return this.request<Product[]>("/products");
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async getProductImage(id: number): Promise<{ data: Uint8Array; contentType: string }> {
    const product = await this.getProduct(id);
    const imageUrl = new URL(product.image, this.baseUrl);
    const apiHost = new URL(this.baseUrl).hostname;
    if (imageUrl.protocol !== "https:" || imageUrl.hostname !== apiHost) {
      throw new ProductApiError("The product service returned an unsupported image URL.");
    }

    let response: Response;
    try {
      response = await fetch(imageUrl, { signal: AbortSignal.timeout(10000) });
    } catch {
      throw new ProductApiError("The product image is temporarily unavailable.");
    }

    if (!response.ok || new URL(response.url).hostname !== apiHost) {
      throw new ProductApiError("The product image is temporarily unavailable.");
    }

    const contentType = response.headers.get("content-type")?.split(";")[0] ?? "";
    if (!contentType.startsWith("image/")) {
      throw new ProductApiError("The product service returned an invalid image.");
    }
    return { data: new Uint8Array(await response.arrayBuffer()), contentType };
  }

  async getCategories(): Promise<string[]> {
    return this.request<string[]>("/products/categories");
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.request<Product[]>(`/products/category/${encodeURIComponent(category)}`);
  }

  private async request<T>(path: string): Promise<T> {
    let response: Response;

    try {
      response = await fetch(new URL(path, this.baseUrl), { signal: AbortSignal.timeout(10000) });
    } catch {
      throw new ProductApiError("The product service is unavailable. Please try again later.");
    }

    if (!response.ok) {
      throw new ProductApiError(`The product service returned ${response.status}.`);
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new ProductApiError("The product service returned an invalid response.");
    }
  }
}
