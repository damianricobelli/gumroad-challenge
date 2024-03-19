import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SquareDashedMousePointer } from "lucide-react";
import { ModeToggle } from "./theme-toggler";

export default function Header() {
	return (
		<div className="sticky top-0 z-50 border-b bg-background px-4">
			<header className="mx-auto flex max-w-7xl items-center justify-between h-12">
				<Button variant="ghost" asChild>
					<Link href="/">
						<SquareDashedMousePointer className="size-4 mr-2" />
						Image elements App
					</Link>
				</Button>
				<ModeToggle />
			</header>
		</div>
	);
}
