import Email from '../../email/otpEmail';
import { Resend } from 'resend';
import { ApiResponse } from '@/types/ApiResponse';
import { promises } from 'dns';

const resend = new Resend(process.env.RESEND_APIKEY);

export async function sendVerifcaitonEmail(
    email: string, verifyCode: string, username: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'OTP verifcation from annoymouse message',
            react: Email({  username, code: verifyCode }),
            text: Email({  username, code: verifyCode }).toString(),
        });

        if (error) {
            return { status: false, responseMessage: error.message };
        }

        return { status: true, responseMessage: "Email sent successfully!", data: data };
    } catch (error) {
        return { status: false, responseMessage: "Error sending email 501." };
    }
}
