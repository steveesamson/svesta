export const relative = (node: HTMLElement) => {
	const parentElement = node.parentElement;
	let previousPosition = 'unset';

	if (parentElement) {
		previousPosition = getComputedStyle(parentElement).position;
		parentElement.style.position = 'relative';
		node.style.transform = 'scale(1)';
	}

	$effect(() => {
		return () => {
			if (!parentElement) return;
			parentElement.style.position = previousPosition;
		};
	});
};
