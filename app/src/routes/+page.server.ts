import { formatHeroNumber } from '$lib/utils.js';

export async function load(event) {
	const { supabase } = event.locals;

	async function getCaicDataCount(): Promise<number> {
		const { count } = await supabase
			.from('caic_data')
			.select('*', { count: 'estimated', head: true });
		return count ?? 60000;
	}

	async function getHeroCount() {
		const data = await getCaicDataCount();
		return formatHeroNumber(data, 0);
	}

	return {
		streamed: {
			caicDataCount: getHeroCount()
		}
	};
}
