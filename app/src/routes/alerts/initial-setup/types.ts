export type AlertThreshold = {
	mountain_id: number;
	name: string;
	location_type: string;
	threshold: number;
};

export type MountainPreview = {
	mountain_id: number;
	display_name: string;
	location_type: 'resort' | 'backcountry';
};
