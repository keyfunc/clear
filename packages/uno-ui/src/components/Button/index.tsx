import type { ButtonProps } from "./type";

function Button(props: ButtonProps) {
	return <button className="bg-amber-950 w-20 h-10" {...props}></button>;
}

export default Button;
