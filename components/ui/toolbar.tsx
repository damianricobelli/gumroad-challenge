"use client";

import * as Toolbar from "@radix-ui/react-toolbar";
import * as React from "react";

import { cn } from "@/lib/utils";
import { HotkeyNumber } from "../hotkey-number";

const ToolbarRoot = React.forwardRef<
	React.ElementRef<typeof Toolbar.Root>,
	React.ComponentPropsWithoutRef<typeof Toolbar.Root>
>(({ className, children, ...props }, ref) => (
	<Toolbar.Root
		ref={ref}
		className={cn(
			"flex p-2.5 w-full min-w-max rounded-md bg-background border select-none",
			className,
		)}
		{...props}
	>
		{children}
	</Toolbar.Root>
));

const ToolbarToggleGroup = React.forwardRef<
	React.ElementRef<typeof Toolbar.ToggleGroup>,
	React.ComponentPropsWithoutRef<typeof Toolbar.ToggleGroup>
>(({ className, children, ...props }, ref) => (
	<Toolbar.ToggleGroup
		ref={ref}
		className={cn("flex gap-2", className)}
		{...props}
	>
		{children}
	</Toolbar.ToggleGroup>
));

const ToolbarToggleItem = React.forwardRef<
	React.ElementRef<typeof Toolbar.ToggleItem>,
	React.ComponentPropsWithoutRef<typeof Toolbar.ToggleItem> & {
		number?: string;
	}
>(({ className, number, children, ...props }, ref) => (
	<Toolbar.ToggleItem
		ref={ref}
		className={cn(
			"flex-shrink-0 flex-grow-0 basis-auto text-gray-11 h-8 p-2 rounded inline-flex text-sm leading-none items-center justify-center bg-background ml-0.5 outline-none hover:bg-purple-3 hover:text-purple-11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-purple-7 first:ml-0 data-[state=on]:bg-purple-5 data-[state=on]:text-purple-11",
			number && "relative",
			className,
		)}
		{...props}
	>
		{children}
		{number && <HotkeyNumber value={number} />}
	</Toolbar.ToggleItem>
));

const ToolbarSeparator = React.forwardRef<
	React.ElementRef<typeof Toolbar.Separator>,
	React.ComponentPropsWithoutRef<typeof Toolbar.Separator>
>(({ className, ...props }, ref) => (
	<Toolbar.Separator
		ref={ref}
		className={cn("w-px mx-2.5 bg-gray-7", className)}
		{...props}
	/>
));

const ToolbarLink = React.forwardRef<
	React.ElementRef<typeof Toolbar.Link>,
	React.ComponentPropsWithoutRef<typeof Toolbar.Link>
>(({ className, children, ...props }, ref) => (
	<Toolbar.Link
		ref={ref}
		className={cn(
			"text-gray-11 hidden sm:inline-flex justify-center items-center hover:cursor-pointer flex-shrink-0 flex-grow-0 basis-auto h-8 px-1 rounded text-xs leading-none bg-background ml-0.5 outline-none hover:bg-purple-3 hover:text-purple-11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-purple-7 first:ml-0 data-[state=on]:bg-purple-7 data-[state=on]:text-purple-11",
			className,
		)}
		{...props}
	>
		{children}
	</Toolbar.Link>
));

const ToolbarButton = React.forwardRef<
	React.ElementRef<typeof Toolbar.Button>,
	React.ComponentPropsWithoutRef<typeof Toolbar.Button>
>(({ className, children, ...props }, ref) => (
	<Toolbar.Button
		ref={ref}
		className={cn(
			"px-2.5 text-white bg-purple-9 flex-shrink-0 flex-grow-0 basis-auto h-8 rounded inline-flex text-sm leading-none items-center justify-center outline-none hover:bg-purple-10 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-purple-7",
			className,
		)}
		{...props}
	>
		{children}
	</Toolbar.Button>
));

export {
	ToolbarRoot,
	ToolbarToggleGroup,
	ToolbarToggleItem,
	ToolbarSeparator,
	ToolbarLink,
	ToolbarButton,
};
