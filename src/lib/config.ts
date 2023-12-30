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
	'matplotlib',
	'Torch/JAX',
	'Transformers',
	'FastAPI',
	'Git'
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
	}
] satisfies Work[];

export const projects = [
	{
		title: 'dsa3101-2210-14-lta',
		description: 'Object detection for traffic observability on Singaporean highways',
		href: 'https://github.com/hewliyang/dsa3101-2210-14-lta',
		tags: ['Python', 'Torch', 'MMDet', 'FastAPI', 'NoSQL']
	}
] satisfies Project[];
