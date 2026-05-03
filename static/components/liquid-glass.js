// Load SVG filters into DOM on first run
(async () => {
	try {
		const res = await fetch("/static/components/liquid-glass.svg");
		if (!res.ok) throw new Error("Failed to load SVG");
		const svg = new DOMParser().parseFromString(
			await res.text(),
			"image/svg+xml",
		).documentElement;
		document.head.appendChild(svg);
	} catch (err) {
		console.error("Liquid Glass: Failed to load SVG filters", err);
	}
})();
