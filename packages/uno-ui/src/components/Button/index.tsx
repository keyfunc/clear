import type { ButtonProps } from "./type";

// 按钮风格
const variantMap = {
	default: "bg-white text-gray-700 hover:bg-blue-600",
	outline: "border border-gray-300 text-gray-700 hover:bg-gray-100",
	ghost: "text-gray-700 hover:bg-gray-100",
	danger: "bg-red-500 text-white hover:bg-red-600",
};

// 按钮大小
const sizeMap = {
	sm: "px-2 py-1 text-sm",
	md: "px-4 py-2",
	lg: "px-6 py-3 text-lg",
	icon: "p-2",
};

function Button(props: ButtonProps) {
	const { children, variant = "default" } = props;

	return (
		<button {...props} className={variantMap[variant]}>
			{children}
		</button>
	);
}

export default Button;
