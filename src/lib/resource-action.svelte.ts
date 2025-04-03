export const relative = (node: HTMLElement) => {
    const parentElement = node.parentElement;
    let previousPosition = 'unset';

    if (parentElement) {
        console.log({ parentElement })
        previousPosition = getComputedStyle(parentElement).position;
        parentElement.style.position = 'relative';
        node.style.transform = 'scale(1)';
    }

    return {
        destroy() {
            if (!parentElement) return;
            parentElement.style.position = previousPosition;
        }
    }
}