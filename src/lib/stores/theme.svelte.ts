import { browser } from '$app/environment';

class ThemeStore {
	current = $state<'light' | 'dark'>('light');

	init = () => {
		if (!browser) return;
		// Read from DOM since blocking script in app.html already applied it
		this.current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
	};

	toggle = () => {
		this.current = this.current === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', this.current);
		this.#apply();
	};

	#apply() {
		document.documentElement.classList.toggle('dark', this.current === 'dark');
	}
}

export const themeStore = new ThemeStore();
