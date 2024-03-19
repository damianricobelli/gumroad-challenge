"use client";

import useResizeObserver from "@/hooks/use-resize-observer";
import { cn } from "@/lib/utils";
import type { Image } from "@/utils/default-images";
import * as React from "react";
import { ImageEditorCreator } from "./image-editor.creator";
import { ImageEditorProvider } from "./image-editor.provider";
import { ImageEditorRectangle } from "./image-editor.rectangle";
import { ImageEditorToolbar } from "./image-editor.toolbar";
import type { Rectangle } from "./types";
import { ZoomImage } from "./zoom-image";

export default function ImageEditor({
	image,
}: {
	image: Image;
}) {
	const imgRef = React.useRef<HTMLImageElement>(null);
	const rect = useResizeObserver<HTMLImageElement>({ ref: imgRef });

	/******************** CREATE RECTANGLE LOGIC ********************/

	const [[currentScaleX, currentScaleY], setScale] = React.useState([1, 1]);

	const [isResizing, setIsResizing] = React.useState(false);
	const [isMoving, setIsMoving] = React.useState(false);

	const [zoomScale, setZoomScale] = React.useState(1);
	const [showZoomControls, setShowZoomControls] = React.useState(false);

	const [selectedRectangle, setSelectedRectangle] =
		React.useState<Rectangle | null>(null);

	// Save the rectangles and annotations in the state
	const [rectangles, setRectangles] = React.useState<Rectangle[]>([]);
	// Save the annotations in the state to be used for the undo/redo functionality
	const [annotations, setAnnotations] = React.useState<Rectangle[]>([]);

	const [newRectangle, setNewRectangle] = React.useState<Rectangle | null>(
		null,
	);

	const [tool, setTool] = React.useState<"move" | "create">("create");

	const containerRef = React.useRef<HTMLDivElement | null>(null);

	// Calculate the scale of the image based on the image dimensions and zoom scale
	const scaleX = currentScaleX * zoomScale;
	const scaleY = currentScaleY * zoomScale;

	// Function to handle the mouse move event
	const handleMouseMoveCreatingNewRectangle = React.useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();
			if (!newRectangle) {
				return;
			}

			const container = containerRef.current;
			const containerRect = container?.getBoundingClientRect();
			if (!containerRect) {
				return;
			}

			// Get the current mouse coordinates
			const { clientX, clientY } = e;
			const offsetX = clientX - containerRect.left;
			const offsetY = clientY - containerRect.top;

			// Calculate the width and height of the rectangle based on the current mouse coordinates
			const width = offsetX - newRectangle.left;
			const height = offsetY - newRectangle.top;

			// Set the width and height of the current rectangle
			setNewRectangle((prev) => ({
				...(prev as Rectangle),
				width,
				height,
				realCoordinates: {
					left: prev?.realCoordinates?.left || 0,
					top: prev?.realCoordinates?.top || 0,
					width: width / scaleX,
					height: height / scaleY,
				},
			}));
		},
		[newRectangle, scaleX, scaleY],
	);

	// This effect is used to calculate the scale of the image based on the image dimensions
	React.useEffect(() => {
		const currentImage = imgRef.current;
		if (currentImage) {
			const width = rect.width || currentImage.width;
			const height = rect.height || currentImage.height;

			const newScaleX = width / currentImage.naturalWidth;
			const newScaleY = height / currentImage.naturalHeight;
			setScale([newScaleX, newScaleY]);

			// Calculate the scale of the rectangle based on the current image dimensions
			setRectangles((prev) =>
				prev.map((rectangle) => {
					const scaleXBasedOnImage = width / rectangle.initialImageSize.width;
					const scaleYBasedOnImage = height / rectangle.initialImageSize.height;

					return {
						...rectangle,
						left:
							(rectangle.initialCoordinates?.left || 0) * scaleXBasedOnImage,
						top: (rectangle.initialCoordinates?.top || 0) * scaleYBasedOnImage,
						width:
							(rectangle.initialCoordinates?.width || 0) * scaleXBasedOnImage,
						height:
							(rectangle.initialCoordinates?.height || 0) * scaleYBasedOnImage,
					};
				}),
			);
		}
	}, [rect]);

	/******************** END CREATE RECTANGLE LOGIC ********************/

	return (
		<ImageEditorProvider
			values={{
				rectangles,
				setRectangles,
				annotations,
				setAnnotations,
				selectedRectangle,
				setSelectedRectangle,
				newRectangle,
				setNewRectangle,
				isResizing,
				setIsResizing,
				isMoving,
				setIsMoving,
				tool,
				setTool,
				showZoomControls,
				setShowZoomControls,
				zoomScale,
				setZoomScale,
				scaleX,
				scaleY,
				rect: {
					width: rect.width || 0,
					height: rect.height || 0,
				},
				containerRef,
			}}
		>
			<div>
				<ImageEditorToolbar />
				<ZoomImage>
					<div
						ref={containerRef}
						className={cn(
							"relative overflow-hidden size-full rounded-b-lg",
							tool === "create" && "cursor-crosshair",
						)}
						onMouseMove={handleMouseMoveCreatingNewRectangle}
					>
						<img
							ref={imgRef}
							src={image.publicUrl}
							alt="Roofer"
							className="size-full object-contain select-none z-0 rounded-b-lg"
						/>
						{rectangles.map((rectangle) => (
							<ImageEditorRectangle key={rectangle.id} rectangle={rectangle} />
						))}
						<ImageEditorCreator />
					</div>
				</ZoomImage>
			</div>
		</ImageEditorProvider>
	);
}
