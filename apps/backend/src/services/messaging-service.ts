import amqp, { ChannelModel, Channel } from "amqplib";

export interface UserRegisteredEvent {
	type: "USER_REGISTERED";
	data: {
		name: string;
		email: string;
		userId: string;
	};
}

export class MessagingService {
	private static connection: ChannelModel;
	private static channel: Channel;
	private static isInitialized = false;

	static async init(url: string) {
		try {
			if (this.isInitialized) {
				return;
			}

			this.connection = await amqp.connect(url);
			this.channel = await this.connection.createChannel();
			this.isInitialized = true;

			console.log("[Backend - RabbitMQ] Conectado");
		} catch (error) {
			console.error("[Backend - RabbitMQ] Erro ao conectar:", error);
			throw error;
		}
	}

	static getChannel(): Channel {
		if (!this.channel) {
			throw new Error("[Backend - RabbitMQ] Channel não inicializado");
		}
		return this.channel;
	}

	static async publish(queue: string, message: object) {
		try {
			if (!this.isInitialized) {
				console.warn(
					"[Backend - RabbitMQ] Tentando publicar sem inicializar. Inicializando..."
				);
				const rabbitUrl =
					process.env.RABBITMQ_URL || "amqp://localhost:5672";
				await this.init(rabbitUrl);
			}

			await this.channel.assertQueue(queue, { durable: true });

			const messageBuffer = Buffer.from(JSON.stringify(message));
			this.channel.sendToQueue(queue, messageBuffer, {
				persistent: true,
			});

			console.log(
				`[Backend - RabbitMQ] Mensagem publicada na fila ${queue}:`,
				message
			);
		} catch (error) {
			console.error(
				"[Backend - RabbitMQ] Erro ao publicar mensagem:",
				error
			);
			throw error;
		}
	}

	static async publishUserRegistered(userData: {
		name: string;
		email: string;
		userId: string;
	}) {
		const event: UserRegisteredEvent = {
			type: "USER_REGISTERED",
			data: userData,
		};

		await this.publish("user_registered", event);
	}

	static async close() {
		try {
			if (this.channel) {
				await this.channel.close();
			}
			if (this.connection) {
				await this.connection.close();
			}
			this.isInitialized = false;
			console.log("[Backend - RabbitMQ] Conexão fechada");
		} catch (error) {
			console.error(
				"[Backend - RabbitMQ] Erro ao fechar conexão:",
				error
			);
		}
	}
}
