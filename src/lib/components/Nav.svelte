<script lang="ts">
	import { page } from '$app/stores';
	import { Home, NotebookPen } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const links = [
		{ href: '/', label: 'Home', icon: Home },
		{ href: '/notes', label: 'Notes', icon: NotebookPen }
	];

	function isActive(href: string): boolean {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}

	// Check if we're on a specific note page (has a slug)
	// In that case, the ToC takes over the desktop aside
	let isNotePage = $derived($page.url.pathname.match(/^\/notes\/[^/]+$/));
</script>

{#snippet desktopLink(href: string, label: string)}
	<li>
		<a
			{href}
			class="flex items-center gap-2 py-1.5 pl-3 text-sm transition-colors {isActive(href)
				? '-ml-px border-l-2 border-neutral-900 text-neutral-900 dark:border-neutral-100 dark:text-neutral-100'
				: 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'}"
		>
			{label}
		</a>
	</li>
{/snippet}

{#snippet mobileLink(href: string, label: string, Icon: typeof Home)}
	<li>
		<a
			{href}
			class="flex flex-col items-center gap-1 text-xs transition-colors {isActive(href)
				? 'text-neutral-900 dark:text-neutral-100'
				: 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'}"
		>
			<Icon size={20} />
			<span>{label}</span>
		</a>
	</li>
{/snippet}

<!-- Desktop aside - hidden on note pages where ToC is shown -->
{#if !isNotePage}
	<aside class="sticky top-24 hidden h-fit w-48 shrink-0 lg:block">
		<nav class="space-y-4">
			<div>
				<ThemeToggle />
			</div>
			<div class="space-y-1">
				<p
					class="text-xs font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400"
				>
					Navigation
				</p>
				<ul class="space-y-1 border-l border-neutral-200 dark:border-neutral-800">
					{#each links as link}
						{@render desktopLink(link.href, link.label)}
					{/each}
				</ul>
			</div>
		</nav>
	</aside>
{/if}

<!-- Mobile bottom nav - always visible -->
<nav
	class="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/80 backdrop-blur-sm lg:hidden dark:border-neutral-800 dark:bg-neutral-950/80"
>
	<ul class="flex items-center justify-center gap-8 px-4 py-3">
		{#each links as link}
			{@render mobileLink(link.href, link.label, link.icon)}
		{/each}
		<li>
			<div class="flex flex-col items-center gap-1 text-xs">
				<ThemeToggle />
				<span class="text-neutral-500 dark:text-neutral-400">Theme</span>
			</div>
		</li>
	</ul>
</nav>
