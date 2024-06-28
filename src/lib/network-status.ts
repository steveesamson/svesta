import { writable, get } from 'svelte/store';

const status = writable<boolean>(true);

const updateConnectionStatus = () => {
	if (navigator.onLine) {
		console.log('online');
		status.set(true);
		location.reload();
	} else {
		console.log('offline');
		status.set(false);
	}
};

type TNetworkStatus = {
	isOnline: boolean;
	register: () => () => void;
};

export const networkStatus: TNetworkStatus = {
	get isOnline() {
		return get(status);
	},
	register() {
		window.addEventListener('online', updateConnectionStatus);
		window.addEventListener('offline', updateConnectionStatus);
		return () => {
			window.removeEventListener('online', updateConnectionStatus);
			window.removeEventListener('offline', updateConnectionStatus);
		};
	}
};
