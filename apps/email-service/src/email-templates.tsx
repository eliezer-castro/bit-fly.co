import { render } from "@react-email/render";
import { WelcomeEmail } from "./templates/welcome-email";

export interface WelcomeEmailData {
	name: string;
	email: string;
}

export class EmailTemplates {
	static async getWelcomeEmail(name: string, email: string) {
		return {
			subject: "Bem-vindo ao Bit-Fly! 🚀",
			html: await render(<WelcomeEmail name={name} email={email} />),
			text: await render(<WelcomeEmail name={name} email={email} />, {
				plainText: true,
			}),
		};
	}
}
