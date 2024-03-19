"use client";

import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import type { Image as ImageType } from "@/utils/default-images";
import * as React from "react";
import ImageEditor from "./image-editor/image-editor";
import { ImagesList } from "./images-list";
import { Button } from "./ui/button";
import { toast } from "./ui/sonner";

export function ImageViewer({
	images,
}: {
	images: ImageType[];
}) {
	const hasImages = images.length > 0;

	const [selectedImage, setSelectedImage] = React.useState<ImageType | null>(
		hasImages
			? {
					publicUrl: images[0].publicUrl,
					index: 0,
			  }
			: null,
	);

	const [loadingSelectedImage, setLoadingSelectedImage] = React.useState(true);

	React.useEffect(() => {
		if (hasImages) {
			const img = new Image();
			img.src = selectedImage?.publicUrl as string;
			img.onload = () => {
				setLoadingSelectedImage(false);
			};
		}
	}, [selectedImage, hasImages]);

	return (
		<div className="space-y-4 w-full">
			<div
				className={cn(
					"flex flex-col gap-4 md:grid md:grid-cols-[280px_minmax(0,1fr)] md:gap-4",
					!hasImages && "h-[calc(100vh_-_180px)] md:grid-cols-1",
				)}
			>
				<Button
					variant="ghost"
					className="border-2 border-dashed p-4 rounded-lg flex items-center justify-center h-full"
					onClick={() => {
						toast("This feature is not implemented yet", {
							description:
								"The main idea is to be able to get a random image from picsum.photos and add it to the list of images. A different use case would be to have an input that allows uploading files to the database.",
						});
					}}
				>
					<div className="flex flex-col items-center gap-2">
						<Plus className="size-5" />
						<span className="text-sm">Click to add random image</span>
					</div>
				</Button>
				{hasImages && selectedImage && (
					<ImagesList
						images={images}
						selectedImage={selectedImage}
						setSelectedImage={setSelectedImage}
						setLoadingSelectedImage={setLoadingSelectedImage}
					/>
				)}
			</div>
			{!loadingSelectedImage && selectedImage ? (
				<ImageEditor image={selectedImage} />
			) : (
				<Skeleton className="w-full h-[700px] rounded-lg opacity-80 duration-1000" />
			)}
		</div>
	);
}
