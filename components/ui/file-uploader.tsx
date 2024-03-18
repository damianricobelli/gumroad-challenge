import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import * as React from "react";
import {
	DropZone,
	DropZoneProps,
	FileDropItem,
	FileTrigger,
	FileTriggerProps,
} from "react-aria-components";

export const FileUploader = React.forwardRef<
	HTMLInputElement,
	{
		label?: string | React.ReactNode;
		icon?: React.ReactNode | false;
		styles?: {
			dropzone?: string;
			trigger?: string;
		};
		variant?: "default" | "avatar";
		dropzoneProps?: Omit<DropZoneProps, "className" | "children">;
		triggerProps?: Omit<FileTriggerProps, "children">;
		files?: File[] | null;
		setFiles: (files: File[]) => void;
		name?: string;
	}
>(
	(
		{
			label = "Upload a file",
			icon = <Upload className="size-4" />,
			styles,
			dropzoneProps,
			triggerProps = {
				allowsMultiple: true,
				acceptedFileTypes: ["*"],
				defaultCamera: "environment",
				acceptDirectory: false,
			},
			variant = "default",
			files,
			setFiles,
			name,
		},
		ref,
	) => {
		if (variant === "avatar" && triggerProps.allowsMultiple) {
			throw new Error("Avatar variant does not support multiple files");
		}

		const fileTriggerRef = React.useRef<HTMLInputElement | null>(null);

		const setFileTriggerRef = React.useCallback(
			(node: HTMLInputElement | null) => {
				fileTriggerRef.current = node;
				if (node) {
					node.name = name || "file";
				}
			},
			[name],
		);

		return (
			<DropZone
				className={({ isHovered, isFocused, isFocusVisible, isDropTarget }) => {
					return cn(
						"cursor-pointer select-none rounded-lg border border-dashed border-gray-7 bg-background text-sm",
						"active:border-gray-8 active:ring-2 active:ring-info-7 active:ring-offset-1",
						isHovered && "border-gray-8 bg-gray-3",
						isDropTarget && "bg-gray-3",
						isFocused && "border-gray-8 ring-2 ring-info-7 ring-offset-1",
						isFocusVisible && "border-gray-8 ring-2 ring-info-7 ring-offset-1",
						variant === "avatar" && "rounded-full",
						styles?.dropzone,
					);
				}}
				onDrop={async (e) => {
					const newFiles = e.items.filter(
						(file) => file.kind === "file",
					) as FileDropItem[];
					const blobFiles = await Promise.all(
						newFiles.map((file) => file.getFile().then((file) => file)),
					);
					const currentFiles = files || [];
					setFiles([...blobFiles, ...currentFiles]);
				}}
				{...dropzoneProps}
			>
				<FileTrigger
					ref={(instance: HTMLInputElement) => {
						setFileTriggerRef(instance);
						if (typeof ref === "function") {
							ref(instance);
						} else if (ref !== null) {
							ref.current = instance;
						}
					}}
					onSelect={(e) => {
						if (e instanceof FileList && e.length > 0) {
							const files = Array.from(e);
							setFiles(files);
						}
					}}
					{...triggerProps}
				>
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						onClick={() => {
							if (fileTriggerRef.current) {
								fileTriggerRef.current.click();
							}
						}}
						className={cn(
							"flex size-full items-center justify-center gap-2 px-4 py-2",
							variant === "avatar" && "size-40",
							styles?.trigger,
						)}
					>
						{icon}
						{label}
					</div>
				</FileTrigger>
			</DropZone>
		);
	},
);

FileUploader.displayName = "FileUploader";

// UTILS
export const formatFileSize = (bytes: number) => {
	if (bytes >= 1024 * 1024) {
		// If the size is greater than or equal to 1 MB, display in MB
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	}
	if (bytes >= 1024) {
		// If the size is greater than or equal to 1 KB, display in KB
		return `${(bytes / 1024).toFixed(2)} KB`;
	}
	// If it's less than 1 KB, display in bytes
	return `${bytes} bytes`;
};

export const truncateFileName = (fileName: string, maxLength: number) => {
	if (fileName.length <= maxLength) {
		return fileName; // If the name is shorter or equal to maxLength, it is not truncated.
	}
	const extension = fileName.split(".").pop() as string; // Get the file extension
	const truncatedName = fileName.substring(0, maxLength - extension.length - 1);
	// Truncate the name to make room for the extension and the three dots
	return `${truncatedName}...${extension}`;
};

export const needTruncate = (fileName: string, maxLength: number) =>
	fileName.length > maxLength;
