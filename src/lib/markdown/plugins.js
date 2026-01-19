// @ts-nocheck
import { visit } from 'unist-util-visit';

/**
 * @typedef {Object} ComponentOverrides
 * @property {string} [img] - Path to custom image component
 * @property {string} [a] - Path to custom link component
 */

/**
 * @typedef {Object} RehypeCustomComponentsOptions
 * @property {ComponentOverrides} components
 */

/**
 * Get the Svelte component name from an import path
 * @param {string} importPath
 * @returns {string}
 */
function getComponentName(importPath) {
	return importPath.split('/').pop()?.replace('.svelte', '') ?? '';
}

/**
 * Rehype plugin to unwrap images from paragraph tags.
 * Markdown wraps images in <p>, but block-level components can't be inside <p>.
 */
export function rehypeUnwrapImages() {
	return (tree) => {
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'p') return;
			if (!parent || typeof index !== 'number') return;

			// Check if paragraph contains only an image
			const validChildren = node.children.filter(
				(child) => !(child.type === 'text' && child.value.trim() === '')
			);

			if (
				validChildren.length === 1 &&
				validChildren[0].type === 'element' &&
				validChildren[0].tagName === 'img'
			) {
				// Replace <p><img></p> with just <img>
				parent.children.splice(index, 1, validChildren[0]);
			}
		});
	};
}

/**
 * Rehype plugin to replace HTML elements with custom Svelte components.
 *
 * For example, if you configure:
 * { img: '$lib/components/markdown/Image.svelte' }
 *
 * Then <img src="..." alt="..."> becomes <Image src="..." alt="..." />
 *
 * @param {RehypeCustomComponentsOptions} options
 */
export function rehypeCustomComponents(options) {
	const { components } = options;
	const elementNames = Object.keys(components);

	// Elements that are self-closing in HTML (void elements)
	const voidElements = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];

	return (tree) => {
		if (elementNames.length === 0) return;

		visit(tree, 'element', (node, index, parent) => {
			if (!elementNames.includes(node.tagName)) return;
			if (!parent || typeof index !== 'number') return;

			const originalTag = node.tagName;
			const componentPath = components[node.tagName];
			const componentName = getComponentName(componentPath);

			// Transform the element to use the custom component
			node.tagName = componentName;

			// Mark void elements as self-closing by ensuring they have no children
			if (voidElements.includes(originalTag)) {
				node.children = [];
				node.properties = node.properties || {};
			}
		});
	};
}

/**
 * Rehype plugin to add copy button to code blocks
 */
export function rehypeCopyCode() {
	return (tree) => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'pre') return;

			// Find the code element inside
			const codeElement = node.children.find(
				(child) => child.type === 'element' && child.tagName === 'code'
			);

			if (!codeElement) return;

			// Add a wrapper class
			if (!node.properties) node.properties = {};
			const existingClass = node.properties.className || [];
			node.properties.className = [...existingClass, 'relative', 'group'];
		});
	};
}
