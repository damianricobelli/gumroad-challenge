import { cn } from '@/lib/utils'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import Header from '@/components/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gumroad challenge',
  description: 'App that uses the AWS Rekognition API to recognize people.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
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
          <Header />
					{children}
					<Toaster visibleToasts={1} />
				</ThemeProvider>
      </body>
    </html>
  )
}
