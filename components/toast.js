import { useToasts } from "react-toast-notifications";

export default function ToastDemo({ content }) {
	const { addToast } = useToasts();
	return (
		<button
			onClick={() =>
				addToast(content, {
					appearance: "success",
					autoDismiss: false,
				})
			}
		>
			Add Toast
		</button>
	);
}
