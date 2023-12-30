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
