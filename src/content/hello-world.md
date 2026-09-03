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

Or even diagrams written in [Typst](https://typst.app) with [CeTZ](https://cetz-package.github.io/), compiled to SVG at build time — no client-side JS, and it follows your color scheme:

```typst
#import "@preview/cetz:0.4.2": canvas, draw

#canvas(length: 1cm, {
  import draw: *

  let block(pos, label, name, w: 1.1) = {
    rect(
      (rel: (-w, -0.5), to: pos), (rel: (w, 0.5), to: pos),
      radius: 0.15, stroke: 0.8pt, name: name
    )
    content(pos, text(size: 10pt, label))
  }

  block((0, 0), [markdown], "md")
  block((3.4, 0), [remark], "remark")
  block((6.8, 0), [rehype], "rehype")
  block((10.2, 0), [svelte], "svelte")

  line("md.east", "remark.west", mark: (end: ">", fill: black))
  line("remark.east", "rehype.west", mark: (end: ">", fill: black))
  line("rehype.east", "svelte.west", mark: (end: ">", fill: black))

  arc-through(
    "remark.north", (5.1, 1.3), "rehype.north",
    mark: (end: ">", fill: gray),
    stroke: (dash: "dashed", paint: gray)
  )
  content((5.1, 1.7), text(size: 8pt, fill: gray)[typst figures rendered here])
})
```

It scales to more involved figures too. Here's the transformer decoder from _Attention is All You Need_:

```typst
#import "@preview/cetz:0.4.2": canvas, draw

#canvas(length: 1cm, {
  import draw: *

  // palette lifted from the paper (fill, border)
  let ink = rgb("#27272a")
  let attn = (rgb("#fcd9b1"), rgb("#d9913f"))
  let norm = (rgb("#fdf6c3"), rgb("#cbb955"))
  let ffn = (rgb("#c9e3f5"), rgb("#6699cc"))
  let embed = (rgb("#fad2dc"), rgb("#cc7a8e"))
  let lin = (rgb("#e2d4f0"), rgb("#9b7fc0"))
  let soft = (rgb("#d3ecd3"), rgb("#74a874"))

  let box(pos, label, name, fill: none, w: 1.7, h: 0.42) = {
    rect(
      (rel: (-w, -h), to: pos), (rel: (w, h), to: pos),
      radius: 0.15,
      fill: fill.at(0),
      stroke: (paint: fill.at(1), thickness: 0.8pt),
      name: name
    )
    content(pos, text(size: 9pt, fill: ink, label))
  }

  let arrow(a, b) = line(a, b, mark: (end: ">", fill: black, scale: 0.8))

  // main vertical stack (bottom to top)
  box((0, 0), [output embedding\ + positional enc.], "emb", fill: embed, h: 0.6)
  box((0, 1.8), [masked multi-head\ self-attention], "mha1", fill: attn, h: 0.6)
  box((0, 3.3), [add & norm], "an1", fill: norm)
  box((0, 4.8), [multi-head\ cross-attention], "mha2", fill: attn, h: 0.6)
  box((0, 6.3), [add & norm], "an2", fill: norm)
  box((0, 7.8), [feed forward], "ffn", fill: ffn)
  box((0, 9.3), [add & norm], "an3", fill: norm)
  box((0, 10.9), [linear], "lin", fill: lin)
  box((0, 12.1), [softmax], "soft", fill: soft)

  arrow("emb.north", "mha1.south")
  arrow("mha1.north", "an1.south")
  arrow("an1.north", "mha2.south")
  arrow("mha2.north", "an2.south")
  arrow("an2.north", "ffn.south")
  arrow("ffn.north", "an3.south")
  arrow("an3.north", "lin.south")
  arrow("lin.north", "soft.south")
  arrow((0, -1.4), "emb.south")
  arrow("soft.north", (0, 13.3))

  content((0.25, -1.2), anchor: "west", text(size: 8pt, fill: gray)[tokens (shifted right)])
  content((0.25, 13.1), anchor: "west", text(size: 8pt, fill: gray)[next-token probabilities])

  // residual connections (left side)
  line((0, 0.9), (-2.6, 0.9), (-2.6, 3.3), "an1.west",
    stroke: (dash: "dashed", paint: gray), mark: (end: ">", fill: gray, scale: 0.8))
  line((0, 4.05), (-2.6, 4.05), (-2.6, 6.3), "an2.west",
    stroke: (dash: "dashed", paint: gray), mark: (end: ">", fill: gray, scale: 0.8))
  line((0, 7.05), (-2.6, 7.05), (-2.6, 9.3), "an3.west",
    stroke: (dash: "dashed", paint: gray), mark: (end: ">", fill: gray, scale: 0.8))

  // encoder input (right side, into cross-attention)
  line((3.6, 4.8), "mha2.east",
    stroke: (paint: gray), mark: (end: ">", fill: gray, scale: 0.8))
  content((4.0, 5.3), text(size: 8pt, fill: gray)[encoder\ K, V])

  // enclosing "x N" block
  rect((-3.1, 1.0), (2.6, 9.95), radius: 0.25, stroke: (paint: gray, dash: "densely-dotted"))
  content((2.2, 1.4), text(size: 9pt, fill: gray)[$times N$])
})
```

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
