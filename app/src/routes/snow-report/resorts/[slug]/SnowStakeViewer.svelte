<script lang="ts">
	import {
		formatClockTime,
		formatFrameDay,
		formatFrameTime,
		framesBeforeClearing,
		isStale,
		sourceHost,
		SNOW_STAKE_WINDOW_HOURS,
		type SnowStakeCam
	} from '$lib/snow-stakes';
	import { timeFromNow } from '$lib/utils';
	import { onMount, tick } from 'svelte';

	export let cam: SnowStakeCam;
	export let resortName: string;

	// Oldest first, so the filmstrip reads left to right in time; start on the newest frame.
	let index = Math.max(cam.frames.length - 1, 0);
	let now = new Date();
	let strip: HTMLElement;
	let dialog: HTMLDialogElement;
	let lightboxOpen = false;
	let announcement = '';

	$: frames = cam.frames;
	$: frame = frames[index];
	$: newest = frames[frames.length - 1];
	$: beforeClearing = framesBeforeClearing(frames, cam.clearedAt);
	$: stale = isStale(newest, now);
	$: camName = /snow stake/i.test(cam.label)
		? `${resortName} ${cam.label.toLowerCase()}`
		: `${resortName} ${cam.label}`;
	$: liveSite = sourceHost(cam.pageUrl);

	const altText = (f: (typeof frames)[number]) =>
		`${camName}, ${formatFrameDay(f.capturedAt, now)} at ${formatFrameTime(
			f.capturedAt
		)} Mountain Time`;

	const prefersReducedMotion = () =>
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/** Scrolls the filmstrip (not the page) so a frame's thumbnail is centred. */
	function centerThumb(i: number, smooth: boolean) {
		const thumb = strip?.querySelector<HTMLElement>(`[data-index="${i}"]`);
		if (!strip || !thumb) return thumb;
		strip.scrollTo({
			left: thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2,
			behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto'
		});
		return thumb;
	}

	async function select(i: number, focusThumb = false) {
		if (i < 0 || i >= frames.length || i === index) return;
		index = i;
		const f = frames[i];
		announcement = `${formatFrameDay(f.capturedAt, now)}, ${formatFrameTime(f.capturedAt)}`;
		await tick();
		const thumb = centerThumb(i, true);
		if (focusThumb) thumb?.focus({ preventScroll: true });
	}

	const older = () => select(index - 1);
	const newer = () => select(index + 1);

	// Filmstrip keyboard: one tab stop; arrows, Home and End move the selection (listbox pattern).
	function onStripKeydown(event: KeyboardEvent) {
		const next = {
			ArrowLeft: index - 1,
			ArrowRight: index + 1,
			Home: 0,
			End: frames.length - 1
		}[event.key];
		if (next === undefined) return;
		event.preventDefault();
		select(next, true);
	}

	// Swipe on touch screens: horizontal swipes step through frames; vertical ones still scroll.
	let swipeStart: { x: number; y: number } | null = null;
	let swiped = false;
	function onPointerDown(event: PointerEvent) {
		swiped = false;
		swipeStart = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY };
	}
	function onPointerUp(event: PointerEvent) {
		if (!swipeStart) return;
		const dx = event.clientX - swipeStart.x;
		const dy = event.clientY - swipeStart.y;
		swipeStart = null;
		if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
		swiped = true;
		if (dx > 0) older();
		else newer();
	}

	function openLightbox() {
		if (swiped) {
			// The tap that ended a swipe isn't a request to enlarge.
			swiped = false;
			return;
		}
		lightboxOpen = true;
		dialog.showModal();
	}

	function onLightboxKeydown(event: KeyboardEvent) {
		if (!lightboxOpen) return;
		if (event.key === 'ArrowLeft') older();
		else if (event.key === 'ArrowRight') newer();
	}

	onMount(() => {
		centerThumb(index, false);
		// Keep "x minutes ago" and the offline check current while the page stays open.
		const timer = setInterval(() => (now = new Date()), 60_000);
		return () => clearInterval(timer);
	});
</script>

<svelte:window on:keydown={onLightboxKeydown} />

{#if frame}
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
		<figure class="lg:col-span-2">
			<div
				class="relative touch-pan-y overflow-hidden rounded-lg bg-surface-200 dark:bg-surface-800"
				style:aspect-ratio="{frame.width} / {frame.height}"
				on:pointerdown={onPointerDown}
				on:pointerup={onPointerUp}
				on:pointercancel={() => (swipeStart = null)}
			>
				<button
					type="button"
					class="block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
					on:click={openLightbox}
				>
					<span class="sr-only">Enlarge:</span>
					<img
						src={frame.src}
						srcset="{frame.thumbSrc} 480w, {frame.src} {frame.width}w"
						sizes="(min-width: 1280px) 820px, (min-width: 1024px) 64vw, 100vw"
						width={frame.width}
						height={frame.height}
						alt={altText(frame)}
						loading="lazy"
						decoding="async"
						class="h-full w-full object-contain"
					/>
				</button>
				<span
					class="pointer-events-none absolute left-2 top-2 rounded-md bg-black/70 px-2 py-1 text-sm font-semibold text-white"
					aria-hidden="true"
				>
					{formatFrameDay(frame.capturedAt, now)}, {formatFrameTime(frame.capturedAt)} MT
				</span>
				<button
					type="button"
					class="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 disabled:hidden"
					disabled={index === 0}
					on:click={older}
					aria-label="Earlier image"
				>
					<i class="fa-solid fa-chevron-left" aria-hidden="true" />
				</button>
				<button
					type="button"
					class="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 disabled:hidden"
					disabled={index === frames.length - 1}
					on:click={newer}
					aria-label="Later image"
				>
					<i class="fa-solid fa-chevron-right" aria-hidden="true" />
				</button>
			</div>
			<figcaption class="sr-only">{altText(frame)}</figcaption>
		</figure>

		<div class="flex flex-col gap-3 text-surface-600 dark:text-surface-300">
			<div>
				<p class="text-2xl font-bold text-surface-900 dark:text-white">
					{formatFrameTime(frame.capturedAt)} <span class="text-base font-semibold">MT</span>
				</p>
				<p>
					{formatFrameDay(frame.capturedAt, now)} · {timeFromNow(frame.capturedAt)}
				</p>
			</div>
			{#if beforeClearing.has(frame.id) && cam.clearedAt}
				<p
					class="rounded-md bg-primary-100 px-3 py-2 text-sm font-medium text-primary-900 dark:bg-primary-900/40 dark:text-primary-100"
				>
					Last image before the stake was cleared at {formatClockTime(cam.clearedAt)}.
				</p>
			{/if}
			{#if stale}
				<p
					class="rounded-md bg-tertiary-200 px-3 py-2 text-sm font-medium text-tertiary-900 dark:bg-tertiary-900/40 dark:text-tertiary-200"
					role="status"
				>
					No new image since {formatFrameTime(newest.capturedAt)}. The cam may be offline or not
					updating.
				</p>
			{/if}
			<ul class="space-y-1 text-sm">
				{#if cam.clearedAt}
					<li>Cleared daily around {formatClockTime(cam.clearedAt)}.</li>
				{/if}
				{#if cam.unofficial}
					<li>
						{resortName} doesn't use this stake as its official snowfall measurement. See Mountain Conditions
						for reported totals.
					</li>
				{/if}
				<li>Captured hourly. Times are Mountain Time.</li>
			</ul>
			<a
				href={cam.pageUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex w-fit items-center gap-2 font-medium text-primary-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 dark:text-primary-300"
			>
				Watch live on {liveSite}
				<i class="fa-solid fa-arrow-up-right-from-square text-xs" aria-hidden="true" />
				<span class="sr-only">(opens in a new tab)</span>
			</a>
		</div>
	</div>

	{#if frames.length > 1}
		<div class="mt-4">
			<p id="stake-strip-label-{cam.id}" class="mb-2 text-sm font-medium">
				Last {SNOW_STAKE_WINDOW_HOURS} hours
			</p>
			<div
				bind:this={strip}
				class="relative flex snap-x gap-2 overflow-x-auto pb-2"
				role="listbox"
				aria-orientation="horizontal"
				aria-labelledby="stake-strip-label-{cam.id}"
				tabindex="-1"
			>
				{#each frames as f, i (f.id)}
					<button
						type="button"
						role="option"
						aria-selected={i === index}
						tabindex={i === index ? 0 : -1}
						data-index={i}
						class="group w-28 shrink-0 snap-start rounded-md p-1 text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 sm:w-32 {i ===
						index
							? 'bg-primary-100 dark:bg-primary-900/50'
							: 'hover:bg-surface-200 dark:hover:bg-surface-800'}"
						on:click={() => select(i)}
						on:keydown={onStripKeydown}
					>
						<span class="relative block">
							<img
								src={f.thumbSrc}
								width="480"
								height={Math.round((480 * f.height) / f.width)}
								alt=""
								loading="lazy"
								decoding="async"
								class="h-auto w-full rounded border-2 bg-surface-200 dark:bg-surface-800 {i ===
								index
									? 'border-primary-600 dark:border-primary-400'
									: 'border-transparent'}"
							/>
							{#if beforeClearing.has(f.id)}
								<span
									class="absolute bottom-1 left-1 rounded bg-primary-700 px-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white"
									aria-hidden="true">Pre-clear</span
								>
							{/if}
						</span>
						<span class="mt-1 block text-xs leading-tight">
							<span class="block font-semibold" aria-hidden="true"
								>{formatFrameDay(f.capturedAt, now)}</span
							>
							<span aria-hidden="true">{formatFrameTime(f.capturedAt)}</span>
							<span class="sr-only"
								>{formatFrameDay(f.capturedAt, now)}, {formatFrameTime(
									f.capturedAt
								)}{beforeClearing.has(f.id) ? ', last image before clearing' : ''}</span
							>
						</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<p class="sr-only" aria-live="polite">{announcement}</p>

	<!-- Esc and focus handling come from the native modal dialog; clicking the backdrop closes it. -->
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
	<dialog
		bind:this={dialog}
		class="m-0 h-full max-h-none w-full max-w-none bg-black p-0 text-white outline-none backdrop:bg-black"
		aria-label="{camName}, enlarged"
		on:close={() => (lightboxOpen = false)}
		on:click={(event) => event.target === dialog && dialog.close()}
	>
		{#if lightboxOpen}
			<div class="flex h-full flex-col">
				<div class="flex items-center justify-between gap-4 p-3 sm:p-4">
					<p class="font-semibold">
						{formatFrameDay(frame.capturedAt, now)}, {formatFrameTime(frame.capturedAt)} MT
					</p>
					<button
						type="button"
						class="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500"
						on:click={() => dialog.close()}
						aria-label="Close"
					>
						<i class="fa-solid fa-xmark text-xl" aria-hidden="true" />
					</button>
				</div>
				<div
					class="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 pb-4"
					on:pointerdown={onPointerDown}
					on:pointerup={onPointerUp}
					on:pointercancel={() => (swipeStart = null)}
				>
					<img
						src={frame.src}
						width={frame.width}
						height={frame.height}
						alt={altText(frame)}
						class="max-h-full max-w-full object-contain"
					/>
					<button
						type="button"
						class="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 disabled:hidden"
						disabled={index === 0}
						on:click={older}
						aria-label="Earlier image"
					>
						<i class="fa-solid fa-chevron-left" aria-hidden="true" />
					</button>
					<button
						type="button"
						class="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500 disabled:hidden"
						disabled={index === frames.length - 1}
						on:click={newer}
						aria-label="Later image"
					>
						<i class="fa-solid fa-chevron-right" aria-hidden="true" />
					</button>
				</div>
			</div>
		{/if}
	</dialog>
{:else}
	<div
		class="flex flex-col items-center justify-center gap-3 rounded-lg bg-surface-100 p-8 text-center dark:bg-surface-800"
	>
		<p>No images from this cam in the last {SNOW_STAKE_WINDOW_HOURS} hours.</p>
		<a
			href={cam.pageUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="font-medium text-primary-700 underline-offset-4 hover:underline dark:text-primary-300"
		>
			Check the cam on {liveSite}<span class="sr-only"> (opens in a new tab)</span>
		</a>
	</div>
{/if}
