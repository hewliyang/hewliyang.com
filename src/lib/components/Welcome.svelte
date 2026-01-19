<script lang="ts">
	import gsap from 'gsap';

	const chars = 'アイウエオカキクケコ01サシスセソ▓▒░█∑∆∂λ≈Ωπ※†‡';
	const targetText = 'Welcome';

	let headingEl: HTMLHeadingElement;

	function scrambleText(element: HTMLElement, text: string, duration: number = 1) {
		const length = text.length;
		let progress = { value: 0 };

		gsap.to(progress, {
			value: 1,
			duration,
			ease: 'power2.out',
			onUpdate: () => {
				let result = '';
				for (let i = 0; i < length; i++) {
					const charProgress = progress.value * length;
					if (i < charProgress - 1) {
						result += text[i];
					} else if (i < charProgress + 2) {
						result += chars[Math.floor(Math.random() * chars.length)];
					} else {
						result += chars[Math.floor(Math.random() * chars.length)];
					}
				}
				element.textContent = result;
			},
			onComplete: () => {
				element.textContent = text;
			}
		});
	}

	$effect(() => {
		if (headingEl) {
			scrambleText(headingEl, targetText, 1);
		}
	});
</script>

<h1
	bind:this={headingEl}
	class="text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-mono tracking-wider"
>
	░▓█∆λ∂π
</h1>
