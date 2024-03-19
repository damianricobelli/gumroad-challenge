import { useHotkeys } from "@mantine/hooks";
import * as React from "react";
import type { Rectangle } from "./types";

type ImageEditorContextType = {
	rectangles: Rectangle[];
	setRectangles: React.Dispatch<React.SetStateAction<Rectangle[]>>;
	annotations: Rectangle[];
	setAnnotations: React.Dispatch<React.SetStateAction<Rectangle[]>>;
	selectedRectangle: Rectangle | null;
	setSelectedRectangle: React.Dispatch<React.SetStateAction<Rectangle | null>>;
	newRectangle: Rectangle | null;
	setNewRectangle: React.Dispatch<React.SetStateAction<Rectangle | null>>;
	tool: string;
	setTool: React.Dispatch<React.SetStateAction<"move" | "create">>;
	showZoomControls: boolean;
	setShowZoomControls: React.Dispatch<React.SetStateAction<boolean>>;
	zoomScale: number;
	setZoomScale: React.Dispatch<React.SetStateAction<number>>;
	scaleX: number;
	scaleY: number;
	rect: {
		width: number;
		height: number;
	};
	containerRef: React.MutableRefObject<HTMLDivElement | null>;
};

const ImageEditorContext = React.createContext<ImageEditorContextType>({
	rectangles: [],
	setRectangles: () => {},
	annotations: [],
	setAnnotations: () => {},
	selectedRectangle: null,
	setSelectedRectangle: () => {},
	newRectangle: null,
	setNewRectangle: () => {},
	tool: "create",
	setTool: () => {},
	showZoomControls: true,
	setShowZoomControls: () => {},
	zoomScale: 1,
	setZoomScale: () => {},
	scaleX: 1,
	scaleY: 1,
	rect: {
		width: 0,
		height: 0,
	},
	containerRef: { current: null },
});

export const ImageEditorProvider = ({
	children,
	values,
}: {
	children: React.ReactNode;
	values: ImageEditorContextType;
}) => {
	const {
		setNewRectangle,
		setSelectedRectangle,
		setRectangles,
		selectedRectangle,
		setTool,
		setShowZoomControls,
		annotations,
	} = values;
	useHotkeys([
		[
			"Escape",
			() => {
				setNewRectangle(null);
				setSelectedRectangle(null);
			},
		],
		[
			"Delete",
			() => {
				if (selectedRectangle) {
					setRectangles((prev) =>
						prev.filter((rect) => rect.id !== selectedRectangle.id),
					);
					setSelectedRectangle(null);
				}
			},
		],
		[
			"Backspace",
			() => {
				if (selectedRectangle) {
					setRectangles((prev) =>
						prev.filter((rect) => rect.id !== selectedRectangle.id),
					);
					setSelectedRectangle(null);
				}
			},
		],
		[
			"1",
			() => {
				setSelectedRectangle(null);
				setTool("move");
			},
		],
		[
			"2",
			() => {
				setSelectedRectangle(null);
				setTool("create");
			},
		],
		[
			"3",
			() => {
				setShowZoomControls((prev) => !prev);
			},
		],
		[
			"4",
			() => {
				const initialRectangles = [...annotations];
				setRectangles(initialRectangles);
				setSelectedRectangle(null);
			},
		],
		[
			"5",
			() => {
				setRectangles([]);
				setSelectedRectangle(null);
			},
		],
		[
			"6",
			() => {
				setSelectedRectangle(null);
			},
		],
	]);

	return (
		<ImageEditorContext.Provider value={values}>
			{children}
		</ImageEditorContext.Provider>
	);
};

export const useImageEditor = () => {
	const context = React.useContext(ImageEditorContext);
	if (!context) {
		throw new Error("useImageEditor must be used within a ImageEditorProvider");
	}
	return context;
};
