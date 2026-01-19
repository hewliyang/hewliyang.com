<script lang="ts">
	import { onMount } from 'svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	interface Heading {
		id: string;
		text: string;
		level: number;
	}

	let { articleEl = $bindable<HTMLElement | null>(null) } = $props();

	let headings = $state<Heading[]>([]);
	let activeId = $state<string>('');
	let progress = $state(0);

	onMount(() => {
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

	function scrollToHeading(id: string) {
		const el = document.getElementById(id);
		if (el) {
			const top = el.getBoundingClientRect().top + window.scrollY - 80;
			window.scrollTo({ top, behavior: 'smooth' });
		}
	}
</script>

<aside class="sticky top-24 hidden h-fit max-h-[calc(100vh-8rem)] w-64 shrink-0 lg:block">
	<div class="space-y-4">
		<!-- Theme toggle -->
		<div>
			<ThemeToggle />
		</div>

		<!-- Progress indicator -->
		<div class="space-y-2">
			<div class="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
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
</aside>
