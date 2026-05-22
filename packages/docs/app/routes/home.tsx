import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Link } from "react-router";
import { baseOptions } from "@/lib/layout.shared";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Uno Docs" },
		{ name: "Uno", content: "Welcome to Uno Docs!" },
	];
}

export default function Home() {
	return (
		<HomeLayout {...baseOptions()}>
			<div className="p-4 flex flex-col items-center justify-center text-center flex-1">
				<Link
					className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
					to="/docs"
				>
					Open Docs
				</Link>
			</div>
		</HomeLayout>
	);
}
