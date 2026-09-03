<script lang="ts">
	import { scaleLinear, scaleLog } from 'd3-scale';

	// ─────────────────────────────────────────────────────────────────────────
	// model — illustrative but internally consistent. one step = one inference
	// pass, which re-reads the whole cached prefix. that prefix grows every turn,
	// so cumulative cache reads grow ~quadratically; the non-composable path just
	// pays the same growing tax twice as often. constant factor, compounded.
	// ─────────────────────────────────────────────────────────────────────────
	// Token sizes are drawn from ~1,400 of my own ~/.pi sessions (pass 1 ≈ 5k, pass 30
	// ≈ 45k, cumulative cache reads fit a quadratic at R² ≈ 1.0). For the visualization we
	// idealize: no compaction and a roomy (~1M) context window, so the prefix climbs
	// unbounded every turn and cumulative cache reads stay a clean parabola.
	const NMAX = 12;
	const BASE = 6_000; // starting context (system prompt + skills + first read), tokens
	const OUT = 300; // agent reasoning + tool call emitted per inference pass
	const TEXT_RES = 20; // "saved page.png"
	const IMG_RES = 1500; // a screenshot, in image tokens
	const WORK = 1200; // the turn's real task context — edit diff, command output, files read —
	//                    that accrues every turn and is re-read by every later pass
	const P_CR = 0.3 / 1e6; // $ / cache-read token  (~Sonnet cache hit)
	const P_OUT = 15 / 1e6; // $ / output token

	// per-turn task, so the trace visibly advances (deterministic → prerender-safe)
	const TASKS = [
		{ edit: 'edit Button.tsx', shot: 'button.png' },
		{ edit: 'patch nav.css', shot: 'nav.png' },
		{ edit: 'fix Dialog.tsx', shot: 'dialog.png' },
		{ edit: 'tweak Chart.svelte', shot: 'chart.png' },
		{ edit: 'edit hero.css', shot: 'hero.png' },
		{ edit: 'refactor Card.tsx', shot: 'card.png' },
		{ edit: 'style Footer.css', shot: 'footer.png' },
		{ edit: 'edit Menu.tsx', shot: 'menu.png' },
		{ edit: 'patch theme.css', shot: 'theme.png' },
		{ edit: 'fix Table.tsx', shot: 'table.png' },
		{ edit: 'edit modal.css', shot: 'modal.png' },
		{ edit: 'tweak Badge.tsx', shot: 'badge.png' }
	];

	const dur = (cacheTok: number) => 0.45 + cacheTok / 120_000; // wall-clock, s

	type Ret = { type: 'text' | 'image'; content: string };
	type Call = { fn: string; args: string; cacheTok: number; dur: number; returns: Ret[] };
	type Turn = { turn: number; calls: Call[] };
	type Point = { turn: number; cache: number; passes: number; cost: number };

	function simulate(mode: 'without' | 'with') {
		let ctx = BASE;
		let cumCache = 0;
		let cumOut = 0;
		let passes = 0;
		const series: Point[] = [{ turn: 0, cache: 0, passes: 0, cost: 0 }];
		const trace: Turn[] = [];

		for (let t = 1; t <= NMAX; t++) {
			const calls: Call[] = [];
			const task = TASKS[(t - 1) % TASKS.length];
			ctx += WORK; // this turn's underlying work lands in context either way
			if (mode === 'without') {
				// pass A — issue the shell command, get only text back
				const a = ctx;
				cumCache += a;
				cumOut += OUT;
				passes++;
				ctx += OUT + TEXT_RES;
				calls.push({
					fn: 'bash',
					args: `${task.edit} && screenshot`,
					cacheTok: a,
					dur: dur(a),
					returns: [{ type: 'text', content: `"saved ${task.shot}"` }]
				});
				// pass B — now actually read the file to see it
				const b = ctx;
				cumCache += b;
				cumOut += OUT;
				passes++;
				ctx += OUT + IMG_RES;
				calls.push({
					fn: 'read',
					args: task.shot,
					cacheTok: b,
					dur: dur(b),
					returns: [{ type: 'image', content: 'base64…' }]
				});
			} else {
				// one pass — the bash result already carries the image
				const a = ctx;
				cumCache += a;
				cumOut += OUT;
				passes++;
				ctx += OUT + TEXT_RES + IMG_RES;
				calls.push({
					fn: 'bash',
					args: `${task.edit} && screenshot && __PI_IMAGE__ ${task.shot}`,
					cacheTok: a,
					dur: dur(a),
					returns: [
						{ type: 'text', content: `"saved ${task.shot}"` },
						{ type: 'image', content: 'base64…' }
					]
				});
			}
			series.push({ turn: t, cache: cumCache, passes, cost: cumCache * P_CR + cumOut * P_OUT });
			trace.push({ turn: t, calls });
		}
		return { series, trace };
	}

	const WITHOUT = simulate('without');
	const WITH = simulate('with');

	// ── controls ──
	type Metric = 'cache' | 'passes' | 'cost';
	const METRICS: { key: Metric; label: string }[] = [
		{ key: 'cache', label: 'cache reads' },
		{ key: 'passes', label: 'passes' },
		{ key: 'cost', label: 'cost' }
	];
	let metric = $state<Metric>('cache');
	let logY = $state(false);
	let turns = $state(8); // current conversation length, 1..NMAX
	let playing = $state(false);

	let timer: ReturnType<typeof setInterval> | null = null;
	function togglePlay() {
		if (playing) return stop();
		playing = true;
		if (turns >= NMAX) turns = 1;
		timer = setInterval(() => {
			turns = Math.min(NMAX, turns + 1);
			if (turns >= NMAX) stop();
		}, 750);
	}
	function stop() {
		playing = false;
		if (timer) clearInterval(timer);
		timer = null;
	}
	$effect(() => () => stop());

	// ── value accessor for the active metric ──
	const val = (p: Point): number =>
		metric === 'cache' ? p.cache : metric === 'passes' ? p.passes : p.cost;

	// ── geometry (logical units; SVG scales via viewBox) ──
	const W = 560;
	const H = 380;
	const M = { top: 24, right: 76, bottom: 40, left: 60 };
	const iw = W - M.left - M.right;
	const ih = H - M.top - M.bottom;

	const x = $derived(scaleLinear().domain([0, NMAX]).range([0, iw]));
	const xTicks = Array.from({ length: NMAX }, (_, i) => i + 1);

	const yMax = $derived(val(WITHOUT.series[NMAX]));
	const yMinPos = $derived(Math.max(1, val(WITHOUT.series[1]) * 0.4));
	const y = $derived(
		logY
			? scaleLog()
					.domain([yMinPos, Math.max(yMinPos * 10, yMax)])
					.range([ih, 0])
					.clamp(true)
			: scaleLinear().domain([0, yMax]).nice().range([ih, 0])
	);

	// points up to the current turn (skip the (0,0) origin under log)
	const lo = $derived(logY ? 1 : 0);
	const pts = (s: Point[]) => s.slice(lo, turns + 1).map((p) => ({ x: x(p.turn), y: y(val(p)) }));
	const ptsWithout = $derived(pts(WITHOUT.series));
	const ptsWith = $derived(pts(WITH.series));

	// ── monotone-ish smooth path (Catmull-Rom → cubic bezier) ──
	type Seg = { c1x: number; c1y: number; c2x: number; c2y: number; x: number; y: number };
	function segs(p: { x: number; y: number }[]): Seg[] {
		const out: Seg[] = [];
		for (let i = 0; i < p.length - 1; i++) {
			const p0 = p[i - 1] ?? p[i];
			const p1 = p[i];
			const p2 = p[i + 1];
			const p3 = p[i + 2] ?? p[i + 1];
			out.push({
				c1x: p1.x + (p2.x - p0.x) / 6,
				c1y: p1.y + (p2.y - p0.y) / 6,
				c2x: p2.x - (p3.x - p1.x) / 6,
				c2y: p2.y - (p3.y - p1.y) / 6,
				x: p2.x,
				y: p2.y
			});
		}
		return out;
	}
	const linePath = (p: { x: number; y: number }[]) => {
		if (p.length < 2) return p.length ? `M${p[0].x},${p[0].y}` : '';
		let d = `M${p[0].x},${p[0].y}`;
		for (const s of segs(p)) d += ` C${s.c1x},${s.c1y} ${s.c2x},${s.c2y} ${s.x},${s.y}`;
		return d;
	};
	const pathWithout = $derived(linePath(ptsWithout));
	const pathWith = $derived(linePath(ptsWith));

	// filled "saved" band between the two smooth curves
	const areaPath = $derived.by(() => {
		const top = ptsWithout;
		const bot = ptsWith;
		if (top.length < 2 || bot.length < 2) return '';
		let d = linePath(top);
		const last = bot[bot.length - 1];
		d += ` L${last.x},${last.y}`;
		const bs = segs(bot);
		for (let i = bs.length - 1; i >= 0; i--) {
			const s = bs[i];
			const end = bot[i];
			d += ` C${s.c2x},${s.c2y} ${s.c1x},${s.c1y} ${end.x},${end.y}`;
		}
		return d + ' Z';
	});

	// ── formatting ──
	const fmtTok = (n: number) => {
		if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
		if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`;
		if (n >= 1e3) return `${(n / 1e3).toFixed(0)}k`;
		return `${Math.round(n)}`;
	};
	const fmtUsd = (n: number) => (n >= 1 ? `$${n.toFixed(2)}` : `$${n.toFixed(3)}`);
	const fmtY = $derived((n: number) =>
		metric === 'cost' ? fmtUsd(n) : metric === 'passes' ? `${Math.round(n)}` : fmtTok(n)
	);
	const yTicks = $derived.by(() => {
		if (!logY) return (y as ReturnType<typeof scaleLinear<number, number>>).ticks(5);
		// log: keep only 1 / 2 / 5 × 10^n so the axis stays legible
		return y.ticks(8).filter((t) => {
			const m = t / 10 ** Math.floor(Math.log10(t));
			return [1, 2, 5].some((k) => Math.abs(m - k) < 0.01);
		});
	});
	const yLabel = $derived(
		metric === 'cache'
			? 'cumulative cache-read tokens'
			: metric === 'passes'
				? 'cumulative inference passes'
				: 'cumulative cost (USD)'
	);

	// ── live readout (the green callout, now reactive) ──
	const now = $derived({
		w: WITHOUT.series[turns],
		c: WITH.series[turns]
	});
	const savedPasses = $derived(now.w.passes - now.c.passes);
	const savedCache = $derived(now.w.cache - now.c.cache);
	const costMult = $derived(now.c.cost > 0 ? now.w.cost / now.c.cost : 1);

	// ── on-chart scrubbing ──
	let svgEl = $state<SVGSVGElement | null>(null);
	function scrub(e: PointerEvent) {
		if (!svgEl) return;
		const r = svgEl.getBoundingClientRect();
		const px = ((e.clientX - r.left) / r.width) * W - M.left;
		const t = Math.round(x.invert(px));
		turns = Math.max(1, Math.min(NMAX, t));
	}
	let dragging = $state(false);

	// ── auto-scroll each trace box to its newest turn ──
	let traceElWithout = $state<HTMLDivElement | null>(null);
	let traceElWith = $state<HTMLDivElement | null>(null);
	$effect(() => {
		void turns;
		for (const el of [traceElWithout, traceElWith]) if (el) el.scrollTop = el.scrollHeight;
	});

	const WITHOUT_C = 'oklch(0.65 0.15 14)';
	const WITH_C = 'oklch(0.64 0.12 248)';
	const SAVED_C = 'oklch(0.62 0.10 150)';
	const retColor = (t: 'text' | 'image') => (t === 'image' ? WITH_C : 'currentColor');
</script>

<figure class="cc not-prose my-10">
	<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
		<div class="text-[13px] leading-tight text-neutral-500 dark:text-neutral-400">
			<span class="font-mono font-medium text-neutral-700 dark:text-neutral-200"
				>composability compounds</span
			>
			<span class="mx-1.5 text-neutral-300 dark:text-neutral-600">·</span>
			one round trip vs two, as the conversation grows
		</div>
		<div class="flex items-center gap-2">
			<div
				class="inline-flex rounded-md border border-neutral-200 bg-neutral-50 p-0.5 text-[12px] dark:border-neutral-800 dark:bg-neutral-900"
				role="group"
				aria-label="Metric"
			>
				{#each METRICS as m (m.key)}
					<button
						class="rounded px-2 py-1 font-mono transition-colors {metric === m.key
							? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50'
							: 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100'}"
						aria-pressed={metric === m.key}
						onclick={() => (metric = m.key)}>{m.label}</button
					>
				{/each}
			</div>
			<button
				class="rounded-md border px-2 py-1 font-mono text-[12px] transition-colors {logY
					? 'border-neutral-300 bg-neutral-100 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50'
					: 'border-neutral-200 text-neutral-500 hover:text-neutral-800 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100'}"
				aria-pressed={logY}
				onclick={() => (logY = !logY)}
				title="logarithmic y axis">log y</button
			>
		</div>
	</div>

	<div class="grid gap-4 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)]">
		<!-- ── left: two growing traces, one box each, both auto-scroll to the newest turn ── -->
		{#snippet traceRows(block: { data: typeof WITHOUT; c: string })}
			{#each block.data.trace.slice(0, turns) as turn (turn.turn)}
				<div class="relative pl-3" style="color:{block.c}">
					<span class="absolute top-0 bottom-0 left-0 w-px" style="background:{block.c};opacity:.28"
					></span>
					<div class="py-0.5 text-[9.5px] tracking-wide text-neutral-400 dark:text-neutral-500">
						turn {turn.turn}
					</div>
					{#each turn.calls as call (call.fn + call.args)}
						<div class="flex items-start justify-between gap-2 py-px">
							<div class="min-w-0 break-words text-neutral-700 dark:text-neutral-200">
								<span style="color:{block.c}">{call.fn}</span><span
									class="text-neutral-400 dark:text-neutral-500">(</span
								>{#each call.args.split('__PI_IMAGE__') as part, i (i)}{#if i > 0}<span
											class="font-semibold"
											style="color:{WITH_C}">__PI_IMAGE__</span
										>{/if}{part}{/each}<span class="text-neutral-400 dark:text-neutral-500"
									>)</span
								>
							</div>
							<span
								class="shrink-0 rounded bg-neutral-200/60 px-1 text-[9.5px] text-neutral-500 tabular-nums dark:bg-neutral-800/80 dark:text-neutral-400"
								>↻ {fmtTok(call.cacheTok)} · {call.dur.toFixed(2)}s</span
							>
						</div>
						{#each call.returns as r (r.type)}
							<div class="truncate pl-3 text-neutral-500 dark:text-neutral-400">
								<span class="text-neutral-300 dark:text-neutral-600">▸ </span>&#123; type:
								<span style="color:{retColor(r.type)}">"{r.type}"</span>, content:
								{r.content} &#125;
							</div>
						{/each}
					{/each}
				</div>
			{/each}
		{/snippet}

		{#snippet traceHeader(block: { label: string; data: typeof WITHOUT; c: string })}
			<div
				class="flex items-center gap-1.5 border-b border-neutral-200/70 px-3 py-1.5 dark:border-neutral-800/70"
			>
				<span class="h-2 w-2 rounded-[2px]" style="background:{block.c}"></span>
				<span class="font-mono text-[11px] font-medium text-neutral-600 dark:text-neutral-300"
					>{block.label}</span
				>
				<span
					class="ml-auto font-mono text-[10px] text-neutral-400 tabular-nums dark:text-neutral-500"
					>{block.data.series[turns].passes} passes · {block.data.trace
						.slice(0, turns)
						.reduce((n, t) => n + t.calls.length, 0)} calls</span
				>
			</div>
		{/snippet}

		<div class="relative min-w-0">
			<div class="flex flex-col gap-3 lg:absolute lg:inset-0">
			<div
				class="flex flex-col rounded-lg border border-neutral-200 bg-neutral-50/60 lg:min-h-0 lg:flex-1 dark:border-neutral-800 dark:bg-neutral-900/40"
			>
				{@render traceHeader({ label: 'without __PI_IMAGE__', data: WITHOUT, c: WITHOUT_C })}
				<div
					bind:this={traceElWithout}
					class="h-[170px] overflow-y-auto p-2.5 font-mono text-[11px] leading-relaxed lg:h-auto lg:min-h-0 lg:flex-1"
				>
					{@render traceRows({ data: WITHOUT, c: WITHOUT_C })}
				</div>
			</div>
			<div
				class="flex flex-col rounded-lg border border-neutral-200 bg-neutral-50/60 lg:min-h-0 lg:flex-1 dark:border-neutral-800 dark:bg-neutral-900/40"
			>
				{@render traceHeader({ label: 'with __PI_IMAGE__', data: WITH, c: WITH_C })}
				<div
					bind:this={traceElWith}
					class="h-[170px] overflow-y-auto p-2.5 font-mono text-[11px] leading-relaxed lg:h-auto lg:min-h-0 lg:flex-1"
				>
					{@render traceRows({ data: WITH, c: WITH_C })}
				</div>
			</div>
			</div>
		</div>

		<!-- ── right: diverging curves ── -->
		<div>
			<svg
				bind:this={svgEl}
				viewBox="0 0 {W} {H}"
				class="block w-full touch-none overflow-visible select-none"
				role="img"
				aria-label="Cumulative {yLabel} versus conversation length, with and without __PI_IMAGE__"
				style="cursor: ew-resize"
				onpointerdown={(e) => {
					dragging = true;
					stop();
					(e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
					scrub(e);
				}}
				onpointermove={(e) => dragging && scrub(e)}
				onpointerup={() => (dragging = false)}
			>
				<g transform="translate({M.left},{M.top})">
					<!-- gridlines + y ticks -->
					{#each yTicks as t (t)}
						<line
							x1="0"
							x2={iw}
							y1={y(t)}
							y2={y(t)}
							class="stroke-neutral-200/70 dark:stroke-neutral-800/70"
							stroke-width="1"
							stroke-dasharray={t === 0 ? 'none' : '2 3'}
						/>
						<text
							x="-9"
							y={y(t)}
							text-anchor="end"
							dominant-baseline="middle"
							class="fill-neutral-400 font-mono text-[10px] dark:fill-neutral-500">{fmtY(t)}</text
						>
					{/each}

					<!-- saved band -->
					{#if areaPath}
						<path d={areaPath} fill={SAVED_C} fill-opacity="0.16" stroke="none" />
					{/if}

					<!-- curves -->
					<path
						d={pathWithout}
						fill="none"
						stroke={WITHOUT_C}
						stroke-width="2"
						stroke-linecap="round"
						class="curve"
					/>
					<path
						d={pathWith}
						fill="none"
						stroke={WITH_C}
						stroke-width="2"
						stroke-linecap="round"
						class="curve"
					/>

					<!-- end dots + path labels -->
					{#if ptsWithout.length}
						{@const e = ptsWithout[ptsWithout.length - 1]}
						<circle cx={e.x} cy={e.y} r="3.5" fill={WITHOUT_C} />
						<text
							x={e.x + 7}
							y={e.y}
							dominant-baseline="middle"
							class="font-mono text-[10px]"
							style="fill:{WITHOUT_C}">without</text
						>
					{/if}
					{#if ptsWith.length}
						{@const e = ptsWith[ptsWith.length - 1]}
						<circle cx={e.x} cy={e.y} r="3.5" fill={WITH_C} />
						<text
							x={e.x + 7}
							y={e.y + 1}
							dominant-baseline="middle"
							class="font-mono text-[10px]"
							style="fill:{WITH_C}">with</text
						>
					{/if}

					<!-- saved callout, anchored mid-band at the current turn -->
					{#if turns >= 2 && metric !== 'passes'}
						{@const cx = x(turns)}
						{@const cy = (y(val(now.w)) + y(val(now.c))) / 2}
						<text
							x={Math.min(cx - 6, iw - 4)}
							y={cy}
							text-anchor="end"
							dominant-baseline="middle"
							class="font-mono text-[10px] font-medium"
							style="fill:{SAVED_C}">saved</text
						>
					{/if}

					<!-- x axis -->
					<line
						x1="0"
						x2={iw}
						y1={ih}
						y2={ih}
						class="stroke-neutral-300 dark:stroke-neutral-700"
						stroke-width="1"
					/>
					{#each xTicks as t (t)}
						<text
							x={x(t)}
							y={ih + 16}
							text-anchor="middle"
							class="font-mono text-[10px] {t === turns
								? 'fill-neutral-700 dark:fill-neutral-200'
								: 'fill-neutral-400 dark:fill-neutral-500'}">{t}</text
						>
					{/each}

					<!-- scrub handle -->
					<line
						x1={x(turns)}
						x2={x(turns)}
						y1="0"
						y2={ih}
						class="stroke-neutral-300 dark:stroke-neutral-600"
						stroke-width="1"
						stroke-dasharray="2 3"
					/>
					<circle
						cx={x(turns)}
						cy={ih}
						r="5"
						class="fill-white stroke-neutral-400 dark:fill-neutral-950 dark:stroke-neutral-500"
						stroke-width="1.5"
					/>
				</g>

				<!-- y axis title -->
				<text
					transform="translate(13,{M.top + ih / 2}) rotate(-90)"
					text-anchor="middle"
					class="fill-neutral-400 font-mono text-[10px] dark:fill-neutral-500">{yLabel}</text
				>
				<text
					x={M.left + iw / 2}
					y={H - 6}
					text-anchor="middle"
					class="fill-neutral-400 font-mono text-[10px] dark:fill-neutral-500"
					>conversation length (turns)</text
				>
			</svg>

			<!-- transport + live readout -->
			<div class="mt-2 flex flex-wrap items-center gap-3">
				<button
					class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
					onclick={togglePlay}
					aria-label={playing ? 'Pause' : 'Play'}
				>
					{#if playing}
						<svg width="11" height="11" viewBox="0 0 10 10" fill="currentColor"
							><rect x="1" y="1" width="3" height="8" rx="0.5" /><rect
								x="6"
								y="1"
								width="3"
								height="8"
								rx="0.5"
							/></svg
						>
					{:else}
						<svg width="11" height="11" viewBox="0 0 10 10" fill="currentColor"
							><path d="M2 1.2 L9 5 L2 8.8 Z" /></svg
						>
					{/if}
				</button>
				<input
					type="range"
					min="1"
					max={NMAX}
					step="1"
					bind:value={turns}
					oninput={stop}
					class="cc-range h-1 flex-1 cursor-pointer"
					aria-label="conversation length in turns"
				/>
				<span class="font-mono text-[11px] text-neutral-500 tabular-nums dark:text-neutral-400"
					>turn {turns}/{NMAX}</span
				>
			</div>

			<div
				class="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px]"
				style="color:{SAVED_C}"
			>
				<span><span class="font-medium">saved</span> {savedPasses} inference passes</span>
				<span>{fmtTok(savedCache)} fewer cache-read tokens</span>
				<span>{costMult.toFixed(1)}× the cost, avoided</span>
			</div>
		</div>
	</div>

	<figcaption class="mt-4 text-[12px] leading-snug text-neutral-500 dark:text-neutral-400">
		Each step is one inference pass, and every pass re-reads the entire cached prefix — which keeps
		growing. Folding the screenshot into a single <code>bash</code> result halves the passes per
		turn, so the gap isn't exponential, it's a constant factor compounding over a lengthening
		conversation — quadratic, and wide by turn {NMAX}. Switch to
		<span class="font-mono">passes</span>
		for the straight-line driver beneath it, or <span class="font-mono">log&nbsp;y</span> to watch the
		ratio settle toward 2×. Token sizes are drawn from my own pi sessions (the prefix ramps from a few&nbsp;k
		to tens of&nbsp;k over the first dozen turns); for clarity this assumes no compaction and room to
		grow, so the prefix climbs unbounded and the curve stays a clean parabola.
	</figcaption>
</figure>

<style>
	.curve {
		transition: d 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}
	@media (prefers-reduced-motion: reduce) {
		.curve {
			transition: none;
		}
	}
	.cc-range {
		appearance: none;
		-webkit-appearance: none;
		background: transparent;
	}
	.cc-range::-webkit-slider-runnable-track {
		height: 3px;
		border-radius: 999px;
		background: color-mix(in oklch, currentColor 22%, transparent);
	}
	.cc-range::-moz-range-track {
		height: 3px;
		border-radius: 999px;
		background: color-mix(in oklch, currentColor 22%, transparent);
	}
	.cc-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		margin-top: -4.5px;
		height: 12px;
		width: 12px;
		border-radius: 999px;
		background: oklch(0.64 0.12 248);
		border: 2px solid white;
		box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
	}
	.cc-range::-moz-range-thumb {
		height: 12px;
		width: 12px;
		border: 2px solid white;
		border-radius: 999px;
		background: oklch(0.64 0.12 248);
	}
	:global(.dark) .cc-range::-webkit-slider-thumb,
	.cc-range::-moz-range-thumb {
		border-color: #0a0a0a;
	}
</style>
