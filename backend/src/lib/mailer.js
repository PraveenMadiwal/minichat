import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // or another email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetEmail = async (to, token) => {
  const resetUrl = `http://localhost:5173/reset-password/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Reset your password",
    html: `
      <h2>Reset Password Request</h2>
      <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `,
  };

  return transporter.sendMail(mailOptions);
};
