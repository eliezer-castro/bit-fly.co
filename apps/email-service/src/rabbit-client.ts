import amqp, { ChannelModel, Channel } from "amqplib";

export class RabbitMQClient {
	private static connection: ChannelModel;
	private static channel: Channel;

	static async init(url: string) {
		try {
			this.connection = await amqp.connect(url);
			this.channel = await this.connection.createChannel();
			console.log("[Email Service - RabbitMQ] Conectado");
		} catch (error) {
			console.error(
				"[Email Service - RabbitMQ] Erro ao conectar:",
				error
			);
			throw error;
		}
	}

	static getChannel(): Channel {
		if (!this.channel) {
			throw new Error(
				"[Email Service - RabbitMQ] Channel não inicializado"
			);
		}
		return this.channel;
	}

	static async consume(queue: string, callback: (msg: any) => void) {
		try {
			await this.channel.assertQueue(queue, { durable: true });

			this.channel.consume(queue, (msg) => {
				if (msg) {
					try {
						const content = JSON.parse(msg.content.toString());
						callback(content);
						this.channel.ack(msg);
					} catch (error) {
						console.error(
							"[Email Service - RabbitMQ] Erro ao processar mensagem:",
							error
						);
						this.channel.nack(msg, false, false);
					}
				}
			});

			console.log(`[Email Service - RabbitMQ] Consumindo fila: ${queue}`);
		} catch (error) {
			console.error(
				"[Email Service - RabbitMQ] Erro ao consumir fila:",
				error
			);
			throw error;
		}
	}

	static async close() {
		try {
			if (this.channel) {
				await this.channel.close();
			}
			if (this.connection) {
				await this.connection.close();
			}
			console.log("[Email Service - RabbitMQ] Conexão fechada");
		} catch (error) {
			console.error(
				"[Email Service - RabbitMQ] Erro ao fechar conexão:",
				error
			);
		}
	}
}
