<script lang="ts">
	import { geoMercator, geoPath } from 'd3-geo';
	import type { Feature, MultiPolygon, Polygon } from 'geojson';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let connectionPathEl: SVGPathElement;

	// Peninsular Malaysia GeoJSON (simplified)
	const peninsularMalaysia: Feature<MultiPolygon> = {
		type: 'Feature',
		properties: { name: 'Peninsular Malaysia' },
		geometry: {
			type: 'MultiPolygon',
			coordinates: [
				[
					[
						[100.119141, 6.441992],
						[100.137988, 6.488672],
						[100.16123, 6.641602],
						[100.176758, 6.671826],
						[100.216602, 6.686621],
						[100.261426, 6.682715],
						[100.34541, 6.549902],
						[100.563867, 6.467529],
						[100.629492, 6.447998],
						[100.715625, 6.480664],
						[100.754492, 6.460059],
						[100.79375, 6.426172],
						[100.816504, 6.331641],
						[100.873926, 6.24541],
						[100.98877, 6.257666],
						[101.029395, 6.245312],
						[101.053516, 6.242578],
						[101.075977, 6.166064],
						[101.086523, 6.033691],
						[101.075586, 5.956494],
						[100.992773, 5.846191],
						[100.981641, 5.771045],
						[101.025195, 5.724512],
						[101.081738, 5.674902],
						[101.113965, 5.636768],
						[101.147656, 5.643066],
						[101.190625, 5.66875],
						[101.229785, 5.733691],
						[101.257031, 5.789355],
						[101.404199, 5.85166],
						[101.556055, 5.907764],
						[101.576758, 5.902002],
						[101.601367, 5.877148],
						[101.65, 5.795996],
						[101.678418, 5.778809],
						[101.719531, 5.770605],
						[101.790723, 5.779346],
						[101.873633, 5.825293],
						[101.917188, 5.911377],
						[101.936133, 5.979346],
						[102.055176, 6.09668],
						[102.068359, 6.184668],
						[102.101074, 6.242236],
						[102.274023, 6.203418],
						[102.340137, 6.172021],
						[102.534375, 5.862549],
						[102.790234, 5.644922],
						[102.898535, 5.56377],
						[102.982422, 5.524951],
						[103.09707, 5.408447],
						[103.196973, 5.262158],
						[103.41582, 4.850293],
						[103.453906, 4.669482],
						[103.46875, 4.393262],
						[103.420508, 3.976855],
						[103.362012, 3.769141],
						[103.37334, 3.671094],
						[103.453516, 3.520605],
						[103.429492, 3.378564],
						[103.44502, 3.260596],
						[103.439453, 2.933105],
						[103.485156, 2.836572],
						[103.537305, 2.774756],
						[103.812207, 2.580469],
						[103.832324, 2.508496],
						[103.967773, 2.26123],
						[104.218555, 1.722852],
						[104.288477, 1.480664],
						[104.280371, 1.415576],
						[104.250098, 1.388574],
						[104.176367, 1.364893],
						[104.114941, 1.412256],
						[104.094238, 1.446191],
						[104.100586, 1.48833],
						[104.076172, 1.529785],
						[104.016016, 1.579297],
						[103.981445, 1.623633],
						[103.991211, 1.550049],
						[103.991504, 1.454785],
						[103.915137, 1.44668],
						[103.816797, 1.476562],
						[103.694531, 1.449658],
						[103.549805, 1.332812],
						[103.480273, 1.329492],
						[103.427344, 1.429834],
						[103.4, 1.497852],
						[103.356836, 1.546143],
						[102.896875, 1.792334],
						[102.727148, 1.855566],
						[102.548242, 2.042383],
						[102.145605, 2.248486],
						[101.889941, 2.449414],
						[101.78125, 2.573584],
						[101.519727, 2.683643],
						[101.406836, 2.813477],
						[101.351367, 2.838965],
						[101.295508, 2.885205],
						[101.354297, 3.011133],
						[101.330176, 3.14248],
						[101.299902, 3.253271],
						[101.11543, 3.472021],
						[101.024805, 3.624707],
						[100.85127, 3.776709],
						[100.781836, 3.864453],
						[100.71543, 3.966211],
						[100.757031, 4.001807],
						[100.795508, 4.023389],
						[100.760254, 4.097217],
						[100.661035, 4.225732],
						[100.614551, 4.373437],
						[100.614551, 4.652246],
						[100.473437, 5.044287],
						[100.352637, 5.587695],
						[100.374023, 5.777979],
						[100.343262, 5.98418],
						[100.263281, 6.18252],
						[100.158398, 6.324219],
						[100.119141, 6.441992]
					]
				]
			]
		}
	};

	// Singapore GeoJSON
	const singapore: Feature<Polygon> = {
		type: 'Feature',
		properties: { name: 'Singapore' },
		geometry: {
			type: 'Polygon',
			coordinates: [
				[
					[103.969727, 1.331445],
					[103.819922, 1.265381],
					[103.650195, 1.325537],
					[103.705273, 1.423437],
					[103.817969, 1.44707],
					[103.908984, 1.415967],
					[103.96084, 1.392236],
					[103.996387, 1.365234],
					[103.969727, 1.331445]
				]
			]
		}
	};

	// City coordinates
	const kualaLumpur = { lon: 101.6869, lat: 3.139 };
	const singaporeCity = { lon: 103.8198, lat: 1.3521 };

	// SVG dimensions
	const width = 280;
	const height = 200;

	// Create projection centered on the region - zoomed in tighter
	const projection = geoMercator()
		.center([102.2, 3.6])
		.scale(2200)
		.translate([width / 2, height / 2]);

	const pathGenerator = geoPath().projection(projection);

	// Generate paths
	const malaysiaPath = pathGenerator(peninsularMalaysia) || '';
	const singaporePath = pathGenerator(singapore) || '';

	// Project city coordinates
	const klPoint = projection([kualaLumpur.lon, kualaLumpur.lat]) || [0, 0];
	const sgPoint = projection([singaporeCity.lon, singaporeCity.lat]) || [0, 0];

	// Create curved path between cities
	const midX = (klPoint[0] + sgPoint[0]) / 2;
	const midY = (klPoint[1] + sgPoint[1]) / 2 - 20;
	const connectionPath = `M ${klPoint[0]} ${klPoint[1]} Q ${midX} ${midY} ${sgPoint[0]} ${sgPoint[1]}`;

	onMount(() => {
		if (connectionPathEl) {
			const pathLength = connectionPathEl.getTotalLength();

			// Set initial state
			gsap.set(connectionPathEl, {
				strokeDasharray: pathLength,
				strokeDashoffset: pathLength
			});

			// Animate in a loop: draw KL→SG, pause, fade out, repeat
			gsap
				.timeline({ repeat: -1, repeatDelay: 0.8 })
				.to(connectionPathEl, {
					strokeDashoffset: 0,
					duration: 1.5,
					ease: 'power2.inOut'
				})
				.to(connectionPathEl, {
					opacity: 0,
					duration: 0.5,
					delay: 0.5
				})
				.set(connectionPathEl, {
					strokeDashoffset: pathLength,
					opacity: 1
				});
		}
	});
</script>

<div class="flex flex-col items-center gap-4">
	<svg {width} {height} viewBox="0 0 {width} {height}" class="overflow-visible">
		<!-- Malaysia -->
		<path
			d={malaysiaPath}
			class="fill-neutral-100 stroke-neutral-300 dark:fill-neutral-800 dark:stroke-neutral-600"
			stroke-width="1"
		/>

		<!-- Singapore -->
		<path
			d={singaporePath}
			class="fill-neutral-100 stroke-neutral-300 dark:fill-neutral-800 dark:stroke-neutral-600"
			stroke-width="1"
		/>

		<!-- Connection line -->
		<path
			bind:this={connectionPathEl}
			d={connectionPath}
			fill="none"
			class="stroke-amber-500/50 dark:stroke-amber-400/50"
			stroke-width="1.5"
		/>

		<!-- Kuala Lumpur marker -->
		<g transform="translate({klPoint[0]}, {klPoint[1]})">
			<circle r="4" class="fill-neutral-900 dark:fill-neutral-100" />
			<circle
				r="6"
				class="fill-none stroke-neutral-900/30 dark:stroke-neutral-100/30"
				stroke-width="1.5"
			/>
		</g>

		<!-- Singapore marker -->
		<g transform="translate({sgPoint[0]}, {sgPoint[1]})">
			<circle r="4" class="fill-amber-500" />
			<circle r="6" class="fill-none stroke-amber-500/40" stroke-width="1.5" />
			<!-- Ping animation for current location -->
			<circle r="4" class="animate-ping fill-amber-500 opacity-75" />
		</g>

		<!-- Labels -->
		<text
			x={klPoint[0]}
			y={klPoint[1] - 12}
			text-anchor="middle"
			class="fill-neutral-600 text-[10px] font-medium dark:fill-neutral-400"
		>
			KL
		</text>
		<text
			x={sgPoint[0]}
			y={sgPoint[1] + 18}
			text-anchor="middle"
			class="fill-amber-600 text-[10px] font-medium dark:fill-amber-400"
		>
			SG
		</text>
	</svg>

	<p class="text-xs text-neutral-500 dark:text-neutral-500">
		From <span class="text-neutral-700 dark:text-neutral-300">Kuala Lumpur</span>, based in
		<span class="text-amber-600 dark:text-amber-400">Singapore</span>
	</p>
</div>
