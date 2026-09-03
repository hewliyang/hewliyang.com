<script lang="ts">
	import { scaleBand, scaleLinear } from 'd3-scale';
	import raw from '$lib/data/pi-usage.json';

	type ModelRow = {
		model: string;
		input: number;
		output: number;
		cacheRead: number;
		cacheWrite: number;
		total: number;
		cost: number;
	};
	type MonthRow = { month: string; models: ModelRow[] };

	const data = raw as MonthRow[];

	// ── model identity: stable stack order + a color per model, grouped by family ──
	// Newer versions sit lower/darker within a family so the mix reads top-to-bottom.
	const FAMILIES: { name: string; models: [string, string][] }[] = [
		{
			name: 'Claude Opus',
			models: [
				['Opus 4.5', 'oklch(0.80 0.06 248)'],
				['Opus 4.6', 'oklch(0.72 0.09 248)'],
				['Opus 4.7', 'oklch(0.63 0.12 250)'],
				['Opus 4.8', 'oklch(0.55 0.14 254)']
			]
		},
		{
			name: 'Claude (light)',
			models: [
				['Sonnet 4.0', 'oklch(0.86 0.06 150)'],
				['Sonnet 4.5', 'oklch(0.79 0.09 150)'],
				['Sonnet 4.6', 'oklch(0.71 0.11 155)'],
				['Haiku 4.5', 'oklch(0.84 0.08 128)'],
				['Fable 5', 'oklch(0.66 0.12 162)']
			]
		},
		{
			name: 'OpenAI GPT',
			models: [
				['GPT-5.3 Codex', 'oklch(0.76 0.11 66)'],
				['GPT-5.3 Codex Spark', 'oklch(0.84 0.07 72)'],
				['GPT-5.4', 'oklch(0.71 0.13 56)'],
				['GPT-5.4 mini', 'oklch(0.81 0.08 60)'],
				['GPT-5.5', 'oklch(0.65 0.15 46)']
			]
		},
		{
			name: 'Gemini',
			models: [
				['Gemini 3 Flash', 'oklch(0.75 0.10 300)'],
				['Gemini 3 Pro', 'oklch(0.64 0.13 296)']
			]
		},
		{
			name: 'Other',
			models: [['Bhumi 1', 'oklch(0.71 0.12 8)']]
		}
	];

	const ORDER = FAMILIES.flatMap((f) => f.models.map(([m]) => m));
	const COLOR = new Map(FAMILIES.flatMap((f) => f.models.map(([m, c]) => [m, c] as const)));
	const rank = (m: string) => {
		const i = ORDER.indexOf(m);
		return i === -1 ? 999 : i;
	};

	// only legend the models that actually appear
	const present = new Set(data.flatMap((d) => d.models.map((m) => m.model)));
	const legend = FAMILIES.map((f) => ({
		name: f.name,
		models: f.models.filter(([m]) => present.has(m)).map(([m, c]) => ({ model: m, color: c }))
	})).filter((f) => f.models.length > 0);

	// ── metric selector ──
	type Metric = 'total' | 'cacheRead' | 'output' | 'cost';
	const METRICS: { key: Metric; label: string }[] = [
		{ key: 'total', label: 'All tokens' },
		{ key: 'cacheRead', label: 'Cache reads' },
		{ key: 'output', label: 'Output' },
		{ key: 'cost', label: 'Cost' }
	];
	let metric = $state<Metric>('total');

	// ── geometry (logical units; SVG scales to container via viewBox) ──
	const W = 680;
	const H = 380;
	const M = { top: 18, right: 58, bottom: 34, left: 56 };
	const iw = W - M.left - M.right;
	const ih = H - M.top - M.bottom;

	const monthLabel = (m: string) => {
		const [y, mo] = m.split('-');
		const names = [
			'',
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		return `${names[+mo]} ’${y.slice(2)}`;
	};

	const x = $derived(
		scaleBand<string>()
			.domain(data.map((d) => d.month))
			.range([0, iw])
			.paddingInner(0.34)
			.paddingOuter(0.18)
	);

	// stacked segments for the active metric
	const stacks = $derived(
		data.map((d) => {
			const rows = [...d.models]
				.filter((m) => m[metric] > 0)
				.sort((a, b) => rank(a.model) - rank(b.model));
			let acc = 0;
			const segs = rows.map((r) => {
				const v = r[metric];
				const s = { model: r.model, value: v, y0: acc, y1: acc + v, row: r };
				acc += v;
				return s;
			});
			return { month: d.month, total: acc, segs };
		})
	);

	const yMax = $derived(Math.max(1, ...stacks.map((s) => s.total)));
	const y = $derived(scaleLinear().domain([0, yMax]).nice().range([ih, 0]));

	// secondary axis: total monthly cost as a line overlay (hidden when metric === cost)
	const costByMonth = $derived(
		data.map((d) => ({ month: d.month, cost: d.models.reduce((a, m) => a + m.cost, 0) }))
	);
	const costMax = $derived(Math.max(1, ...costByMonth.map((c) => c.cost)));
	// 12% headroom so the peak marker never collides with the top gridline
	const yCost = $derived(
		scaleLinear()
			.domain([0, costMax * 1.12])
			.nice()
			.range([ih, 0])
	);
	const showCostLine = $derived(metric !== 'cost');
	const costPath = $derived(
		costByMonth
			.map((c, i) => {
				const cx = (x(c.month) ?? 0) + x.bandwidth() / 2;
				const cy = yCost(c.cost);
				return `${i ? 'L' : 'M'}${cx.toFixed(1)},${cy.toFixed(1)}`;
			})
			.join(' ')
	);

	// ── formatting ──
	const fmtTok = (n: number) => {
		if (n >= 1e9) return `${(n / 1e9).toFixed(n >= 1e10 ? 0 : 1)}B`;
		if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
		if (n >= 1e3) return `${(n / 1e3).toFixed(0)}k`;
		return `${n}`;
	};
	const fmtTokFull = (n: number) => n.toLocaleString('en-US');
	const fmtUsd = (n: number) =>
		n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : n >= 1 ? `$${n.toFixed(0)}` : `$${n.toFixed(2)}`;
	const fmtY = $derived((n: number) => (metric === 'cost' ? fmtUsd(n) : fmtTok(n)));
	const yTicks = $derived(y.ticks(5));
	const costTicks = $derived(yCost.ticks(5));

	const unitLabel = $derived(
		metric === 'cost'
			? 'cost (USD)'
			: metric === 'cacheRead'
				? 'cache-read tokens'
				: metric === 'output'
					? 'output tokens'
					: 'tokens (in + out + cache)'
	);

	// ── interaction ──
	let hovered = $state<string | null>(null); // highlighted model (legend hover)
	let wrap = $state<HTMLDivElement | null>(null);
	let tip = $state<{
		left: number;
		top: number;
		model: string;
		month: string;
		row: ModelRow;
	} | null>(null);

	function showTip(e: PointerEvent, month: string, model: string, row: ModelRow) {
		hovered = model;
		if (!wrap) return;
		const r = wrap.getBoundingClientRect();
		tip = { left: e.clientX - r.left, top: e.clientY - r.top, model, month, row };
	}
	function clearTip() {
		tip = null;
		hovered = null;
	}

	const dim = (m: string) => hovered !== null && hovered !== m;
</script>

<figure class="usage not-prose my-10">
	<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
		<div class="text-[13px] leading-tight text-neutral-500 dark:text-neutral-400">
			<span class="font-medium text-neutral-700 dark:text-neutral-200">pi token usage</span>
			<span class="mx-1.5 text-neutral-300 dark:text-neutral-600">·</span>
			by model, monthly
		</div>
		<div
			class="inline-flex rounded-md border border-neutral-200 bg-neutral-50 p-0.5 text-[12px] dark:border-neutral-800 dark:bg-neutral-900"
			role="group"
			aria-label="Metric"
		>
			{#each METRICS as m (m.key)}
				<button
					class="rounded px-2.5 py-1 font-mono transition-colors {metric === m.key
						? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-50'
						: 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100'}"
					aria-pressed={metric === m.key}
					onclick={() => (metric = m.key)}
				>
					{m.label}
				</button>
			{/each}
		</div>
	</div>

	<div bind:this={wrap} class="relative">
		<svg
			viewBox="0 0 {W} {H}"
			class="block w-full overflow-visible"
			role="img"
			aria-label="Stacked bar chart of pi token usage per model per month, with a monthly cost overlay"
		>
			<g transform="translate({M.left},{M.top})">
				<!-- horizontal gridlines + left axis ticks -->
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
						class="fill-neutral-400 font-mono text-[10px] dark:fill-neutral-500"
					>
						{fmtY(t)}
					</text>
				{/each}

				<!-- right cost axis -->
				{#if showCostLine}
					{#each costTicks as t (t)}
						<text
							x={iw + 10}
							y={yCost(t)}
							text-anchor="start"
							dominant-baseline="middle"
							class="font-mono text-[10px]"
							style="fill: oklch(0.62 0.13 12)"
						>
							{fmtUsd(t)}
						</text>
					{/each}
				{/if}

				<!-- stacked bars -->
				{#each stacks as col (col.month)}
					{@const bx = x(col.month) ?? 0}
					{#each col.segs as s (s.model)}
						<rect
							x={bx}
							y={y(s.y1)}
							width={x.bandwidth()}
							height={Math.max(0, y(s.y0) - y(s.y1))}
							fill={COLOR.get(s.model) ?? 'gray'}
							class="seg"
							style="opacity: {dim(s.model) ? 0.22 : 1}"
							role="presentation"
							onpointermove={(e) => showTip(e, col.month, s.model, s.row)}
							onpointerleave={clearTip}
						/>
					{/each}
				{/each}

				<!-- cost overlay -->
				{#if showCostLine}
					<path
						d={costPath}
						fill="none"
						style="stroke: oklch(0.62 0.16 12)"
						stroke-width="1.75"
						stroke-linejoin="round"
						class="costline"
					/>
					{#each costByMonth as c (c.month)}
						<circle
							cx={(x(c.month) ?? 0) + x.bandwidth() / 2}
							cy={yCost(c.cost)}
							r="3"
							style="fill: oklch(0.62 0.16 12)"
							class="stroke-white dark:stroke-neutral-950"
							stroke-width="1.5"
						/>
					{/each}
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
				{#each data as d (d.month)}
					<text
						x={(x(d.month) ?? 0) + x.bandwidth() / 2}
						y={ih + 16}
						text-anchor="middle"
						class="fill-neutral-500 font-mono text-[10px] dark:fill-neutral-400"
					>
						{monthLabel(d.month)}
					</text>
				{/each}
			</g>

			<!-- axis titles -->
			<text
				transform="translate(13,{M.top + ih / 2}) rotate(-90)"
				text-anchor="middle"
				class="fill-neutral-400 font-mono text-[10px] dark:fill-neutral-500"
			>
				{unitLabel}
			</text>
			{#if showCostLine}
				<text
					transform="translate({W - 11},{M.top + ih / 2}) rotate(-90)"
					text-anchor="middle"
					class="font-mono text-[10px]"
					style="fill: oklch(0.62 0.13 12)"
				>
					monthly cost (USD)
				</text>
			{/if}
		</svg>

		{#if tip}
			<div
				class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-md border border-neutral-200 bg-white/95 px-2.5 py-2 text-[11px] shadow-lg backdrop-blur-sm dark:border-neutral-700 dark:bg-neutral-900/95"
				style="left: {tip.left}px; top: {tip.top}px"
			>
				<div
					class="mb-1 flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-100"
				>
					<span
						class="inline-block h-2 w-2 rounded-[2px]"
						style="background: {COLOR.get(tip.model)}"
					></span>
					{tip.model}
					<span class="font-mono text-[10px] font-normal text-neutral-400"
						>{monthLabel(tip.month)}</span
					>
				</div>
				<dl
					class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 font-mono whitespace-nowrap text-neutral-500 dark:text-neutral-400"
				>
					<dt>tokens</dt>
					<dd class="text-right text-neutral-700 tabular-nums dark:text-neutral-200">
						{fmtTokFull(tip.row.total)}
					</dd>
					<dt>cache read</dt>
					<dd class="text-right tabular-nums">{fmtTokFull(tip.row.cacheRead)}</dd>
					<dt>output</dt>
					<dd class="text-right tabular-nums">{fmtTokFull(tip.row.output)}</dd>
					<dt>cost</dt>
					<dd class="text-right text-neutral-700 tabular-nums dark:text-neutral-200">
						${tip.row.cost.toFixed(2)}
					</dd>
				</dl>
			</div>
		{/if}
	</div>

	<!-- legend: grouped by family, hover to isolate -->
	<div class="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px]">
		{#each legend as fam (fam.name)}
			<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
				{#each fam.models as m (m.model)}
					<button
						class="flex items-center gap-1.5 font-mono text-neutral-500 transition-opacity hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
						style="opacity: {dim(m.model) ? 0.35 : 1}"
						onpointerenter={() => (hovered = m.model)}
						onpointerleave={() => (hovered = null)}
					>
						<span class="inline-block h-2.5 w-2.5 rounded-[2px]" style="background: {m.color}"
						></span>
						{m.model}
					</button>
				{/each}
			</div>
		{/each}
	</div>

	<figcaption class="mt-4 text-[12px] leading-snug text-neutral-500 dark:text-neutral-400">
		Eight months of pi usage, broken down by model. The mix turns over constantly: Sonnet and Haiku
		give way to Opus, then GPT-5 Codex and Gemini join, then GPT-5.5 and the 4.7/4.8 Opus line.
		Cache reads dwarf everything else, every avoided round trip is a full prefix you don’t re-read.
	</figcaption>
</figure>

<style>
	.seg {
		transition:
			y 0.45s cubic-bezier(0.22, 1, 0.36, 1),
			height 0.45s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.18s ease;
		cursor: crosshair;
	}
	.costline,
	.usage circle {
		transition:
			d 0.45s cubic-bezier(0.22, 1, 0.36, 1),
			cy 0.45s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.2s ease;
	}
	@media (prefers-reduced-motion: reduce) {
		.seg,
		.costline,
		.usage circle {
			transition: opacity 0.18s ease;
		}
	}
</style>
