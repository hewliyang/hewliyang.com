<script lang="ts">
	import { onMount } from 'svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	interface Heading {
		id: string;
		text: string;
		level: number;
	}

	let { articleEl = $bindable<HTMLElement | null>(null), collapsed = $bindable(false) } = $props();

	let headings = $state<Heading[]>([]);
	let activeId = $state<string>('');
	let progress = $state(0);
	let isMac = $state(false);
	let shortcutLabel = $derived(isMac ? '⌘B' : 'Ctrl+B');

	const kbdClass =
		'inline-flex h-5 min-w-5 items-center justify-center rounded border border-neutral-200 bg-neutral-50 px-1 font-mono text-[10px] leading-none text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400';

	onMount(() => {
		isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
		collapsed = localStorage.getItem('toc-collapsed') === 'true';

		if (!articleEl) return;

		// Parse headings from DOM
		const elements = articleEl.querySelectorAll('h2, h3');
		headings = (Array.from(elements) as Element[]).map((el, i) => {
			// Ensure each heading has an id
			if (!el.id) {
				el.id = `heading-${i}`;
			}
			return {
				id: el.id,
				text: el.textContent || '',
				level: parseInt(el.tagName[1])
			};
		});

		// Setup scroll tracking
		const handleScroll = () => {
			// Calculate progress
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			progress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 100;

			const threshold = 120;
			let currentId = '';

			// Find the last heading that has scrolled past the threshold
			for (const heading of headings) {
				const el = document.getElementById(heading.id);
				if (el) {
					const rect = el.getBoundingClientRect();
					if (rect.top <= threshold) {
						currentId = heading.id;
					}
				}
			}

			// If at the very bottom, check if there's a heading we haven't reached
			// but is visible on screen (page too short to scroll to it)
			const atBottom =
				window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
			if (atBottom && headings.length > 0) {
				// Find the last heading that's visible in the viewport
				for (let i = headings.length - 1; i >= 0; i--) {
					const el = document.getElementById(headings[i].id);
					if (el) {
						const rect = el.getBoundingClientRect();
						if (rect.top >= 0 && rect.top < window.innerHeight) {
							currentId = headings[i].id;
							break;
						}
					}
				}
			}

			activeId = currentId;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	function toggleCollapsed() {
		collapsed = !collapsed;
		localStorage.setItem('toc-collapsed', String(collapsed));
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'b' || (!event.metaKey && !event.ctrlKey) || event.altKey || event.shiftKey) {
			return;
		}

		const target = event.target;
		if (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target instanceof HTMLSelectElement ||
			(target instanceof HTMLElement && target.isContentEditable)
		) {
			return;
		}

		event.preventDefault();
		toggleCollapsed();
	}

	function scrollToHeading(id: string) {
		const el = document.getElementById(id);
		if (el) {
			const top = el.getBoundingClientRect().top + window.scrollY - 80;
			window.scrollTo({ top, behavior: 'smooth' });
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<aside
	class="sticky top-24 hidden h-fit max-h-[calc(100vh-8rem)] shrink-0 transition-all duration-200 lg:block {collapsed
		? 'w-10'
		: 'w-64'}"
>
	{#if collapsed}
		<div class="flex flex-col items-center gap-3">
			<button
				onclick={toggleCollapsed}
				title="Expand sidebar ({shortcutLabel})"
				aria-label="Expand sidebar"
				aria-keyshortcuts="Control+B Meta+B"
				class="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M15 18l-6-6 6-6" />
				</svg>
			</button>
			<ThemeToggle />
		</div>
	{:else}
		<div class="space-y-4">
			<!-- Theme toggle -->
			<div class="flex items-center justify-between">
				<ThemeToggle />
				<div class="flex items-center gap-1.5">
					{#if isMac}
						<div class="flex items-center gap-0.5" aria-hidden="true">
							<kbd class="{kbdClass} font-sans text-xs">⌘</kbd>
							<kbd class={kbdClass}>B</kbd>
						</div>
					{:else}
						<kbd class={kbdClass} aria-hidden="true">Ctrl+B</kbd>
					{/if}
					<button
						onclick={toggleCollapsed}
						title="Collapse sidebar ({shortcutLabel})"
						aria-label="Collapse sidebar"
						aria-keyshortcuts="Control+B Meta+B"
						class="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M9 18l6-6-6-6" />
						</svg>
					</button>
				</div>
			</div>

			<!-- Progress indicator -->
			<div class="space-y-2">
				<div
					class="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400"
				>
					<span>Progress</span>
					<span class="font-mono">{Math.round(progress)}%</span>
				</div>
				<div class="h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
					<div
						class="h-full bg-neutral-900 transition-all duration-150 dark:bg-neutral-100"
						style="width: {progress}%"
					></div>
				</div>
			</div>

			<!-- Table of Contents -->
			{#if headings.length > 0}
				<nav class="space-y-1">
					<p
						class="text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
					>
						On this page
					</p>
					<ul class="space-y-1 border-l border-neutral-200 dark:border-neutral-800">
						{#each headings as heading}
							<li>
								<button
									onclick={() => scrollToHeading(heading.id)}
									class="block w-full py-1 text-left text-sm transition-colors {heading.level === 3
										? 'pl-6'
										: 'pl-3'} {activeId === heading.id
										? '-ml-px border-l-2 border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100'
										: 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'}"
								>
									{heading.text}
								</button>
							</li>
						{/each}
					</ul>
				</nav>
			{/if}
		</div>
	{/if}
</aside>
