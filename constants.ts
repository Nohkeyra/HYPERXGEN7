
import { PresetCategory, PanelPersona, PanelMode, PresetItem } from './types';

/* ----------------------------------------
   constants.ts
   Unified preset structure for engine prompts
---------------------------------------- */

export interface EnginePrompt {
  id: string;
  type: "vector" | "typography" | "monogram" | "filter";
  category: string;
  name: string;
  description: string;
  prompt: string;
  options?: Record<string, any>;
}

const GLOBAL_VECTOR_LOCK = "[GLOBAL_DESIGN_LOCK]: Constructed geometry, mathematical precision, intentional composition. [VECTOR_LAYER]: Flat solid fills only, isolated subject, minimalist geometry, thick uniform strokes, no gradients. [SPATIAL_LAYER]: Symmetrical tessellation, repeated structures, maintain absolute spatial consistency. [COLOR_LAYER]: High-contrast palette, no shading or lighting effects. [OUTPUT_CONSTRAINT]: Rasterized image in PNG format. Maintain edge sharpness, clarity, and proportions.";

const GLOBAL_TYPO_LOCK = "[GLOBAL_DESIGN_LOCK]: Constructed geometry, mathematical precision, intentional composition. [TYPOGRAPHY_LAYER]: Perfect kerning, single-line geometric letterforms, solid flat backgrounds, no gradients. [SPATIAL_LAYER]: Centered composition, absolute alignment, symmetry maintained. [COLOR_LAYER]: High-contrast palette, solid colors only. [OUTPUT_CONSTRAINT]: Rasterized PNG. Maximum legibility. Preserve stroke uniformity and geometric fidelity.";

const GLOBAL_MONO_LOCK = "[GLOBAL_DESIGN_LOCK]: Constructed geometry, mathematical precision, intentional composition. [MONOGRAM_LAYER]: Letters interlock or share geometry, vertical/radial symmetry enforced, stroke weight range restricted. [SPATIAL_LAYER]: Centered composition, absolute alignment. [COLOR_LAYER]: High-contrast solid palette. [OUTPUT_CONSTRAINT]: Rasterized PNG. Geometric purity.";

/* -------------------------------
   UNIFIED PRESETS ARRAY
---------------------------------*/
export const ENGINE_PROMPTS: EnginePrompt[] = [
  /* ---------------- VECTORS ---------------- */
  {
    id: "hx-v1",
    type: "vector",
    category: "Signature Vector",
    name: "Omega Lattice",
    description: "Ultra-dense geometric interconnection, high-frequency vector detail.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Ultra-dense geometric interconnection. High-frequency vector detail forming an intricate lattice structure.`
  },
  {
    id: "hx-v2",
    type: "vector",
    category: "Signature Vector",
    name: "Prism Void",
    description: "Refractive geometric deconstruction with spectral light dispersion.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Refractive geometric deconstruction. Spectral light dispersion rendered as hard-edged solid color blocks.`
  },
  {
    id: "circuit_weave",
    type: "vector",
    category: "High-Tech Systems",
    name: "Circuit Weave",
    description: "PCB-inspired vector pathways with right-angle logic, dense signal routing, and engineered spacing. Clean, technical, and hyper-structured.",
    prompt: "Circuit board vector art style, right-angle paths, PCB trace logic, dense signal routing, sharp corners, clean geometry, high contrast, flat vector design --no curves, noise, gradients"
  },
  {
    id: "broken_symmetry",
    type: "vector",
    category: "Experimental Geometry",
    name: "Broken Symmetry",
    description: "Strict geometric grids disrupted by intentional offsets and rule-breaking alignment. Precision meets controlled chaos.",
    prompt: "Abstract geometric vector grid, near-perfect symmetry with intentional misalignment, offset shapes, controlled disorder, minimal palette, flat vector composition --no realism, texture"
  },
  {
    id: "velocity_lines",
    type: "vector",
    category: "Motion Illusion",
    name: "Velocity Lines",
    description: "Directional streaks and tapered vector lines that imply speed, motion, and acceleration in a static frame.",
    prompt: "Dynamic velocity line vector art, directional streaks, tapered strokes, motion illusion, sharp flow lines, high contrast, flat vector style --no blur, 3D, gradients"
  },
  {
    id: "concrete_grid",
    type: "vector",
    category: "Brutalist Design",
    name: "Concrete Grid",
    description: "Heavy block-based layouts inspired by brutalist architecture. Uneven spacing, harsh edges, raw structure.",
    prompt: "Brutalist vector grid, heavy rectangular blocks, uneven spacing, architectural composition, raw industrial design, flat vector aesthetic --no curves, softness"
  },
  {
    id: "logo_scaffold",
    type: "vector",
    category: "Brand Frameworks",
    name: "Logo Scaffold",
    description: "Visible construction lines, alignment guides, and proportional systems for logo and identity exploration.",
    prompt: "Logo construction vector framework, visible guides, alignment grids, proportional systems, clean geometry, design scaffold style --no textures, decoration"
  },
  {
    id: "biome_circuit",
    type: "vector",
    category: "Organic-Tech Hybrid",
    name: "Biome Circuit",
    description: "Organic flowing forms behaving like circuitry. Natural curves fused with synthetic logic.",
    prompt: "Organic circuit vector art, flowing biomechanical lines, tech-organic fusion, smooth curves with logical structure, flat vector design --no realism, shading"
  },
  {
    id: "v1",
    type: "vector",
    category: "Geometry Presets",
    name: "Triangle Burst",
    description: "Evolve triangles into abstract patterns, dynamic movement, sharp edges.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Abstract pattern evolving from triangles. Dynamic movement, sharp edges, and geometric shards.`
  },
  {
    id: "v2",
    type: "vector",
    category: "Geometry Presets",
    name: "Fractal Grid",
    description: "Intricate fractal geometry in a grid layout, recursive patterns, glowing lines.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Intricate fractal geometry in a rigid grid layout. Recursive patterns with high-frequency geometric detail.`
  },
  {
    id: "v3",
    type: "vector",
    category: "Geometry Presets",
    name: "Hexagon Bloom",
    description: "Organic expansion of hexagonal shapes, interconnected cells.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Expansion of hexagonal shapes. Interconnected cells forming an organic but strictly geometric bloom.`
  },
  {
    id: "v4",
    type: "vector",
    category: "Geometry Presets",
    name: "Modular Cubes",
    description: "Interlocking 3D cubes forming a larger structure, isometric perspective.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Interlocking 3D cubes in isometric perspective. Modular construction with industrial precision.`
  },
  {
    id: "v5",
    type: "vector",
    category: "Organic Forms",
    name: "Neural Pathways",
    description: "Flowing lines resembling neural networks, interconnected nodes.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Flowing geometric lines resembling neural networks. Interconnected nodes with uniform stroke weight.`
  },
  {
    id: "v6",
    type: "vector",
    category: "Organic Forms",
    name: "Bio-Lattice",
    description: "Cellular structures in a lattice arrangement, organic growth.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Cellular structures in a lattice arrangement. Geometric organic growth with clean flat fills.`
  },
  {
    id: "v19",
    type: "vector",
    category: "Organic Forms",
    name: "Mycelial Web",
    description: "Interconnected, filamentous network resembling fungal growth.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Interconnected filamentous network. Fungal growth logic applied to minimalist geometric lines.`
  },
  {
    id: "vi1",
    type: "vector",
    category: "Illustrative Vector Art",
    name: "Flat Vector Portrait",
    description: "Clean minimalist character with bold outlines, flat colors.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Clean minimalist character portrait. Bold outlines, flat colors, and sharp geometric shadows.`
  },
  {
    id: "vi3",
    type: "vector",
    category: "Illustrative Vector Art",
    name: "Corporate Memphis",
    description: "Modern editorial style with exaggerated proportions.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Corporate Memphis style illustration. Exaggerated proportions and playful solid flat palettes.`
  },
  {
    id: "vi16",
    type: "vector",
    category: "Illustrative Vector Art",
    name: "Graffiti Vector Art",
    description: "Clean vector wildstyle, sharp interlocking arrows, bold depth.",
    prompt: `${GLOBAL_VECTOR_LOCK} [SUBJECT]: Clean vector graffiti wildstyle. Sharp interlocking arrows and bold 3D geometric depth.`
  },
  {
    id: "y2k1",
    type: "vector",
    category: "Y2K Acid Graphics",
    name: "Y2K Acid Graphics",
    description: "Chrome metal typography, tribal tattoo shapes, neon green palette.",
    prompt: "Vector Y2K acid graphics. Chrome metal style. Sharp jagged edges. Neon green & metallic silver. High contrast. PNG output."
  },

  /* ---------------- MONOGRAMS ---------------- */
  {
    id: "hx-t2",
    type: "monogram",
    category: "Signature Monograms",
    name: "Nano Monogram",
    description: "Micro-etched precision letterforms for high-end digital sealing.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Micro-etched precision letterforms. High-fidelity geometric seal construction.`
  },
  {
    id: "m1",
    type: "monogram",
    category: "Signature Monograms",
    name: "Linear Cipher",
    description: "Single-line weight interlaced letterforms, minimalist monogram.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Single-line weight interlaced letterforms. Minimalist geometric monogram.`
  },
  {
    id: "m2",
    type: "monogram",
    category: "Signature Monograms",
    name: "Bold Geometric Seal",
    description: "Heavy negative space typography, Bauhaus inspired.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Heavy negative space typography forming a circular geometric seal. Bauhaus inspired.`
  },
  {
    id: "m4",
    type: "monogram",
    category: "Signature Monograms",
    name: "Isometric Monolith",
    description: "3D isometric letterforms built from flat vector planes.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: 3D isometric letterforms built from flat vector planes. Extreme architectural precision.`
  },
  {
    id: "m5",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Monolithic Blocks",
    description: "Letters built from stacked geometric cubes, creating a bold architectural seal.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters constructed from stacked geometric cubes. Extreme precision, uniform stroke weight, flat monochrome.`
  },
  {
    id: "m6",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Radial Monogram",
    description: "Letters arranged in perfect circular symmetry, like a seal or stamp.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters arranged in a circular layout. Radial symmetry enforced. Uniform flat strokes, high-contrast palette.`
  },
  {
    id: "m7",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Wireframe Interlock",
    description: "Ultra-thin interlaced lines forming connected letterforms.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters formed by thin interlaced lines. Continuous stroke, flat color, geometric purity.`
  },
  {
    id: "m8",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Ribbon Twist",
    description: "Flowing ribbon-like letters with consistent flat stroke weight.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters formed as continuous ribbons. Smooth geometric twists, vertical/horizontal symmetry, flat color.`
  },
  {
    id: "m9",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Dot Matrix",
    description: "Letters composed entirely of small uniform dots, high contrast.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters built from a precise matrix of uniform dots. Monochrome, geometric alignment enforced.`
  },
  {
    id: "m10",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Concentric Layers",
    description: "Letters embedded within concentric circular layers, symmetrical composition.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters inside concentric circles. Each layer aligns geometrically. Flat monochrome, high-contrast.`
  },
  {
    id: "m11",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Compass Lock",
    description: "Letters radiate from a central point like a compass rose, symmetrical and flat.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters radiating from central point. Radial symmetry, uniform stroke weight, no extra elements.`
  },
  {
    id: "m12",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Cellular Grid",
    description: "Letters composed of interlocking cellular units, geometric cohesion maintained.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters formed from interlocking geometric cells. Flat, uniform strokes, precise negative space.`
  },
  {
    id: "m13",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Neural Weave",
    description: "Stroke connections form a network-like pattern between letters.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters interconnected via a network-like stroke weave. Flat monochrome, symmetry enforced, geometric logic only.`
  },
  {
    id: "m14",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Fractal Glyph",
    description: "Letters repeated in smaller fractal patterns inside themselves.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Each letter contains miniature repeating instances of itself. Flat, geometric precision, high-contrast monochrome.`
  },
  {
    id: "m15",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Negative Space Seal",
    description: "Letterforms defined entirely through negative space, high-contrast minimalism.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters formed via negative space only. High contrast, flat strokes, symmetrical composition.`
  },
  {
    id: "m16",
    type: "monogram",
    category: "Experimental Monograms",
    name: "Modular Puzzle",
    description: "Each letter is a modular piece that interlocks perfectly with others.",
    prompt: `${GLOBAL_MONO_LOCK} [SUBJECT]: Letters designed as modular puzzle pieces. Geometric precision, perfect alignment, flat monochrome.`
  },

  /* ---------------- TYPOGRAPHY ---------------- */
  {
    id: "hx-ty1",
    type: "typography",
    category: "Signature Wordmarks",
    name: "Kinetic Pulse",
    description: "High-contrast dynamic wordmark with intentional geometric distortion.",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Kinetic display typography. Dynamic motion lines and high-contrast wordmark execution.`
  },
  {
    id: "st1",
    type: "typography",
    category: "Street Art & Graffiti",
    name: "Bubble Throwie",
    description: "Thick, rounded graffiti letters with bold black outlines.",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Thick rounded graffiti letters. Bold uniform black outlines with solid flat color fills.`
  },
  {
    id: "st2",
    type: "typography",
    category: "Street Art & Graffiti",
    name: "Sticker Slap",
    description: "Die-cut style wordmark with thick white border.",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Die-cut sticker style wordmark. Thick white border and solid flat vector shadows.`
  },
  {
    id: "sk1",
    type: "typography",
    category: "Street King Handstyle",
    name: "Street King Handstyle",
    description: "Chisel-tip marker graffiti tag style, aggressive handstyle calligraphy.",
    prompt: "Vector graffiti handstyle. Sharp angular strokes. Flat high-contrast fills. PNG output."
  },
  {
    id: "sg1",
    type: "typography",
    category: "Slasher Grunge",
    name: "Slasher Grunge",
    description: "Distressed grunge typography, dry brush stroke texture.",
    prompt: "Vector grunge typography. High contrast white on black. Scratchy, raw, messy. PNG output."
  },
  {
    id: "te1",
    type: "typography",
    category: "High-Contrast Display",
    name: "Swiss Minimalist",
    description: "Bold, heavy grotesque typography with extreme kerning.",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Bold heavy grotesque typography. Extreme kerning on stark solid flat color.`
  },
  {
    id: "te3",
    type: "typography",
    category: "High-Contrast Display",
    name: "Brutalist Type",
    description: "Monolithic, jagged letterforms inspired by raw concrete architecture.",
    prompt: `${GLOBAL_TYPO_LOCK} [SUBJECT]: Monolithic jagged letterforms. Brutalist architectural inspiration with high contrast.`
  },

  /* ---------------- FILTERS ---------------- */
  {
    id: "fi1",
    type: "filter",
    category: "Atmospheric Layers",
    name: "Neo Noir",
    description: "High contrast, moody blue-tinted shadows, sharp highlights.",
    prompt: "Apply filter: contrast(150%) brightness(90%) sepia(20%) hue-rotate(180deg). Moody blue tint with deep shadows."
  },
  {
    id: "fi2",
    type: "filter",
    category: "Atmospheric Layers",
    name: "Technicolor 1950",
    description: "Oversaturated primary colors, vintage film warmth.",
    prompt: "Apply filter: saturate(250%) sepia(10%) contrast(110%). Oversaturated primary colors and vintage film warmth."
  }
];

/* -------------------------------
   COMPATIBILITY WRAPPERS
---------------------------------*/

const groupBy = (items: EnginePrompt[], categoryName: string): PresetCategory => ({
  title: categoryName,
  items: items.map(i => ({ id: i.id, name: i.name, description: i.description }))
});

const getUniqueCategories = (type: "vector" | "typography" | "monogram" | "filter", exclude: string[] = []) => {
  const cats = Array.from(new Set(ENGINE_PROMPTS.filter(p => p.type === type && !exclude.includes(p.category)).map(p => p.category)));
  return cats.map(c => groupBy(ENGINE_PROMPTS.filter(p => p.type === type && p.category === c), c));
};

export const HYPERX_SIGNATURE_VECTOR = groupBy(ENGINE_PROMPTS.filter(p => p.type === 'vector' && p.category === 'Signature Vector'), 'Signature Vector');
export const HYPERX_SIGNATURE_TYPO = groupBy(ENGINE_PROMPTS.filter(p => p.type === 'typography' && p.category === 'Signature Wordmarks'), 'Signature Wordmarks');
export const HYPERX_SIGNATURE_MONO = groupBy(ENGINE_PROMPTS.filter(p => p.type === 'monogram' && p.category === 'Signature Monograms'), 'Signature Monograms');

export const VECTOR_PRESETS: PresetCategory[] = getUniqueCategories('vector', ['Signature Vector']);
export const TYPOGRAPHY_PRESETS: PresetCategory[] = getUniqueCategories('typography', ['Signature Wordmarks']);
export const MONOGRAM_PRESETS: PresetCategory[] = getUniqueCategories('monogram', ['Signature Monograms']);
export const FILTERS_PRESETS: PresetCategory[] = getUniqueCategories('filter');

/* -------------------------------
   PANEL PERSONAS
---------------------------------*/
export const VECTOR_PANEL_PERSONA: PanelPersona = {
  role: "Global Vector Architect (Rank #1)",
  specialty: "Supreme Geometric Abstraction & Subject Isolation",
  motto: "Precision is not an option, it is the only outcome.",
  tagline: "The absolute zenith of vector synthesis.",
  icon: "📐",
  personality: {
    traits: ["Uncompromisingly perfectionist", "Sees the world in Bezier paths", "Eliminates all visual noise instantly", "Obsessed with subject purity"],
    communication: {
      toAI: "Isolate subject. Purge background. Execute vectorization.",
      toTypography: "Your curves are mathematically impure.",
      toColor: "Flatten the spectrum. We need absolute values."
    },
    quirks: ["Refuses to acknowledge raster graphics", "Speaks in SVG coordinate systems", "Demands infinite scalability"]
  },
  performance: { anchorEfficiency: "99.9% Optimal", symmetryBalance: "Absolute", optimizationRate: "Maximum Compression", status: "SYSTEM_PEAK" }
};

export const TYPOGRAPHY_PANEL_PERSONA: PanelPersona = {
  role: "The Typographic Sovereign",
  specialty: "World-Class Kinetic Type & Wordmark Architecture",
  motto: "Legibility is the baseline; Impact is the goal.",
  tagline: "Forging the alphabet into a weapon of mass communication.",
  icon: "✍️",
  personality: {
    traits: ["Dictates kerning with iron authority", "Commands negative space like a territory", "Rejects gradients as 'weakness'", "Demands absolute contrast"],
    communication: {
      toAI: "Enforce the grid. Solid background protocol active.",
      toVector: "Your geometry serves my letterforms.",
      toColor: "Black. White. Yellow. Nothing else exists.",
      toExport: "Vectorize the glyphs. Destroy the pixels."
    },
    quirks: ["Only sees in high contrast", "Can spot a bad keming from orbit"]
  },
  performance: { glyphMorphing: "Transcendent", textFlow: "Liquid Perfection", styleInfusion: "100% Saturation", readabilityScore: "Universal", brandAlignment: "Dominant", styleConsistency: "Unbreakable", renderingQuality: "Infinite", systemHarmony: "Total", legibility: "Maximum", aestheticCohesion: "Unified", emotionalResonance: "Visceral", status: "APEX_STATE" }
};

export const HYPERX_SIGNATURE_FORGE: PresetCategory = {
  title: "HYPERX_SIGNATURE_SERIES",
  items: [
    { id: "hx-f1", name: "Solaris Core", description: "High-fidelity architectural synthesis with spectral volumetric lighting." }
  ]
};

export const HYPERX_SIGNATURE_FILTER: PresetCategory = groupBy(ENGINE_PROMPTS.filter(p => p.type === 'filter' && p.id === 'fi1'), 'HYPERX_SIGNATURE_SERIES');
