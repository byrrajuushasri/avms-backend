
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private readonly resend = new Resend(
    process.env.RESEND_API_KEY,
  );

  async sendMatrimonyRegistrationEmail(params: {
    email: string;
    name: string;
    memberId: string;
    matrimonialId: number;
    registrationDate: Date;
    expiryDate: Date;
  }) {
    const {
      email,
      name,
      memberId,
      matrimonialId,
      registrationDate,
      expiryDate,
    } = params;

    // =========================================================
    // EMAIL CHECK
    // =========================================================

    if (!email) {
      this.logger.warn(
        'Matrimony email not sent: email address is missing.',
      );

      return {
        success: false,
        message: 'Email address is missing',
      };
    }

    // =========================================================
    // RESEND FROM EMAIL
    // =========================================================

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      'noreply@aaryavysyamahasabha.com';

    // =========================================================
    // DATE FORMAT
    // =========================================================

    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    };

    const formattedRegistrationDate =
      formatDate(registrationDate);

    const formattedExpiryDate =
      formatDate(expiryDate);

    // =========================================================
    // SUBJECT
    // =========================================================

    const subject =
      'Your Matrimonial Registration Has Been Approved';

    // =========================================================
    // PLAIN TEXT EMAIL
    // =========================================================

    const emailText = `
Aarya Vysya Matrimony

MATRIMONIAL REGISTRATION

REGISTRATION APPROVED SUCCESSFULLY

Dear ${name || 'Member'},

Congratulations!

Your matrimonial profile has been successfully approved by the Telangana State Arya Vysya Mahasabha.

YOUR REGISTRATION DETAILS

Membership ID: ${memberId}
Matrimonial ID: ${matrimonialId}
Registration Date: ${formattedRegistrationDate}
Expiry Date: ${formattedExpiryDate}

FREE REGISTRATION

Your matrimonial registration is FREE and valid for up to 99 days from the approval/registration date.

EXTENSION

The registration can be extended for another 180 days with a volunteer contribution in three digits, as applicable.

Please keep your Membership ID and Matrimonial ID safely for future reference.

Thank you for registering with Aarya Vysya Matrimony.

Regards,

Telangana State Arya Vysya Mahasabha
Aarya Vysya Matrimony
Hyderabad, Telangana
    `.trim();

    // =========================================================
    // HTML EMAIL
    // =========================================================

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f5f5;
    font-family:Arial,Helvetica,sans-serif;
    color:#333333;
  "
>
  <div style="padding:30px 15px;">

    <div
      style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        border:1px solid #e5e5e5;
        border-radius:8px;
        overflow:hidden;
      "
    >

      <!-- HEADER -->
      <div
        style="
          padding:22px;
          text-align:center;
          border-bottom:1px solid #eeeeee;
        "
      >
        <h2
          style="
            margin:0;
            color:#800018;
            font-size:22px;
          "
        >
          Aarya Vysya Matrimony
        </h2>

        <p
          style="
            margin:7px 0 0;
            color:#777777;
            font-size:13px;
          "
        >
          Telangana State Arya Vysya Mahasabha
        </p>
      </div>

      <!-- CONTENT -->
      <div style="padding:30px;">

        <h3
          style="
            margin:0 0 8px;
            color:#800018;
            font-size:20px;
          "
        >
          Matrimonial Registration
        </h3>

        <p
          style="
            margin:0 0 22px;
            color:#188038;
            font-weight:bold;
            font-size:16px;
          "
        >
          Registration Approved Successfully
        </p>

        <p>
          Dear ${name || 'Member'},
        </p>

        <p>
          Congratulations!
        </p>

        <p>
          Your matrimonial profile has been successfully approved by
          the Telangana State Arya Vysya Mahasabha.
        </p>

        <h4
          style="
            margin-top:25px;
            margin-bottom:12px;
            color:#333333;
          "
        >
          Your Registration Details
        </h4>

        <table
          width="100%"
          cellpadding="8"
          cellspacing="0"
          style="
            border-collapse:collapse;
            font-size:14px;
          "
        >
          <tr>
            <td
              style="
                border:1px solid #eeeeee;
                font-weight:bold;
                width:45%;
              "
            >
              Membership ID
            </td>

            <td style="border:1px solid #eeeeee;">
              ${memberId}
            </td>
          </tr>

          <tr>
            <td
              style="
                border:1px solid #eeeeee;
                font-weight:bold;
              "
            >
              Matrimonial ID
            </td>

            <td style="border:1px solid #eeeeee;">
              ${matrimonialId}
            </td>
          </tr>

          <tr>
            <td
              style="
                border:1px solid #eeeeee;
                font-weight:bold;
              "
            >
              Registration Date
            </td>

            <td style="border:1px solid #eeeeee;">
              ${formattedRegistrationDate}
            </td>
          </tr>

          <tr>
            <td
              style="
                border:1px solid #eeeeee;
                font-weight:bold;
              "
            >
              Expiry Date
            </td>

            <td style="border:1px solid #eeeeee;">
              ${formattedExpiryDate}
            </td>
          </tr>
        </table>

        <div
          style="
            margin-top:25px;
            padding:18px;
            background:#fafafa;
            border-left:4px solid #800018;
          "
        >
          <h4
            style="
              margin:0 0 8px;
              color:#800018;
            "
          >
            FREE REGISTRATION
          </h4>

          <p style="margin:0;line-height:1.6;">
            Your matrimonial registration is FREE and valid for up to
            99 days from the approval/registration date.
          </p>
        </div>

        <div style="margin-top:22px;">

          <h4
            style="
              margin:0 0 8px;
              color:#333333;
            "
          >
            Extension
          </h4>

          <p style="margin:0;line-height:1.6;">
            The registration can be extended for another 180 days
            with a volunteer contribution in three digits, as applicable.
          </p>

        </div>

        <p
          style="
            margin-top:25px;
            line-height:1.6;
          "
        >
          Please keep your Membership ID and Matrimonial ID safely
          for future reference.
        </p>

        <p
          style="
            margin-top:25px;
            line-height:1.6;
          "
        >
          Thank you for registering with Aarya Vysya Matrimony.
        </p>

        <p style="margin-top:25px;">
          Regards,<br />

          <strong>
            Telangana State Arya Vysya Mahasabha
          </strong>
          <br />

          Aarya Vysya Matrimony
          <br />

          Hyderabad, Telangana
        </p>

      </div>

    </div>

  </div>
</body>
</html>
    `.trim();

    // =========================================================
    // SEND EMAIL
    // =========================================================

    try {
      const result = await this.resend.emails.send({
        from: `Aarya Vysya Matrimony <${fromEmail}>`,

        to: [email],

        replyTo: fromEmail,

        subject,

        html: emailHtml,

        text: emailText,

        headers: {
          'X-Priority': '1',
          Importance: 'high',
        },
      });

      this.logger.log(
        `Matrimony approval email sent successfully to ${email}`,
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send matrimony approval email to ${email}`,
        error,
      );

      return {
        success: false,
        message: 'Email sending failed',
      };
    }
  }
}

