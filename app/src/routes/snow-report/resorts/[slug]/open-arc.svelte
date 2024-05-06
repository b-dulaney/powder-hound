<script lang="ts">
	import { Chart, Svg, Group, LinearGradient, Arc, Text } from 'layerchart';
	import { cubicInOut } from 'svelte/easing';
	export let url: string;
	export let open: number;
	export let total: number;
	export let type: 'Lifts' | 'Runs';

	const pctOpen = (open / total) * 100;
	let arcGradient = ['#d4d4d4', '#a8a29e'];
	if (pctOpen <= 33) {
		arcGradient = ['#f87171', '#fb923c'];
	}
	if (pctOpen >= 33 && pctOpen <= 66) {
		arcGradient = ['#fb923c', '#fde047'];
	}
	if (pctOpen >= 66 && pctOpen <= 75) {
		arcGradient = ['#fde047', '#0a7854'];
	}
	if (pctOpen >= 75) {
		arcGradient = ['#0a7854', '#0FBA81'];
	}
</script>

<div class="flex flex-col items-center pb-2">
	<div class="h-[100px] w-full p-2">
		<Chart ssr>
			<Svg title="Number of open {type}">
				<Group center>
					<Group y={16}>
						<LinearGradient stops={arcGradient} let:url>
							<Arc
								value={(open / total) * 100}
								range={[-120, 120]}
								outerRadius={55}
								innerRadius={45}
								cornerRadius={5}
								fill={url}
								track={{ class: 'fill-surface-200 dark:fill-surface-600' }}
							>
								<Text
									value={`${open} / ${total}`}
									textAnchor="middle"
									verticalAnchor="middle"
									class="fill-surface-600 dark:fill-surface-300"
								/>
							</Arc>
						</LinearGradient>
					</Group>
				</Group>
			</Svg>
		</Chart>
	</div>
	<a
		class="anchor !text-surface-900 dark:!text-surface-50 xl:text-lg"
		href={url}
		target="_blank"
		rel="noopener">{type} Open <span class="text-2xl">&rsaquo;</span></a
	>
</div>
