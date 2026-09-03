import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';
import { transformerMetaHighlight } from '@shikijs/transformers';
import { rehypeCustomComponents, rehypeUnwrapImages } from './plugins.js';
import { remarkTypst } from './typst.js';

/**
 * @typedef {Object} ComponentOverrides
 * @property {string} [img] - Path to custom image component
 */

/**
 * @typedef {Object} MarkdownOptions
 * @property {ComponentOverrides} [components] - Element to component mappings
 * @property {string} [theme] - Shiki theme for code highlighting
 * @property {string} [componentDir] - Directory for auto-imported components
 */

/** @type {MarkdownOptions} */
const defaultOptions = {
	components: {
		img: '$lib/components/markdown/Image.svelte'
	},
	theme: 'github-dark-default',
	componentDir: '$lib/components/markdown'
};

/**
 * Creates the unified markdown processor
 * @param {MarkdownOptions} options
 */
function createProcessor(options) {
	const opts = { ...defaultOptions, ...options };

	return unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(remarkTypst)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeSlug)
		.use(rehypeUnwrapImages)
		.use(rehypeShiki, {
			themes: {
				light: 'github-light-default',
				dark: 'github-dark-default'
			},
			defaultColor: false,
			transformers: [
				{
					pre(node) {
						if (node.properties?.tabindex) {
							delete node.properties.tabindex;
						}
					}
				},
				transformerMetaHighlight()
			]
		})
		.use(rehypeCustomComponents, { components: opts.components ?? {} })
		.use(rehypeStringify, { allowDangerousHtml: true });
}

/**
 * Escape Svelte special chars in text content only (not in tags)
 * @param {string} content
 * @returns {string}
 */
function escapeSvelteChars(content) {
	// Split by HTML tags to only escape content outside tags
	const parts = content.split(/(<[^>]+>)/g);

	return parts
		.map((part, i) => {
			// Even indices are text content, odd indices are tags
			if (i % 2 === 0) {
				// Text content - escape { and }
				return part.replace(/{/g, '&#123;').replace(/}/g, '&#125;');
			}
			// HTML/Component tag - leave as is
			return part;
		})
		.join('');
}

/**
 * Make void element components self-closing
 * @param {string} content
 * @returns {string}
 */
function makeSelfClosing(content) {
	// Convert <Image ...></Image> to <Image ... />
	content = content.replace(/<(Image)\s+([^>]*?)><\/\1>/gi, '<$1 $2 />');
	// Convert standalone <Image ...> (without closing tag) - add self-closing
	content = content.replace(/<(Image)\s+([^/][^>]*?)>(?![\s\S]*?<\/\1>)/gi, '<$1 $2 />');
	return content;
}

/**
 * Extract frontmatter
 * @param {string} content
 */
function extractFrontmatter(content) {
	const { content: markdown, data } = matter(content);
	return { markdown, metadata: data };
}

/**
 * Detect custom Svelte components used in content
 * @param {string} content
 * @returns {string[]}
 */
function detectComponents(content) {
	// Match PascalCase component tags like <Counter />, <MyComponent>, etc.
	// Exclude built-in HTML elements and our transformed components (Image)
	const componentRegex = /<([A-Z][a-zA-Z0-9]*)/g;
	const builtIn = ['Image']; // These are handled separately
	const found = new Set();

	let match;
	while ((match = componentRegex.exec(content)) !== null) {
		const name = match[1];
		if (!builtIn.includes(name)) {
			found.add(name);
		}
	}

	return Array.from(found);
}

/**
 * Generate import statements
 * @param {ComponentOverrides} elementComponents - Element overrides
 * @param {string[]} customComponents - Auto-detected components
 * @param {string} componentDir - Component directory
 * @returns {string[]}
 */
function generateImports(elementComponents, customComponents, componentDir) {
	const imports = [];

	// Element override imports (img -> Image, etc.)
	for (const [, componentPath] of Object.entries(elementComponents)) {
		const name = componentPath.split('/').pop()?.replace('.svelte', '') ?? '';
		imports.push(`import ${name} from '${componentPath}';`);
	}

	// Auto-detected custom components
	for (const name of customComponents) {
		imports.push(`import ${name} from '${componentDir}/${name}.svelte';`);
	}

	return imports;
}

/**
 * Svelte preprocessor for Markdown files
 * @param {MarkdownOptions} [options]
 */
export function markdown(options = {}) {
	const opts = { ...defaultOptions, ...options };

	return {
		name: 'markdown',

		/**
		 * @param {Object} params
		 * @param {string} params.content
		 * @param {string} params.filename
		 */
		async markup({ content, filename }) {
			if (!filename.endsWith('.md')) return;

			// Extract frontmatter
			const { markdown: rawMarkdown, metadata } = extractFrontmatter(content);

			// Detect custom components BEFORE processing
			const customComponents = detectComponents(rawMarkdown);

			// Process markdown to HTML
			const processor = createProcessor(opts);
			const result = await processor.process(rawMarkdown);
			let html = String(result);

			// Make component tags self-closing
			html = makeSelfClosing(html);

			// Escape Svelte chars in text content
			html = escapeSvelteChars(html);

			// Generate imports
			const imports = generateImports(
				opts.components ?? {},
				customComponents,
				opts.componentDir ?? '$lib/components/markdown'
			);

			// Build module script
			const moduleScript = `<script module>
	export const metadata = ${JSON.stringify(metadata)};
</script>`;

			// Build instance script with imports
			const instanceScript =
				imports.length > 0
					? `<script>
	${imports.join('\n\t')}
</script>`
					: '';

			const code = [moduleScript, instanceScript, html].filter(Boolean).join('\n\n');

			return { code };
		}
	};
}

export default markdown;
