import type { Network, NetworkStatus } from "./types/index.js";


const NetworkState =  {
	KEY:"NetworkState",
	save(state:string) {
		if(typeof window === 'undefined') return;
		sessionStorage.setItem(NetworkState.KEY, state);
	},
	restore(){
		if(typeof window === 'undefined') return true;
		const state = sessionStorage.getItem(NetworkState.KEY);
		return state? state === 'true' :  false; 
	}
}

const _status = $state<NetworkStatus>({ online: NetworkState.restore() });

let refresh = $state<boolean>(false);

const updateConnectionStatus = () => {
	if (navigator.onLine) {
		console.log('online');
		_status.online = true;
		NetworkState.save("true")
		if(refresh){
			location.reload();
		}
		
	} else {
		console.log('offline');
		_status.online = false;
		NetworkState.save("false");
	}
};

const start = () =>{
	if(typeof window === 'undefined') return;
	window.addEventListener('online', updateConnectionStatus);
	window.addEventListener('offline', updateConnectionStatus);
	if(!_status.online){
		updateConnectionStatus();
	}
}

start();

export const network: Network = {
	get status() {
		return _status;
	},
	qeueuRefresh(){
		refresh = true;
	}
};
