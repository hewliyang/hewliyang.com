---
title: Hello World
description: Welcome to my blog. A quick intro on what I'll be writing about.
date: '2024-01-15'
---

# Hello World

Welcome to my blog! This is where I'll be sharing thoughts on software engineering, AI, and whatever else catches my interest.

## Why a blog?

I've always found that writing helps me think more clearly. It forces me to organize my thoughts and articulate ideas in a way that's (hopefully) coherent to others.

## What to expect

Here's a nice gradient to brighten up this post:

![A colorful gradient](/images/gradient.png)

I'll be writing about:

- **Engineering deep-dives** - breaking down interesting problems I've encountered
- **AI/ML explorations** - experiments, papers, and practical applications
- **Open source** - projects I'm working on or contributing to
- **Random musings** - because sometimes you just need to ramble

And maybe some data visualizations like this:

![Financial charts example](/images/chart-demo.png)

## Interactive components

One thing I love about this setup is that I can embed interactive Svelte components directly in my posts:

<Counter />

Pretty neat, right? This opens up a lot of possibilities for interactive explanations and demos.

## Code highlighting

And of course, code blocks work great too:

```typescript
async function fetchPosts() {
	const modules = import.meta.glob('/src/content/*.md');
	const posts = await Promise.all(
		Object.entries(modules).map(async ([path, resolver]) => {
			const { metadata } = await resolver();
			const slug = path.split('/').pop()?.replace('.md', '');
			return { ...metadata, slug };
		})
	);
	return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}
```

That's all for now. Stay tuned for more posts!
