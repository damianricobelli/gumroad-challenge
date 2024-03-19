import { cn } from "@/lib/utils";
import { useImageEditor } from "./image-editor.provider";
import { useMoveResizer } from "./use-move-resizer";

const classes = {
	left: "cursor-ew-resize translate-y-[-50%] -left-1 top-1/2",
	top: "cursor-ns-resize -top-1 left-1/2 translate-x-[-50%]",
	right: "cursor-ew-resize translate-y-[-50%] -right-1 top-1/2",
	bottom: "cursor-ns-resize -bottom-1 left-1/2 translate-x-[-50%]",
	topLeft: "cursor-nwse-resize -top-1 -left-1",
	topRight: "cursor-nesw-resize -top-1 -right-1",
	bottomLeft: "cursor-nesw-resize -bottom-1 -left-1",
	bottomRight: "cursor-nwse-resize -bottom-1 -right-1",
} as const;

export function ImageEditorResizer() {
	const {
		selectedRectangle,
		setRectangles,
		scaleX,
		scaleY,
		containerRef,
		zoomScale,
	} = useImageEditor();

	const {
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
	} = useMoveResizer({
		selectedRectangle,
		setRectangles,
		scaleX,
		scaleY,
		containerRef,
		zoomScale,
	});

	const refs = {
		left: refLeft,
		top: refTop,
		right: refRight,
		bottom: refBottom,
		topLeft: refTopLeft,
		topRight: refTopRight,
		bottomLeft: refBottomLeft,
		bottomRight: refBottomRight,
	};

	return Object.entries(classes).map(([key, value]) => (
		<div
			key={key}
			ref={refs[key as keyof typeof refs]}
			className={cn(
				"absolute size-2",
				!isResizing && "bg-info-3 border-info-12 border",
				value,
			)}
			onMouseUp={() => setIsResizing(false)}
			onMouseDown={(e) => {
				e.stopPropagation();
				// Only allow left click
				if (e.button !== 0) {
					return;
				}
				setIsResizing(true);
			}}
		/>
	));
}
