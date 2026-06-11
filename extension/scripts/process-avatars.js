#!/usr/bin/env node
/**
 * Curtain Avatar Post-Processing Script
 *
 * Processes raw DALL-E generated images:
 * - Crops to square (face-centered)
 * - Resizes to 128x128
 * - Converts to WebP format
 * - Generates manifest.json
 *
 * Usage:
 *   node process-avatars.js              # Process all raw images
 *   node process-avatars.js --manifest   # Only regenerate manifest
 *
 * Prerequisites:
 *   npm install sharp   (or: yarn add sharp)
 */

const fs = require('fs');
const path = require('path');

// Try to load sharp, provide helpful error if not installed
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp module not found.');
  console.error('Install it with: npm install sharp');
  console.error('Or: yarn add sharp');
  process.exit(1);
}

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, 'output', 'raw'),
  outputDir: path.join(__dirname, 'output', 'processed'),
  finalDir: path.join(__dirname, '..', 'src', 'shared', 'avatars', 'v1'),
  targetSize: 128,
  webpQuality: 82,  // 80-85 is visually lossless for faces
  maxFileSize: 10 * 1024,  // 10KB max
};

const BUCKETS = [
  'female_light', 'female_medium', 'female_dark',
  'male_light', 'male_medium', 'male_dark',
  'neutral_light', 'neutral_medium', 'neutral_dark',
];

// Process a single image
async function processImage(inputPath, outputPath) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  // Calculate crop dimensions (center crop to square)
  const size = Math.min(metadata.width, metadata.height);
  const left = Math.floor((metadata.width - size) / 2);
  const top = Math.floor((metadata.height - size) / 2);

  // Process: crop -> resize -> convert to WebP
  await image
    .extract({ left, top, width: size, height: size })
    .resize(CONFIG.targetSize, CONFIG.targetSize, {
      kernel: sharp.kernel.lanczos3,  // High-quality downsampling
    })
    .webp({ quality: CONFIG.webpQuality })
    .toFile(outputPath);

  // Check file size
  const stats = fs.statSync(outputPath);
  if (stats.size > CONFIG.maxFileSize) {
    console.warn(`  ⚠️  ${path.basename(outputPath)} is ${(stats.size / 1024).toFixed(1)}KB (exceeds ${CONFIG.maxFileSize / 1024}KB)`);
  }

  return stats.size;
}

// Process all images in a bucket
async function processBucket(bucketName) {
  const inputBucketDir = path.join(CONFIG.inputDir, bucketName);
  const outputBucketDir = path.join(CONFIG.outputDir, bucketName);

  if (!fs.existsSync(inputBucketDir)) {
    console.log(`  Skipping ${bucketName} (no input directory)`);
    return { processed: 0, skipped: 0, failed: 0 };
  }

  // Create output directory
  if (!fs.existsSync(outputBucketDir)) {
    fs.mkdirSync(outputBucketDir, { recursive: true });
  }

  const inputFiles = fs.readdirSync(inputBucketDir)
    .filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));

  let processed = 0;
  let skipped = 0;
  let failed = 0;
  let totalSize = 0;

  for (const filename of inputFiles) {
    const inputPath = path.join(inputBucketDir, filename);
    const outputFilename = filename.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(outputBucketDir, outputFilename);

    // Skip if already processed
    if (fs.existsSync(outputPath)) {
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`  Processing ${filename}... `);
      const size = await processImage(inputPath, outputPath);
      totalSize += size;
      console.log(`✓ ${(size / 1024).toFixed(1)}KB`);
      processed++;
    } catch (error) {
      console.log(`✗ ${error.message}`);
      failed++;
    }
  }

  const avgSize = processed > 0 ? (totalSize / processed / 1024).toFixed(1) : 0;
  console.log(`  → ${bucketName}: ${processed} processed, ${skipped} skipped, ${failed} failed (avg ${avgSize}KB)`);

  return { processed, skipped, failed };
}

// Generate manifest.json
async function generateManifest() {
  console.log('\n📋 Generating manifest.json...');

  const manifest = {
    packVersion: 'v1',
    packSeed: 'curtain-avatars-v1-2024',
    generatedAt: new Date().toISOString().split('T')[0],
    totalImages: 0,
    buckets: {},
  };

  for (const bucketName of BUCKETS) {
    const bucketDir = path.join(CONFIG.outputDir, bucketName);
    manifest.buckets[bucketName] = [];

    if (!fs.existsSync(bucketDir)) {
      continue;
    }

    const files = fs.readdirSync(bucketDir)
      .filter(f => f.endsWith('.webp'))
      .sort();

    for (const filename of files) {
      manifest.buckets[bucketName].push(`${bucketName}/${filename}`);
      manifest.totalImages++;
    }
  }

  // Write manifest to processed directory
  const manifestPath = path.join(CONFIG.outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`  ✓ Manifest written to ${manifestPath}`);
  console.log(`  ✓ Total images: ${manifest.totalImages}`);

  // Print bucket summary
  console.log('\n  Bucket summary:');
  for (const bucketName of BUCKETS) {
    const count = manifest.buckets[bucketName].length;
    console.log(`    ${bucketName}: ${count} images`);
  }

  return manifest;
}

// Copy processed files to final location (src/shared/avatars/v1)
async function copyToFinal() {
  console.log('\n📦 Copying to final location...');

  // Create final directory structure
  if (!fs.existsSync(CONFIG.finalDir)) {
    fs.mkdirSync(CONFIG.finalDir, { recursive: true });
  }

  let copiedFiles = 0;

  for (const bucketName of BUCKETS) {
    const srcDir = path.join(CONFIG.outputDir, bucketName);
    const destDir = path.join(CONFIG.finalDir, bucketName);

    if (!fs.existsSync(srcDir)) continue;

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.webp'));
    for (const filename of files) {
      fs.copyFileSync(
        path.join(srcDir, filename),
        path.join(destDir, filename)
      );
      copiedFiles++;
    }
  }

  // Copy manifest
  const manifestSrc = path.join(CONFIG.outputDir, 'manifest.json');
  const manifestDest = path.join(CONFIG.finalDir, 'manifest.json');
  if (fs.existsSync(manifestSrc)) {
    fs.copyFileSync(manifestSrc, manifestDest);
  }

  console.log(`  ✓ Copied ${copiedFiles} images to ${CONFIG.finalDir}`);
}

// Calculate total bundle size
function calculateBundleSize() {
  let totalSize = 0;
  let fileCount = 0;

  for (const bucketName of BUCKETS) {
    const bucketDir = path.join(CONFIG.outputDir, bucketName);
    if (!fs.existsSync(bucketDir)) continue;

    const files = fs.readdirSync(bucketDir).filter(f => f.endsWith('.webp'));
    for (const filename of files) {
      const stats = fs.statSync(path.join(bucketDir, filename));
      totalSize += stats.size;
      fileCount++;
    }
  }

  return { totalSize, fileCount };
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    manifestOnly: args.includes('--manifest'),
    copyFinal: args.includes('--copy-final'),
    help: args.includes('--help') || args.includes('-h'),
  };
}

// Print usage
function printUsage() {
  console.log(`
Curtain Avatar Post-Processing Script

Usage:
  node process-avatars.js                 Process all raw images
  node process-avatars.js --manifest      Only regenerate manifest
  node process-avatars.js --copy-final    Copy processed images to final location

Options:
  --manifest      Only regenerate manifest.json (no image processing)
  --copy-final    Copy processed images to src/shared/avatars/v1/
  --help, -h      Show this help message

Input:  ${CONFIG.inputDir}
Output: ${CONFIG.outputDir}
Final:  ${CONFIG.finalDir}

Processing steps:
  1. Crop to square (center crop)
  2. Resize to ${CONFIG.targetSize}x${CONFIG.targetSize} (Lanczos resampling)
  3. Convert to WebP (quality ${CONFIG.webpQuality})
`);
}

// Main
async function main() {
  const options = parseArgs();

  if (options.help) {
    printUsage();
    process.exit(0);
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Curtain Avatar Post-Processing');
  console.log('═══════════════════════════════════════════════════════════');

  if (options.manifestOnly) {
    await generateManifest();
    const { totalSize, fileCount } = calculateBundleSize();
    console.log(`\n  📊 Bundle size: ${(totalSize / 1024 / 1024).toFixed(2)}MB (${fileCount} files)`);
    return;
  }

  // Process all buckets
  console.log('\n🖼️  Processing images...\n');

  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const bucketName of BUCKETS) {
    const result = await processBucket(bucketName);
    totalProcessed += result.processed;
    totalSkipped += result.skipped;
    totalFailed += result.failed;
  }

  // Generate manifest
  await generateManifest();

  // Calculate bundle size
  const { totalSize, fileCount } = calculateBundleSize();

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('  Processing Complete');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  ✓ Processed: ${totalProcessed} images`);
  console.log(`  ⏭ Skipped: ${totalSkipped} images`);
  console.log(`  ✗ Failed: ${totalFailed} images`);
  console.log(`  📊 Bundle size: ${(totalSize / 1024 / 1024).toFixed(2)}MB (${fileCount} files)`);
  console.log(`\n  Output: ${CONFIG.outputDir}`);

  if (options.copyFinal) {
    await copyToFinal();
  } else {
    console.log(`\n  To copy to final location, run:`);
    console.log(`  node process-avatars.js --copy-final`);
  }
}

main().catch(error => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
