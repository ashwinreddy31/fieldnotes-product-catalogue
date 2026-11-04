import "dotenv/config";
import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import helmet from "helmet";
import { ProductApiError, ProductDataService, type Product } from "@catalogue/product-data-service";
import { EmailService, type Enquiry } from "./email.js";

const port = Number(process.env.PORT ?? 4000);
const productService = new ProductDataService(
  process.env.FAKE_STORE_API_URL ?? "https://fakestoreapi.com"
);
const emailService = new EmailService({
  provider: process.env.EMAIL_PROVIDER ?? "console",
  to: process.env.ENQUIRY_TO_EMAIL ?? "hello@example.com",
  from: process.env.EMAIL_FROM ?? "Product Catalogue <no-reply@example.com>",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS
});

const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/api/categories", async (_request, response, next) => {
  try {
    response.json(await productService.getCategories());
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/featured", async (_request, response, next) => {
  try {
    const products = await productService.getAllProducts();
    response.json(sortByRating(products).slice(0, 5));
  } catch (error) {
    next(error);
  }
});

app.get("/api/products", async (request, response, next) => {
  try {
    const category = typeof request.query.category === "string" ? request.query.category : undefined;
    const search = typeof request.query.search === "string"
      ? request.query.search.trim().toLocaleLowerCase()
      : undefined;
    const products = category
      ? await productService.getProductsByCategory(category)
      : await productService.getAllProducts();
    response.json(search
      ? products.filter((product) => `${product.title} ${product.description} ${product.category}`
        .toLocaleLowerCase().includes(search))
      : products);
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:id/image", async (request, response, next) => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id < 1) {
    response.status(400).json({ error: "Product ID must be a positive integer." });
    return;
  }

  try {
    const image = await productService.getProductImage(id);
    response.type(image.contentType).set("Cache-Control", "public, max-age=86400").send(image.data);
  } catch (error) {
    next(error);
  }
});

app.get("/api/products/:id", async (request, response, next) => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id < 1) {
    response.status(400).json({ error: "Product ID must be a positive integer." });
    return;
  }

  try {
    response.json(await productService.getProduct(id));
  } catch (error) {
    next(error);
  }
});

app.post("/api/enquiries", async (request, response, next) => {
  const { name, email, phone, message, productTitle } = request.body ?? {};
  const enquiry: Enquiry = { name, email, phone, message, productTitle };
  const errors = validateEnquiry(enquiry);
  if (Object.keys(errors).length > 0) {
    response.status(400).json({ error: "Please correct the highlighted fields.", fields: errors });
    return;
  }

  try {
    await emailService.sendEnquiry(enquiry);
    response.status(201).json({ message: "Your enquiry has been sent." });
  } catch (error) {
    next(error);
  }
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ProductApiError) {
    response.status(error.statusCode).json({ error: error.message });
    return;
  }

  console.error("Request failed:", error);
  response.status(500).json({ error: "Something went wrong. Please try again." });
};
app.use(errorHandler);

function sortByRating(products: Product[]): Product[] {
  return [...products].sort((a, b) => b.rating.rate - a.rating.rate);
}

function validateEnquiry(enquiry: Enquiry): Record<string, string> {
  const errors: Record<string, string> = {};
  if (typeof enquiry.name !== "string" || !enquiry.name.trim()) {
    errors.name = "Please enter your name.";
  }
  if (typeof enquiry.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(enquiry.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (typeof enquiry.phone !== "string" || !enquiry.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  }
  if (typeof enquiry.message !== "string" || !enquiry.message.trim()) {
    errors.message = "Please enter a message.";
  }
  if (enquiry.productTitle !== undefined && typeof enquiry.productTitle !== "string") {
    errors.productTitle = "Product title must be text.";
  }
  return errors;
}

app.listen(port, () => {
  console.info(`Product Catalogue API listening on http://localhost:${port}`);
});
