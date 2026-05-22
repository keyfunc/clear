import type { ButtonProps } from "./type";

function Button(props: ButtonProps) {
	return (
		<div className="w-10 h-10 bg-blue-500 border border-gray-600">
			<span>{props.title}</span>
			<span>hahhaah</span>
		</div>
	);
}

export default Button;
