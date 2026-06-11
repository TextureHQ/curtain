import type { OrganizationEntry } from '@texturehq/curtain-core';

/**
 * Fictional US energy-sector organisations used by the Curtain extension
 * during demos. Names verified against ~2,906 real US municipal utilities,
 * 834 co-ops, and 168 IOUs to avoid trademark collisions.
 *
 * See `docs/industry-methodology.md` (in the curtain repo) for the
 * generation process: real-logo reference collection → Gemini logo
 * synthesis → Claude name generation → manual collision-check pass.
 */
export const ENERGY_ORGANIZATIONS: ReadonlyArray<OrganizationEntry> = [
  // Co-ops (org_001–015)
  { id: 'org_001', name: 'Timber Ridge Electric Cooperative', type: 'coop' },
  { id: 'org_002', name: 'Pinecrest Rural Electric', type: 'coop' },
  { id: 'org_003', name: 'Clearwater Basin REC', type: 'coop' },
  { id: 'org_004', name: 'Riverbend Electric Cooperative', type: 'coop' },
  { id: 'org_005', name: 'Sunrise Valley Electric Membership Corp', type: 'coop' },
  { id: 'org_006', name: 'Crossroads Energy Cooperative', type: 'coop' },
  { id: 'org_007', name: 'Twin Rivers Electric Cooperative', type: 'coop' },
  { id: 'org_008', name: 'Ridgeline Rural Electric', type: 'coop' },
  { id: 'org_009', name: 'Harvest Plains Electric Cooperative', type: 'coop' },
  { id: 'org_010', name: 'Redstone Electric Cooperative', type: 'coop' },
  { id: 'org_011', name: 'Meadowbrook Rural Electric', type: 'coop' },
  { id: 'org_012', name: 'Summit Creek Electric Cooperative', type: 'coop' },
  { id: 'org_013', name: 'Ironwood Electric Cooperative', type: 'coop' },
  { id: 'org_014', name: 'Copperhead Basin REC', type: 'coop' },
  { id: 'org_015', name: 'Silver Lake Electric Cooperative', type: 'coop' },
  // IOUs (org_016–030)
  { id: 'org_016', name: 'Northstar Electric', type: 'iou' },
  { id: 'org_017', name: 'Valley Stream Power', type: 'iou' },
  { id: 'org_018', name: 'Summit Power Company', type: 'iou' },
  { id: 'org_019', name: 'Aurora Power', type: 'iou' },
  { id: 'org_020', name: 'Evergreen Utilities', type: 'iou' },
  { id: 'org_021', name: 'Prairie State Energy', type: 'iou' },
  { id: 'org_022', name: 'Golden State Electric', type: 'iou' },
  { id: 'org_023', name: 'Piedmont Power', type: 'iou' },
  { id: 'org_024', name: 'Great Plains Energy', type: 'iou' },
  { id: 'org_025', name: 'Atlantic Electric', type: 'iou' },
  { id: 'org_026', name: 'Pacific Coast Power', type: 'iou' },
  { id: 'org_027', name: 'Midwestern Energy', type: 'iou' },
  { id: 'org_028', name: 'Southern Regional Electric', type: 'iou' },
  { id: 'org_029', name: 'Continental Power', type: 'iou' },
  { id: 'org_030', name: 'Heartland Power Holdings', type: 'iou' },
  // Municipals (org_031–045)
  { id: 'org_031', name: 'Willowbrook Municipal Electric', type: 'municipal' },
  { id: 'org_032', name: 'Cedarwood Public Utilities', type: 'municipal' },
  { id: 'org_033', name: 'Stonegate Electric Department', type: 'municipal' },
  { id: 'org_034', name: 'Maplecrest Power & Light', type: 'municipal' },
  { id: 'org_035', name: 'Thornhill Municipal Utilities', type: 'municipal' },
  { id: 'org_036', name: 'Elmdale Public Power', type: 'municipal' },
  { id: 'org_037', name: 'Pinewood Public Utilities', type: 'municipal' },
  { id: 'org_038', name: 'Hawthorne Electric Department', type: 'municipal' },
  { id: 'org_039', name: 'Briarwood Power & Light', type: 'municipal' },
  { id: 'org_040', name: 'Summerville Utilities', type: 'municipal' },
  { id: 'org_041', name: 'Oakmont Municipal Electric', type: 'municipal' },
  { id: 'org_042', name: 'Clearfield Public Power', type: 'municipal' },
  { id: 'org_043', name: 'Northbrook Electric Department', type: 'municipal' },
  { id: 'org_044', name: 'Ridgemont Public Utilities', type: 'municipal' },
  { id: 'org_045', name: 'Silverdale Power & Light', type: 'municipal' },
  // DER / Grid Tech (org_046–060)
  { id: 'org_046', name: 'Redwood Energy Group', type: 'der' },
  { id: 'org_047', name: 'Pacific Grid Solutions', type: 'der' },
  { id: 'org_048', name: 'Blue Sky Energy', type: 'der' },
  { id: 'org_049', name: 'Horizon Energy Systems', type: 'der' },
  { id: 'org_050', name: 'NextWave Power', type: 'der' },
  { id: 'org_051', name: 'Clearwater Energy', type: 'der' },
  { id: 'org_052', name: 'Summit Grid Technologies', type: 'der' },
  { id: 'org_053', name: 'VoltEdge Energy', type: 'der' },
  { id: 'org_054', name: 'Northstar Power Systems', type: 'der' },
  { id: 'org_055', name: 'Suncrest Energy', type: 'der' },
  { id: 'org_056', name: 'GridPoint Technologies', type: 'der' },
  { id: 'org_057', name: 'EnergyHub Solutions', type: 'der' },
  { id: 'org_058', name: 'FlexGrid Systems', type: 'der' },
  { id: 'org_059', name: 'PowerSync Technologies', type: 'der' },
  { id: 'org_060', name: 'CleanTech Energy', type: 'der' },
];
