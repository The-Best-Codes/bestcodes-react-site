import { NextRequest, NextResponse } from "next/server";
import nodeMailer from "nodemailer";

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     description: Sends an email with the contact form data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the sender
 *               email:
 *                 type: string
 *                 description: Email of the sender
 *               message:
 *                 type: string
 *                 description: Message from the sender
 *               cloudflareToken:
 *                 type: string
 *                 description: Cloudflare Turnstile token
 *             required:
 *               - name
 *               - email
 *               - message
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: All fields are required
 *       401:
 *         description: Invalid captcha
 *       500:
 *         description: Failed to send email or internal server error
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, message, cloudflareToken } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    if (!cloudflareToken) {
      return NextResponse.json(
        { error: "Please verify that you are human." },
        { status: 401 },
      );
    }

    try {
      const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
            response: cloudflareToken,
          }),
        },
      );

      const data = await response.json();

      if (!data.success) {
        return NextResponse.json({ error: "Invalid captcha" }, { status: 401 });
      }
    } catch (error) {
      console.error("Turnstile verification failed:", error);
      return NextResponse.json(
        { error: "Failed to verify captcha." },
        { status: 500 },
      );
    }

    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PSW,
        },
      });

      const mailOptions = {
        from: `BestCodes Website <${process.env.GMAIL_USER}>`,
        to: `${process.env.GMAIL_USER}`,
        subject: `New Submission of BestCodes Contact Form - From ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error("Email sending failed:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Unexpected error during submission:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
