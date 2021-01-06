import { useToasts } from "react-toast-notifications";

export default function ToastDemo({ content }) {
	const { addToast } = useToasts();
	if (content.toString().match(/success/i)) {
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
	} else {
		return (
			<button
				onClick={() =>
					addToast(content, {
						appearance: "error",
						autoDismiss: false,
					})
				}
			>
				Add Toast
			</button>
		);
	}
}
