import * as React from "react";
import type { Rectangle } from "./types";

type ResizerType =
	| "left"
	| "top"
	| "right"
	| "bottom"
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

export function useMoveResizer({
	selectedRectangle,
	setRectangles,
	scaleX,
	scaleY,
	containerRef,
	zoomScale,
}: {
	selectedRectangle: Rectangle | null;
	setRectangles: React.Dispatch<React.SetStateAction<Rectangle[]>>;
	scaleX: number;
	scaleY: number;
	containerRef: React.MutableRefObject<HTMLDivElement | null>;
	zoomScale: number;
}) {
	const refLeft = React.useRef<HTMLDivElement>(null);
	const refTop = React.useRef<HTMLDivElement>(null);
	const refRight = React.useRef<HTMLDivElement>(null);
	const refBottom = React.useRef<HTMLDivElement>(null);
	const refTopLeft = React.useRef<HTMLDivElement>(null);
	const refTopRight = React.useRef<HTMLDivElement>(null);
	const refBottomLeft = React.useRef<HTMLDivElement>(null);
	const refBottomRight = React.useRef<HTMLDivElement>(null);

	const [isResizing, setIsResizing] = React.useState(false);

	const handleResize = React.useCallback(
		(id: string, dx: number, dy: number, resizeType: ResizerType) => {
			setRectangles((prev) =>
				prev.map((rectangle) => {
					const { left, top, width, height } = rectangle;

					let newLeft = left;
					let newTop = top;
					let newWidth = width;
					let newHeight = height;

					switch (resizeType) {
						case "right":
							newWidth = Math.max(
								0,
								Math.min(
									width + dx,
									(containerRef.current?.clientWidth || 0) - left,
								),
							);
							break;
						case "bottom":
							newHeight = Math.max(
								0,
								Math.min(
									height + dy,
									(containerRef.current?.clientHeight || 0) - top,
								),
							);
							break;
						case "left":
							newLeft = Math.max(0, Math.min(left + dx, left + width));
							newWidth = Math.max(0, Math.min(width - dx, left + width));
							break;
						case "top":
							newTop = Math.max(0, Math.min(top + dy, top + height));
							newHeight = Math.max(0, Math.min(height - dy, top + height));
							break;
						case "top-left":
							newLeft = Math.max(0, Math.min(left + dx, left + width));
							newWidth = Math.max(0, Math.min(width - dx, left + width));
							newTop = Math.max(0, Math.min(top + dy, top + height));
							newHeight = Math.max(0, Math.min(height - dy, top + height));
							break;
						case "top-right":
							newWidth = Math.max(
								0,
								Math.min(
									width + dx,
									(containerRef.current?.clientWidth || 0) - left,
								),
							);
							newTop = Math.max(0, Math.min(top + dy, top + height));
							newHeight = Math.max(0, Math.min(height - dy, top + height));
							break;
						case "bottom-left":
							newLeft = Math.max(0, Math.min(left + dx, left + width));
							newWidth = Math.max(0, Math.min(width - dx, left + width));
							newHeight = Math.max(
								0,
								Math.min(
									height + dy,
									(containerRef.current?.clientHeight || 0) - top,
								),
							);
							break;
						case "bottom-right":
							newWidth = Math.max(
								0,
								Math.min(
									width + dx,
									(containerRef.current?.clientWidth || 0) - left,
								),
							);
							newHeight = Math.max(
								0,
								Math.min(
									height + dy,
									(containerRef.current?.clientHeight || 0) - top,
								),
							);
							break;
						default:
							break;
					}

					const newRealCoordinates = {
						left: newLeft / scaleX,
						top: newTop / scaleY,
						width: newWidth / scaleX,
						height: newHeight / scaleY,
					};

					return rectangle.id === id
						? {
								...rectangle,
								score: undefined,
								left: newLeft,
								top: newTop,
								width: newWidth,
								height: newHeight,
								realCoordinates: newRealCoordinates,
						  }
						: rectangle;
				}),
			);
		},
		[scaleX, scaleY, containerRef, setRectangles],
	);

	React.useEffect(() => {
		const resizerLeft = refLeft.current;
		const resizerTop = refTop.current;
		const resizerRight = refRight.current;
		const resizerBottom = refBottom.current;
		const resizerTopLeft = refTopLeft.current;
		const resizerTopRight = refTopRight.current;
		const resizerBottomLeft = refBottomLeft.current;
		const resizerBottomRight = refBottomRight.current;

		let x = 0;
		let y = 0;

		// Left resize
		const onMouseMoveLeftResize = (e: MouseEvent) => {
			const dx = (e.clientX - x) / zoomScale;
			handleResize(selectedRectangle?.id as string, dx, 0, "left");
			x = e.clientX;
		};

		const onMouseUpLeftResize = () => {
			document.removeEventListener("mousemove", onMouseMoveLeftResize);
		};

		const onMouseDownLeftResize = (e: MouseEvent) => {
			x = e.clientX;
			document.addEventListener("mousemove", onMouseMoveLeftResize);
			document.addEventListener("mouseup", onMouseUpLeftResize);
		};

		// Top resize
		const onMouseMoveTopResize = (e: MouseEvent) => {
			const dy = (e.clientY - y) / zoomScale;
			handleResize(selectedRectangle?.id as string, 0, dy, "top");
			y = e.clientY;
		};

		const onMouseUpTopResize = () => {
			document.removeEventListener("mousemove", onMouseMoveTopResize);
		};

		const onMouseDownTopResize = (e: MouseEvent) => {
			y = e.clientY;
			document.addEventListener("mousemove", onMouseMoveTopResize);
			document.addEventListener("mouseup", onMouseUpTopResize);
		};

		// Right resize
		const onMouseMoveRightResize = (e: MouseEvent) => {
			const dx = (e.clientX - x) / zoomScale;
			handleResize(selectedRectangle?.id as string, dx, 0, "right");
			x = e.clientX;
		};

		const onMouseUpRightResize = () => {
			document.removeEventListener("mousemove", onMouseMoveRightResize);
		};

		const onMouseDownRightResize = (e: MouseEvent) => {
			x = e.clientX;
			document.addEventListener("mousemove", onMouseMoveRightResize);
			document.addEventListener("mouseup", onMouseUpRightResize);
		};

		// Bottom resize
		const onMouseMoveBottomResize = (e: MouseEvent) => {
			const dy = (e.clientY - y) / zoomScale;
			handleResize(selectedRectangle?.id as string, 0, dy, "bottom");
			y = e.clientY;
		};

		const onMouseUpBottomResize = () => {
			document.removeEventListener("mousemove", onMouseMoveBottomResize);
		};

		const onMouseDownBottomResize = (e: MouseEvent) => {
			y = e.clientY;
			document.addEventListener("mousemove", onMouseMoveBottomResize);
			document.addEventListener("mouseup", onMouseUpBottomResize);
		};

		// Top left resize
		const onMouseMoveTopLeftResize = (e: MouseEvent) => {
			const dx = (e.clientX - x) / zoomScale;
			const dy = (e.clientY - y) / zoomScale;
			handleResize(selectedRectangle?.id as string, dx, dy, "top-left");
			x = e.clientX;
			y = e.clientY;
		};

		const onMouseUpTopLeftResize = () => {
			document.removeEventListener("mousemove", onMouseMoveTopLeftResize);
		};

		const onMouseDownTopLeftResize = (e: MouseEvent) => {
			x = e.clientX;
			y = e.clientY;
			document.addEventListener("mousemove", onMouseMoveTopLeftResize);
			document.addEventListener("mouseup", onMouseUpTopLeftResize);
		};

		// Top right resize
		const onMouseMoveTopRightResize = (e: MouseEvent) => {
			const dx = (e.clientX - x) / zoomScale;
			const dy = (e.clientY - y) / zoomScale;
			handleResize(selectedRectangle?.id as string, dx, dy, "top-right");
			x = e.clientX;
			y = e.clientY;
		};

		const onMouseUpTopRightResize = () => {
			document.removeEventListener("mousemove", onMouseMoveTopRightResize);
		};

		const onMouseDownTopRightResize = (e: MouseEvent) => {
			x = e.clientX;
			y = e.clientY;
			document.addEventListener("mousemove", onMouseMoveTopRightResize);
			document.addEventListener("mouseup", onMouseUpTopRightResize);
		};

		// Bottom left resize
		const onMouseMoveBottomLeftResize = (e: MouseEvent) => {
			const dx = (e.clientX - x) / zoomScale;
			const dy = (e.clientY - y) / zoomScale;
			handleResize(selectedRectangle?.id as string, dx, dy, "bottom-left");
			x = e.clientX;
			y = e.clientY;
		};

		const onMouseUpBottomLeftResize = () => {
			document.removeEventListener("mousemove", onMouseMoveBottomLeftResize);
		};

		const onMouseDownBottomLeftResize = (e: MouseEvent) => {
			x = e.clientX;
			y = e.clientY;
			document.addEventListener("mousemove", onMouseMoveBottomLeftResize);
			document.addEventListener("mouseup", onMouseUpBottomLeftResize);
		};

		// Bottom right resize
		const onMouseMoveBottomRightResize = (e: MouseEvent) => {
			const dx = (e.clientX - x) / zoomScale;
			const dy = (e.clientY - y) / zoomScale;
			handleResize(selectedRectangle?.id as string, dx, dy, "bottom-right");
			x = e.clientX;
			y = e.clientY;
		};

		const onMouseUpBottomRightResize = () => {
			document.removeEventListener("mousemove", onMouseMoveBottomRightResize);
		};

		const onMouseDownBottomRightResize = (e: MouseEvent) => {
			x = e.clientX;
			y = e.clientY;
			document.addEventListener("mousemove", onMouseMoveBottomRightResize);
			document.addEventListener("mouseup", onMouseUpBottomRightResize);
		};

		// Add mouse down event listener
		resizerLeft?.addEventListener("mousedown", onMouseDownLeftResize);
		resizerTop?.addEventListener("mousedown", onMouseDownTopResize);
		resizerRight?.addEventListener("mousedown", onMouseDownRightResize);
		resizerBottom?.addEventListener("mousedown", onMouseDownBottomResize);
		resizerTopLeft?.addEventListener("mousedown", onMouseDownTopLeftResize);
		resizerTopRight?.addEventListener("mousedown", onMouseDownTopRightResize);
		resizerBottomLeft?.addEventListener(
			"mousedown",
			onMouseDownBottomLeftResize,
		);
		resizerBottomRight?.addEventListener(
			"mousedown",
			onMouseDownBottomRightResize,
		);

		return () => {
			resizerLeft?.removeEventListener("mousedown", onMouseDownLeftResize);
			resizerTop?.removeEventListener("mousedown", onMouseDownTopResize);
			resizerRight?.removeEventListener("mousedown", onMouseDownRightResize);
			resizerBottom?.removeEventListener("mousedown", onMouseDownBottomResize);
			resizerTopLeft?.removeEventListener(
				"mousedown",
				onMouseDownTopLeftResize,
			);
			resizerTopRight?.removeEventListener(
				"mousedown",
				onMouseDownTopRightResize,
			);
			resizerBottomLeft?.removeEventListener(
				"mousedown",
				onMouseDownBottomLeftResize,
			);
			resizerBottomRight?.removeEventListener(
				"mousedown",
				onMouseDownBottomRightResize,
			);
		};
	}, [handleResize, selectedRectangle, zoomScale]);

	return {
		refLeft,
		refTop,
		refRight,
		refBottom,
		refTopLeft,
		refTopRight,
		refBottomLeft,
		refBottomRight,
		isResizing,
		setIsResizing,
	};
}
