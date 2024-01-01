import { dev } from '$app/environment';
import type { Work, Education, Project } from '$lib/types';

export const title = 'hewliyang';
export const description = "Li Yang's blog";
export const url = dev ? 'http://localhost:5173/' : 'https://hewliyang.com/';
export const skills = [
	'Python',
	'JavaScript',
	'TypeScript',
	'Svelte/SvelteKit',
	'Java',
	'R',
	'Kubernetes',
	'Helm',
	'SQL',
	'Streamlit',
	'Torch/JAX',
	'Transformers',
	'FastAPI',
	'Git',
	'Docker',
	'LaTeX',
	'GitHub Actions'
];

export const educations = [
	{
		degree: 'BSc (Hons.) Data Science & Analytics with a minor in Computer Science',
		university: 'National University of Singapore',
		from: '2020',
		to: '2024'
	}
] satisfies Education[];

export const works = [
	{
		company: 'GIC',
		description: 'Building LLM apps & research on latest developments in NLP',
		isInternship: true,
		position: 'Machine Learning Engineer Intern',
		from: 'June 2023',
		to: 'Dec 2023'
	},
	{
		company: 'Infineon',
		description: 'Data cleaning , OCR & training BERT-style models for text classification',
		isInternship: true,
		position: 'Data Science Intern',
		from: 'May 2023',
		to: 'June 2023'
	},
	{
		company: 'National University of Singapore',
		position: 'Teaching Assistant',
		description:
			'Prepare model answers to tutorials in LaTeX for ST1131 (Introduction to Statistical Computing)',
		isInternship: false,
		from: 'Aug 2022',
		to: 'May 2023'
	}
] satisfies Work[];

export const projects = [
	{
		title: 'dsa3101-2210-14-lta',
		description: 'Object detection for traffic observability on Singaporean highways',
		href: 'https://github.com/hewliyang/dsa3101-2210-14-lta',
		tags: ['Python', 'Torch', 'MMDet', 'FastAPI', 'NoSQL', 'Plotly']
	},
	{
		title: 'nus-sentiment',
		description:
			"Semantic search & sentiment analysis for r/NUS posts. Won the NUS Hackers Coreteam's Best Roll at NUS Hack&Roll 2023. ",
		href: 'https://github.com/selangor-no-1/nus-sentiment',
		tags: ['Python', 'Transformers', 'Torch', 'Pinecone', 'Streamlit']
	},
	{
		title: 'nus-nextbus-web',
		description: 'NUS Internal Shuttle Bus web client for visualizing arrival times & routes.',
		href: 'https://github.com/hewliyang/nus-nextbus-web',
		tags: ['Svelte', 'SvelteKit', 'Typescript', 'TailwindCSS', 'GitHub Actions']
	},
	{
		title: 'pru-viz',
		description:
			'Interactive data visualisations for Malaysian election data. Includes choropleths, log transforms, geomorphing to adjust for population, etc.',
		href: 'https://github.com/hewliyang/pru-viz',
		tags: ['Python', 'Streamlit', 'Apache ECharts']
	},
	{
		title: 'hewliyang.com',
		description: 'This blog!',
		href: 'https://github.com/hewliyang/hewliyang.com',
		tags: [
			'Svelte',
			'SvelteKit',
			'Typescript',
			'TailwindCSS',
			'shadcn-ui',
			'KaTeX',
			'rehype',
			'remark'
		]
	}
] satisfies Project[];
