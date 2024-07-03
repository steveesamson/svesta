type TNetworkStatus = {
	isOnline: () => boolean;
	qeueuRefresh: () => void;
	onChange:(fn:(state:boolean) => void) => void;
};

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

let status = $state<boolean>(NetworkState.restore());
let refresh = $state<boolean>(false);
const onChangeListeners:((state:boolean) => void)[] = [];

const updateConnectionStatus = () => {
	if (navigator.onLine) {
		console.log('online');
		status = true;
		NetworkState.save("true")
		if(refresh){
			location.reload();
		}else{
			for(const action of onChangeListeners){
				action(status);
			}
		}
		
	} else {
		console.log('offline');
		status = false;
		NetworkState.save("false");
		for(const action of onChangeListeners){
			action(status);
		}
	}
};

const start = () =>{
	if(typeof window === 'undefined') return;
	window.addEventListener('online', updateConnectionStatus);
	window.addEventListener('offline', updateConnectionStatus);
	if(!status){
		updateConnectionStatus();
	}
}

start();

export const networkStatus: TNetworkStatus = {
	isOnline() {
		return status;
	},
	qeueuRefresh(){
		refresh = true;
	},
	onChange(fn:(state:boolean) => void){
		onChangeListeners.push(fn);
	}
};
