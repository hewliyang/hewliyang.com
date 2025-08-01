import { dev } from '$app/environment';
import type { Work, Education, Project } from '$lib/types';

export const title = 'Hew Li Yang';
export const description = "hewliyang's website";
export const url = dev ? 'http://localhost:5173/' : 'https://hewliyang.com/';
export const skills = [
	'Python',
	'JS/TS',
	'Svelte',
	'React',
	'PGVector',
	'FastAPI',
	'Git',
	'Docker',
	'Github Actions',
	'Terraform'
];

export const educations: Education[] = [
	{
		degree: 'Data Science & Analytics (CS Minor) Undergrad',
		university: 'National University of Singapore',
		from: 'Aug 2020',
		to: 'Dec 2024',
		extra: `Worked on learning to rate synthetic speech quality, published datasets on 🤗
			<ul class="list-disc ml-4">
				<li>
					<a href="https://huggingface.co/datasets/hewliyang/nisqa-blizzard-challenge-mos" target="_blank" rel="noopener noreferrer" class="underline">
						hewliyang/nisqa-blizzard-challenge-mos
					</a>
				</li>
				<li>
					<a href="https://huggingface.co/datasets/hewliyang/nisqa-vcc-mos" target="_blank" rel="noopener noreferrer" class="underline">
						hewliyang/nisqa-vcc-mos
					</a>
				</li>
			</ul>`
	}
];

export const works: Work[] = [
	{
		company: 'brightriver.ai',
		description: `
			<ul class="list-disc ml-4">
				<li>
					Joined as the 1st employee, scaled platform from zero across the full stack to serve over 30 institutional investors across over 10 firms.
				</li>
				<li>
					Involved in all verticals including frontend, backend, product, design and research.
				</li>
				<li>
					Primary focus in unstructured document search and agent scaffolding to suit domain requirements.
				</li>
			</ul>
		`,
		isInternship: false,
		position: 'AI Engineer',
		from: 'July 2024',
		to: 'Now'
	},
	{
		company: 'NCS, IORA (NUS)',
		description: `
			<ul class="list-disc ml-4">
				<li>
					Policy research for optimizing energy use in data centers, causal inference on sensor data.
				</li>
			</ul>
		`,
		isInternship: true,
		position: 'Research Engineer Intern',
		from: 'Jan 2024',
		to: 'June 2024'
	},
	{
		company: 'GIC',
		description: `
			<ul class="list-disc ml-4">
				<li>
					Building internal LLM SDKs, structured output pipelines and a natural language to kdb+q queries for our traders.
				</li>
			</ul>
		`,
		isInternship: true,
		position: 'Machine Learning Engineer Intern',
		from: 'June 2023',
		to: 'Dec 2023'
	},
	{
		company: 'National University of Singapore (NUS)',
		position: 'Teaching Assistant',
		description: `
			<ul class="list-disc ml-4">
				<li>
					Taught ST1131 (Introduction to Statistical Computing).
				</li>
			</ul>
		`,
		isInternship: false,
		from: 'Aug 2022',
		to: 'May 2023'
	}
];

export const projects: Project[] = [
	{
		title: 'nus-nextbus-web',
		description:
			'NUS Internal Shuttle Bus web client for visualizing arrival times & routes. Over 200k visits.',
		href: 'https://github.com/hewliyang/nus-nextbus-web',
		tags: ['Svelte', 'SvelteKit', 'Typescript', 'TailwindCSS', 'GitHub Actions']
	},
	{
		title: 'nus-sentiment',
		description:
			"Semantic search & sentiment analysis for r/NUS posts. Won the NUS Hackers Coreteam's Best Roll at NUS Hack&Roll 2023. ",
		href: 'https://github.com/selangor-no-1/nus-sentiment',
		tags: ['Python', 'Transformers', 'Torch', 'Pinecone', 'Streamlit']
	},
	{
		title: 'autograd-ui',
		description:
			'Education tool for visualizing automatic differentiation during backpropgation. Built in 24H during NUS Hack&Roll 2024.',
		href: 'https://github.com/hewliyang/autograd-ui',
		tags: ['Svelte', 'xyflow', 'Typescript']
	}
];
