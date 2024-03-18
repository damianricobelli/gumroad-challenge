export const HotkeyNumber = ({
	value,
}: {
	value: string;
}) => {
	return (
		<div className="absolute -top-1.5 -right-1.5 bg-purple-9 text-white rounded-full size-4 flex items-center justify-center text-[10px]">
			{value}
		</div>
	);
};
