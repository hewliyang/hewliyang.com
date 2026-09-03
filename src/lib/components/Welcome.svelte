<a href="/" class="group inline-block" aria-label="Home">
	<div class="name-wrap">
		<h1 class="flex items-start gap-3 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
			<ruby class="name-part">
				<span
					class="text-neutral-400 transition-colors group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
					>Hew</span
				>
				<rt>family</rt>
			</ruby>
			<ruby class="name-part">
				Li Yang
				<rt>given</rt>
			</ruby>
		</h1>
		<span class="phonetic">/hjuː liː jʌŋ/ &middot; &ldquo;hugh lee young&rdquo;</span>
	</div>
</a>

<style>
	.name-wrap {
		position: relative;
	}

	.name-part {
		ruby-position: under;
	}

	.name-part rt {
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.625rem;
		font-weight: 400;
		letter-spacing: 0.05em;
		color: var(--color-neutral-400);
		transition: color 0.15s ease;
	}

	:global(html.dark) .name-part rt {
		color: var(--color-neutral-500);
	}

	a:hover .name-part rt {
		color: var(--color-neutral-600);
	}

	:global(html.dark) a:hover .name-part rt {
		color: var(--color-neutral-400);
	}

	.phonetic {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 0.25rem;
		font-family: 'IBM Plex Mono', monospace;
		font-size: 0.6875rem;
		font-weight: 400;
		letter-spacing: 0.05em;
		white-space: nowrap;
		color: var(--color-neutral-400);
		opacity: 0;
		transform: translateY(-2px);
		transition:
			opacity 0.15s ease,
			transform 0.15s ease;
	}

	:global(html.dark) .phonetic {
		color: var(--color-neutral-500);
	}

	a:hover .phonetic {
		opacity: 1;
		transform: translateY(0);
	}
</style>
