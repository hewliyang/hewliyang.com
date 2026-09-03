<script lang="ts">
	import { geoMercator, geoPath } from 'd3-geo';
	import type { Feature, MultiPolygon, Polygon } from 'geojson';

	import peninsularMalaysia from '$lib/data/peninsular_malaysia.json';
	import singaporeGeo from '$lib/data/singapore.json';
	import californiaGeo from '$lib/data/california.json';

	const malaysia = peninsularMalaysia as unknown as Feature<MultiPolygon>;
	const singapore = singaporeGeo as unknown as Feature<Polygon>;
	const california = californiaGeo as unknown as Feature<Polygon>;

	// City coordinates [lon, lat]
	const kualaLumpur: [number, number] = [101.6869, 3.139];
	const singaporeCity: [number, number] = [103.8198, 1.3521];
	const sanFrancisco: [number, number] = [-122.4194, 37.7749];

	const width = 240;
	const height = 170;

	const seaProj = geoMercator().center([102.3, 3.6]).scale(850).translate([50, 115]);
	const caProj = geoMercator().center([-119.5, 37.0]).scale(360).translate([195, 55]);

	const seaPath = geoPath().projection(seaProj);
	const caPath = geoPath().projection(caProj);

	const malaysiaPath = seaPath(malaysia) || '';
	const singaporePath = seaPath(singapore) || '';
	const californiaPath = caPath(california) || '';

	const landClass =
		'fill-neutral-200 stroke-neutral-300 dark:fill-neutral-800 dark:stroke-neutral-700';

	function projectSEA(point: [number, number]): [number, number] {
		const p = seaProj(point);
		return p ? [p[0], p[1]] : [0, 0];
	}
	function projectCA(point: [number, number]): [number, number] {
		const p = caProj(point);
		return p ? [p[0], p[1]] : [0, 0];
	}

	const klPt = projectSEA(kualaLumpur);
	const sgPt = projectSEA(singaporeCity);
	const sfPt = projectCA(sanFrancisco);

	const klSgMidX = (klPt[0] + sgPt[0]) / 2 - 6;
	const klSgMidY = (klPt[1] + sgPt[1]) / 2 + 2;
	const klSgPath = `M ${klPt[0]} ${klPt[1]} Q ${klSgMidX} ${klSgMidY} ${sgPt[0]} ${sgPt[1]}`;

	const sgSfMidX = (sgPt[0] + sfPt[0]) / 2;
	const sgSfMidY = Math.min(sgPt[1], sfPt[1]) - 28;
	const sgSfPathD = `M ${sgPt[0]} ${sgPt[1]} Q ${sgSfMidX} ${sgSfMidY} ${sfPt[0]} ${sfPt[1]}`;

	const labelClass = 'font-mono text-[9px]';

	// Ocean canvas bleeds past the SVG bounds into surrounding whitespace.
	// Left/top/bottom bleed generously; right stays modest to avoid horizontal
	// scroll (overflow to the right of the viewport creates a scrollbar,
	// overflow to the left/top doesn't).
	const bleed = { top: 150, right: 72, bottom: 200, left: 340 };
	const oceanW = width + bleed.left + bleed.right;
	const oceanH = height + bleed.top + bleed.bottom;

	function animateArc(node: SVGPathElement) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const length = node.getTotalLength();
		node.style.strokeDasharray = `${length}`;

		// draw (2s) -> hold (0.9s) -> fade (0.6s) -> pause (1.2s), looped
		const total = 4700;
		const draw = node.animate(
			[
				{ strokeDashoffset: length, offset: 0, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
				{ strokeDashoffset: 0, offset: 2000 / total },
				{ strokeDashoffset: 0, offset: 1 }
			],
			{ duration: total, iterations: Infinity }
		);
		const fade = node.animate(
			[
				{ opacity: 1, offset: 0 },
				{ opacity: 1, offset: 2900 / total },
				{ opacity: 0, offset: 3500 / total },
				{ opacity: 0, offset: 1 }
			],
			{ duration: total, iterations: Infinity }
		);

		return () => {
			draw.cancel();
			fade.cancel();
		};
	}

	// WebGL ocean: slow-drifting fbm contour lines, nautical-chart style.
	// Tinted neutrals at watermark alpha; vignetted so the canvas edge never shows.
	const VERT = `#version 300 es
void main() {
	vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
	gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

	const FRAG = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_t;
uniform vec3 u_color;
uniform float u_alpha;
uniform float u_boost;
uniform float u_zoom;
uniform vec2 u_center;
uniform vec4 u_edge; // normalized fade widths: left, right, bottom, top
out vec4 o;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p);
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(
		mix(hash(i), hash(i + vec2(1, 0)), u.x),
		mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x),
		u.y
	);
}
float fbm(vec2 p) {
	float v = 0.0, a = 0.5;
	for (int i = 0; i < 3; i++) {
		v += a * noise(p);
		p *= 2.03;
		a *= 0.5;
	}
	return v;
}

// One field of open, undulating swell lines.
// freq: line density; warp: undulation depth; drift: phase scroll speed.
float swell(vec2 uv, float t, float freq, float warp, float drift) {
	float s = uv.y * freq + fbm(uv * 1.5 + vec2(t * 0.45, 0.0)) * warp - t * drift;
	return 1.0 - smoothstep(0.0, 1.6, abs(fract(s) - 0.5) / fwidth(s));
}

void main() {
	// u_zoom keeps wavelength constant in CSS px regardless of canvas size
	vec2 uv = gl_FragCoord.xy / u_res.y * u_zoom;
	float t = u_t * 0.06;

	// Three swell layers at different scales and speeds: parallax = depth.
	// Far: fine, faint, slow. Mid: main field. Near: long lazy rollers.
	float far  = swell(uv, t * 0.6, 19.0, 1.8, 0.7) * 0.30;
	float mid  = swell(uv + 3.7, t, 11.0, 2.8, 1.0) * 0.65;
	float near = swell(uv + 9.2, t * 1.5, 6.0, 3.6, 1.3) * 1.0;

	// Patchy shimmer: large slow noise brightens some regions, dims others,
	// like light moving on water. Keeps the field from feeling mechanical.
	float glint = 0.45 + 0.55 * noise(uv * 1.1 + vec2(t * 0.8, t * 0.3));

	float line = (far + mid + near) * glint;
	vec2 c = gl_FragCoord.xy / u_res - u_center;
	float vig = smoothstep(0.6, 0.2, length(c * vec2(1.0, 1.05)));
	// Hard guarantee: alpha reaches zero at every canvas edge so the square
	// boundary never shows, regardless of how asymmetric the bleed is.
	vec2 q = gl_FragCoord.xy / u_res;
	float edge = smoothstep(0.0, u_edge.x, q.x)
	           * smoothstep(0.0, u_edge.y, 1.0 - q.x)
	           * smoothstep(0.0, u_edge.z, q.y)
	           * smoothstep(0.0, u_edge.w, 1.0 - q.y);
	float a = min(line * u_boost, 1.0) * vig * edge * u_alpha;
	o = vec4(u_color * a, a);
}`;

	function oceanShader(canvas: HTMLCanvasElement) {
		const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true });
		if (!gl) return; // no WebGL2: page background shows through, nothing lost

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		canvas.width = oceanW * dpr;
		canvas.height = oceanH * dpr;

		function compile(type: number, src: string) {
			const s = gl!.createShader(type)!;
			gl!.shaderSource(s, src);
			gl!.compileShader(s);
			return s;
		}
		const prog = gl.createProgram()!;
		gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
		gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
		gl.linkProgram(prog);
		if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
		gl.useProgram(prog);

		const uRes = gl.getUniformLocation(prog, 'u_res');
		const uT = gl.getUniformLocation(prog, 'u_t');
		const uColor = gl.getUniformLocation(prog, 'u_color');
		const uAlpha = gl.getUniformLocation(prog, 'u_alpha');
		const uBoost = gl.getUniformLocation(prog, 'u_boost');
		const uZoom = gl.getUniformLocation(prog, 'u_zoom');
		const uCenter = gl.getUniformLocation(prog, 'u_center');
		const uEdge = gl.getUniformLocation(prog, 'u_edge');

		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.uniform2f(uRes, canvas.width, canvas.height);
		gl.uniform1f(uZoom, oceanH / height);
		// Anchor the vignette focal point over the map box, not the canvas center,
		// so the asymmetric bleed doesn't make the ocean glow lopsided.
		// gl_FragCoord origin is bottom-left, so y is measured from the bottom.
		gl.uniform2f(uCenter, (bleed.left + width / 2) / oceanW, (bleed.bottom + height / 2) / oceanH);
		// Fade widths sized to each side's bleed (capped so big bleeds don't
		// over-soften), in normalized canvas units. gl y=0 is the CSS bottom.
		gl.uniform4f(
			uEdge,
			Math.min(bleed.left, 140) / oceanW,
			Math.min(bleed.right, 140) / oceanW,
			Math.min(bleed.bottom, 140) / oceanH,
			Math.min(bleed.top, 140) / oceanH
		);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

		const dark = window.matchMedia('(prefers-color-scheme: dark)');
		function applyTheme() {
			if (dark.matches) {
				gl!.uniform3f(uColor, 0.56, 0.65, 0.82);
				gl!.uniform1f(uAlpha, 0.2);
				gl!.uniform1f(uBoost, 1.0);
			} else {
				// Deep ink blue; aggressive boost saturates even the faint far
				// layer so every line registers against a white page.
				gl!.uniform3f(uColor, 0.16, 0.28, 0.52);
				gl!.uniform1f(uAlpha, 1.0);
				gl!.uniform1f(uBoost, 3.5);
			}
		}
		applyTheme();

		function draw(t: number) {
			gl!.uniform1f(uT, t);
			gl!.clearColor(0, 0, 0, 0);
			gl!.clear(gl!.COLOR_BUFFER_BIT);
			gl!.drawArrays(gl!.TRIANGLES, 0, 3);
		}

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			draw(40); // single static frame
			const onTheme = () => draw(40);
			dark.addEventListener('change', () => {
				applyTheme();
				onTheme();
			});
			return;
		}

		let raf = 0;
		let visible = true;
		function loop() {
			draw(performance.now() / 1000);
			raf = requestAnimationFrame(loop);
		}
		function setRunning(run: boolean) {
			cancelAnimationFrame(raf);
			if (run) raf = requestAnimationFrame(loop);
		}

		const io = new IntersectionObserver(([e]) => {
			visible = e.isIntersecting;
			setRunning(visible && !document.hidden);
		});
		io.observe(canvas);
		const onVis = () => setRunning(visible && !document.hidden);
		document.addEventListener('visibilitychange', onVis);
		const onTheme = () => applyTheme();
		dark.addEventListener('change', onTheme);

		return () => {
			cancelAnimationFrame(raf);
			io.disconnect();
			document.removeEventListener('visibilitychange', onVis);
			dark.removeEventListener('change', onTheme);
		};
	}
</script>

<div class="relative" style="width: {width}px; height: {height}px;">
	<canvas
		width={oceanW}
		height={oceanH}
		class="pointer-events-none absolute -z-10"
		style="left: {-bleed.left}px; top: {-bleed.top}px; width: {oceanW}px; height: {oceanH}px;"
		aria-hidden="true"
		{@attach oceanShader}
	></canvas>

	<svg
		{width}
		{height}
		viewBox="0 0 {width} {height}"
		class="relative block overflow-visible"
		role="img"
		aria-label="Map showing my move from Kuala Lumpur and Singapore to San Francisco"
	>
		<path d={malaysiaPath} class={landClass} stroke-width="0.75" stroke-linejoin="round" />
		<path d={singaporePath} class={landClass} stroke-width="0.75" stroke-linejoin="round" />
		<path d={californiaPath} class={landClass} stroke-width="0.75" stroke-linejoin="round" />

		<path
			d={klSgPath}
			fill="none"
			class="stroke-neutral-400 dark:stroke-neutral-600"
			stroke-width="1"
			stroke-dasharray="2 2"
		/>

		<path
			d={sgSfPathD}
			fill="none"
			class="stroke-amber-500 dark:stroke-amber-400"
			stroke-width="1.5"
			stroke-linecap="round"
			{@attach animateArc}
		/>

		<g transform="translate({klPt[0]}, {klPt[1]})">
			<circle r="2.5" class="fill-neutral-400 dark:fill-neutral-500" />
		</g>
		<text
			x={klPt[0] - 6}
			y={klPt[1] + 3}
			text-anchor="end"
			class="{labelClass} fill-neutral-500 dark:fill-neutral-400"
		>
			KL
		</text>

		<g transform="translate({sgPt[0]}, {sgPt[1]})">
			<circle r="3.5" class="fill-neutral-800 dark:fill-neutral-200" />
			<circle
				r="6"
				class="fill-none stroke-neutral-800/20 dark:stroke-neutral-200/25"
				stroke-width="1"
			/>
		</g>
		<text
			x={sgPt[0] + 7}
			y={sgPt[1] + 11}
			text-anchor="start"
			class="{labelClass} fill-neutral-700 dark:fill-neutral-300"
		>
			SG
		</text>

		<g transform="translate({sfPt[0]}, {sfPt[1]})">
			<circle r="3.5" class="fill-amber-500 dark:fill-amber-400" />
			<circle
				r="6.5"
				class="fill-none stroke-amber-500/30 dark:stroke-amber-400/35"
				stroke-width="1"
			/>
		</g>
		<text
			x={sfPt[0] - 7}
			y={sfPt[1] + 3}
			text-anchor="end"
			class="{labelClass} fill-amber-600 dark:fill-amber-400"
		>
			SF
		</text>
	</svg>
</div>
