import * as React from "react";
import {
	Html,
	Head,
	Preview,
	Body,
	Container,
	Section,
	Text,
	Heading,
	Button,
	Hr,
} from "@react-email/components";

export interface WelcomeEmailProps {
	name: string;
	email: string;
}

export const WelcomeEmail = ({ name, email }: WelcomeEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Bem-vindo ao Bit-Fly! 🚀</Preview>
			<Body style={main}>
				<Container style={container}>
					<Section style={header}>
						<Heading style={h1}>Bit-Fly</Heading>
						<Heading style={h2}>Bem-vindo, {name}! 🎉</Heading>
					</Section>

					<Text style={text}>
						Obrigado por se cadastrar no <strong>Bit-Fly</strong>, o
						encurtador de URLs mais rápido e confiável!
					</Text>

					<Text style={text}>Agora você pode:</Text>

					{/* Features */}
					<Section style={features}>
						<Text style={feature}>
							✓ Encurtar URLs longas em segundos
						</Text>
						<Text style={feature}>
							✓ Acompanhar cliques e estatísticas
						</Text>
						<Text style={feature}>✓ Personalizar seus links</Text>
						<Text style={feature}>
							✓ Gerenciar todos os seus links em um só lugar
						</Text>
					</Section>

					<Section style={buttonContainer}>
						<Button
							style={button}
							href="https://bit-fly.co/dashboard"
						>
							Começar Agora
						</Button>
					</Section>

					<Hr style={hr} />

					<Text style={text}>
						Se você tiver alguma dúvida, não hesite em entrar em
						contato conosco. Estamos aqui para ajudar!
					</Text>

					<Section style={footer}>
						<Text style={footerText}>
							Este email foi enviado para {email}
						</Text>
						<Text style={footerText}>
							© 2024 Bit-Fly. Todos os direitos reservados.
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};

// Estilos inline para compatibilidade com clientes de email
const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 0 48px",
	maxWidth: "560px",
};

const header = {
	textAlign: "center" as const,
	marginBottom: "32px",
};

const h1 = {
	color: "#1f2937",
	fontSize: "32px",
	fontWeight: "700",
	margin: "0 0 16px",
	textAlign: "center" as const,
};

const h2 = {
	color: "#374151",
	fontSize: "24px",
	fontWeight: "600",
	margin: "0",
	textAlign: "center" as const,
};

const text = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "16px 0",
};

const features = {
	margin: "24px 0",
	padding: "20px",
	backgroundColor: "#f9fafb",
	borderRadius: "8px",
};

const feature = {
	color: "#374151",
	fontSize: "16px",
	lineHeight: "24px",
	margin: "8px 0",
};

const buttonContainer = {
	textAlign: "center" as const,
	margin: "32px 0",
};

const button = {
	backgroundColor: "#3b82f6",
	borderRadius: "8px",
	color: "#ffffff",
	fontSize: "16px",
	fontWeight: "600",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "inline-block",
	padding: "12px 24px",
	border: "none",
};

const hr = {
	borderColor: "#e5e7eb",
	margin: "32px 0",
};

const footer = {
	textAlign: "center" as const,
	marginTop: "32px",
};

const footerText = {
	color: "#6b7280",
	fontSize: "14px",
	lineHeight: "20px",
	margin: "8px 0",
	textAlign: "center" as const,
};

export default WelcomeEmail;
