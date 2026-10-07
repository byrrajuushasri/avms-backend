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
      'Matrimony approval email not sent: email address is missing.',
    );

    return {
      success: false,
      message: 'Email address is missing',
    };
  }

  // =========================================================
  // FROM EMAIL
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
    'Matrimonial Registration Approved - Aarya Vysya Matrimony';

  // =========================================================
  // SIMPLE EMAIL
  // =========================================================

  const emailText = `
Dear ${name || 'Member'},

Congratulations!

Your matrimonial registration with Aarya Vysya Matrimony has been approved successfully.

Registration Details:

Membership ID: ${memberId}
Matrimonial ID: ${matrimonialId}
Registration Date: ${formattedRegistrationDate}
Expiry Date: ${formattedExpiryDate}

FREE REGISTRATION

Your matrimonial registration is FREE and valid for 99 days from the registration/approval date.

EXTENSION

The registration can be extended for another 180 days with a volunteer contribution in three digits, as applicable.

Please keep your Membership ID and Matrimonial ID safely for future reference.

Thank you for registering with Aarya Vysya Matrimony.

Regards,
Aarya Vysya Matrimony
Aarya Vysya Mahasabha
Hyderabad, Telangana

Email: beldaguru@gmail.com
Phone: 9246119408
Website: www.aaryavysyamahasabha.com
  `.trim();

  // =========================================================
  // SEND EMAIL
  // =========================================================

  try {
    const result = await this.resend.emails.send({
      from: `Aarya Vysya Matrimony <${fromEmail}>`,

      to: [email],

      replyTo: 'beldaguru@gmail.com',

      subject,

      text: emailText,
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