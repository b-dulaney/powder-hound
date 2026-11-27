// Snow stake cam frames: types shared by the loader and the components, and time helpers.
// Times are shown in the resorts' time zone (Mountain Time) whatever the viewer's zone is,
// because "cleared at 5 AM" only makes sense in resort time.

export type SnowStakeFrame = {
	id: number;
	capturedAt: string;
	src: string;
	thumbSrc: string;
	width: number;
	height: number;
};

export type SnowStakeCam = {
	id: number;
	label: string;
	pageUrl: string;
	/** Usual clearing time, "HH:MM:SS" Mountain Time, when the resort states one. */
	clearedAt: string | null;
	unofficial: boolean;
	/** Oldest first. */
	frames: SnowStakeFrame[];
};

/** How far back the page shows frames. */
export const SNOW_STAKE_WINDOW_HOURS = 48;

/** A cam whose newest frame is older than this is shown as possibly offline. */
const STALE_AFTER_MS = 3 * 60 * 60 * 1000;

const TIME_ZONE = 'America/Denver';

const timeFormat = new Intl.DateTimeFormat('en-US', {
	timeZone: TIME_ZONE,
	hour: 'numeric',
	minute: '2-digit'
});
const dateFormat = new Intl.DateTimeFormat('en-US', {
	timeZone: TIME_ZONE,
	weekday: 'short',
	month: 'short',
	day: 'numeric'
});
const partsFormat = new Intl.DateTimeFormat('en-US', {
	timeZone: TIME_ZONE,
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	hourCycle: 'h23'
});

type LocalClock = { day: string; minutes: number };

/** The Mountain Time calendar day ("YYYY-MM-DD") and minutes past midnight of an instant. */
function localClock(date: Date): LocalClock {
	const parts = Object.fromEntries(
		partsFormat.formatToParts(date).map((p) => [p.type, p.value])
	) as Record<string, string>;
	return {
		day: `${parts.year}-${parts.month}-${parts.day}`,
		minutes: Number(parts.hour) * 60 + Number(parts.minute)
	};
}

/** "4:50 AM" */
export function formatFrameTime(iso: string): string {
	return timeFormat.format(new Date(iso));
}

/** "Today", "Yesterday" or "Wed, Nov 25", relative to now in Mountain Time. */
export function formatFrameDay(iso: string, now: Date): string {
	const day = localClock(new Date(iso)).day;
	if (day === localClock(now).day) return 'Today';
	if (day === localClock(new Date(now.getTime() - 24 * 60 * 60 * 1000)).day) return 'Yesterday';
	return dateFormat.format(new Date(iso));
}

/** "05:00:00" -> "5:00 AM" */
export function formatClockTime(time: string): string {
	const [h, m] = time.split(':').map(Number);
	const suffix = h < 12 ? 'AM' : 'PM';
	return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

function clockMinutes(time: string): number {
	const [h, m] = time.split(':').map(Number);
	return h * 60 + m;
}

/**
 * Frames taken just before the stake was cleared: the last frame before each daily clearing
 * time, when the next frame came after it. Those show the full day's snow. frames are oldest
 * first; frames more than 3 hours apart aren't compared, so a gap doesn't mislabel one.
 */
export function framesBeforeClearing(
	frames: SnowStakeFrame[],
	clearedAt: string | null
): Set<number> {
	const ids = new Set<number>();
	if (!clearedAt) return ids;
	const clear = clockMinutes(clearedAt);
	for (let i = 0; i < frames.length - 1; i++) {
		const before = new Date(frames[i].capturedAt);
		const after = new Date(frames[i + 1].capturedAt);
		if (after.getTime() - before.getTime() > 3 * 60 * 60 * 1000) continue;
		const a = localClock(before);
		const b = localClock(after);
		const crossed =
			a.day === b.day
				? a.minutes < clear && b.minutes >= clear
				: a.minutes < clear || b.minutes >= clear;
		if (crossed) ids.add(frames[i].id);
	}
	return ids;
}

/** Whether a cam's newest frame is old enough that the cam may have stopped updating. */
export function isStale(newest: SnowStakeFrame | undefined, now: Date): boolean {
	return !!newest && now.getTime() - new Date(newest.capturedAt).getTime() > STALE_AFTER_MS;
}

/** "skiloveland.com" from a resort page URL, for attribution. */
export function sourceHost(url: string): string {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch {
		return url;
	}
}
