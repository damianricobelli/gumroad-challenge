import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Minus, Plus, RefreshCcw } from "lucide-react";
import { useRef, useState } from "react";
import {
	type ReactZoomPanPinchContentRef,
	type ReactZoomPanPinchRef,
	TransformComponent,
	TransformWrapper,
	useTransformEffect,
} from "react-zoom-pan-pinch";
import { useImageEditor } from "./image-editor.provider";

const controlIcons = {
	zoomIn: <Plus className="size-4" />,
	zoomOut: <Minus className="size-4" />,
	resetTransform: <RefreshCcw className="size-4" />,
};

type ControlType = keyof typeof controlIcons;

const ControlButton = ({
	callback,
	type,
	label,
	className,
}: {
	callback: () => void;
	type: ControlType;
	label: string;
	className?: string;
}) => (
	<Tooltip>
		<TooltipTrigger asChild>
			<Button
				className={cn(
					"size-8 bg-gray-3 text-gray-12 hover:text-gray-1",
					className,
				)}
				size="icon"
				onClick={() => callback()}
			>
				{controlIcons[type]}
			</Button>
		</TooltipTrigger>
		<TooltipContent>{label}</TooltipContent>
	</Tooltip>
);

const Controls = ({
	zoomIn,
	zoomOut,
	resetTransform,
	instance,
}: ReactZoomPanPinchContentRef) => {
	const { zoomScale, setZoomScale } = useImageEditor();

	const contentComponent = instance?.contentComponent;
	const imageElement = contentComponent?.children[0] as HTMLImageElement;

	const reset = () => {
		resetTransform();
		if (imageElement) {
			imageElement.style.transition = "none";
			imageElement.style.transform = "";
		}
	};

	useTransformEffect(({ state }) => {
		setZoomScale(state.scale);
	});
	return (
		<TooltipProvider>
			<div className="absolute top-4 right-4 z-50 flex h-8 items-center gap-2">
				<div className="flex h-full items-center gap-2 rounded-md bg-gray-3 p-2 backdrop-blur-sm">
					<ControlButton
						className="size-5 bg-transparent"
						callback={zoomOut}
						type="zoomOut"
						label="Zoom out"
					/>
					<Tooltip>
						<TooltipTrigger asChild>
							<Slider
								onValueChange={(value) => {
									instance?.setTransformState(value[0], 0, 0);
									instance?.setCenter();
								}}
								className={cn(
									"w-[100px]",
									"[&>span[data-orientation=horizontal]]:h-1 [&>span[data-orientation=horizontal]]:bg-gray-9",
									"[&>span[data-orientation=horizontal]]:[&>span[data-orientation=horizontal]]:bg-gray-12",
									"[&_span[aria-orientation=horizontal]]:h-3 [&_span[aria-orientation=horizontal]]:w-3 [&_span[aria-orientation=horizontal]]:border-0",
								)}
								min={1}
								max={8}
								value={[zoomScale]}
								step={0.1}
							/>
						</TooltipTrigger>
						<TooltipContent>
							{Math.floor(Math.round((((zoomScale - 1) * 100) / 7) * 10) / 10)}%
						</TooltipContent>
					</Tooltip>
					<ControlButton
						className="size-5 bg-transparent"
						callback={zoomIn}
						type="zoomIn"
						label="Zoom in"
					/>
				</div>

				<ControlButton
					className="backdrop-blur-sm"
					callback={reset}
					type="resetTransform"
					label="Reset"
				/>
			</div>
		</TooltipProvider>
	);
};

export const ZoomImage = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { showZoomControls, setZoomScale } = useImageEditor();
	const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

	const [doubleStep, setDoubleStep] = useState(0.7);

	return (
		<TransformWrapper
			smooth
			ref={transformComponentRef}
			doubleClick={{ step: doubleStep }}
			onZoomStop={(e) => {
				setZoomScale(e.state.scale);
			}}
			onPanningStop={(e) => {
				if (e.state.scale !== 1) {
					setDoubleStep(-0.7);
				} else {
					setDoubleStep(0.7);
				}
			}}
		>
			{(utils) => (
				<div className="relative size-full">
					{showZoomControls && <Controls {...utils} />}
					<TransformComponent wrapperClass="rounded-b-md border-b border-x">
						{children}
					</TransformComponent>
				</div>
			)}
		</TransformWrapper>
	);
};
