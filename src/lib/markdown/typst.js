// @ts-nocheck
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { visit } from 'unist-util-visit';

/**
 * Preamble prepended to every figure unless the source sets its own page.
 * - auto-sized, transparent page so the SVG hugs the drawing
 * - no margin surprises
 */
const PREAMBLE = `#set page(width: auto, height: auto, margin: 8pt, fill: none)\n`;

/** In-memory cache so dev HMR doesn't recompile unchanged figures */
const cache = new Map();

/**
 * Compile Typst source to a themeable inline SVG.
 * @param {string} source
 * @returns {string}
 */
function compileTypst(source) {
	const key = createHash('sha256').update(source).digest('hex');
	if (cache.has(key)) return cache.get(key);

	const input = source.includes('#set page') ? source : PREAMBLE + source;

	let svg;
	try {
		svg = execFileSync('typst', ['compile', '--format', 'svg', '-', '-'], {
			input,
			encoding: 'utf-8',
			maxBuffer: 16 * 1024 * 1024
		});
	} catch (err) {
		throw new Error(`Typst compilation failed:\n${err.stderr ?? err.message}`);
	}

	svg = svg
		// inherit text color from the page (works with dark mode)
		.replaceAll('#000000', 'currentColor')
		// scale down on small screens; CSS handles sizing via the figure wrapper
		.replace(/<svg /, '<svg role="img" ');

	cache.set(key, svg);
	return svg;
}

/**
 * Remark plugin: replaces ```typst fenced code blocks with the compiled
 * SVG, wrapped in a <figure>. Runs at build time — no client JS shipped.
 *
 * Use ```typ if you want to *show* Typst source instead of rendering it.
 */
export function remarkTypst() {
	return (tree) => {
		visit(tree, 'code', (node, index, parent) => {
			if (node.lang !== 'typst') return;
			if (!parent || typeof index !== 'number') return;

			const svg = compileTypst(node.value);
			parent.children[index] = {
				type: 'html',
				value: `<figure class="typst-figure">${svg}</figure>`
			};
		});
	};
}

export default remarkTypst;
