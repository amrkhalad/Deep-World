import nodemailer from 'nodemailer';
import { UserPreferences } from '@/types/content';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(user: string, pass: string) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    });
  }

  async sendNewContentNotification(
    user: UserPreferences,
    newContent: Array<{
      title: string;
      description: string;
      url: string;
      type: string;
    }>
  ): Promise<void> {
    if (!user.emailNotifications) return;

    const emailContent = this.generateEmailContent(newContent);
    const subject = this.getEmailSubject(user.emailFrequency);

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_SERVICE_USER,
        to: user.userId,
        subject,
        html: emailContent
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  }

  private generateEmailContent(content: Array<{
    title: string;
    description: string;
    url: string;
    type: string;
  }>): string {
    return `
      <h2>New Content Available!</h2>
      <p>Here are the latest items that match your interests:</p>
      <ul>
        ${content.map(item => `
          <li>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <p><strong>Type:</strong> ${item.type}</p>
            <a href="${item.url}">View More</a>
          </li>
        `).join('')}
      </ul>
      <p>You can manage your email preferences in your account settings.</p>
    `;
  }

  private getEmailSubject(frequency: 'daily' | 'weekly' | 'monthly'): string {
    switch (frequency) {
      case 'daily':
        return 'Daily Content Update';
      case 'weekly':
        return 'Weekly Content Digest';
      case 'monthly':
        return 'Monthly Content Roundup';
      default:
        return 'New Content Available';
    }
  }

  async sendWelcomeEmail(userId: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_SERVICE_USER,
        to: userId,
        subject: 'Welcome to Our Platform!',
        html: `
          <h1>Welcome to Our Platform!</h1>
          <p>Thank you for joining us. We're excited to have you on board!</p>
          <p>You'll receive regular updates about new content that matches your interests.</p>
          <p>You can customize your preferences at any time in your account settings.</p>
        `
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }
} 