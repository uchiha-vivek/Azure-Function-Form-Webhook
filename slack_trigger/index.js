const nodemailer = require("nodemailer");

module.exports = async function (context, req) {
    context.log("Form submission received");

    if (!req.body) {
        context.res = {
            status: 400,
            body: { error: "No form data given" }
        };
        return;
    }

    const submission = {
        name: req.body.name || "unknown user",
        email: req.body.email || "dummy email",
        message: req.body.message || "no message",
        timestamp: new Date().toISOString()
    };

    try {
        // Configure transporter (use Gmail SMTP)
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'notifications@allysolutions.ai',  // your Gmail address
                pass: "fnha kenl dsnx wdpw"   // app password (not regular Gmail password!)
            }
        });

        // Send email
        let info = await transporter.sendMail({
            from: 'notifications@allysolutions.ai',
            to: "vivek@allysolutions.ai",
            subject: "📩 New Form Submission",
            text: `You received a new form submission:
            
Name: ${submission.name}
Email: ${submission.email}
Message: ${submission.message}
Timestamp: ${submission.timestamp}
            `,
            html: `<h3>New Form Submission</h3>
                   <p><b>Name:</b> ${submission.name}</p>
                   <p><b>Email:</b> ${submission.email}</p>
                   <p><b>Message:</b> ${submission.message}</p>
                   <p><b>Time:</b> ${submission.timestamp}</p>`
        });

        context.log("Email sent:", info.messageId);

        context.res = {
            status: 200,
            body: { success: true, sent: submission }
        };
    } catch (err) {
        context.log.error("Error sending email:", err);
        context.res = {
            status: 500,
            body: { error: "Failed to send email" }
        };
    }
};
