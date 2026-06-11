#!/usr/bin/env node
/**
 * Generate AI logos for fictional utility organizations
 * Uses Google Gemini's image generation API
 *
 * Usage: node scripts/generate-logos.js [--type coop|iou|municipal|der] [--dry-run]
 *
 * Install dependencies first: npm install @google/genai
 */

const fs = require('fs');
const path = require('path');

// Only load Gemini SDK if not in dry-run mode
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');

let GoogleGenAI;
if (!isDryRun) {
  try {
    const genai = require('@google/genai');
    GoogleGenAI = genai.GoogleGenAI;
  } catch (e) {
    console.error('Error: @google/genai module not found. Install with: npm install @google/genai');
    process.exit(1);
  }
}

// Load organizations from data.js by parsing the file
const dataPath = path.join(__dirname, '../src/shared/data.js');
const dataContent = fs.readFileSync(dataPath, 'utf8');

// Extract ORGANIZATIONS array from the file
const orgMatch = dataContent.match(/const ORGANIZATIONS = \[([\s\S]*?)\];/);
if (!orgMatch) {
  console.error('Could not find ORGANIZATIONS in data.js');
  process.exit(1);
}

// Parse the organizations (simplified parsing)
const ORGANIZATIONS = [];
const orgLines = orgMatch[1].split('\n');
for (const line of orgLines) {
  const match = line.match(/\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*type:\s*'([^']+)'\s*\}/);
  if (match) {
    ORGANIZATIONS.push({ id: match[1], name: match[2], type: match[3] });
  }
}

console.log(`Loaded ${ORGANIZATIONS.length} organizations`);

// Style archetypes for co-ops (rotate through these)
const COOP_STYLE_ARCHETYPES = [
  {
    name: 'Mid-Century Badge',
    layout: 'Enclosed in a thick circular border or a shield shape with heavy slab-serif text.',
    vibe: '1950s-60s "Reliable"',
  },
  {
    name: '80s Geometric',
    layout: 'The icon is a sharp, abstract lightning bolt or a "Z" shape integrated into the text.',
    vibe: '1980s "High Tech"',
  },
  {
    name: 'Scenic Horizon',
    layout: 'A wide, landscape-oriented icon showing a sun rising over hills/trees above the text.',
    vibe: '1990s "Community"',
  },
  {
    name: 'Modern Monogram',
    layout: 'A thick, stylized lettermark (like an "E" or the first letter of the name) that incorporates a bolt.',
    vibe: '2000s "Modern"',
  },
];

// Natural and utility elements to combine
const NATURAL_ELEMENTS = ['hills', 'sun', 'trees', 'water', 'mountains', 'plains', 'river', 'valley'];
const UTILITY_ELEMENTS = ['lightning bolt', 'power lines', 'electric spark', 'transmission tower silhouette'];
const PRIMARY_COLORS = ['blue', 'green', 'orange', 'red', 'navy blue', 'forest green', 'golden yellow'];

// Build prompt for a co-op logo
function buildCoopPrompt(org, styleIndex) {
  const style = COOP_STYLE_ARCHETYPES[styleIndex % COOP_STYLE_ARCHETYPES.length];
  const naturalElement = NATURAL_ELEMENTS[Math.floor(Math.random() * NATURAL_ELEMENTS.length)];
  const utilityElement = UTILITY_ELEMENTS[Math.floor(Math.random() * UTILITY_ELEMENTS.length)];
  const primaryColor = PRIMARY_COLORS[Math.floor(Math.random() * PRIMARY_COLORS.length)];

  return `A professional logo for a US rural electric cooperative named "${org.name}". Use a ${style.name} design.

Layout & Graphics: ${style.layout} The icon should be a stylized ${naturalElement} combined with a ${utilityElement}.

Aesthetic: Clean vector lines, solid colors, professional utility branding. Avoid complex gradients. The logo should look like it belongs on a utility bill or a truck door.

Color Palette: Limited to 2 or 3 colors—predominantly ${primaryColor} with earth-tone accents.

Text: Only include the name "${org.name}" in the logo. Do not include any taglines, slogans, or other text.

Output: Square format with a transparent background. The logo should be a clean vector-style design suitable for use on any background color.`;
}

// Style archetypes for IOUs (investor-owned utilities) - realistic US utility branding
const IOU_STYLE_ARCHETYPES = [
  {
    name: 'Infra-Bold Wordmark',
    description: 'Pure typographic logo with heavy sans-serif wordmark. No icon or a very subtle typographic mark. Feels immovable and institutional.',
  },
  {
    name: 'Flow & Current',
    description: 'Abstract swooshes, waves, or parallel lines. Implies energy flow, transmission, or current. Rounded geometry, subtle motion cues.',
  },
  {
    name: 'Eco-Orb / Solar Spark',
    description: 'Circular or radial symbol. Suggests sun, grid hub, turbine, or clean energy. Balanced symmetry, restrained brightness.',
  },
  {
    name: 'Regional Legacy',
    description: 'Slightly older or heritage feel. May include shield, diamond, or structured geometric container. Evokes longevity and regional identity.',
  },
];

// Build prompt for IOU logos - realistic US utility style
function buildIOUPrompt(org, index) {
  const archetype = IOU_STYLE_ARCHETYPES[index % IOU_STYLE_ARCHETYPES.length];

  return `Create a corporate logo for a fictional U.S. investor-owned electric and gas utility named "${org.name}".

The logo must look completely believable if placed alongside real U.S. utility company logos (e.g., Duke Energy, PGE, Dominion, Exelon, Ameren, PPL, Xcel Energy).
It should feel regulated, institutional, conservative, and trustworthy, not playful, startup-like, or consumer-tech.

Core Style Constraints (MANDATORY)
- Industry tone: Essential infrastructure, public trust, long-term reliability, regulated monopoly
- Design era: Corporate utility branding from the late 1990s through today
- Overall feel: Safe, stable, serious, boring-in-a-good-way
- Avoid: gradients that feel "tech startup," mascots, illustrations, handwritten fonts, playful shapes, neon colors, novelty typography

Color System
Use a restrained, utility-standard palette:
- Dominant blue (navy to medium blue) for trust and reliability
- Optional green for sustainability or renewables
- Optional orange or red as a restrained accent for power, heat, or energy
- White or very light gray backgrounds

Colors should be flat or minimally shaded, suitable for signage, trucks, uniforms, and regulatory documents.

Typography
- Heavy or medium-weight sans-serif
- Prefer all-caps or small caps
- Slightly condensed or tightly kerned
- Feels like infrastructure, not marketing

Symbol & Structure
The logo may include:
- A wordmark only, OR
- A simple abstract symbol paired with the wordmark

The symbol should be geometric, abstract, and timeless, never illustrative.

Archetype: ${archetype.name}
${archetype.description}

Output Requirements
- Flat vector-style logo
- White or transparent background
- Suitable for use on utility trucks, hard hats, investor presentations, regulatory filings, and substation signage

The final logo should be visually interchangeable with real U.S. investor-owned utility logos and should not stand out as modern, playful, or experimental.`;
}

// Style archetypes for municipal utilities - civic/community feel
const MUNICIPAL_STYLE_ARCHETYPES = [
  {
    name: 'City Seal',
    layout: 'A circular or shield-shaped seal with the city/town name around the perimeter and a central icon representing the community (tree, building silhouette, landscape, or abstract civic symbol).',
    vibe: 'Official Municipal',
  },
  {
    name: 'Community Icon',
    layout: 'A friendly, approachable icon (stylized house with power lines, tree with electric symbol, sun/lightbulb) above or beside the utility name.',
    vibe: 'Friendly Public Service',
  },
  {
    name: 'Modern Municipal',
    layout: 'Clean, contemporary design with simple geometric shapes suggesting both community and energy. Minimal, professional typography.',
    vibe: 'Progressive City Services',
  },
  {
    name: 'Heritage Emblem',
    layout: 'A badge or emblem style incorporating local character—could include elements like mountains, water, or regional symbols with integrated power/light imagery.',
    vibe: 'Local Pride',
  },
];

// Build prompt for municipal utility logos
function buildMunicipalPrompt(org, index) {
  const style = MUNICIPAL_STYLE_ARCHETYPES[index % MUNICIPAL_STYLE_ARCHETYPES.length];
  const cityName = org.name.split(' ')[0]; // Extract city name

  return `A professional logo for a municipal electric utility named "${org.name}". Use a ${style.name} design.

Layout & Graphics: ${style.layout}

Aesthetic: This is a city-owned public utility serving the community of ${cityName}. The logo should feel civic, trustworthy, and community-oriented—like a well-run city department, not a faceless corporation. Think Austin Energy, LADWP, or Seattle City Light.

Color Palette: Blues, greens, or earth tones typical of municipal branding. Can include accent colors but keep it professional.

Text: Only include the name "${org.name}" in the logo. No taglines or slogans.

Output: Square format with a transparent background. The logo should be a clean vector-style design suitable for use on any background color.`;
}

// Style archetypes for DER/energy tech companies - modern tech startup feel
const DER_STYLE_ARCHETYPES = [
  {
    name: 'Tech Wordmark',
    layout: 'A clean, modern wordmark with custom typography. May include a subtle icon or symbol integrated into or replacing a letter.',
    vibe: 'Silicon Valley Startup',
  },
  {
    name: 'Abstract Tech Symbol',
    layout: 'A distinctive abstract symbol (connected nodes, flowing energy lines, stylized sun/battery) with clean sans-serif company name.',
    vibe: 'Clean Energy Innovation',
  },
  {
    name: 'Geometric Mark',
    layout: 'Bold geometric shapes (hexagon, circle segments, interlocking forms) suggesting connectivity and energy, paired with modern typography.',
    vibe: 'Smart Grid Tech',
  },
  {
    name: 'Gradient Icon',
    layout: 'A modern icon with subtle gradient or color transition, suggesting energy transformation or renewable sources.',
    vibe: 'Next-Gen Energy',
  },
];

// Build prompt for DER/tech company logos
function buildDERPrompt(org, index) {
  const style = DER_STYLE_ARCHETYPES[index % DER_STYLE_ARCHETYPES.length];

  return `A professional logo for a modern energy technology company named "${org.name}". Use a ${style.name} design.

Layout & Graphics: ${style.layout}

Aesthetic: This is a clean energy / distributed energy resources (DER) tech company. The logo should feel modern, innovative, and forward-looking—like Tesla, Sunrun, Enphase, or a Y Combinator energy startup. Clean, tech-forward, not traditional utility.

Color Palette: Modern tech palette—teals, bright greens, electric blues, solar oranges, or clean grays. Can use gradients sparingly.

Text: Only include the name "${org.name}" in the logo. No taglines or slogans.

Output: Square format with a transparent background. The logo should be a clean vector-style design suitable for use on any background color.`;
}

function buildPrompt(org, index) {
  switch (org.type) {
    case 'coop':
      return buildCoopPrompt(org, index);
    case 'iou':
      return buildIOUPrompt(org, index);
    case 'municipal':
      return buildMunicipalPrompt(org, index);
    case 'der':
      return buildDERPrompt(org, index);
    default:
      return buildCoopPrompt(org, index);
  }
}

async function generateLogo(client, org, index, outputDir) {
  const prompt = buildPrompt(org, index);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Generating logo for: ${org.name} (${org.id})`);
  console.log(`Type: ${org.type}`);
  console.log(`Prompt preview: ${prompt.substring(0, 150)}...`);

  try {
    // Use gemini-2.5-flash-image for fast, efficient logo generation
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        responseModalities: ['Text', 'Image'],
        imageConfig: {
          aspectRatio: '1:1', // Square logos
        },
      },
    });

    // Extract image from response - handle both response formats
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        const ext = mimeType.includes('png') ? 'png' : 'webp';

        const filename = `${org.id}.${ext}`;
        const filepath = path.join(outputDir, filename);

        const buffer = Buffer.from(imageData, 'base64');
        fs.writeFileSync(filepath, buffer);

        console.log(`✓ Saved: ${filepath} (${(buffer.length / 1024).toFixed(1)} KB)`);
        return { success: true, filepath };
      }
    }

    console.log(`✗ No image in response for ${org.name}`);
    console.log('Response:', JSON.stringify(response, null, 2).substring(0, 500));
    return { success: false, error: 'No image in response' };
  } catch (error) {
    console.error(`✗ Error generating ${org.name}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const typeFilter = args.find(a => a.startsWith('--type='))?.split('=')[1];

  // Filter organizations by type if specified
  let orgs = ORGANIZATIONS;
  if (typeFilter) {
    orgs = ORGANIZATIONS.filter(o => o.type === typeFilter);
    console.log(`Filtered to ${orgs.length} ${typeFilter} organizations`);
  }

  if (dryRun) {
    console.log('\n=== DRY RUN - Showing prompts only ===\n');
    orgs.forEach((org, i) => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`${org.id}: ${org.name} (${org.type})`);
      console.log(`${'='.repeat(60)}`);
      console.log(buildPrompt(org, i));
    });
    return;
  }

  // Initialize Gemini client
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Error: GOOGLE_GEMINI_API_KEY or GEMINI_API_KEY environment variable not set');
    process.exit(1);
  }

  const client = new GoogleGenAI({ apiKey });

  // Create output directory
  const outputDir = path.join(__dirname, '../src/shared/logos');
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`\nGenerating logos for ${orgs.length} organizations...`);
  console.log(`Output directory: ${outputDir}`);

  const results = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < orgs.length; i++) {
    const org = orgs[i];
    const result = await generateLogo(client, org, i, outputDir);

    if (result.success) {
      results.success++;
    } else {
      results.failed++;
      results.errors.push({ org: org.name, error: result.error });
    }

    // Rate limiting - wait between requests
    if (i < orgs.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('GENERATION COMPLETE');
  console.log(`${'='.repeat(60)}`);
  console.log(`Success: ${results.success}`);
  console.log(`Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(e => console.log(`  - ${e.org}: ${e.error}`));
  }
}

main().catch(console.error);
