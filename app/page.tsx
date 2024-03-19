import { ImageViewer } from "@/components/image-viewer";
import { defaultImages } from "@/utils/default-images";

export default function Home() {
	return (
		<main className="bg-background px-4">
			<div className="mx-auto flex max-w-7xl items-center justify-between">
				<ImageViewer images={defaultImages} />
			</div>
		</main>
	);
}
