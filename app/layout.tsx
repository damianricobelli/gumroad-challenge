import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Gumroad challenge",
	description: "App to select and classify elements of an image",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					inter.className,
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					<div className="space-y-4 mb-4">
						<Header />
						{children}
						<Toaster visibleToasts={1} richColors />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
