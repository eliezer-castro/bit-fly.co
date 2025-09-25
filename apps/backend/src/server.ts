import { app } from "./app";
import { MessagingService } from "./services/messaging-service";
import { env } from "./env";

async function startServer() {
  try {
    // Inicializar RabbitMQ
    const rabbitUrl = process.env.RABBITMQ_URL || "amqp://localhost:5672";
    await MessagingService.init(rabbitUrl);

    // Iniciar servidor HTTP
    await app.listen({
      host: "0.0.0.0",
      port: 3000,
    });

    console.log("HTTP Server running on port 3000");
    console.log("RabbitMQ initialized");

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Shutting down server...");
      await MessagingService.close();
      process.exit(0);
    });

  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
