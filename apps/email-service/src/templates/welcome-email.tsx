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
	Tailwind,
	pixelBasedPreset,
} from "@react-email/components";

import { CheckIcon } from "@heroicons/react/24/solid";

export interface WelcomeEmailProps {
	name: string;
	email: string;
}

export const WelcomeEmail = ({ name, email }: WelcomeEmailProps) => {
	return (
		<Html>
			<Tailwind
				config={{
					presets: [pixelBasedPreset],
				}}
			>
				<Head />
				<Preview>Bem-vindo ao Bit-Fly! 🚀</Preview>
				<Body className="bg-gray-50 font-sans text-gray-800">
					<Container className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
						{/* Header */}
						<Section className="text-center mb-6">
							<Heading className="text-2xl font-bold text-indigo-600">
								Bit-Fly
							</Heading>
							<Heading className="text-xl font-semibold text-gray-900 mt-2">
								Bem-vindo, {name}! 🎉
							</Heading>
						</Section>

						{/* Intro */}
						<Text className="text-base leading-relaxed mb-4 text-gray-700">
							Obrigado por se cadastrar no{" "}
							<strong className="text-indigo-600">Bit-Fly</strong>
							, o encurtador de URLs mais rápido e confiável!
						</Text>

						<Text className="text-base font-medium mb-2">
							Agora você pode:
						</Text>

						{/* Features (sem space-y, usando mb manual) */}
						<Section className="mb-6">
							<ul className="list-none p-0 m-0">
								<li className="flex items-center mb-2">
									<span className="text-green-500 mr-2">
										<CheckIcon className="w-5 h-5" />
									</span>{" "}
									Encurtar URLs longas em segundos
								</li>
								<li className="flex items-center mb-2">
									<span className="text-green-500 mr-2">
										<CheckIcon className="w-5 h-5" />
									</span>{" "}
									Acompanhar cliques e estatísticas
								</li>
								<li className="flex items-center mb-2">
									<span className="text-green-500 mr-2">
										<CheckIcon className="w-5 h-5" />
									</span>{" "}
									Personalizar seus links
								</li>
								<li className="flex items-center">
									<span className="text-green-500 mr-2">
										<CheckIcon className="w-5 h-5" />
									</span>{" "}
									Gerenciar todos os seus links em um só lugar
								</li>
							</ul>
						</Section>

						{/* CTA (sem hover) */}
						<Section className="text-center mb-8">
							<Button
								href="https://bit-fly.co/dashboard"
								className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-md"
							>
								Começar Agora
							</Button>
						</Section>

						<Hr className="border-gray-200 my-6" />

						{/* Footer */}
						<Text className="text-sm text-gray-500 leading-relaxed">
							Se você tiver alguma dúvida, não hesite em entrar em
							contato conosco. Estamos aqui para ajudar!
						</Text>

						<Section className="mt-6 text-center text-xs text-gray-400">
							<Text>Este email foi enviado para {email}</Text>
							<Text>
								© 2024 Bit-Fly. Todos os direitos reservados.
							</Text>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};
