
export interface EnginePrompt {
  id: string;
  type: "vector" | "typography" | "filter";
  category: string;
  name: string;
  description: string;
  prompt: string;
  options?: Record<string, any>;
}

const GLOBAL_VECTOR_LOCK = "[GLOBAL_DESIGN_LOCK]: Constructed geometry, mathematical precision, intentional composition. [VECTOR_LAYER]: Flat solid fills only, isolated subject, minimalist geometry, thick uniform strokes, no gradients. [SPATIAL_LAYER]: Symmetrical tessellation, repeated structures, maintain absolute spatial consistency. [COLOR_LAYER]: High-contrast palette, no shading or lighting effects. [OUTPUT_CONSTRAINT]: Rasterized image in PNG format. Maintain edge sharpness, clarity, and proportions.";

const GLOBAL_TYPO_LOCK = "[GLOBAL_DESIGN_LOCK]: Constructed geometry, mathematical precision, intentional composition. [TYPOGRAPHY_LAYER]: Perfect kerning, single-line geometric letterforms, solid flat backgrounds, no gradients. [SPATIAL_LAYER]: Centered composition, absolute alignment, symmetry maintained. [COLOR_LAYER]: High-contrast palette, solid colors only. [OUTPUT_CONSTRAINT]: Rasterized PNG. Maximum legibility. Preserve stroke uniformity and geometric fidelity.";

/**
 * VECTOR_ENGINE_PROMPTS
 * Maps presets to engine-ready geometric blueprints.
 */
export const VECTOR_ENGINE_PROMPTS: EnginePrompt[] = [
  // HYPERX SIGNATURE SERIES
  {
    id: "hx-v1",
    type: "vector",
    category: "HYPERX_SIGNATURE_SERIES",
    name: "Omega Lattice",
    description: "Ultra-dense geometric interconnection, high-frequency vector detail.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Ultra-dense geometric interconnection. High-frequency vector detail forming an intricate lattice structure.`
  },
  {
    id: "hx-v2",
    type: "vector",
    category: "HYPERX_SIGNATURE_SERIES",
    name: "Prism Void",
    description: "Refractive geometric deconstruction with spectral light dispersion.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Refractive geometric deconstruction. Spectral light dispersion rendered as hard-edged solid color blocks.`
  },
  // GEOMETRY PRESETS
  {
    id: "v1",
    type: "vector",
    category: "Geometry Presets",
    name: "Triangle Burst",
    description: "Evolve triangles into abstract patterns, dynamic movement, sharp edges",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Abstract pattern evolving from triangles. Dynamic movement, sharp edges, and geometric shards.`
  },
  {
    id: "v2",
    type: "vector",
    category: "Geometry Presets",
    name: "Fractal Grid",
    description: "Generate intricate fractal geometry in a grid layout, recursive patterns, glowing lines",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Intricate fractal geometry in a rigid grid layout. Recursive patterns with high-frequency geometric detail.`
  },
  {
    id: "v3",
    type: "vector",
    category: "Geometry Presets",
    name: "Hexagon Bloom",
    description: "Organic expansion of hexagonal shapes, interconnected cells, subtle geometric forms",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Expansion of hexagonal shapes. Interconnected cells forming an organic but strictly geometric bloom.`
  },
  {
    id: "v4",
    type: "vector",
    category: "Geometry Presets",
    name: "Modular Cubes",
    description: "Interlocking 3D cubes forming a larger structure, isometric perspective, industrial feel",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Interlocking 3D cubes in isometric perspective. Modular construction with industrial precision.`
  },
  {
    id: "v17",
    type: "vector",
    category: "Geometry Presets",
    name: "Polyhedral Swarm",
    description: "Dynamic cluster of interconnected polyhedra, crystalline structures, tessellating forms",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Cluster of interconnected polyhedra. Crystalline structures and tessellating geometric forms.`
  },
  {
    id: "v18",
    type: "vector",
    category: "Geometry Presets",
    name: "Voronoi Cell Grid",
    description: "Organic cell-like patterns forming intricate tessellations, interconnected nodes",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Voronoi cell patterns forming a grid. Interconnected nodes and geometric tessellations.`
  },
  // ORGANIC FORMS
  {
    id: "v5",
    type: "vector",
    category: "Organic Forms",
    name: "Neural Pathways",
    description: "Flowing lines resembling neural networks, interconnected nodes",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Flowing geometric lines resembling neural networks. Interconnected nodes with uniform stroke weight.`
  },
  {
    id: "v6",
    type: "vector",
    category: "Organic Forms",
    name: "Bio-Lattice",
    description: "Cellular structures in a lattice arrangement, organic growth, translucent layers",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Cellular structures in a lattice arrangement. Geometric organic growth with clean flat fills.`
  },
  {
    id: "v7",
    type: "vector",
    category: "Organic Forms",
    name: "Vortex Bloom",
    description: "Swirling organic vortex from a central point, dynamic energy, fluid motion",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Swirling geometric vortex. Dynamic energy and fluid motion rendered as flat vector paths.`
  },
  {
    id: "v8",
    type: "vector",
    category: "Organic Forms",
    name: "Crystal Growth",
    description: "Geodesic crystalline formations, sharp facets, geometric light effects",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Geodesic crystalline formations. Sharp facets and geometric light dispersion via solid color planes.`
  },
  {
    id: "v19",
    type: "vector",
    category: "Organic Forms",
    name: "Mycelial Web",
    description: "Interconnected, filamentous network resembling fungal growth, delicate patterns",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Interconnected filamentous network. Fungal growth logic applied to minimalist geometric lines.`
  },
  {
    id: "v20",
    type: "vector",
    category: "Organic Forms",
    name: "Radiolarian Symmetry",
    description: "Symmetrical, intricate micro-skeletal forms inspired by marine organisms",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Symmetrical intricate micro-skeletal forms. Marine-inspired radial geometry.`
  },
  // ILLUSTRATIVE VECTOR ART
  {
    id: "vi1",
    type: "vector",
    category: "Illustrative Vector Art",
    name: "Flat Vector Portrait",
    description: "Clean minimalist character with bold outlines, flat colors, geometric shadows",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Clean minimalist character portrait. Bold outlines, flat colors, and sharp geometric shadows.`
  },
  {
    id: "vi3",
    type: "vector",
    category: "Illustrative Vector Art",
    name: "Corporate Memphis",
    description: "Modern editorial style with exaggerated proportions, playful flat palettes",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Corporate Memphis style illustration. Exaggerated proportions and playful solid flat palettes.`
  },
  {
    id: "vi4",
    type: "vector",
    category: "Illustrative Vector Art",
    name: "Ligne Claire Flora",
    description: "Intricate botanical illustrations using clear, uniform line weights and solid color fills",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Intricate botanical illustration in Ligne Claire style. Uniform line weights and solid fills.`
  },
  {
    id: "vi13",
    type: "vector",
    category: "Illustrative Vector Art",
    name: "Futuristic Technical",
    description: "Isometric technical illustration, clean blue-line blueprints, industrial precision",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Isometric technical illustration. Clean blue-line blueprints with extreme industrial precision.`
  },
  {
    id: "vi14",
    type: "vector",
    category: "Illustrative Vector Art",
    name: "Minimalist Mascot",
    description: "Cute, rounded geometric character design, thick uniform lines, bold flat colors",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Cute rounded geometric mascot design. Thick uniform lines and bold solid colors.`
  },
  {
    id: "vi16",
    type: "vector",
    category: "Illustrative Vector Art",
    name: "Graffiti Vector Art",
    description: "Clean vector wildstyle, sharp interlocking arrows, bold 3D depth effects, high-vibrancy street aesthetic",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Clean vector graffiti wildstyle. Sharp interlocking arrows and bold 3D geometric depth.`
  },
  // ABSTRACT PATTERNS
  {
    id: "v9",
    type: "vector",
    category: "Abstract Patterns",
    name: "Circuit Warp",
    description: "Distorted circuit board patterns, digital glitch effects, data flow visualization",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Distorted circuit board patterns. Digital glitch effects and geometric data flow visualization.`
  },
  {
    id: "v10",
    type: "vector",
    category: "Abstract Patterns",
    name: "Sonic Wave",
    description: "Abstract sound waves visualized, rhythmic patterns, energetic pulse",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Abstract sound waves visualized as rhythmic geometric patterns. Energetic pulse.`
  },
  {
    id: "v11",
    type: "vector",
    category: "Abstract Patterns",
    name: "Kinetic Ribbons",
    description: "Interweaving, flowing ribbons in dynamic motion, fluid abstract art",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Interweaving geometric ribbons in dynamic motion. Fluid abstract vector art.`
  },
  {
    id: "v21",
    type: "vector",
    category: "Abstract Patterns",
    name: "Runic Glyphs",
    description: "Ancient, stylized symbols arranged in an abstract pattern, mystical and cryptographic feel",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Ancient stylized symbols arranged in a cryptographic geometric pattern.`
  },
  {
    id: "v22",
    type: "vector",
    category: "Abstract Patterns",
    name: "Halftone Cascade",
    description: "Dot patterns cascading and evolving, creating abstract gradients and transitions",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Halftone dot patterns cascading and evolving. Geometric transitions using solid dots.`
  },
  // ADVANCED KINETIC FORMS
  {
    id: "v13",
    type: "vector",
    category: "Advanced Kinetic Forms",
    name: "Cyber-Chrysalis",
    description: "Interlocking transparent layers forming futuristic organic shell, luminous edges",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Interlocking transparent geometric layers. Futuristic organic shell with luminous solid edges.`
  },
  {
    id: "v15",
    type: "vector",
    category: "Advanced Kinetic Forms",
    name: "Kinetic Distortion",
    description: "Geometric shapes in motion, simulating high-speed warp, streaking lights, energy trails",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Geometric shapes in motion simulating a high-speed warp. Energy trails and streaking lines.`
  },
  {
    id: "v23",
    type: "vector",
    category: "Advanced Kinetic Forms",
    name: "Gravitational Ripple",
    description: "Concentric waves of distortion emanating from a central point, spacetime bending, subtle energy fields",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Concentric geometric waves of distortion. Spacetime bending visualization with subtle energy fields.`
  },
  {
    id: "v24",
    type: "vector",
    category: "Advanced Kinetic Forms",
    name: "Ephemeral Bloom",
    description: "Flowing particle effects forming an unfolding organic shape, delicate and fleeting beauty",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Unfolding organic shape formed by geometric particle effects. Fleeting beauty.`
  }
];

/**
 * TYPOGRAPHY_ENGINE_PROMPTS
 * Maps presets to engine-ready typographic blueprints.
 */
export const TYPOGRAPHY_ENGINE_PROMPTS: EnginePrompt[] = [
  // STREET ART & GRAFFITI
  {
    id: "st1",
    type: "typography",
    category: "Street Art & Graffiti",
    name: "Bubble Throwie",
    description: "Thick, rounded graffiti letters with bold black outlines and flat color fills, no background",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Thick rounded graffiti letters. Bold uniform black outlines with solid flat color fills.`
  },
  {
    id: "st2",
    type: "typography",
    category: "Street Art & Graffiti",
    name: "Sticker Slap",
    description: "Die-cut style wordmark with thick white border and flat vector shadows, high-contrast flat background",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Die-cut sticker style wordmark. Thick white border and solid flat vector shadows.`
  },
  {
    id: "st3",
    type: "typography",
    category: "Street Art & Graffiti",
    name: "Wildstyle Burner",
    description: "Intricate, sharp-edged graffiti arrows and interlocking letterforms, flat color blocks, urban aesthetic",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Intricate sharp-edged graffiti. Interlocking letterforms and solid color blocks.`
  },
  {
    id: "st4",
    type: "typography",
    category: "Street Art & Graffiti",
    name: "Stencil Core",
    description: "Sharp, minimalist stencil-cut letterforms, high-contrast two-tone flat color execution",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Sharp minimalist stencil-cut letters. High-contrast two-tone execution.`
  },
  {
    id: "st5",
    type: "typography",
    category: "Street Art & Graffiti",
    name: "Marker Scrawl",
    description: "Raw, energetic permanent marker aesthetic, thick inconsistent lines, flat white or gray background",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Raw energetic marker scrawl. Thick uniform lines on a stark solid background.`
  },
  // SIGNATURE MONOGRAMS
  {
    id: "m1",
    type: "typography",
    category: "Signature Monograms",
    name: "Linear Cipher",
    description: "Single-line weight interlaced letterforms, minimalist geometric monogram on a flat background",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Single-line weight interlaced letterforms. Minimalist geometric monogram.`
  },
  {
    id: "m2",
    type: "typography",
    category: "Signature Monograms",
    name: "Bold Geometric Seal",
    description: "Heavy negative space typography forming circular or square emblem, Bauhaus inspired, flat color",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Heavy negative space typography forming a circular geometric seal. Bauhaus inspired.`
  },
  {
    id: "m3",
    type: "typography",
    category: "Signature Monograms",
    name: "Modernist Script",
    description: "Elegant, continuous monoline script, smooth vector curves, centered on solid flat color",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Elegant continuous monoline script. Smooth vector curves on a flat background.`
  },
  {
    id: "m4",
    type: "typography",
    category: "Signature Monograms",
    name: "Isometric Monolith",
    description: "3D isometric letterforms built from flat vector planes, no gradients, architectural precision",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: 3D isometric letterforms built from flat vector planes. Extreme architectural precision.`
  },
  {
    id: "hx-t2-mono",
    type: "typography",
    category: "Signature Monograms",
    name: "Nano Monogram",
    description: "Micro-etched precision letterforms for high-end digital sealing",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Micro-etched precision letterforms. High-fidelity geometric seal construction.`
  },
  // ABSTRACT WORDMARKS
  {
    id: "t1",
    type: "typography",
    category: "Abstract Wordmarks",
    name: "Glitch Block",
    description: "Typography with clean digital glitch offsets and flat color bars, technical aesthetic, solid background",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Typography with digital glitch offsets. Solid color bars and technical geometric aesthetic.`
  },
  {
    id: "t2",
    type: "typography",
    category: "Abstract Wordmarks",
    name: "Liquid Vector",
    description: "Melting letterforms rendered as clean vector shapes with flat color fills, no environmental reflections",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Melting letterforms as clean vector shapes. Solid color fills with zero reflections.`
  },
  {
    id: "t3",
    type: "typography",
    category: "Abstract Wordmarks",
    name: "Circuit Etch",
    description: "Letterforms composed of 90-degree vector traces, glowing flat colors, technical blueprint style",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Letterforms composed of 90-degree vector traces. Technical blueprint style.`
  },
  // HIGH-CONTRAST DISPLAY
  {
    id: "te1",
    type: "typography",
    category: "High-Contrast Display",
    name: "Swiss Minimalist",
    description: "Bold, heavy grotesque typography with extreme kerning, centered on stark solid flat color",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Bold heavy grotesque typography. Extreme kerning on stark solid flat color.`
  },
  {
    id: "te2",
    type: "typography",
    category: "High-Contrast Display",
    name: "Retro Badge",
    description: "Stacked vector typography with offset flat shadows, 1970s design aesthetic, limited flat palette",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Stacked vector typography with flat offset shadows. 1970s design aesthetic.`
  },
  {
    id: "te3",
    type: "typography",
    category: "High-Contrast Display",
    name: "Brutalist Type",
    description: "Monolithic, jagged letterforms inspired by raw concrete architecture, high-contrast solid backgrounds",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Monolithic jagged letterforms. Brutalist architectural inspiration with high contrast.`
  }
];

/**
 * FILTER_ENGINE_PROMPTS
 * Rule: CSS-like instructions for neural transformation.
 */
export const FILTER_ENGINE_PROMPTS: EnginePrompt[] = [
  {
    id: "hx-fi1",
    type: "filter",
    category: "HYPERX_SIGNATURE_SERIES",
    name: "HyperX Vision",
    description: "High-contrast geometric transformation, spectral aberration, lattice enhancement.",
    prompt: "Apply filter: contrast(120%) saturate(140%) hue-rotate(5deg). Enhance geometric edges and sharpen spectral highlights."
  },
  {
    id: "fi1",
    type: "filter",
    category: "Atmospheric Layers",
    name: "Neo Noir",
    description: "High contrast, moody blue-tinted shadows, sharp highlights",
    prompt: "Apply filter: contrast(150%) brightness(90%) sepia(20%) hue-rotate(180deg). Moody blue tint with deep shadows."
  },
  {
    id: "fi2",
    type: "filter",
    category: "Atmospheric Layers",
    name: "Technicolor 1950",
    description: "Oversaturated primary colors, vintage film warmth",
    prompt: "Apply filter: saturate(250%) sepia(10%) contrast(110%). Oversaturated primary colors and vintage film warmth."
  },
  {
    id: "f-polaroid",
    type: "filter",
    category: "Analog Film Simulations",
    name: "Instant Classic",
    description: "Faded vintage instant film look, washed-out blacks, warm highlights",
    prompt: "Apply filter: contrast(80%) brightness(110%) saturate(85%) sepia(20%). Faded instant film aesthetic with warm highlights."
  },
  {
    id: "f-kodachrome",
    type: "filter",
    category: "Analog Film Simulations",
    name: "Chrome 64",
    description: "Rich, deep reds and yellows with high contrast",
    prompt: "Apply filter: contrast(140%) saturate(130%) hue-rotate(-5deg). Rich deep reds and high contrast chrome aesthetic."
  }
];
