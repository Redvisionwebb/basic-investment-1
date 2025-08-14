import nodemailer from 'nodemailer';

// Function to send email
export const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.NEXT_PUBLIC_SMTP_MAIL,
                pass: process.env.NEXT_PUBLIC_SMTP_MAIL
            }
        });

        // Define email options
        const mailOptions = {
            from: `"Redvision Technology" ${process.env.NEXT_PUBLIC_SMTP_MAIL}`,
            to,
            subject,
            text,
            // html: "<b>Hello world?</b>" // Uncomment if you want to send HTML email
        };

        // Send email using the transporter object
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
