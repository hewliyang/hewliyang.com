---
title: My Pi Setup
description: How I extend pi with extensions, skills, and small composable CLIs — and why I don't use MCP.
date: '2026-06-10'
draft: true
---

# My Pi Setup

<!-- hook: pi is a minimal harness; the whole point is you adapt it to your workflows, not the other way around. tour of my actual setup. -->

## The Lay of the Land

<!-- 30-second mental model: 4 default tools (read/write/edit/bash) + 4 extension points (extensions, skills, prompt templates, packages). CeTZ #1: architecture diagram — pi core in the middle, extension points radiating out -->

```typst
#import "@preview/cetz:0.4.2": canvas, draw

#canvas(length: 1cm, {
  import draw: *

  // pi logo mark, redrawn from the SVG path (5 cells on a 4x4 grid)
  let pi-logo(pos, s, fill: black) = {
    let (px, py) = pos
    let r(gx, gy, gw, gh) = rect(
      (px + gx * s, py - gy * s),
      (px + (gx + gw) * s, py - (gy + gh) * s),
      fill: fill, stroke: (paint: fill, thickness: 0.3pt)
    )
    r(0, 0, 3, 1)
    r(0, 1, 1, 3)
    r(2, 1, 1, 1)
    r(1, 2, 1, 1)
    r(3, 2, 1, 2)
  }

  let ink = rgb("#27272a")
  let dim = gray
  let corec = (rgb("#c9e3f5"), rgb("#6699cc"))
  let toolc = (rgb("#fdf6c3"), rgb("#cbb955"))
  let extc  = (rgb("#fcd9b1"), rgb("#d9913f"))
  let skillc = (rgb("#d3ecd3"), rgb("#74a874"))
  let tplc  = (rgb("#e2d4f0"), rgb("#9b7fc0"))
  let clic  = (rgb("#fad2dc"), rgb("#cc7a8e"))

  let box(pos, label, name, fill: none, w: 1.6, h: 0.5) = {
    rect((rel: (-w, -h), to: pos), (rel: (w, h), to: pos),
      radius: 0.15, fill: fill.at(0),
      stroke: (paint: fill.at(1), thickness: 0.8pt), name: name)
    content(pos, text(size: 9pt, fill: ink, label))
  }

  // core (center)
  box((0, 0), [], "core", fill: corec, w: 1.5, h: 0.8)
  pi-logo((-0.3, 0.55), 0.15, fill: ink)
  content((0, -0.35), text(size: 9pt, fill: ink)[*pi* agent loop])

  // default tools (below core)
  box((0, -2.6), [`read` `write` `edit` `bash`], "tools", fill: toolc, w: 2.2, h: 0.5)
  line("core.south", "tools.north", mark: (end: ">", fill: black, scale: 0.8))
  content((0.3, -1.5), anchor: "west", text(size: 8pt, fill: dim)[4 default tools])

  // left column: package-able extension points
  box((-5.6, 1.7), [extensions\ #text(size: 7.5pt, fill: dim)[hook the loop, add tools & commands]], "ext", fill: extc, w: 2.3, h: 0.75)
  box((-5.6, 0), [skills\ #text(size: 7.5pt, fill: dim)[instructions loaded on demand]], "skill", fill: skillc, w: 2.3, h: 0.75)
  box((-5.6, -1.7), [prompt templates\ #text(size: 7.5pt, fill: dim)[reusable /commands]], "tpl", fill: tplc, w: 2.3, h: 0.75)

  line("ext.east", "core.north-west", mark: (end: ">", fill: black, scale: 0.8))
  line("skill.east", "core.west", mark: (end: ">", fill: black, scale: 0.8))
  line("tpl.east", "core.south-west", mark: (end: ">", fill: black, scale: 0.8))

  // packages wrapper
  rect((-8.2, -2.8), (-3.0, 3.0), radius: 0.25, stroke: (paint: dim, dash: "densely-dotted"))
  content((-5.6, 2.72), text(size: 8pt, fill: dim)[shareable as *pi packages* (npm / git)])

  // right: CLIs reached through bash
  box((5.4, -2.6), [CLIs\ #text(size: 7.5pt, fill: dim)[anything on \$PATH]], "cli", fill: clic, w: 2.0, h: 0.75)
  line("cli.west", "tools.east", mark: (end: ">", fill: black, scale: 0.8), stroke: (dash: "dashed", paint: dim))
  content((2.85, -3.05), text(size: 7.5pt, fill: dim)[via `bash`])

  content((5.4, -3.85), text(size: 7.5pt, fill: dim)[`colgrep` · `img-gen` · `splitwise-cli` · `browser-harness` …])
})
```

<!-- fig caption idea: everything that extends pi, and how it reaches the loop -->

## Extensions

<!-- TypeScript modules hooked into the agent loop. my two real examples: tps.ts (tok/s + cache stats after every turn) and /pr command. point: ~50 lines each, hot-reloadable, no fork required -->

## Skills

<!-- progressive disclosure: only name+description live in the system prompt; full SKILL.md loads on demand. one settings line points pi at ~/.claude/skills — same skills work across harnesses. CeTZ #2: progressive disclosure diagram — system prompt holds tiny descriptions, read() pulls in the full skill only when relevant -->

```typst
#import "@preview/cetz:0.4.2": canvas, draw

#canvas(length: 1cm, {
  import draw: *

  let ink = rgb("#27272a")
  let dim = gray
  let ctxc = (rgb("#c9e3f5"), rgb("#6699cc"))
  let skillc = (rgb("#d3ecd3"), rgb("#74a874"))
  let dimskill = (rgb("#f4f4f5"), rgb("#c4c4cc"))

  // ── context window (left) ──
  rect((-1.9, -3.4), (1.9, 3.4), radius: 0.2, stroke: (paint: ctxc.at(1), thickness: 1pt))
  content((0, 3.05), text(size: 9pt, weight: "bold")[context window])

  // system prompt block
  rect((-1.6, 0.4), (1.6, 2.6), radius: 0.12, fill: rgb("#fdf6c3"), stroke: (paint: rgb("#cbb955"), thickness: 0.8pt))
  content((0, 2.3), text(size: 8pt, fill: ink)[system prompt])

  // tiny description entries inside system prompt
  let entry(y, label) = {
    rect((-1.35, y - 0.17), (1.35, y + 0.17), radius: 0.08, fill: skillc.at(0), stroke: (paint: skillc.at(1), thickness: 0.6pt))
    content((0, y), text(size: 6.5pt, fill: ink, label))
  }
  entry(1.85, [browser-harness — 1-line desc])
  entry(1.4, [img-gen — 1-line desc])
  entry(0.95, [spreadjs — 1-line desc])
  content((0, 0.62), text(size: 6.5pt, fill: dim)[… ~2 lines each])

  // conversation area
  rect((-1.6, -3.1), (1.6, 0.1), radius: 0.12, stroke: (paint: dim, dash: "densely-dotted"))
  content((0, -0.25), text(size: 8pt, fill: dim)[conversation])

  // loaded skill in conversation
  rect((-1.35, -2.5), (1.35, -0.7), radius: 0.08, fill: skillc.at(0), stroke: (paint: skillc.at(1), thickness: 0.8pt), name: "loaded")
  content((0, -1.0), text(size: 7pt, fill: ink)[`SKILL.md`])
  content((0, -1.45), text(size: 6.5pt, fill: dim)[full instructions,])
  content((0, -1.85), text(size: 6.5pt, fill: dim)[helper scripts,])
  content((0, -2.25), text(size: 6.5pt, fill: dim)[references])

  // ── disk (right) ──
  rect((4.6, -3.4), (9.4, 3.4), radius: 0.2, stroke: (paint: dim, dash: "densely-dotted"))
  content((7, 3.05), text(size: 9pt, weight: "bold")[`~/.claude/skills/` on disk])

  let skillbox(y, label, name, active: false) = {
    let c = if active { skillc } else { dimskill }
    rect((4.95, y - 0.45), (9.05, y + 0.45), radius: 0.12, fill: c.at(0), stroke: (paint: c.at(1), thickness: 0.8pt), name: name)
    content((7, y), text(size: 7.5pt, fill: if active { ink } else { dim }, label))
  }
  skillbox(2.1, [`browser-harness/SKILL.md` +helpers], "s1", active: true)
  skillbox(1.0, [`img-gen/SKILL.md` + references], "s2")
  skillbox(-0.1, [`spreadjs/SKILL.md` + scripts], "s3")
  skillbox(-1.2, [`sentry-cli/SKILL.md`], "s4")
  skillbox(-2.3, [`qwen-tts-voice-cloning/SKILL.md`], "s5")

  // arrow: read() pulls full skill on demand
  line("s1.west", (3.2, 2.1), (3.2, -1.6), "loaded.east",
    mark: (end: ">", fill: skillc.at(1), scale: 0.9),
    stroke: (paint: skillc.at(1), thickness: 1pt))
  content((3.25, 1.0), text(size: 7.5pt, fill: skillc.at(1))[`read`\ on demand])
})
```

<!-- fig caption idea: the system prompt only carries one-liners; the full skill is read when needed -->

## CLIs Are the Real Tool Layer

<!-- the agent already has bash. a well-written CLI with --help IS a tool definition. splitwise-cli, colgrep, img-gen, browser-harness. discoverable, pipeable, versionable, usable by humans too -->

## Why Not MCP?

<!-- every MCP tool schema is resident context forever; a CLI costs zero until invoked. no server lifecycle, no transport, no JSON-RPC. composability argument leads into next section. CeTZ #3: side-by-side context-window comparison — MCP schemas always loaded vs skills/CLIs loaded on demand -->

```typst
#import "@preview/cetz:0.4.2": canvas, draw

#canvas(length: 1cm, {
  import draw: *

  let ink = rgb("#27272a")
  let dim = gray
  let sysc  = (rgb("#fdf6c3"), rgb("#cbb955"))
  let mcpc  = (rgb("#fad2dc"), rgb("#cc7a8e"))
  let convc = (rgb("#c9e3f5"), rgb("#6699cc"))
  let freec = (rgb("#f4f4f5"), rgb("#d4d4d8"))
  let skillc = (rgb("#d3ecd3"), rgb("#74a874"))

  let bar(x, segs, title) = {
    content((x, 7.0), text(size: 10pt, weight: "bold", title))
    let y = 6.4
    for (h, c, label, sub) in segs {
      rect((x - 1.7, y - h), (x + 1.7, y), radius: 0.1,
        fill: c.at(0), stroke: (paint: c.at(1), thickness: 0.8pt))
      content((x, y - h / 2 + (if sub == none { 0 } else { 0.42 })), text(size: 8pt, fill: ink, label))
      if sub != none {
        content((x, y - h / 2 - 0.25), text(size: 6.5pt, fill: dim, sub))
      }
      y -= h
    }
  }

  // ── MCP bar ──
  bar(0, (
    (0.8, sysc, [system prompt], none),
    (3.4, mcpc, [tool schemas], [every tool from every server,\ every request, used or not]),
    (1.4, convc, [conversation], none),
    (0.8, freec, text(fill: dim)[free], none),
  ), [MCP servers])

  // ── CLI/skills bar ──
  bar(5.6, (
    (0.8, sysc, [system prompt], none),
    (0.5, skillc, [skill descriptions], none),
    (1.4, convc, [conversation], none),
    (3.7, freec, text(fill: dim)[free], none),
  ), [skills + CLIs])

  // annotations
  content((2.8, -0.9), text(size: 8pt, fill: dim)[a CLI costs *zero* context until invoked — `--help` is its schema, read on demand])

  // braces showing cost
  line((-2.0, 6.4 - 0.8), (-2.3, 6.4 - 0.8), (-2.3, 6.4 - 4.2), (-2.0, 6.4 - 4.2), stroke: (paint: mcpc.at(1)))
  content((-2.6, 6.4 - 2.5), anchor: "east", text(size: 7.5pt, fill: mcpc.at(1))[resident\ forever])

  line((7.6, 6.4 - 0.8), (7.9, 6.4 - 0.8), (7.9, 6.4 - 1.3), (7.6, 6.4 - 1.3), stroke: (paint: skillc.at(1)))
  content((8.2, 6.4 - 1.05), anchor: "west", text(size: 7.5pt, fill: skillc.at(1))[~2 lines\ per skill])
})
```

<!-- fig caption idea: where your context budget goes -->

## Composability Compounds

<!-- pi-bash-image case study: __PI_IMAGE__ turns screenshot→read (2 round trips) into 1 tool call. fewer round trips, fewer cache invalidations, fewer input tokens. unix pipes apply to agents. interactive: left = a growing agent trace (fn-call style, call → result blocks), 2 passes/turn vs 1; right = diverging cumulative cache-read curves (quadratic, not exponential), scrub the conversation length and watch the gap open. data modelled in ComposabilityChart.svelte -->

<ComposabilityChart />

<!-- fig caption idea: seeing an image: two tool calls vs one -->

Why a parabola and not a hockey stick? The curve isn't an empirical mystery — it falls out of one assumption about how the prefix grows.

```typst
#set text(size: 10pt)
#set par(leading: 0.62em)

#let dim = gray
#let accent = rgb("#6699cc")
#let warm = rgb("#cc7a8e")
#let saved = rgb("#74a874")
#let tag(body, c) = box(inset: (x: 4pt, y: 1pt), radius: 3pt, fill: c.lighten(78%), stroke: 0.6pt + c.lighten(40%), text(size: 8.5pt, fill: c.darken(12%), body))

#block(width: 48em, {
  // ── one modelling assumption ──
  text(size: 8.5pt, fill: dim, smallcaps[the one assumption])
  v(-0.3em)
  [The cached prefix grows by a roughly constant chunk each turn — the turn's
   work, the model's reasoning, the tool results — so its length is *linear* in
   the turn index $t$:]
  $ c(t) = c_0 + g t $
  set text(size: 8.5pt)
  block(inset: (left: 0.4em))[$c_0$ — base prompt (system + skills) #h(1.2em) $g$ — tokens added per turn]
  set text(size: 10pt)

  v(0.4em)
  text(size: 8.5pt, fill: dim, smallcaps[step is linear])
  v(-0.3em)
  [Every inference pass re-reads the *whole* prefix, so one pass costs $c(t)$.
   With $p$ passes per turn ($p=2$ #tag([without], warm), $p=1$ #tag([with], accent)):]
  $ S(t) = p dot c(t) = p(c_0 + g t) quad (#text(fill: dim, size: 8.5pt)[linear in] t) $

  v(0.4em)
  text(size: 8.5pt, fill: dim, smallcaps[cumulative is quadratic])
  v(-0.3em)
  [Summing the step over $N$ turns is a triangular sum — the discrete
   $integral t dif t$:]
  $ C(N) = sum_(t=1)^N p dot c(t)
    = underbrace((p g)/2, "curvature") N^2
    + p(c_0 + g/2) N $
  [A *constant* per-turn structure integrates to a *quadratic* total. The bend
   is the running sum, not exponential blow-up.]

  v(0.4em)
  text(size: 8.5pt, fill: dim, smallcaps[the ratio])
  v(-0.3em)
  [Both paths are quadratics with the same shape, so their ratio tends to a
   constant set by the pass counts:]
  $ C_"without" / C_"with" -->_(N -> oo)
    underbrace(p_"w" / p_"c", =2) dot underbrace(g_"w" / g_"c", >1) gt.tilde 2 $
  [#text(fill: saved)[$gt.tilde 2$], not exactly $2$: the two-pass path also
   emits an extra reasoning block per turn, so $g_"w" > g_"c"$ nudges it just above.]

  v(0.4em)
  line(length: 100%, stroke: 0.5pt + dim.lighten(40%))
  v(0.2em)
  set text(size: 8.5pt, fill: dim)
  [*Where it breaks.* The parabola needs an unbounded prefix. Under compaction
   or a context cap, $c(t) -> c_max$ and the sum collapses to $C(N) -> p c_max N$
   — asymptotically *linear*. The $2 times$ gap survives as a constant factor;
   the curvature does not.]
})
```

<!-- real-world evidence: ccusage pi monthly, nov '25 – jun '26. interactive: per-model stacked bars, switchable metric, cost overlay. data baked from ~/.pi session logs into src/lib/data/pi-usage.json -->

<TokenUsageChart />

## A Coding Agent That Doesn't Code

<!-- bash + skills means the "coding" agent does non-coding work: browser automation via CDP, excel via spreadjs, splitting bills via splitwise-cli, TTS pipelines. the harness is general; the tools define the domain -->

## Build Your Own Tools

<!-- when something's missing, wrap it: codex-image-cli wraps Codex image-gen internals into a CLI+SDK (concurrent gens, OAuth reuse). google search = a browser-harness script: open tab → google → scrape → close. you don't wait for an integration, you write 100 lines. CeTZ #5 (optional): codex-image-cli layering — oauth token → SDK fn → CLI on top, both consumable -->

```typst
#import "@preview/cetz:0.4.2": canvas, draw

#canvas(length: 1cm, {
  import draw: *

  let ink = rgb("#27272a")
  let dim = gray
  let basec = (rgb("#f4f4f5"), rgb("#c4c4cc"))
  let sdkc  = (rgb("#c9e3f5"), rgb("#6699cc"))
  let clic  = (rgb("#fcd9b1"), rgb("#d9913f"))
  let usec  = (rgb("#d3ecd3"), rgb("#74a874"))

  let layer(y, w, label, sub, name, fill) = {
    rect((-w, y - 0.55), (w, y + 0.55), radius: 0.15,
      fill: fill.at(0), stroke: (paint: fill.at(1), thickness: 0.8pt), name: name)
    content((0, y + 0.16), text(size: 9pt, fill: ink, label))
    content((0, y - 0.24), text(size: 7.5pt, fill: dim, sub))
  }

  // stack, bottom to top
  layer(0, 4.4, [Codex internals], [`image_generation` endpoint + your existing ChatGPT OAuth token], "base", basec)
  layer(1.6, 3.6, [SDK — `generateImage()`], [structured returns · `Promise.all` concurrency · abort/retry], "sdk", sdkc)
  layer(3.2, 2.8, [CLI — `img-gen`], [`img-gen -o hero.png "<prompt>"` — agent-callable via `bash`], "cli", clic)

  line("base.north", "sdk.south", mark: (end: ">", fill: black, scale: 0.8))
  line("sdk.north", "cli.south", mark: (end: ">", fill: black, scale: 0.8))

  content((-5.6, 0), anchor: "east", text(size: 7.5pt, fill: dim)[already on\ your machine])
  content((-5.6, 1.6), anchor: "east", text(size: 7.5pt, fill: dim)[wrap it in\ a function])
  content((-5.6, 3.2), anchor: "east", text(size: 7.5pt, fill: dim)[put a CLI\ on top])

  // consumers
  let consumer(x, label, name) = {
    rect((x - 1.5, 4.85), (x + 1.5, 5.75), radius: 0.15,
      fill: usec.at(0), stroke: (paint: usec.at(1), thickness: 0.8pt), name: name)
    content((x, 5.3), text(size: 8pt, fill: ink, label))
  }
  consumer(-3.6, [agent, via `bash`\ #text(size: 6.5pt, fill: dim)[one-off generations]], "c1")
  consumer(0, [you, in a terminal\ #text(size: 6.5pt, fill: dim)[same tool, no agent]], "c3")
  consumer(3.6, [node pipelines\ #text(size: 6.5pt, fill: dim)[concurrent batches]], "c2")

  line("cli.north", "c1.south", mark: (end: ">", fill: usec.at(1), scale: 0.8), stroke: (paint: usec.at(1)))
  line("sdk.east", (3.6, 1.6), "c2.south",
    mark: (end: ">", fill: usec.at(1), scale: 0.8), stroke: (paint: usec.at(1)))
  line("cli.north", "c3.south", mark: (end: ">", fill: usec.at(1), scale: 0.8), stroke: (paint: usec.at(1)))
})
```

<!-- fig caption idea: internals → function → SDK → CLI: each layer adds a consumer -->

## Closing

<!-- the setup is small on purpose. every piece is a file you can read. start with one extension or one CLI wrapper -->
