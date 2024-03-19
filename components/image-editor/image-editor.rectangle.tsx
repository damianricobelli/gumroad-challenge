import { useImageEditor } from "./image-editor.provider";
import type { Rectangle } from "./types";

import { Badge } from "@/components/ui/badge";

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { cn } from "@/lib/utils";
import { CopyPlus, Trash } from "lucide-react";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { Separator } from "../ui/separator";
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
		setIsMoving,
	} = useImageEditor();

	const isSelected = selectedRectangle?.id === rectangle.id;

	const ref = React.useRef<HTMLDivElement>(null);
	useOnClickOutside(ref, (e) => {
		const popover = document.getElementById("popover-content");
		if (popover?.contains(e.target as Node)) {
			return;
		}
		setSelectedRectangle(null);
	});

	const handleRectangleMove = React.useCallback(
		(id: string, dx: number, dy: number) => {
			// Update the coordinates of the rectangle based on the mouse movement
			setRectangles((prev) =>
				prev.map((rectangle) =>
					rectangle.id === id
						? {
								...rectangle,
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
				<WithPopover rectangle={rectangle} isSelected={isSelected}>
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

							setIsMoving(true);

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
								setIsMoving(false);
							};

							document.addEventListener("mousemove", handleMouseMove);
							document.addEventListener("mouseup", handleMouseUp);
						}}
					>
						{isSelected && (
							<div className="absolute -bottom-6 left-0 right-0 flex justify-center whitespace-nowrap">
								<div className="bg-info-9 text-background text-xs px-1.5 py-0.5 rounded-sm">
									{rectangle.realCoordinates?.width.toFixed(0)} x{" "}
									{rectangle.realCoordinates?.height.toFixed(0)}
								</div>
							</div>
						)}
						{isSelected && <ImageEditorResizer />}
					</div>
				</WithPopover>
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

function WithPopover({
	children,
	rectangle,
	isSelected,
}: {
	children: React.ReactNode;
	rectangle: Rectangle;
	isSelected: boolean;
}) {
	const { tool, setRectangles, isResizing, isMoving } = useImageEditor();

	if (tool === "create" || isResizing || isMoving) {
		return children;
	}

	return (
		<Popover open={isSelected}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				id="popover-content"
				onOpenAutoFocus={(e) => e.preventDefault()}
				className="relative z-[60] px-3.5 py-3 space-y-4 w-64"
				side="right"
				align="start"
			>
				<div>
					<Badge variant="primary-subtle" size="sm" className="rounded-sm mb-2">
						Coordinates
					</Badge>
					<div className="text-xs text-muted-foreground">
						<div className="flex justify-between items-center">
							<p>Left</p>
							<p>{rectangle.realCoordinates?.left.toFixed(0)}px</p>
						</div>
						<div className="flex justify-between items-center">
							<p>Top</p>
							<p>{rectangle.realCoordinates?.top.toFixed(0)}px</p>
						</div>
						<div className="flex justify-between items-center">
							<p>Width</p>
							<p>{rectangle.realCoordinates?.width.toFixed(0)}px</p>
						</div>
						<div className="flex justify-between items-center">
							<p>Height</p>
							<p>{rectangle.realCoordinates?.height.toFixed(0)}px</p>
						</div>
					</div>
				</div>
				<Separator />
				<div className="grid gap-4">
					<Badge
						variant="primary-subtle"
						size="sm"
						className="rounded-sm w-max"
					>
						Clasification
					</Badge>
					<div className="grid gap-1">
						<div className="grid items-center gap-1 text-muted-foreground text-xs">
							<Label htmlFor="name" className="text-xs">
								What is this?
							</Label>
							<Input
								id="name"
								value={rectangle.name}
								onChange={(e) => {
									const value = e.target.value;
									const modifiedRectangle = {
										...rectangle,
										name: value,
									};
									setRectangles((prev) =>
										prev.map((rect) =>
											rect.id === modifiedRectangle.id
												? modifiedRectangle
												: rect,
										),
									);
								}}
								className="col-span-2 h-8 text-xs"
								placeholder="Face, glass, clothing, etc."
							/>
						</div>
					</div>
					<div className="grid gap-1 mb-1">
						<div className="grid items-center gap-1 text-muted-foreground text-xs">
							<Label htmlFor="description" className="text-xs">
								Description
							</Label>
							<Input
								id="description"
								value={rectangle.description}
								onChange={(e) => {
									const value = e.target.value;
									const modifiedRectangle = {
										...rectangle,
										description: value,
									};
									setRectangles((prev) =>
										prev.map((rect) =>
											rect.id === modifiedRectangle.id
												? modifiedRectangle
												: rect,
										),
									);
								}}
								className="col-span-2 h-8 text-xs"
								placeholder="Describe the element"
							/>
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
