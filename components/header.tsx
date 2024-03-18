import Link from "next/link";

import { ModeToggle } from "./theme-toggler";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

export default function Header() {
	return (
		<div className="sticky top-0 z-50 border-b bg-background px-4">
			<header className="mx-auto flex max-w-7xl items-center justify-between h-12">
				<Button variant="ghost" asChild>
					<Link href="/">
						<Bot className="size-4 mr-2" />
						AI Person Recognition
					</Link>
				</Button>
				<ModeToggle />
			</header>
		</div>
	);
}
