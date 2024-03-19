import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const badgeVariants = cva("inline-flex items-center font-medium select-none", {
	variants: {
		variant: {
			primary: "text-gray-1 bg-gray-12",
			"primary-subtle": "text-gray-12 bg-gray-3",
			"primary-outline": "text-gray-12 border border-gray-7",
			info: "text-gray-1 dark:text-gray-12 bg-info-9",
			"info-subtle": "text-info-11 bg-info-3",
			"info-outline": "text-info-11 border border-info-7",
			warning: "text-gray-12 bg-warning-9 dark:text-gray-1",
			"warning-subtle": "text-warning-11 bg-warning-3 dark:text-warning-12",
			"warning-outline": "text-warning-11 border border-warning-7",
			danger: "text-gray-1 dark:text-gray-12 bg-danger-9",
			"danger-subtle": "text-danger-11 bg-danger-3",
			"danger-outline": "text-danger-11 border border-danger-7",
			success: "text-gray-1 dark:text-gray-12 bg-success-9",
			"success-subtle": "text-success-11 bg-success-3",
			"success-outline": "text-success-11 border border-success-7",
			orange: "text-gray-1 dark:text-gray-12 bg-orange-9",
			"orange-subtle": "text-orange-11 bg-orange-3",
			"orange-outline": "text-orange-11 border border-orange-7",
			brown: "text-gray-1 dark:text-gray-12 bg-brown-9",
			"brown-subtle": "text-brown-11 bg-brown-3",
			"brown-outline": "text-brown-11 border border-brown-7",
			purple: "text-gray-1 dark:text-gray-12 bg-purple-9",
			"purple-subtle": "text-purple-11 bg-purple-3",
			"purple-outline": "text-purple-11 border border-purple-7",
			pink: "text-gray-1 dark:text-gray-12 bg-pink-9",
			"pink-subtle": "text-pink-11 bg-pink-3",
			"pink-outline": "text-pink-11 border border-pink-7",
		},
		size: {
			xs: "py-[1px] px-2 text-xs rounded-[4px]",
			sm: "py-[3px] px-2 text-xs rounded-[6px]",
			md: "py-1 px-3 text-base rounded-[8px]",
			lg: "py-2 px-3 text-base rounded-[8px]",
		},
		appearance: {
			round: "rounded-[40px]",
			number: "rounded-full",
		},
		tag: {
			true: "cursor-pointer transition-colors ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info-7 focus-visible:ring-offset-1 disabled:pointer-events-none",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "sm",
	},
	compoundVariants: [
		{
			variant: "primary",
			tag: true,
			className:
				"border border-transparent active:border-gray-11 active:bg-gray-11 hover:bg-gray-10",
		},
		{
			variant: "primary-outline",
			tag: true,
			className: "active:border-gray-11 hover:border-gray-8",
		},
		{
			variant: "primary-subtle",
			tag: true,
			className:
				"border border-transparent active:border-gray-11 active:bg-gray-4 hover:bg-gray-4",
		},
		{
			variant: "info",
			tag: true,
			className:
				"border border-transparent active:border-info-12 active:bg-info-11 hover:bg-info-10",
		},
		{
			variant: "info-outline",
			tag: true,
			className: "active:border-info-12 hover:border-info-8",
		},
		{
			variant: "info-subtle",
			tag: true,
			className:
				"border border-transparent active:border-info-12 active:bg-info-4 hover:bg-info-4",
		},
		{
			variant: "warning",
			tag: true,
			className:
				"border border-transparent active:border-warning-12 active:bg-warning-11 hover:bg-warning-10",
		},
		{
			variant: "warning-outline",
			tag: true,
			className: "active:border-warning-12 hover:border-warning-8",
		},
		{
			variant: "warning-subtle",
			tag: true,
			className:
				"border border-transparent active:border-warning-12 active:bg-warning-4 hover:bg-warning-4",
		},
		{
			variant: "danger",
			tag: true,
			className:
				"border border-transparent active:border-danger-12 active:bg-danger-11 hover:bg-danger-10",
		},
		{
			variant: "danger-outline",
			tag: true,
			className: "active:border-danger-12 hover:border-danger-8",
		},
		{
			variant: "danger-subtle",
			tag: true,
			className:
				"border border-transparent active:border-danger-12 active:bg-danger-4 hover:bg-danger-4",
		},
		{
			variant: "success",
			tag: true,
			className:
				"border border-transparent active:border-success-12 active:bg-success-11 hover:bg-success-10",
		},
		{
			variant: "success-outline",
			tag: true,
			className: "active:border-success-12 hover:border-success-8",
		},
		{
			variant: "success-subtle",
			tag: true,
			className:
				"border border-transparent active:border-success-12 active:bg-success-4 hover:bg-success-4",
		},
		{
			variant: "orange",
			tag: true,
			className:
				"border border-transparent active:border-orange-12 active:bg-orange-11 hover:bg-orange-10",
		},
		{
			variant: "orange-outline",
			tag: true,
			className: "active:border-orange-12 hover:border-orange-8",
		},
		{
			variant: "orange-subtle",
			tag: true,
			className:
				"border border-transparent active:border-orange-12 active:bg-orange-4 hover:bg-orange-4",
		},
		{
			variant: "brown",
			tag: true,
			className:
				"border border-transparent active:border-brown-12 active:bg-brown-11 hover:bg-brown-10",
		},
		{
			variant: "brown-outline",
			tag: true,
			className: "active:border-brown-12 hover:border-brown-8",
		},
		{
			variant: "brown-subtle",
			tag: true,
			className:
				"border border-transparent active:border-brown-12 active:bg-brown-4 hover:bg-brown-4",
		},
		{
			variant: "purple",
			tag: true,
			className:
				"border border-transparent active:border-purple-12 active:bg-purple-11 hover:bg-purple-10",
		},
		{
			variant: "purple-outline",
			tag: true,
			className: "active:border-purple-12 hover:border-purple-8",
		},
		{
			variant: "purple-subtle",
			tag: true,
			className:
				"border border-transparent active:border-purple-12 active:bg-purple-4 hover:bg-purple-4",
		},
		{
			variant: "pink",
			tag: true,
			className:
				"border border-transparent active:border-pink-12 active:bg-pink-11 hover:bg-pink-10",
		},
		{
			variant: "pink-outline",
			tag: true,
			className: "active:border-pink-12 hover:border-pink-8",
		},
		{
			variant: "pink-subtle",
			tag: true,
			className:
				"border border-transparent active:border-pink-12 active:bg-pink-4 hover:bg-pink-4",
		},
	],
});

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {
	tag?: boolean;
}

function Badge({
	className,
	variant,
	size,
	appearance,
	tag = false,
	...props
}: BadgeProps) {
	return (
		<div
			role={tag ? "button" : undefined}
			tabIndex={tag ? 0 : undefined}
			className={cn(
				badgeVariants({ variant, size, appearance, tag }),
				className,
			)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
