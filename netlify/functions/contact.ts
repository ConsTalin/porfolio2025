import nodemailer from "nodemailer";

export const handler = async (event: any) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: "Método no permitido" }),
    };
  }

  const { nombre, telefono, email, asunto, mensaje } = JSON.parse(event.body);

  if (!nombre || !telefono || !email || !asunto || !mensaje) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Campos incompletos" }),
    };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
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
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Error al enviar correo" }),
    };
  }
};
