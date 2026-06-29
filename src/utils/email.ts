import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for sending emails with Resend SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
});

console.log(transporter, process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const mailOptions = {
      from: 'BulkWay <noreply@surajweb.in>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Email template for bid approval
export const getBidApprovalEmailTemplate = (
  bidderName: string,
  amount: number,
  contractId: number,
  startLocation: string,
  endLocation: string,
  distance: number,
  weight: number,
  vehicleType: string,
  upiID: string,
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { border: 1px solid #ddd; padding: 20px; border-radius: 0 0 5px 5px; }
        .detail-row { margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #4CAF50; }
        .label { font-weight: bold; color: #4CAF50; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        .amount { font-size: 24px; font-weight: bold; color: #4CAF50; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bid Approved!</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${bidderName}</strong>,</p>

          <p>Great news! Your bid has been approved by the admin. Here are the details of your approved contract:</p>

          <div class="detail-row">
            <span class="label">Bid Amount:</span>
            <div class="amount">₹${amount.toLocaleString('en-IN')}</div>
          </div>

          <div class="detail-row">
            <span class="label">Contract ID:</span> #${contractId}
          </div>

          <div class="detail-row">
            <span class="label">Route:</span> ${startLocation} → ${endLocation}
          </div>

          <div class="detail-row">
            <span class="label">Distance:</span> ${distance} km
          </div>

          <div class="detail-row">
            <span class="label">Weight:</span> ${weight} tons
          </div>

          <div class="detail-row">
            <span class="label">Vehicle Type:</span> ${vehicleType}
          </div>

          <div class="detail-row">
            <span class="label">UPI ID:</span> ${upiID}
          </div>

          <p style="margin-top: 20px;">
            You can now proceed with the contract. Please login to your dashboard to view more details and track the shipment.
          </p>

          <p>
            If you have any questions or concerns, please contact our support team.
          </p>

          <p>Best regards,<br><strong>LoadTrust Dispatch Flow Team</strong></p>

          <div class="footer">
            <p>This is an automated email. Please do not reply directly to this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Email template for delivery confirmation
export const getDeliveryConfirmationEmailTemplate = (
  contractorName: string,
  contractId: number,
  driverName: string,
  amount: number,
  startLocation: string,
  endLocation: string,
  distance: number,
  weight: number,
  vehicleType: string,
  notes: string,
  upiID: string
) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { border: 1px solid #ddd; padding: 20px; border-radius: 0 0 5px 5px; }
        .detail-row { margin: 15px 0; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #2196F3; }
        .label { font-weight: bold; color: #2196F3; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
        .amount { font-size: 24px; font-weight: bold; color: #2196F3; }
        .payment-section { background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Delivery Confirmed!</h1>
        </div>
        <div class="content">
          <p>Hello,</p>

          <p>The delivery for Contract #${contractId} has been successfully confirmed. Here are the details:</p>

          <div class="detail-row">
            <span class="label">Contractor:</span> ${contractorName}
          </div>

          <div class="detail-row">
            <span class="label">Driver:</span> ${driverName}
          </div>

          <div class="detail-row">
            <span class="label">Route:</span> ${startLocation} → ${endLocation}
          </div>

          <div class="detail-row">
            <span class="label">Distance:</span> ${distance} km
          </div>

          <div class="detail-row">
            <span class="label">Weight:</span> ${weight} tons
          </div>

          <div class="detail-row">
            <span class="label">Vehicle Type:</span> ${vehicleType}
          </div>

          ${notes ? `
          <div class="detail-row">
            <span class="label">Delivery Notes:</span> ${notes}
          </div>
          ` : ''}

          <div class="detail-row">
            <span class="label">Driver UPI ID:</span> ${upiID}
          </div>

          <div class="payment-section">
            <p style="margin: 0 0 10px 0;"><strong>💰 Payment Information</strong></p>
            <div class="detail-row">
              <span class="label">Amount to be Paid to Driver:</span>
              <div class="amount">₹${amount.toLocaleString('en-IN')}</div>
            </div>
          </div>

          <p style="margin-top: 20px;">
            Please process the payment to the driver and mark this transaction in the system. The contractor has confirmed successful delivery.
          </p>

          <p>Best regards,<br><strong>LoadTrust Dispatch Flow Team</strong></p>

          <div class="footer">
            <p>This is an automated email. Please do not reply directly to this email.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
