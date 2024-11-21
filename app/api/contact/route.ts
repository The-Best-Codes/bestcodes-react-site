import { NextRequest, NextResponse } from "next/server";
import nodeMailer from "nodemailer";

export async function POST(request: NextRequest) {
    try {
        const { name, email, message, cloudflareToken } = await request.json();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
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
                            response: cloudflareToken,
                        }),
                    }
                );

                const data = await response.json();

                if (!data.success) {
                    return NextResponse.json(
                        { error: "Invalid captcha" },
                        { status: 401 }
                    );
                }
            } catch (error) {
                console.error(error);
                return NextResponse.json(
                    { error: "Failed to verify captcha" },
                    { status: 500 }
                );
            }
        } else {
            return NextResponse.json(
                { error: "Invalid captcha" },
                { status: 401 }
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
            console.error(error);
            return NextResponse.json(
                { error: "Failed to send email" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
