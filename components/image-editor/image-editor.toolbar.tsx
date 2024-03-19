import { Button } from "@/components/ui/button";
import {
	ToolbarRoot,
	ToolbarSeparator,
	ToolbarToggleGroup,
	ToolbarToggleItem,
} from "@/components/ui/toolbar";
import { toJpeg, toPng, toSvg } from "html-to-image";
import {
	Download,
	Eraser,
	Eye,
	EyeOff,
	Hand,
	RotateCcw,
	Save,
	Square,
} from "lucide-react";

import isEqual from "lodash.isequal";

import { HotkeyNumber } from "@/components/hotkey-number";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useImageEditor } from "./image-editor.provider";

export function ImageEditorToolbar() {
	const {
		rectangles,
		setRectangles,
		annotations,
		selectedRectangle,
		setSelectedRectangle,
		tool,
		setTool,
		showZoomControls,
		setShowZoomControls,
		containerRef,
	} = useImageEditor();
	return (
		<ToolbarRoot
			aria-label="Formatting options"
			className="rounded-t-lg rounded-b-none gap-10"
		>
			<div className="flex-1 flex gap-2 items-center">
				<ToolbarToggleGroup
					type="single"
					onValueChange={(value) => {
						setSelectedRectangle(null);
						setTool(value as "move" | "create");
					}}
					value={tool}
					aria-label="Text formatting"
				>
					<ToolbarToggleItem value="move" aria-label="Bold" number="1">
						<Hand className="size-4" />
					</ToolbarToggleItem>
					<ToolbarToggleItem value="create" aria-label="Italic" number="2">
						<Square className="size-4" />
					</ToolbarToggleItem>
				</ToolbarToggleGroup>
				<ToolbarSeparator className="mx-2 h-full" />
				<div className="flex items-center gap-2">
					<Button
						className="h-8 relative"
						variant="outline"
						onClick={() => {
							setShowZoomControls((prev) => !prev);
						}}
					>
						<HotkeyNumber value="3" />
						{!showZoomControls ? (
							<EyeOff className="size-4 mr-2" />
						) : (
							<Eye className="size-4 mr-2" />
						)}
						Zoom controls
					</Button>
					<Button
						className="h-8 relative"
						variant="outline"
						onClick={() => {
							const initialRectangles = [...annotations];
							setRectangles(initialRectangles);
							setSelectedRectangle(null);
						}}
					>
						<HotkeyNumber value="4" />
						<RotateCcw className="size-4 mr-2" />
						Restart
					</Button>
					<Button
						className="h-8 relative"
						variant="outline"
						disabled={rectangles.length === 0}
						onClick={() => {
							setRectangles([]);
							setSelectedRectangle(null);
						}}
					>
						<HotkeyNumber value="5" />
						<Eraser className="size-4 mr-2" />
						Clear all
					</Button>
					{selectedRectangle && (
						<Button
							className="h-8 relative"
							variant="outline"
							onClick={() => setSelectedRectangle(null)}
						>
							<HotkeyNumber value="6" />
							Deselect
						</Button>
					)}
				</div>
			</div>
			<div className="flex gap-2 items-center flex-nowrap">
				<Button
					className="h-8 relative"
					disabled={isEqual(annotations, rectangles)}
				>
					<Save className="size-4 mr-2" />
					Save changes
				</Button>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="h-8 relative" variant="outline">
							<Download className="size-4 mr-2" />
							Download
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-max">
						<DropdownMenuLabel>Format</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem
								onClick={() => {
									setSelectedRectangle(null);
									toJpeg(containerRef.current as HTMLElement).then(
										(dataUrl) => {
											const link = document.createElement("a");
											link.download = "image.jpeg";
											link.href = dataUrl;
											link.click();
											link.remove();
										},
									);
								}}
							>
								<span>JPG</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setSelectedRectangle(null);
									toPng(containerRef.current as HTMLElement).then((dataUrl) => {
										const link = document.createElement("a");
										link.download = "image.png";
										link.href = dataUrl;
										link.click();
										link.remove();
									});
								}}
							>
								<span>PNG</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setSelectedRectangle(null);
									toSvg(containerRef.current as HTMLElement).then((dataUrl) => {
										const link = document.createElement("a");
										link.download = "image.svg";
										link.href = dataUrl;
										link.click();
										link.remove();
									});
								}}
							>
								<span>SVG</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</ToolbarRoot>
	);
}
