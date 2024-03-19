import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialogDescription } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { Edit2, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ImagesListProps {
	images: {
		publicUrl: string;
		index: number;
	}[];
	selectedImage: {
		publicUrl: string;
		index: number;
	};
	setSelectedImage: React.Dispatch<
		React.SetStateAction<{
			publicUrl: string;
			index: number;
		} | null>
	>;
	setLoadingSelectedImage: React.Dispatch<React.SetStateAction<boolean>>;
}

type CheckedState = {
	file: string;
	checked: boolean;
};

export function ImagesList({
	images,
	selectedImage,
	setSelectedImage,
	setLoadingSelectedImage,
}: ImagesListProps) {
	const router = useRouter();

	const [checked, setChecked] = useState<CheckedState[]>([]);
	const [status, setStatus] = useState<"default" | "edit">("default");

	const deleteFile = async () => {
		toast.promise(
			async () => {
				setChecked([]);
				router.refresh();
			},
			{
				loading: "Deleting file...",
				success: "Files removed successfully",
				error: (error: Error) => {
					return `An error occurred while deleting file. Cause: ${error.message}`;
				},
			},
		);
	};

	return (
		<div className="w-full border rounded-lg px-2.5 py-1">
			<ScrollArea type="always" className="relative py-2.5">
				<ScrollBar orientation="horizontal" />
				{status === "edit" ? (
					<>
						<div className="flex items-center gap-2 absolute top-4 left-0.5">
							<Checkbox
								id="all-selected"
								checked={
									checked.filter((image) => image?.checked).length ===
									images.length
								}
								onCheckedChange={(checked) => {
									setChecked(
										images.map((image) => {
											return {
												checked: checked as boolean,
												file: image.publicUrl,
											};
										}),
									);
								}}
								className="rounded size-5 bg-background"
							/>
							<Label htmlFor="all-selected" className="text-gray-11">
								{checked.filter((image) => image?.checked).length} selected
							</Label>
						</div>
						<div className="flex items-center gap-2 absolute top-2.5 right-0.5">
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									setStatus("default");
									setChecked([]);
								}}
							>
								Cancel
							</Button>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										size="sm"
										variant="destructive"
										onClick={() => setStatus("edit")}
										disabled={
											checked.filter((image) => image?.checked).length === 0
										}
									>
										<Trash className="size-4 mr-2" />
										Delete
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you sure you want to delete these images?
										</AlertDialogTitle>
										<AlertDialogDescription>
											You cannot undo this action.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={() => {
												const checkedImages = checked.filter(
													(image) => image?.checked,
												);
												if (checkedImages.length === 0) {
													toast.error(
														"Please select at least one image to delete",
													);
													return;
												}
												deleteFile();
											}}
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</>
				) : (
					<div className="flex absolute top-2.5 right-0.5">
						<Button
							size="sm"
							variant="outline"
							onClick={() => setStatus("edit")}
						>
							<Edit2 className="size-4 mr-2" />
							Edit
						</Button>
					</div>
				)}
				<RadioGroup
					className="flex items-center gap-3 h-full mt-11"
					value={`${selectedImage.publicUrl}-${selectedImage.index}`}
					onValueChange={(value: string) => {
						const index = Number(value.split("-").pop() as string);
						const publicUrl = images[index].publicUrl;
						setLoadingSelectedImage(true);
						setSelectedImage({ publicUrl, index });
					}}
				>
					{images.map((image, i) => {
						const id = `${image.publicUrl}-${image.index}`;
						return (
							<div className="relative" key={uuidv4()}>
								<Label
									htmlFor={id}
									className="relative flex size-[100px] z-0 flex-col gap-3 rounded-md border-2 bg-background hover:bg-gray-3 [&:has([data-state=checked])]:border-purple-9 [&:has([data-state=checked])]:border-[3px]"
								>
									<RadioGroupItem id={id} className="sr-only" value={id} />
									<Image
										width={100}
										height={100}
										src={image.publicUrl}
										className="size-full rounded-sm border object-cover hover:opacity-80 transition-opacity duration-150"
										alt="Image"
									/>
								</Label>
								{status === "edit" && (
									<Checkbox
										checked={checked[i]?.checked}
										onCheckedChange={(checked) => {
											setChecked((prev) => {
												const newChecked = [...prev];
												newChecked[i] = {
													...newChecked[i],
													checked: checked as boolean,
													file: image.publicUrl,
												};
												return newChecked;
											});
										}}
										className={cn(
											"absolute rounded size-5 bg-background left-2 top-2 z-10",
										)}
									/>
								)}
							</div>
						);
					})}
				</RadioGroup>
			</ScrollArea>
		</div>
	);
}
