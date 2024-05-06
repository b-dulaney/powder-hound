export type ToastType = 'info' | 'success' | 'delete' | 'error';

export type ToastSettings = {
	message: string;
	type: ToastType;
	timeout: number;
};

export type Toast = {
	id: number;
	message: string;
	type: ToastType;
	timeout: number;
};
