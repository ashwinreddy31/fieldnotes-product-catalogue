
import nodemailer from "nodemailer";

export interface Enquiry {
  name: string;
  email: string;
  phone: string;
  message: string;
  productTitle?: string;
}

interface EmailConfig {
  provider: string;
  to: string;
  from: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPass?: string;
}

export class EmailService {
  constructor(private readonly config: EmailConfig) {}

  async sendEnquiry(enquiry: Enquiry): Promise<void> {
    console.info("Email provider selected:", this.config.provider);

    const subject = enquiry.productTitle
      ? `Product enquiry: ${enquiry.productTitle}`
      : "New product catalogue enquiry";

    const text = [
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone}`,
      enquiry.productTitle
        ? `Product: ${enquiry.productTitle}`
        : undefined,
      "",
      enquiry.message
    ]
      .filter((line): line is string => line !== undefined)
      .join("\n");

    if (this.config.provider === "console") {
      console.info(
        `[local enquiry email]\nTo: ${this.config.to}\nSubject: ${subject}\n\n${text}`
      );
      return;
    }

    if (
      this.config.provider !== "smtp" ||
      !this.config.smtpHost ||
      !this.config.smtpPort
    ) {
      throw new Error("Email provider configuration is invalid.");
    }

    const transport = nodemailer.createTransport({
      host: this.config.smtpHost,
      port: this.config.smtpPort,
      secure: this.config.smtpSecure ?? false,
      auth: this.config.smtpUser
        ? {
            user: this.config.smtpUser,
            pass: this.config.smtpPass ?? ""
          }
        : undefined,
      logger: true,
      debug: true
    });

    try {
      console.info(
        `Connecting to SMTP: ${this.config.smtpHost}:${this.config.smtpPort}`
      );

      await transport.verify();

      console.info("SMTP connection verified successfully.");

      const info = await transport.sendMail({
        from: this.config.from,
        to: this.config.to,
        replyTo: enquiry.email,
        subject,
        text
      });

      console.info("Email accepted by SMTP server.");
      console.info("Message ID:", info.messageId);
      console.info("SMTP response:", info.response);
    } catch (error) {
      console.error("SMTP email delivery failed:", error);
      throw error;
    } finally {
      transport.close();
    }
  }
}
