export type Post = {
	title: string;
	slug: string;
	description: string;
	date: string;
	published: boolean;
};

export type Project = {
	title: string;
	href: string;
	description: string;
	tags: string[];
};

export type Work = {
	company: string;
	position: string;
	description: string;
	isInternship: boolean;
	from: string;
	to: string;
};

export type Education = {
	university: string;
	degree: string;
	from: string;
	to: string;
	extra: string;
};
