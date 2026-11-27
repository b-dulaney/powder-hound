import type { Database } from '$lib/supabase-generated.types';
import { SNOW_STAKE_WINDOW_HOURS, type SnowStakeCam } from '$lib/snow-stakes';
import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'resort-cams';
// Upper bound per cam: hourly frames over the window, with room for a few extra.
const MAX_FRAMES = SNOW_STAKE_WINDOW_HOURS + 12;

/**
 * A resort's active snow stake cams with their frames from the last SNOW_STAKE_WINDOW_HOURS,
 * oldest first. Frames are public Storage objects, so URLs are built here, not fetched. Errors
 * are logged and give no cams: the stake card is an extra, not worth failing the page over.
 */
export async function loadSnowStakeCams(
	supabase: SupabaseClient<Database>,
	mountainId: number
): Promise<SnowStakeCam[]> {
	const since = new Date(Date.now() - SNOW_STAKE_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
	const { data, error } = await supabase
		.from('resort_cams')
		.select(
			'id, label, page_url, cleared_at, unofficial, resort_cam_images (id, captured_at, path, thumb_path, width, height)'
		)
		.eq('mountain_id', mountainId)
		.eq('active', true)
		.eq('kind', 'snow-stake')
		.gte('resort_cam_images.captured_at', since)
		.order('sort_order')
		.order('captured_at', { referencedTable: 'resort_cam_images', ascending: false })
		.limit(MAX_FRAMES, { referencedTable: 'resort_cam_images' });

	if (error) {
		console.error(`snow stake cams for mountain ${mountainId}:`, error.message);
		return [];
	}

	const bucket = supabase.storage.from(BUCKET);
	const url = (path: string) => bucket.getPublicUrl(path).data.publicUrl;
	return data.map((cam) => ({
		id: cam.id,
		label: cam.label,
		pageUrl: cam.page_url,
		clearedAt: cam.cleared_at,
		unofficial: cam.unofficial,
		// Newest first from the query (so the limit keeps the latest); the page wants oldest first.
		frames: cam.resort_cam_images
			.map((f) => ({
				id: f.id,
				capturedAt: f.captured_at,
				src: url(f.path),
				thumbSrc: url(f.thumb_path),
				width: f.width,
				height: f.height
			}))
			.reverse()
	}));
}
