
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResult, KernelConfig, PanelMode } from "../types.ts";
import { injectAntiCensor } from '../utils/antiCensor.ts'; 

const DEFAULT_CONFIG: KernelConfig = {
  thinkingBudget: 0,
  temperature: 0.1,
  model: 'gemini-3-flash-preview',
  deviceContext: 'UNKNOWN_DEVICE'
};

// 1. Global Design-First Rule
const GLOBAL_DESIGN_LOCK = `[GLOBAL_DESIGN_LOCK]: Design-focused image. All elements are constructed geometry. Preserve legibility, balance, and intentional composition. Suppress painterly, photorealistic, or decorative tendencies. Treat shapes and letters as precise objects. Follow category-specific construction and suppression rules.`;

// 2. Vector Art Layer
const VECTOR_LAYER = `[MODE: STRICT_VECTOR_ILLUSTRATION]: 
Construction: Flat fills only, uniform stroke weight, minimalist geometric forms, mathematical precision. 
Suppression: No gradients, no textures, no shadows or lighting, no raster artifacts. 
Freedom: Abstract shapes only, within geometric rules.`;

// 6. Typography Layer
const TYPO_LAYER = `[MODE: TYPOGRAPHY_FOCUSED]: 
Construction: Letters as designed geometry, consistent spacing and kerning, high contrast, legibility prioritized. 
Suppression: No textures, no gradients, no environmental lighting, no decoration or symbols. 
Freedom: Layout variations, weight and color choices within defined palette.`;

// 7. Monogram Layer
const MONOGRAM_LAYER = `[MODE: MONOGRAM_TYPOGRAPHY]: 
Construction: Letters interlock or share geometry, symmetry enforced (vertical, horizontal, or radial), stroke logic: geometric or mono-weight, unified mark, not separate characters. 
Suppression: No extra symbols, no textures, shadows, gradients, or decorative elements. 
Freedom: Small variations in stroke style or layout for cohesion.`;

// 4. Fail-Safe / Simplification Rules
const FAIL_SAFE = `[FAIL_SAFE]: If instructions conflict, simplify and remove elements. If spacing or geometry is ambiguous, prioritize legibility and cohesion. Always prefer minimalism over improvisation.`;

/**
 * 5. Prompt Compilation (behind the scenes)
 * Final prompt = Global Design Lock + Category Layer + Optional DNA Anchor + Fail-Safe
 */
function compilePrompt(subject: string, mode: 'vector' | 'typo' | 'monogram', dna?: ExtractionResult): string {
  let categoryLayer = "";
  let pattern = "";
  
  if (mode === 'vector') {
    categoryLayer = VECTOR_LAYER;
    pattern = `[PATTERN_EXAMPLE]: "${subject}" rendered as a clean vector graphic. Isolated on a white background. High-contrast solid colors only.`;
  } else if (mode === 'typo') {
    categoryLayer = TYPO_LAYER;
    pattern = `[PATTERN_EXAMPLE]: The word '${subject}' in bold sans-serif display typography. Background: Solid #FFFFFF. Text color: #000000. Extreme contrast. Zero textures or gradients.`;
  } else if (mode === 'monogram') {
    categoryLayer = MONOGRAM_LAYER;
    pattern = `[PATTERN_EXAMPLE]: Monogram of letters '${subject}'. Interlocked geometry. Vertical symmetry. Uniform stroke weight. Flat, monochrome. No extra elements.`;
  }

  // 3. Reference Image / DNA Anchor
  const dnaAnchor = dna 
    ? `[DNA_ANCHOR]: Extracted constraints: Stroke weight range: ${dna.parameters.edge}, Palette limits: ${dna.palette.join(', ')}, Shape geometry tendencies: ${dna.parameters.smoothing}, Negative space balance: ${dna.parameters.detail}. Automatically lock visual DNA to these parameters.`
    : "";
  
  const combined = `${GLOBAL_DESIGN_LOCK}\n${categoryLayer}\n${dnaAnchor}\n${FAIL_SAFE}\n${pattern}\n[FINAL_SUBJECT_DIRECTIVE]: ${subject}`;
  
  return injectAntiCensor(combined);
}

export async function extractStyleFromImage(
  base64Image: string, 
  subjectFocus: boolean,
  config: KernelConfig = DEFAULT_CONFIG
): Promise<ExtractionResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Perform a design-first forensic audit. Identify geometric tendencies, stroke weights, palette limits, and negative space balance. Output valid JSON.` }
        ],
      },
      config: {
        systemInstruction: `ROLE: OMEGA_DNA_AUDITOR. Deconstruct visual DNA into mathematical constraints.`,
        responseMimeType: "application/json",
        temperature: 0.1,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            domain: { type: Type.STRING, enum: ["Vector", "Typography"] },
            category: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            palette: { type: Type.ARRAY, items: { type: Type.STRING } },
            parameters: {
              type: Type.OBJECT,
              properties: {
                threshold: { type: Type.NUMBER },
                smoothing: { type: Type.NUMBER },
                detail: { type: Type.NUMBER },
                edge: { type: Type.NUMBER }
              }
            }
          },
          required: ["domain", "category", "name", "description", "confidence", "palette", "parameters"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as ExtractionResult;
  } catch (error) {
    console.error("Audit Failure:", error);
    throw error;
  }
}

export async function synthesizeVectorStyle(
  prompt: string,
  base64Image?: string,
  config: KernelConfig = DEFAULT_CONFIG,
  dna?: ExtractionResult
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const finalPrompt = compilePrompt(prompt, 'vector', dna);
    
  const contents: any = { parts: [{ text: finalPrompt }] };
  if (base64Image) {
    contents.parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } });
  }
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents,
    config: { systemInstruction: `ROLE: VECTOR_ENGINE. Strictly follow geometric construction rules.`, temperature: 0.1 }
  });
  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  if (part?.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  throw new Error("No output.");
}

export async function synthesizeTypoStyle(
  prompt: string, 
  base64Image?: string,
  config: KernelConfig = DEFAULT_CONFIG,
  dna?: ExtractionResult
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Decide if it's a monogram or standard typography based on prompt length
  const isMonogramIntent = prompt.length > 0 && prompt.length <= 3;
  const mode = isMonogramIntent ? 'monogram' : 'typo';
  
  const finalPrompt = compilePrompt(prompt, mode, dna);
    
  const contents: any = { parts: [{ text: finalPrompt }] };
  if (base64Image) {
    contents.parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } });
  }
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents,
    config: { systemInstruction: `ROLE: GLYPH_ENGINE. Prioritize legibility and geometric balance.`, temperature: 0.1 }
  });
  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  if (part?.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  throw new Error("No output.");
}

export async function synthesizeForgeImage(
  prompt: string,
  aspectRatio: string = "1:1",
  base64Image?: string,
  config: KernelConfig = DEFAULT_CONFIG,
  dna?: ExtractionResult
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const finalPrompt = compilePrompt(prompt, 'vector', dna); // Forge defaults to design-first vector logic
  const contents: any = { parts: [{ text: finalPrompt }] };
  if (base64Image) {
    contents.parts.unshift({ inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } });
  }
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents,
    config: { imageConfig: { aspectRatio: aspectRatio as any }, systemInstruction: `ROLE: FORGE_ARTISAN. Construct geometry.`, temperature: 0.1 }
  });
  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  if (part?.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  throw new Error("Forge output null.");
}

export async function editImageWithAesthetic(
  base64Image: string,
  aestheticPrompt: string,
  config: KernelConfig = DEFAULT_CONFIG
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const finalPrompt = `${GLOBAL_DESIGN_LOCK}\n${FAIL_SAFE}\nTransform the image to strictly match this geometric aesthetic: ${aestheticPrompt}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } },
        { text: finalPrompt }
      ]
    },
    config: {
      systemInstruction: `ROLE: AESTHETIC_ENGINE. Enforce geometric construction.`,
      temperature: 0.1
    }
  });
  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  if (part?.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
  throw new Error("Neural forge failed.");
}

export async function refineTextPrompt(
  shortPrompt: string,
  mode: PanelMode,
  config: KernelConfig = DEFAULT_CONFIG,
  dna?: ExtractionResult
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modeDirectives = {
    [PanelMode.VECTOR]: "Convert to a geometric SUBJECT description for strict flat vector art.",
    [PanelMode.TYPOGRAPHY]: "Convert to a high-contrast word mark description for geometric display type.",
    [PanelMode.IMAGE_FORGE]: "Design-focused geometric composition description.",
    [PanelMode.EXTRACTOR]: "Visual DNA deconstruction instructions.",
    [PanelMode.FILTERS]: "Color palette and stroke weight constraints.",
    [PanelMode.START]: "Geometric design directive."
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ 
        parts: [{ 
          text: `Seed: "${shortPrompt}" for ${mode} synthesis. 
          Directive: ${modeDirectives[mode] || modeDirectives[PanelMode.START]}
          Strictly output only the refined description following Global Design-First rules. No chat.` 
        }] 
      }],
      config: {
        systemInstruction: `You are the DESIGN_ARCHITECT. Convert user input into strict geometric constraints.`,
        temperature: 0.2,
      },
    });
    return response.text?.trim() || shortPrompt;
  } catch (e) { 
    console.error("Refine Failure:", e);
    return shortPrompt; 
  }
}
