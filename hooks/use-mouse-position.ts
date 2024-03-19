import * as React from "react";

export const useMousePosition = <T extends HTMLElement>(
	imgRef: React.RefObject<T>,
) => {
	const [mousePosition, setMousePosition] = React.useState({
		x: 0,
		y: 0,
	});

	React.useEffect(() => {
		const updateMousePosition = (ev: MouseEvent) => {
			const targetElement = imgRef.current;
			if (targetElement) {
				const rect = targetElement.getBoundingClientRect();
				const scaledX = ev.clientX - rect.left;
				const scaledY = ev.clientY - rect.top;
				setMousePosition({ x: scaledX, y: scaledY });
			}
		};
		window.addEventListener("mousemove", updateMousePosition);
		return () => {
			window.removeEventListener("mousemove", updateMousePosition);
		};
	}, [imgRef]);

	return mousePosition;
};
