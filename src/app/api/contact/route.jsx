import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { name, email, phone, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from:    "onboarding@resend.dev",
            to:      [process.env.YOUR_EMAIL],
            replyTo: email,
            subject: `Volt Store Contact from ${name}`,
            html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">

                    <!-- Header -->
                    <div style="background:linear-gradient(135deg,#3b82f6,#06b6d4);padding:28px 32px;">
                        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:0.04em;">
                            ⚡ VOLT STORE
                        </h1>
                        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">
                            New Contact Form Submission
                        </p>
                    </div>

                    <!-- Body -->
                    <div style="padding:28px 32px;background:#ffffff;">
                        <h2 style="margin:0 0 20px;color:#111827;font-size:16px;font-weight:700;">
                            Message Details
                        </h2>
                        <table style="width:100%;border-collapse:collapse;font-size:14px;">
                            <tr>
                                <td style="padding:10px 12px;font-weight:700;color:#6b7280;width:100px;background:#f9fafb;border-radius:6px 0 0 6px;">Name</td>
                                <td style="padding:10px 12px;color:#111827;background:#f9fafb;border-radius:0 6px 6px 0;">${name}</td>
                            </tr>
                            <tr><td colspan="2" style="padding:3px;"></td></tr>
                            <tr>
                                <td style="padding:10px 12px;font-weight:700;color:#6b7280;background:#f9fafb;border-radius:6px 0 0 6px;">Email</td>
                                <td style="padding:10px 12px;background:#f9fafb;border-radius:0 6px 6px 0;">
                                    <a href="mailto:${email}" style="color:#3b82f6;text-decoration:none;">${email}</a>
                                </td>
                            </tr>
                            <tr><td colspan="2" style="padding:3px;"></td></tr>
                            <tr>
                                <td style="padding:10px 12px;font-weight:700;color:#6b7280;background:#f9fafb;border-radius:6px 0 0 6px;">Phone</td>
                                <td style="padding:10px 12px;color:#111827;background:#f9fafb;border-radius:0 6px 6px 0;">${phone || "Not provided"}</td>
                            </tr>
                            <tr><td colspan="2" style="padding:3px;"></td></tr>
                            <tr>
                                <td style="padding:10px 12px;font-weight:700;color:#6b7280;vertical-align:top;background:#f9fafb;border-radius:6px 0 0 6px;">Message</td>
                                <td style="padding:10px 12px;color:#111827;white-space:pre-wrap;background:#f9fafb;border-radius:0 6px 6px 0;">${message}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Footer -->
                    <div style="padding:18px 32px;background:#f3f4f6;border-top:1px solid #e5e7eb;">
                        <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                            This message was sent via the contact form at
                            <strong style="color:#6b7280;">voltstore.com</strong> · Volt Store — Premium Electronics
                        </p>
                    </div>

                </div>
            `,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data.id });
    } catch (err) {
        console.error("Server error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}