import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
export const prerender = false;
import dotenv from "dotenv";
dotenv.config();
export const POST: APIRoute = async ({ request }) => {

   
    const { nombre, telefono, email, asunto, mensaje } = await request.json();

    if (!nombre || !telefono || !email || !asunto || !mensaje) {
        return new Response(
            JSON.stringify({ success: false, error: "Campos incompletos" }),
            { status: 400 }
        );
    }
    console.log("ENV CHECK", {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? "OK" : "MISSING",
  email: process.env.EMAIL,
});

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: `Formulario: ${asunto}`,
            html: `
                <h1>Formulario de contacto</h1>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Asunto:</strong> ${asunto}</p>
                <p><strong>Mensaje:</strong> ${mensaje}</p>
            `
        });

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        return new Response(
            
            JSON.stringify(error, null, 2),
            { status: 500 }
        );
    }
};