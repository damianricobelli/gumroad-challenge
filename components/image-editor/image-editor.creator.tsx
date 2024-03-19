import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { adjustCoordinates } from "./helpers";
import { useImageEditor } from "./image-editor.provider";
import type { Rectangle } from "./types";

export function ImageEditorCreator() {
	const {
		tool,
		newRectangle,
		zoomScale,
		containerRef,
		setRectangles,
		setSelectedRectangle,
		setNewRectangle,
		setTool,
		scaleX,
		scaleY,
		rect,
	} = useImageEditor();

	// Function to handle the mouse down event
	const handleCreateNewRectangle = React.useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();

			// Only allow left click
			if (e.button !== 0) {
				return;
			}

			// If there is a new rectangle being created the user is trying to close the rectangle (mouse up event)
			if (newRectangle) {
				if (e.type === "mouseup") {
					// check if the new rectangle is too small
					if (newRectangle.width < 20 || newRectangle.height < 20) {
						// Reset the current rectangle
						setNewRectangle(null);
						return;
					}
				}

				const adjustedCoordinates = adjustCoordinates(newRectangle, zoomScale);

				const newRectangleData = {
					...newRectangle,
					...adjustedCoordinates,
					initialCoordinates: {
						...adjustedCoordinates,
					},
					// Save real coordinates without the zoom scale to avoid values being multiplied by the zoom scale
					realCoordinates: {
						left:
							(adjustedCoordinates.left / newRectangle.initialScale.x) *
							zoomScale,
						top:
							(adjustedCoordinates.top / newRectangle.initialScale.y) *
							zoomScale,
						width:
							(adjustedCoordinates.width / newRectangle.initialScale.x) *
							zoomScale,
						height:
							(adjustedCoordinates.height / newRectangle.initialScale.y) *
							zoomScale,
					},
				} satisfies Rectangle;
				setRectangles((prev) => [...prev, newRectangleData]);

				// Reset the current rectangle
				setNewRectangle(null);

				// Set the new rectangle as the selected rectangle
				setSelectedRectangle(newRectangleData);
				setTool("move");

				return;
			}

			const { clientX, clientY } = e;
			const containerRect = containerRef.current?.getBoundingClientRect();

			if (!containerRect) {
				return;
			}

			const offsetX = clientX - containerRect.left;
			const offsetY = clientY - containerRect.top;

			// Create a new rectangle with the initial coordinates
			const rectangle: Rectangle = {
				id: uuidv4(),
				top: offsetY,
				left: offsetX,
				width: 0,
				height: 0,
				initialCoordinates: {
					top: offsetY,
					left: offsetX,
					width: 0,
					height: 0,
				},
				// Save the initial image dimensions to calculate the scale of the rectangle
				initialImageSize: {
					width: rect?.width || 0,
					height: rect?.height || 0,
				},
				// Save the initial scale of the rectangle
				initialScale: {
					x: scaleX,
					y: scaleY,
				},
				realCoordinates: {
					top: offsetY / scaleY,
					left: offsetX / scaleX,
					width: 0,
					height: 0,
				},
			};

			// Set the new rectangle as the current rectangle
			setNewRectangle(rectangle);
		},
		[
			rect,
			scaleX,
			scaleY,
			newRectangle,
			zoomScale,
			containerRef,
			setRectangles,
			setSelectedRectangle,
			setNewRectangle,
			setTool,
		],
	);

	if (tool !== "create") {
		return null;
	}

	return (
		<>
			{newRectangle && (
				<div
					className="absolute border-blue-200 bg-blue-500/30"
					style={{
						...adjustCoordinates(newRectangle, zoomScale),
						borderWidth: `${(2 / zoomScale).toFixed(4)}px`,
					}}
				>
					<div className="absolute -bottom-6 left-0 right-0 flex justify-center whitespace-nowrap">
						<div className="bg-info-9 text-background text-xs px-1.5 py-0.5 rounded-sm">
							{newRectangle.realCoordinates?.width.toFixed(0)} x{" "}
							{newRectangle.realCoordinates?.height.toFixed(0)}
						</div>
					</div>
				</div>
			)}
			<div
				className="absolute size-full top-0 left-0"
				onMouseDown={handleCreateNewRectangle}
				onMouseUp={handleCreateNewRectangle}
			/>
		</>
	);
}
