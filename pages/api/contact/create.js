// pages/api/contact/create.js

import nodeMailer from "nodemailer";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, email, message, cloudflareToken } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (cloudflareToken) {
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
                        response: token,
                    }),
                }
            );

            const data = await response.json();

            if (!data.success) {
                return res.status(401).json({ error: "Invalid captcha" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Failed to verify captcha" });
        }
    } else {
        return res.status(401).json({ error: "Invalid captcha" });
    }

    try {
        const transporter = nodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "bestcodes.official@gmail.com",
                pass: process.env.GMAIL_PSW,
            },
        });

        const mailOptions = {
            from: `BestCodes Website <bestcodes.official@gmail.com>`,
            to: "bestcodes.official@gmail.com",
            subject: `New Submission of BestCodes Contact Form - From ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(500).json({ error: "Internal server error" });
}