import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { RabbitMQClient } from "./rabbit-client";
import { EmailTemplates, WelcomeEmailData } from "./email-templates";

dotenv.config();

export interface EmailOptions {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}

export interface UserRegisteredMessage {
	type: "USER_REGISTERED";
	data: {
		name: string;
		email: string;
		userId: string;
	};
}

export class EmailService {
	private transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: process.env.EMAIL_HOST || "localhost",
			port: Number(process.env.EMAIL_PORT) || 1025,
			secure: false,
		});
	}

	async sendEmail(options: EmailOptions) {
		try {
			const mail = {
				from: process.env.EMAIL_FROM || "noreply@bit-fly.co",
				...options,
			};

			const info = await this.transporter.sendMail(mail);
			console.log("[Email Service] Email enviado: %s", info.messageId);
			return info;
		} catch (error) {
			console.error("[Email Service] Erro ao enviar email:", error);
			throw error;
		}
	}

	async sendWelcomeEmail(userData: WelcomeEmailData) {
		const emailTemplate = await EmailTemplates.getWelcomeEmail(
			userData.name,
			userData.email
		);

		await this.sendEmail({
			to: userData.email,
			subject: emailTemplate.subject,
			html: emailTemplate.html,
			text: emailTemplate.text,
		});
	}

	async handleUserRegistered(message: UserRegisteredMessage) {
		console.log(
			"[Email Service] Processando cadastro de usuário:",
			message.data.email
		);

		try {
			await this.sendWelcomeEmail({
				name: message.data.name,
				email: message.data.email,
			});

			console.log(
				"[Email Service] Email de boas-vindas enviado para:",
				message.data.email
			);
		} catch (error) {
			console.error(
				"[Email Service] Erro ao enviar email de boas-vindas:",
				error
			);
			throw error;
		}
	}
}

async function startEmailService() {
	try {
		const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";

		await RabbitMQClient.init(rabbitUrl);

		const emailService = new EmailService();

		await RabbitMQClient.consume(
			"user_registered",
			(message: UserRegisteredMessage) => {
				emailService.handleUserRegistered(message);
			}
		);

		console.log("[Email Service] Serviço iniciado com sucesso");

		process.on("SIGINT", async () => {
			console.log("[Email Service] Encerrando serviço...");
			await RabbitMQClient.close();
			process.exit(0);
		});
	} catch (error) {
		console.error("[Email Service] Erro ao iniciar serviço:", error);
		process.exit(1);
	}
}

if (require.main === module) {
	startEmailService();
}
