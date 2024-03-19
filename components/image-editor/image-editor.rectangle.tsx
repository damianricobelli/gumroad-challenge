import { useImageEditor } from "./image-editor.provider";
import type { Rectangle } from "./types";

import { Badge } from "@/components/ui/badge";

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
	HoverCard,
	HoverCardContent,
	HoverCardPortal,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { cn } from "@/lib/utils";
import { CopyPlus, Trash } from "lucide-react";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { ImageEditorResizer } from "./image-editor.resizer";

export function ImageEditorRectangle({
	rectangle,
}: {
	rectangle: Rectangle;
}) {
	const {
		selectedRectangle,
		tool,
		zoomScale,
		setSelectedRectangle,
		setRectangles,
		rect,
		containerRef,
		scaleX,
		scaleY,
	} = useImageEditor();

	const isSelected = selectedRectangle?.id === rectangle.id;

	const ref = React.useRef<HTMLDivElement>(null);
	useOnClickOutside(ref, () => setSelectedRectangle(null));

	const handleRectangleMove = React.useCallback(
		(id: string, dx: number, dy: number) => {
			// Update the coordinates of the rectangle based on the mouse movement
			setRectangles((prev) =>
				prev.map((rectangle) =>
					rectangle.id === id
						? {
								...rectangle,
								score: undefined,
								// Ensure the rectangle is always inside the container
								top: Math.max(
									0,
									Math.min(
										rectangle.top + dy,
										(containerRef.current?.clientHeight || 0) -
											rectangle.height,
									),
								),
								left: Math.max(
									0,
									// Ensure the rectangle is always inside the container
									Math.min(
										rectangle.left + dx,
										(containerRef.current?.clientWidth || 0) - rectangle.width,
									),
								),
								initialCoordinates: {
									...rectangle.initialCoordinates,
									top: Math.max(
										0,
										Math.min(
											rectangle.top + dy,
											(containerRef.current?.clientHeight || 0) -
												rectangle.height,
										),
									),
									left: Math.max(
										0,
										Math.min(
											rectangle.left + dx,
											(containerRef.current?.clientWidth || 0) -
												rectangle.width,
										),
									),
									width: rectangle.width,
									height: rectangle.height,
								},
								initialImageSize: {
									width: rect.width || 0,
									height: rect.height || 0,
								},
								initialScale: {
									x: scaleX,
									y: scaleY,
								},
								realCoordinates: {
									top: Math.max(0, (rectangle.top + dy) / scaleY),
									left: Math.max(0, (rectangle.left + dx) / scaleX),
									width: rectangle.width / scaleX,
									height: rectangle.height / scaleY,
								},
						  }
						: rectangle,
				),
			);
		},
		[rect, scaleX, scaleY, containerRef, setRectangles],
	);

	return (
		<ContextMenu key={rectangle.id}>
			<ContextMenuTrigger>
				<WithHoverCard rectangle={rectangle}>
					<div
						ref={ref}
						role="button"
						key={rectangle.id}
						className={cn(
							"absolute transition-colors duration-150 z-50",
							tool === "move" ? "cursor-move" : "cursor-default",
							isSelected
								? "border-blue-200 bg-blue-500/30"
								: "border-cyan-300 bg-cyan-500/30 hover:bg-cyan-500/60",
						)}
						style={{
							left: `${rectangle.left}px`,
							top: `${rectangle.top}px`,
							width: `${rectangle.width}px`,
							height: `${rectangle.height}px`,
							borderWidth: `${(2 / zoomScale).toFixed(4)}px`,
						}}
						onMouseDown={(e) => {
							e.stopPropagation();

							// Only allow left click
							// Prevent the event if the tool is not move
							if (tool !== "move" || e.button !== 0) {
								return;
							}

							if (!selectedRectangle || selectedRectangle.id !== rectangle.id) {
								setSelectedRectangle(rectangle);
							}

							let startX = e.clientX;
							let startY = e.clientY;

							const handleMouseMove = (e: MouseEvent) => {
								const dx = (e.clientX - startX) / zoomScale;
								const dy = (e.clientY - startY) / zoomScale;
								handleRectangleMove(rectangle.id, dx, dy);
								startX = e.clientX;
								startY = e.clientY;
							};

							const handleMouseUp = () => {
								document.removeEventListener("mousemove", handleMouseMove);
								document.removeEventListener("mouseup", handleMouseUp);
							};

							document.addEventListener("mousemove", handleMouseMove);
							document.addEventListener("mouseup", handleMouseUp);
						}}
					>
						{isSelected && <ImageEditorResizer />}
					</div>
				</WithHoverCard>
			</ContextMenuTrigger>
			<ContextMenuContent className="w-64">
				<ContextMenuItem
					inset
					onClick={() => {
						const newRectangle = {
							...rectangle,
							id: uuidv4(),
						};
						setRectangles((prev) => [...prev, newRectangle]);
						setSelectedRectangle(newRectangle);
					}}
				>
					<CopyPlus className="size-4 mr-2" />
					Duplicate
				</ContextMenuItem>
				<ContextMenuItem
					inset
					onClick={() => {
						setRectangles((prev) =>
							prev.filter((rect) => rect.id !== rectangle.id),
						);
						setSelectedRectangle(null);
					}}
					className="text-danger-9"
				>
					<Trash className="size-4 mr-2" />
					Delete
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

function WithHoverCard({
	children,
	rectangle,
}: {
	children: React.ReactNode;
	rectangle: Rectangle;
}) {
	const { tool } = useImageEditor();

	if (tool === "create") {
		return children;
	}

	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardPortal>
				<HoverCardContent className="relative py-2.5 px-3.5 z-[60]">
					{rectangle.score && (
						<Badge
							variant={
								rectangle.score * 100 < 50
									? "danger-subtle"
									: rectangle.score * 100 < 75
									  ? "warning-subtle"
									  : "success-subtle"
							}
							size="sm"
							className="rounded-sm absolute -top-2 -right-2"
						>
							Accuracy: {(rectangle.score * 100).toFixed(2)}
						</Badge>
					)}
					<Badge variant="info-subtle" size="sm" className="rounded-sm mb-2">
						Coordinates
					</Badge>
					<div className="text-xs text-muted-foreground">
						<div className="flex justify-between items-center">
							<p>Left</p>
							<p>{rectangle.realCoordinates?.left.toFixed(2)}</p>
						</div>
						<div className="flex justify-between items-center">
							<p>Top</p>
							<p>{rectangle.realCoordinates?.top.toFixed(2)}</p>
						</div>
						<div className="flex justify-between items-center">
							<p>Width</p>
							<p>{rectangle.realCoordinates?.width.toFixed(2)}</p>
						</div>
						<div className="flex justify-between items-center">
							<p>Height</p>
							<p>{rectangle.realCoordinates?.height.toFixed(2)}</p>
						</div>
					</div>
				</HoverCardContent>
			</HoverCardPortal>
		</HoverCard>
	);
}
