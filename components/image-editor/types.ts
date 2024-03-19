export interface Rectangle {
	id: string;
	// Coordinates of the rectangle in the canvas (scaled)
	top: number;
	left: number;
	width: number;
	height: number;
	// name and description
	name?: string;
	description?: string;
	// Initial coordinates provided by AWS Rekognition API with initial scale
	initialCoordinates?: {
		top: number;
		left: number;
		width: number;
		height: number;
	};
	// Initial image dimensions to calculate the scale of the rectangle
	initialImageSize: {
		width: number;
		height: number;
	};
	// Initial scale of the rectangle
	initialScale: {
		x: number;
		y: number;
	};
	// Coordinates of the rectangle in the original image from AWS Rekognition API
	realCoordinates?: {
		top: number;
		left: number;
		width: number;
		height: number;
	};
}
