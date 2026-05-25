import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "ghost" | "link" | "destructive";
	size?: "sm" | "md" | "lg" | "icon";
	loading?: boolean;
	block?: boolean;
}
