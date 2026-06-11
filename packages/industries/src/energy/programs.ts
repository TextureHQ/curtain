import type { ProgramBucket } from '@texturehq/curtain-core';

/**
 * Energy-industry program names — marketing-oriented strings modelled on
 * real utility offerings (battery rebates, EV TOU, demand response, VPP).
 * Weights match the original Curtain extension distribution.
 */
export const ENERGY_PROGRAMS: Record<string, ProgramBucket> = {
  battery: {
    weight: 0.40,
    names: [
      'Home Battery System', 'Battery System Rebates', 'Smart Battery Program',
      'Power+FLEX', 'Peak Time Payback', 'Peak Time Payback Battery',
      'SmartConnect Battery', 'Flexible Load', 'PowerStore Home',
      'GridRewards Battery', 'Home Energy Storage', 'Battery Backup Rebate',
      'PowerBank Program', 'FlexPower Battery', 'Smart Storage Rewards',
      'Battery Saver Plus', 'Home Powerwall Program', 'Energy Vault',
      'StorageSmart', 'BatteryWise', 'PowerReserve Program',
    ],
  },
  ev: {
    weight: 0.30,
    names: [
      'EV TOU', 'EV Managed Charging', 'EnergySmart EV', 'EV Pilot',
      'EV Energy Management', 'ChargeReady', 'SmartCharge Rewards',
      'EV Home Charging', 'DriveGreen', 'Charge@Home', 'EV Connect',
      'PowerDrive EV', 'CleanRide Program', 'EV Saver', 'ChargeWise',
      'EV Time-of-Use', 'SmartEV', 'GreenCharge', 'EV FlexCharge',
      'Managed EV Charging', 'EV Peak Rewards',
    ],
  },
  demandResponse: {
    weight: 0.15,
    names: [
      'Demand Response', 'Peak Rewards', 'FlexSaver',
      'GridSmart', 'Peak Time Rebates', 'Smart Thermostat Program',
      'ConnectedSavings', 'CoolCredits', 'PowerDown Rewards',
      'Rush Hour Rewards', 'SmartAC', 'Summer Saver',
    ],
  },
  vpp: {
    weight: 0.15,
    names: [
      'Virtual Power Plant', 'GridFlex VPP', 'Connected Home VPP',
      'PowerGrid Partners', 'Community Battery Network', 'Grid Services',
      'Distributed Energy Network', 'FlexGrid Program', 'PowerShare',
      'GridSync', 'VPP Rewards', 'Connected Resources',
    ],
  },
};

export const ENERGY_DEVICES: ReadonlyArray<string> = [
  'Home Battery', 'Main Thermostat', 'EV Charger', 'Solar Inverter', 'Smart Panel',
  'Heat Pump', 'Water Heater', 'Pool Pump', 'HVAC System', 'Backup Generator',
  'Energy Monitor', 'Smart Outlet', 'Garage Charger', 'Office Thermostat', 'Guest House Battery',
];
