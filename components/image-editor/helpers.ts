import type { Rectangle } from "./types";

// Function to set the coordinates of the rectangle to be always positive
// This function is useful to avoid negative width and height values
// Also adjust the coordinates based on the zoom scale
export function adjustCoordinates(
	{ top, left, width, height }: Rectangle,
	zoomScale = 1,
) {
	return {
		top: (height < 0 ? top + height : top) / zoomScale,
		left: (width < 0 ? left + width : left) / zoomScale,
		width: Math.abs(width) / zoomScale,
		height: Math.abs(height) / zoomScale,
	};
}

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
