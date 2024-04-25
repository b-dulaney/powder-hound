import type { State } from '@vincjo/datatables/remote';

export const reload = async (state: State) => {
	const response = await fetch(`/api/snow-report?view=backcountry_overview${getParams(state)}`);
	const { data } = await response.json();
	return data;
};

const getParams = (state: State) => {
	const { sort, filters, search } = state;

	let params = ``;

	if (sort) {
		params += `&sort=${sort.orderBy}&order=${sort.direction}`;
	}
	if (filters) {
		params += filters.map(({ filterBy, value }) => `&${filterBy}=${value}`).join();
	}
	if (search) {
		params += `&q=${search}`;
	}
	return params;
};
