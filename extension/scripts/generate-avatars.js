#!/usr/bin/env node
/**
 * Curtain Avatar Generation Script
 *
 * Generates AI avatar images using Google Gemini for the Curtain PII masking extension.
 * See specs/curtain-pii-masking/ai-avatar-assets.md for full documentation.
 *
 * Usage:
 *   node generate-avatars.js --sample          # Generate ~20 sample images for validation
 *   node generate-avatars.js --full            # Generate full batch (~450 images)
 *   node generate-avatars.js --bucket female_light --count 5   # Generate specific bucket
 *
 * Environment:
 *   GOOGLE_API_KEY - Required. Your Google AI API key.
 *
 * Output:
 *   Images are saved to tools/curtain/scripts/output/raw/{bucket}/
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CONFIG = {
  model: 'gemini-2.5-flash-image',  // Gemini with native image generation
  outputDir: path.join(__dirname, 'output', 'raw'),
};

// Avatar bucket definitions (3 genders x 3 appearances = 9 buckets)
const BUCKETS = {
  female_light: { gender: 'female', appearance: 'light', targetCount: 47 },
  female_medium: { gender: 'female', appearance: 'medium', targetCount: 47 },
  female_dark: { gender: 'female', appearance: 'dark', targetCount: 40 },
  male_light: { gender: 'male', appearance: 'light', targetCount: 47 },
  male_medium: { gender: 'male', appearance: 'medium', targetCount: 47 },
  male_dark: { gender: 'male', appearance: 'dark', targetCount: 40 },
  neutral_light: { gender: 'neutral', appearance: 'light', targetCount: 10 },
  neutral_medium: { gender: 'neutral', appearance: 'medium', targetCount: 10 },
  neutral_dark: { gender: 'neutral', appearance: 'dark', targetCount: 9 },
};

// Gender presentation descriptions for prompts
const GENDER_DESCRIPTIONS = {
  female: 'woman',
  male: 'man',
  neutral: 'person with androgynous features',
};

// Variety options for realistic energy company customers
const BACKGROUNDS = [
  'modern kitchen with natural light',
  'cozy living room',
  'home office with bookshelf',
  'backyard patio',
  'front porch of a house',
  'garage workshop',
  'sunny garden',
  'bright dining area',
  'suburban neighborhood street',
  'local park with trees',
  'driveway next to car',
  'hiking trail outdoors',
  'beach boardwalk',
  'farmers market',
  'coffee shop patio',
  'city sidewalk',
  'backyard with fence',
  'near a window indoors',
];

const ATTIRE = [
  'casual t-shirt',
  'comfortable sweater',
  'button-down shirt',
  'polo shirt',
  'casual blouse',
  'flannel shirt',
  'light cardigan',
  'simple hoodie',
  'everyday casual clothes',
  'relaxed weekend attire',
];

const HAIR_STYLES = {
  female: ['long straight hair', 'short bob', 'curly hair', 'wavy shoulder-length hair', 'pixie cut', 'hair in a ponytail', 'braided hair', 'natural textured hair', 'long wavy hair', 'medium layered hair'],
  male: ['short cropped hair', 'slightly longer wavy hair', 'bald', 'buzz cut', 'receding hairline', 'curly hair', 'slicked back hair', 'natural textured hair', 'crew cut', 'messy casual hair'],
  neutral: ['short stylish hair', 'medium length hair', 'curly hair', 'wavy hair', 'natural textured hair', 'undercut style'],
};

const HAIR_COLORS = {
  light: ['blonde', 'light brown', 'auburn', 'strawberry blonde', 'dark brown', 'gray', 'silver', 'dirty blonde'],
  medium: ['dark brown', 'black', 'chestnut brown', 'auburn', 'gray', 'salt and pepper'],
  dark: ['black', 'dark brown', 'gray', 'salt and pepper'],
};

const AGES = ['late 20s', 'early 30s', 'mid 30s', 'late 30s', 'early 40s', 'mid 40s', 'late 40s', 'early 50s', 'late 50s', 'early 60s'];

const BUILD = ['slim', 'average', 'athletic', 'stocky', 'heavyset', 'petite', 'tall and lean'];

const FACE_FEATURES = [
  'round face',
  'oval face',
  'square jaw',
  'high cheekbones',
  'soft features',
  'angular features',
  'dimples',
  'freckles',
  'laugh lines',
  'prominent nose',
];

// Expressions - mostly positive but varied
const EXPRESSIONS = [
  'warm smile',
  'friendly smile',
  'genuine smile',
  'relaxed happy expression',
  'confident smile',
  'soft smile',
  'cheerful expression',
  'approachable expression',
  'natural relaxed expression',
  'pleasant expression',
];

// Context hints for energy company customers (homeowners, families)
const CONTEXT_HINTS = [
  '',  // No extra context most of the time
  '',
  '',
  '',
  'looks like a homeowner',
  'appears to be a parent',
  'looks like they just finished yard work',
  '',
  '',
  '',
];

const ACCESSORIES = ['', '', '', 'wearing glasses', 'wearing reading glasses', 'wearing sunglasses on head', ''];

// Photo style variations - from polished to more casual/candid
const PHOTO_STYLES = [
  // More polished (40%)
  { style: 'well-lit portrait photo', framing: 'well-composed head and shoulders', quality: 'sharp focus' },
  { style: 'clear portrait photo', framing: 'centered head and shoulders', quality: 'good lighting' },
  { style: 'nice portrait photo', framing: 'head and shoulders', quality: 'natural lighting' },
  { style: 'portrait photo', framing: 'head and shoulders', quality: 'even lighting' },
  // More casual/candid (60%)
  { style: 'casual photo', framing: 'head and shoulders, slightly off-center', quality: 'natural daylight' },
  { style: 'candid photo', framing: 'casual framing', quality: 'ambient lighting' },
  { style: 'everyday photo', framing: 'relaxed pose', quality: 'natural light' },
  { style: 'casual snapshot', framing: 'informal framing', quality: 'available light' },
  { style: 'natural photo', framing: 'slightly cropped', quality: 'soft natural light' },
  { style: 'relaxed photo', framing: 'casual head shot', quality: 'window light' },
];

// Build the prompt for a given bucket with variety
function buildPrompt(gender, appearance) {
  const genderDesc = GENDER_DESCRIPTIONS[gender];
  const background = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
  const attire = ATTIRE[Math.floor(Math.random() * ATTIRE.length)];
  const hairOptions = HAIR_STYLES[gender];
  const hair = hairOptions[Math.floor(Math.random() * hairOptions.length)];
  const hairColorOptions = HAIR_COLORS[appearance];
  const hairColor = hairColorOptions[Math.floor(Math.random() * hairColorOptions.length)];
  const age = AGES[Math.floor(Math.random() * AGES.length)];
  const build = BUILD[Math.floor(Math.random() * BUILD.length)];
  const faceFeature = FACE_FEATURES[Math.floor(Math.random() * FACE_FEATURES.length)];
  const accessory = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)];
  const photoStyle = PHOTO_STYLES[Math.floor(Math.random() * PHOTO_STYLES.length)];
  const expression = EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)];
  const contextHint = CONTEXT_HINTS[Math.floor(Math.random() * CONTEXT_HINTS.length)];

  return `${photoStyle.style} of a ${genderDesc} in their ${age} with ${appearance} skin tone. ${hairColor} ${hair}. ${faceFeature}, ${build} build. ${expression}. Wearing ${attire}${accessory ? ', ' + accessory : ''}. ${photoStyle.quality}. ${background}. ${photoStyle.framing}. No hands visible in frame.${contextHint ? ' ' + contextHint + '.' : ''} Photorealistic, looks like a real person's photo.`;
}

// Make Gemini API request for image generation
async function generateImage(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      contents: [{
        parts: [{ text: prompt }],
      }],
      generationConfig: {
        responseModalities: ['Text', 'Image'],
        imageConfig: {
          aspectRatio: '1:1',
        },
      },
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${CONFIG.model}:generateContent`,
      method: 'POST',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message));
          } else if (response.candidates && response.candidates[0]?.content?.parts) {
            const imagePart = response.candidates[0].content.parts.find(p => p.inlineData);
            if (imagePart && imagePart.inlineData?.data) {
              resolve(imagePart.inlineData.data);
            } else {
              reject(new Error(`No image in response: ${JSON.stringify(response).substring(0, 300)}`));
            }
          } else {
            reject(new Error(`Unexpected API response: ${JSON.stringify(response).substring(0, 300)}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message} - ${data.substring(0, 200)}`));
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out after 60s'));
    });
    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

// Save base64 image to file
function saveBase64Image(base64Data, filepath) {
  const buffer = Buffer.from(base64Data, 'base64');
  fs.writeFileSync(filepath, buffer);
}

// Get next available filename in bucket directory
function getNextFilename(bucketDir) {
  if (!fs.existsSync(bucketDir)) {
    fs.mkdirSync(bucketDir, { recursive: true });
  }

  const existingFiles = fs.readdirSync(bucketDir)
    .filter(f => f.startsWith('avatar_') && f.endsWith('.png'))
    .map(f => parseInt(f.match(/avatar_(\d+)/)?.[1] || '0', 10));

  const nextNum = existingFiles.length > 0 ? Math.max(...existingFiles) + 1 : 1;
  return `avatar_${String(nextNum).padStart(4, '0')}.png`;
}

// Generate images for a bucket
async function generateBucket(bucketName, count, apiKey, dryRun = false) {
  const bucket = BUCKETS[bucketName];
  if (!bucket) {
    throw new Error(`Unknown bucket: ${bucketName}`);
  }

  const bucketDir = path.join(CONFIG.outputDir, bucketName);

  console.log(`\n📁 Bucket: ${bucketName}`);
  console.log(`   Gender: ${bucket.gender}, Appearance: ${bucket.appearance}`);
  console.log(`   Generating ${count} images with unique prompts...`);

  if (dryRun) {
    console.log(`   [DRY RUN] Would generate ${count} images`);
    return { success: count, failed: 0 };
  }

  let success = 0;
  let failed = 0;

  for (let i = 0; i < count; i++) {
    const filename = getNextFilename(bucketDir);
    const filepath = path.join(bucketDir, filename);

    try {
      // Generate unique prompt for each image
      const prompt = buildPrompt(bucket.gender, bucket.appearance);
      process.stdout.write(`   [${i + 1}/${count}] Generating ${filename}... `);

      const base64Image = await generateImage(prompt, apiKey);
      saveBase64Image(base64Image, filepath);

      console.log('✓');
      success++;

      // Rate limiting: wait between requests
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.log(`✗ ${error.message}`);
      failed++;

      // On rate limit, wait longer
      if (error.message.includes('rate') || error.message.includes('429') || error.message.includes('quota')) {
        console.log('   Waiting 30s due to rate limit...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }
  }

  return { success, failed };
}

// Sample mode: generate ~2-3 images per bucket for validation
async function runSampleMode(apiKey, dryRun) {
  console.log('\n🎯 SAMPLE MODE: Generating ~20 images for validation\n');

  const sampleCounts = {
    female_light: 2,
    female_medium: 2,
    female_dark: 2,
    male_light: 2,
    male_medium: 2,
    male_dark: 2,
    neutral_light: 2,
    neutral_medium: 2,
    neutral_dark: 2,
  };

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const [bucketName, count] of Object.entries(sampleCounts)) {
    const result = await generateBucket(bucketName, count, apiKey, dryRun);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  return { totalSuccess, totalFailed };
}

// Full mode: generate target count for each bucket (~450 total, 1.5x for curation)
async function runFullMode(apiKey, dryRun) {
  console.log('\n🎯 FULL MODE: Generating ~450 images (1.5x target for curation)\n');

  let totalSuccess = 0;
  let totalFailed = 0;

  // Generate 1.5x the target count to allow for curation
  for (const [bucketName, bucket] of Object.entries(BUCKETS)) {
    const count = Math.ceil(bucket.targetCount * 1.5);
    const result = await generateBucket(bucketName, count, apiKey, dryRun);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  return { totalSuccess, totalFailed };
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mode: null,
    bucket: null,
    count: null,
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--sample':
        options.mode = 'sample';
        break;
      case '--full':
        options.mode = 'full';
        break;
      case '--bucket':
        options.mode = 'bucket';
        options.bucket = args[++i];
        break;
      case '--count':
        options.count = parseInt(args[++i], 10);
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--help':
      case '-h':
        options.mode = 'help';
        break;
    }
  }

  return options;
}

// Print usage
function printUsage() {
  console.log(`
Curtain Avatar Generation Script (Google Gemini)

Usage:
  node generate-avatars.js --sample              Generate ~20 sample images for validation
  node generate-avatars.js --full                Generate full batch (~450 images)
  node generate-avatars.js --bucket <name> --count <n>   Generate specific bucket
  node generate-avatars.js --dry-run --sample    Show what would be generated (no API calls)

Options:
  --sample          Generate sample batch (~2 per bucket, ~20 total)
  --full            Generate full batch (1.5x target per bucket, ~450 total)
  --bucket <name>   Generate for specific bucket (e.g., female_light, male_dark)
  --count <n>       Number of images to generate (used with --bucket)
  --dry-run         Show what would be generated without making API calls
  --help, -h        Show this help message

Available buckets:
  ${Object.keys(BUCKETS).join(', ')}

Environment:
  GOOGLE_API_KEY or GOOGLE_GEMINI_API_KEY
                    Required. Your Google AI API key.
                    Get one at: https://aistudio.google.com/app/apikey

Cost estimate:
  Gemini: ~$0.03/image (may vary, requires billing)
  Sample batch (~20): ~$0.60
  Full batch (~450): ~$13.50

Output:
  Images saved to: ${CONFIG.outputDir}
`);
}

// Main
async function main() {
  const options = parseArgs();

  if (options.mode === 'help' || !options.mode) {
    printUsage();
    process.exit(options.mode === 'help' ? 0 : 1);
  }

  // Check for API key (accept either GOOGLE_GEMINI_API_KEY or GOOGLE_API_KEY)
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey && !options.dryRun) {
    console.error('Error: GOOGLE_GEMINI_API_KEY or GOOGLE_API_KEY environment variable is required');
    console.error('Get one at: https://aistudio.google.com/app/apikey');
    console.error('Set it with: export GOOGLE_GEMINI_API_KEY=your-key-here');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Curtain Avatar Generation (Google Gemini)');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Output directory: ${CONFIG.outputDir}`);
  console.log(`  Model: ${CONFIG.model}`);
  if (options.dryRun) {
    console.log('  ⚠️  DRY RUN MODE - No API calls will be made');
  }

  // Ensure output directory exists
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
  }

  let result;
  const startTime = Date.now();

  try {
    switch (options.mode) {
      case 'sample':
        result = await runSampleMode(apiKey, options.dryRun);
        break;
      case 'full':
        result = await runFullMode(apiKey, options.dryRun);
        break;
      case 'bucket':
        if (!options.bucket || !options.count) {
          console.error('Error: --bucket requires both bucket name and --count');
          process.exit(1);
        }
        result = await generateBucket(options.bucket, options.count, apiKey, options.dryRun);
        result = { totalSuccess: result.success, totalFailed: result.failed };
        break;
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const cost = (result.totalSuccess * 0.03).toFixed(2);

    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  Generation Complete');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  ✓ Success: ${result.totalSuccess} images`);
    console.log(`  ✗ Failed: ${result.totalFailed} images`);
    console.log(`  ⏱ Duration: ${duration}s`);
    if (!options.dryRun) {
      console.log(`  💰 Estimated cost: $${cost}`);
    }
    console.log(`\n  Output: ${CONFIG.outputDir}`);

  } catch (error) {
    console.error(`\nFatal error: ${error.message}`);
    process.exit(1);
  }
}

main();
