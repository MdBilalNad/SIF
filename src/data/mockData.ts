import { 
  AnalysisRun, 
  IndicatorDefinition, 
  MethodologySection, 
  PrecursorIndicator,
  AnalysisResult 
} from '../types';

export const SYSTEM_INDICATOR_DEFINITIONS: IndicatorDefinition[] = [
  {
    id: 'ind_barrier_bypass',
    name: 'Critical Barrier Bypass Frequency',
    category: 'barrier_integrity',
    categoryLabel: 'Barrier Integrity',
    unit: 'events/10k hrs',
    defaultThreshold: 2.0,
    description: 'Rate of unauthorized or extended overrides on safety-instrumented systems, pressure interlocks, and emergency stops.',
    formulaDescription: 'Total safety bypass hours divided by total operational asset running hours * 10,000.',
    referenceStandard: 'IEC 61511 / CCPS Guidelines for Safe Automation'
  },
  {
    id: 'ind_energy_uncontrolled',
    name: 'Uncontrolled High-Energy Exposure Index',
    category: 'energy_exposure',
    categoryLabel: 'Energy Exposure',
    unit: 'exposure index',
    defaultThreshold: 35.0,
    description: 'Density of line-of-fire work orders performed in immediate proximity to pressurized, electrical, or suspended gravitational loads exceeding SIF thresholds.',
    formulaDescription: 'Weighted sum of high-energy operational permits active without independent physical verification.',
    referenceStandard: 'Campbell Institute / High-Energy Hazard Control Standard'
  },
  {
    id: 'ind_valve_drift',
    name: 'Safety Relief Valve Calibration Drift',
    category: 'barrier_integrity',
    categoryLabel: 'Barrier Integrity',
    unit: '% variance',
    defaultThreshold: 5.0,
    description: 'Measured deviation of primary containment overpressure relief release setpoints during bench or in-line surveillance.',
    formulaDescription: 'Absolute percentage deviation between design set pressure and observed pop pressure.',
    referenceStandard: 'API 520/526 Sizing, Selection & Inspection'
  },
  {
    id: 'ind_hipo_nearmiss',
    name: 'High-Potential Near-Miss Ratio',
    category: 'pre_incident_conditions',
    categoryLabel: 'Pre-Incident Conditions',
    unit: 'ratio',
    defaultThreshold: 0.15,
    description: 'Proportion of reported near-misses that involved high-energy sources or fatal barrier failure mechanisms regardless of final outcome severity.',
    formulaDescription: 'HiPo near-miss incident count divided by total incident and near-miss log entries.',
    referenceStandard: 'ANSI/ASSP Z16.1 Leading Indicators Standard'
  },
  {
    id: 'ind_maintenance_backlog',
    name: 'Safety-Critical Maintenance Backlog',
    category: 'operational_drift',
    categoryLabel: 'Operational Drift',
    unit: 'days overdue',
    defaultThreshold: 14.0,
    description: 'Cumulative deferral duration for preventative maintenance on primary safety containment and emergency isolation valves.',
    formulaDescription: 'Mean overdue days across all Level-1 safety critical elements (SCEs) active in the CMMS ledger.',
    referenceStandard: 'ISO 55000 Asset Reliability Framework'
  },
  {
    id: 'ind_shift_variance',
    name: 'Shift Handover Discrepancy Rate',
    category: 'operational_drift',
    categoryLabel: 'Operational Drift',
    unit: 'discrepancies/shift',
    defaultThreshold: 0.8,
    description: 'Identified omissions or permit discrepancies between outgoing and incoming operating crew logs regarding active isolation boundaries.',
    formulaDescription: 'Weekly audited handover discrepancies divided by total shift handover cycles.',
    referenceStandard: 'HSE HSG48 Human Factors in Safety-Critical Handover'
  },
  {
    id: 'ind_interlock_defeat',
    name: 'Mechanical & Electrical Interlock Defeat Rate',
    category: 'barrier_integrity',
    categoryLabel: 'Barrier Integrity',
    unit: 'defeats/month',
    defaultThreshold: 1.0,
    description: 'Frequency of mechanical pins, jumpers, or electrical bridge overrides applied to safeguard machine perimeters.',
    formulaDescription: 'Active verified jumper permits logged during live operating state.',
    referenceStandard: 'OSHA 1910.147 / ISO 14119 Guard Interlocking'
  },
  {
    id: 'ind_audit_closure',
    name: 'Level-1 Safety Audit Action Overdue Rate',
    category: 'systems_governance',
    categoryLabel: 'Systems Governance',
    unit: '% overdue',
    defaultThreshold: 10.0,
    description: 'Percentage of corrective action items directly tied to fatal precursor findings that exceed initial target remediation deadlines.',
    formulaDescription: 'Overdue high-risk corrective action items divided by total open action items * 100.',
    referenceStandard: 'ISO 45001 Clause 10 Improvement Governance'
  }
];

// Sample run 1: Critical SIF Potential
const SAMPLE_RUN_1_INDICATORS: PrecursorIndicator[] = [
  {
    id: 'ind_barrier_bypass',
    name: 'Critical Barrier Bypass Frequency',
    category: 'barrier_integrity',
    categoryLabel: 'Barrier Integrity',
    currentValue: 4.8,
    threshold: 2.0,
    unit: 'events/10k hrs',
    status: 'critical',
    contributionPct: 28.5,
    relevance: 'Direct failure of secondary relief isolation; multiple bypasses active without secondary supervisory sign-off.',
    observedEvidence: 'Log records show 7 active bypasses exceeding 72 hours on Pressure Separation Unit C-4.',
    interpretation: 'Elevated duration of unmitigated pressure barrier bypasses creates immediate vulnerability to overpressure events.',
    historicalDeltaPct: 140.0
  },
  {
    id: 'ind_valve_drift',
    name: 'Safety Relief Valve Calibration Drift',
    category: 'barrier_integrity',
    categoryLabel: 'Barrier Integrity',
    currentValue: 8.6,
    threshold: 5.0,
    unit: '% variance',
    status: 'critical',
    contributionPct: 24.2,
    relevance: 'Primary relief valve PSV-402 popped at 108.6% of maximum allowable working pressure during bench test.',
    observedEvidence: 'SURV-2026-Q1 test reports indicate spring corrosion and delayed reseat response.',
    interpretation: 'Vessel overpressure containment margin compromised by delayed actuator activation.',
    historicalDeltaPct: 72.0
  },
  {
    id: 'ind_energy_uncontrolled',
    name: 'Uncontrolled High-Energy Exposure Index',
    category: 'energy_exposure',
    categoryLabel: 'Energy Exposure',
    currentValue: 52.4,
    threshold: 35.0,
    unit: 'exposure index',
    status: 'significant',
    contributionPct: 19.8,
    relevance: 'Simultaneous maintenance work executed adjacent to live 120 bar pressurized gas pipeline.',
    observedEvidence: 'PTW-88219 lacked independent physical barrier between pipe trench and hot work perimeter.',
    interpretation: 'Line-of-fire presence during high-pressure manifold operations without engineered standoff.',
    historicalDeltaPct: 49.7
  },
  {
    id: 'ind_maintenance_backlog',
    name: 'Safety-Critical Maintenance Backlog',
    category: 'operational_drift',
    categoryLabel: 'Operational Drift',
    currentValue: 26.0,
    threshold: 14.0,
    unit: 'days overdue',
    status: 'significant',
    contributionPct: 14.5,
    relevance: '3 critical isolation valve preventative overhauls deferred due to turnaround scheduling constraints.',
    observedEvidence: 'WO-99120 and WO-99124 deferred past manufacturer maximum recommended run cycles.',
    interpretation: 'Cumulative equipment fatigue accumulation reduces barrier reliability under transient load.',
    historicalDeltaPct: 85.7
  },
  {
    id: 'ind_hipo_nearmiss',
    name: 'High-Potential Near-Miss Ratio',
    category: 'pre_incident_conditions',
    categoryLabel: 'Pre-Incident Conditions',
    currentValue: 0.28,
    threshold: 0.15,
    unit: 'ratio',
    status: 'significant',
    contributionPct: 13.0,
    relevance: '2 near-misses categorized with catastrophic potential (heavy flange drop and unverified nitrogen purge).',
    observedEvidence: 'HSE Log entries INC-2026-031 and INC-2026-044.',
    interpretation: 'High precursor density indicates latent failure mechanisms already actively triggering near-miss events.',
    historicalDeltaPct: 86.6
  }
];

export const INITIAL_ANALYSES: AnalysisRun[] = [
  {
    id: 'ANL-2026-0849',
    title: 'Hydrocarbon Processing Unit 4 - Barrier Integrity & Pressure System Audit',
    createdAt: '2026-09-27T14:32:00Z',
    updatedAt: '2026-09-27T14:35:10Z',
    sourceType: 'file_upload',
    sourceFileName: 'hpu4_telemetry_and_permits_q3.csv',
    sourceFileSize: 2457600,
    recordsCount: 14820,
    status: 'complete',
    engineVersion: 'SIF-PE v2.4-Core',
    config: {
      analysisType: 'sif_precursor_standard',
      dateRange: {
        startDate: '2026-06-01',
        endDate: '2026-09-25'
      },
      indicatorSet: ['ind_barrier_bypass', 'ind_valve_drift', 'ind_energy_uncontrolled', 'ind_maintenance_backlog', 'ind_hipo_nearmiss'],
      sensitivity: 0.85,
      criticalThreshold: 70,
      metadata: {
        facilityOrSite: 'Rotterdam Complex - Terminal B',
        operatingUnit: 'HPU-04',
        analystId: 'ANL-ENG-441',
        notes: 'Targeted assessment following automated trip alarm frequency spike during high-throughput run.'
      }
    },
    result: {
      compositeScore: 82.4,
      classification: 'Critical SIF Potential',
      severityLevel: 'critical',
      confidenceScore: 0.94,
      thresholdMet: true,
      activePrecursorsCount: 5,
      totalIndicatorsEvaluated: 5,
      criticalBarriersDegraded: 3,
      indicators: SAMPLE_RUN_1_INDICATORS,
      primaryContributors: [
        {
          indicatorId: 'ind_barrier_bypass',
          name: 'Critical Barrier Bypass Frequency',
          weightPct: 28.5,
          severity: 'critical',
          impactSummary: 'Extended duration safety instrument bypasses operating without supervisory oversight.'
        },
        {
          indicatorId: 'ind_valve_drift',
          name: 'Safety Relief Valve Calibration Drift',
          weightPct: 24.2,
          severity: 'critical',
          impactSummary: 'Observed pop pressure setpoint exceeded design rating by 8.6%.'
        },
        {
          indicatorId: 'ind_energy_uncontrolled',
          name: 'Uncontrolled High-Energy Exposure Index',
          weightPct: 19.8,
          severity: 'significant',
          impactSummary: 'Personnel operating inside high-pressure energy boundary without active containment.'
        }
      ],
      explanation: {
        summary: 'The submitted dataset exhibits multiple concurrent precursor indicators crossing critical safety thresholds. Primary containment barrier degradation coincides with active control bypasses and unmitigated high-energy operational work.',
        observedEvidence: [
          '7 separate bypass overrides logged on Pressure Separation Unit C-4 exceeding 72 hours runtime.',
          'Safety Relief Valve PSV-402 benchmarked at 108.6% of set pressure during bench testing.',
          'Two high-potential near misses logged involving heavy equipment and unverified purge within 14 days.',
          'Safety-critical maintenance backlog on isolation elements deferred 26 days past nominal limits.'
        ],
        criticalFailures: [
          'Secondary pressure relief barrier compromised by calibration drift.',
          'Management of Change (MOC) bypass approval procedure was not re-validated after 24 hours.'
        ],
        systemicPreconditions: [
          'Operational pressure to maintain uninterrupted unit throughput during feedstock transition.',
          'Maintenance crew shortage leading to preventative inspection deferrals.'
        ],
        recommendedMitigations: [
          'Immediate physical reinstatement or administrative re-authorization of all Unit C-4 bypasses.',
          'Emergency bench inspection and recalibration of valves PSV-401 and PSV-402.',
          'Mandatory stand-down for simultaneous operations permits in Zone 4 until physical barriers are verified.'
        ]
      },
      timeSeriesData: [
        { timestamp: '2026-06-05', label: 'W1 Jun', precursorScore: 32.1, barrierIntegrityScore: 28.0, energyExposureScore: 31.0, threshold: 70 },
        { timestamp: '2026-06-19', label: 'W3 Jun', precursorScore: 36.4, barrierIntegrityScore: 30.5, energyExposureScore: 34.2, threshold: 70 },
        { timestamp: '2026-07-03', label: 'W1 Jul', precursorScore: 44.0, barrierIntegrityScore: 39.2, energyExposureScore: 42.0, threshold: 70 },
        { timestamp: '2026-07-17', label: 'W3 Jul', precursorScore: 51.8, barrierIntegrityScore: 48.6, energyExposureScore: 45.1, threshold: 70 },
        { timestamp: '2026-07-31', label: 'W5 Jul', precursorScore: 59.2, barrierIntegrityScore: 56.4, energyExposureScore: 48.0, threshold: 70 },
        { timestamp: '2026-08-14', label: 'W2 Aug', precursorScore: 68.5, barrierIntegrityScore: 67.1, energyExposureScore: 51.5, threshold: 70 },
        { timestamp: '2026-08-28', label: 'W4 Aug', precursorScore: 74.3, barrierIntegrityScore: 73.0, energyExposureScore: 53.0, threshold: 70 },
        { timestamp: '2026-09-11', label: 'W2 Sep', precursorScore: 79.0, barrierIntegrityScore: 81.2, energyExposureScore: 52.8, threshold: 70 },
        { timestamp: '2026-09-25', label: 'W4 Sep', precursorScore: 82.4, barrierIntegrityScore: 84.8, energyExposureScore: 52.4, threshold: 70 }
      ],
      distributionData: [
        { range: '0 - 20 (Nominal)', observedCount: 142, expectedBaseline: 420 },
        { range: '21 - 40 (Low)', observedCount: 310, expectedBaseline: 380 },
        { range: '41 - 60 (Elevated)', observedCount: 520, expectedBaseline: 150 },
        { range: '61 - 80 (Significant)', observedCount: 390, expectedBaseline: 45 },
        { range: '81 - 100 (Critical)', observedCount: 118, expectedBaseline: 5 }
      ]
    }
  },
  {
    id: 'ANL-2026-0812',
    title: 'Logistics Depot B - High-Energy Mobile Equipment & Pedestrian Separation',
    createdAt: '2026-09-21T09:15:00Z',
    updatedAt: '2026-09-21T09:17:40Z',
    sourceType: 'file_upload',
    sourceFileName: 'depot_b_telematics_august.csv',
    sourceFileSize: 1180000,
    recordsCount: 8450,
    status: 'complete',
    engineVersion: 'SIF-PE v2.4-Core',
    config: {
      analysisType: 'high_energy_audit',
      dateRange: {
        startDate: '2026-08-01',
        endDate: '2026-08-31'
      },
      indicatorSet: ['ind_energy_uncontrolled', 'ind_hipo_nearmiss', 'ind_shift_variance'],
      sensitivity: 0.75,
      criticalThreshold: 65,
      metadata: {
        facilityOrSite: 'Inland Hub North',
        operatingUnit: 'Loading Dock Bay 3-8',
        analystId: 'ANL-SAF-109',
        notes: 'Monthly evaluation of mobile forklift sensor telemetry against pedestrian walkway geofence zones.'
      }
    },
    result: {
      compositeScore: 58.7,
      classification: 'Elevated Precursor Risk',
      severityLevel: 'elevated',
      confidenceScore: 0.91,
      thresholdMet: false,
      activePrecursorsCount: 2,
      totalIndicatorsEvaluated: 3,
      criticalBarriersDegraded: 1,
      indicators: [
        {
          id: 'ind_energy_uncontrolled',
          name: 'Uncontrolled High-Energy Exposure Index',
          category: 'energy_exposure',
          categoryLabel: 'Energy Exposure',
          currentValue: 41.2,
          threshold: 35.0,
          unit: 'exposure index',
          status: 'elevated',
          contributionPct: 54.0,
          relevance: 'Pedestrian walkway buffer incursions detected by proximity lidar telemetry during peak staging hours.',
          observedEvidence: '34 proximity alerts under 1.5 meter buffer recorded at cross-dock intersection 2.',
          interpretation: 'Physical segregation barrier degraded by operator route short-cutting during shift changeovers.',
          historicalDeltaPct: 22.0
        },
        {
          id: 'ind_hipo_nearmiss',
          name: 'High-Potential Near-Miss Ratio',
          category: 'pre_incident_conditions',
          categoryLabel: 'Pre-Incident Conditions',
          currentValue: 0.18,
          threshold: 0.15,
          unit: 'ratio',
          status: 'elevated',
          contributionPct: 31.0,
          relevance: '1 event involving counterweight swing near high-density manual sorting table.',
          observedEvidence: 'Incident report INC-2026-077.',
          interpretation: 'High-energy kinetic motion intersecting unprotected worker envelopes.',
          historicalDeltaPct: 15.4
        },
        {
          id: 'ind_shift_variance',
          name: 'Shift Handover Discrepancy Rate',
          category: 'operational_drift',
          categoryLabel: 'Operational Drift',
          currentValue: 0.65,
          threshold: 0.8,
          unit: 'discrepancies/shift',
          status: 'nominal',
          contributionPct: 15.0,
          relevance: 'Equipment pre-start checklist completion rate meets standard protocols.',
          observedEvidence: 'Audit compliance score 94.2% across 60 shift turnarounds.',
          interpretation: 'Procedural verification remains steady despite floor physical layout friction.',
          historicalDeltaPct: -4.0
        }
      ],
      primaryContributors: [
        {
          indicatorId: 'ind_energy_uncontrolled',
          name: 'Uncontrolled High-Energy Exposure Index',
          weightPct: 54.0,
          severity: 'elevated',
          impactSummary: 'Repeated pedestrian proximity breach within heavy vehicle operational radius.'
        },
        {
          indicatorId: 'ind_hipo_nearmiss',
          name: 'High-Potential Near-Miss Ratio',
          weightPct: 31.0,
          severity: 'elevated',
          impactSummary: 'Elevated proportion of kinetic near-misses during truck uncoupling.'
        }
      ],
      explanation: {
        summary: 'Elevated precursor indicators detected primarily in vehicle-pedestrian interaction zones. While formal equipment maintenance remains nominal, physical separation barriers are repeatedly compromised during high-volume freight windows.',
        observedEvidence: [
          '34 proximity events recorded where heavy forklifts operated within 1.5m of unsegregated foot traffic.',
          'Cross-dock aisle 2 line-of-sight obstruction from temporary pallet staging.'
        ],
        criticalFailures: [
          'Physical barrier bollards absent at high-traffic intersection 2.',
          'Speed governor override not recorded in pre-trip checks.'
        ],
        systemicPreconditions: [
          'Surge delivery targets conflicting with designated safe travel paths.'
        ],
        recommendedMitigations: [
          'Install permanent physical crash barriers along cross-dock corridor 2.',
          'Program vehicle geofence speed caps to 6 km/h within 10 meters of active pedestrian lanes.'
        ]
      },
      timeSeriesData: [
        { timestamp: '2026-08-01', label: 'Day 1', precursorScore: 42.0, barrierIntegrityScore: 35.0, energyExposureScore: 38.0, threshold: 65 },
        { timestamp: '2026-08-08', label: 'Day 8', precursorScore: 46.5, barrierIntegrityScore: 38.0, energyExposureScore: 40.0, threshold: 65 },
        { timestamp: '2026-08-15', label: 'Day 15', precursorScore: 54.1, barrierIntegrityScore: 44.0, energyExposureScore: 48.0, threshold: 65 },
        { timestamp: '2026-08-22', label: 'Day 22', precursorScore: 61.2, barrierIntegrityScore: 46.0, energyExposureScore: 55.0, threshold: 65 },
        { timestamp: '2026-08-31', label: 'Day 31', precursorScore: 58.7, barrierIntegrityScore: 43.0, energyExposureScore: 51.0, threshold: 65 }
      ],
      distributionData: [
        { range: '0 - 20 (Nominal)', observedCount: 220, expectedBaseline: 350 },
        { range: '21 - 40 (Low)', observedCount: 380, expectedBaseline: 400 },
        { range: '41 - 60 (Elevated)', observedCount: 290, expectedBaseline: 200 },
        { range: '61 - 80 (Significant)', observedCount: 65, expectedBaseline: 40 },
        { range: '81 - 100 (Critical)', observedCount: 5, expectedBaseline: 10 }
      ]
    }
  },
  {
    id: 'ANL-2026-0790',
    title: 'Electrical Substation Alpha - Scheduled High-Voltage Isolation Audit',
    createdAt: '2026-09-14T11:00:00Z',
    updatedAt: '2026-09-14T11:02:15Z',
    sourceType: 'file_upload',
    sourceFileName: 'substation_alpha_loto_records.xlsx',
    sourceFileSize: 650000,
    recordsCount: 4200,
    status: 'complete',
    engineVersion: 'SIF-PE v2.4-Core',
    config: {
      analysisType: 'barrier_decay_focus',
      dateRange: {
        startDate: '2026-08-15',
        endDate: '2026-09-12'
      },
      indicatorSet: ['ind_barrier_bypass', 'ind_interlock_defeat', 'ind_audit_closure'],
      sensitivity: 0.70,
      criticalThreshold: 70,
      metadata: {
        facilityOrSite: 'Substation Alpha Grid Interconnect',
        operatingUnit: 'Switchyard 230kV',
        analystId: 'ANL-ELEC-088',
        notes: 'Standard quarterly compliance audit of high-voltage lockout/tagout and grounding verification.'
      }
    },
    result: {
      compositeScore: 18.2,
      classification: 'Nominal',
      severityLevel: 'nominal',
      confidenceScore: 0.98,
      thresholdMet: false,
      activePrecursorsCount: 0,
      totalIndicatorsEvaluated: 3,
      criticalBarriersDegraded: 0,
      indicators: [
        {
          id: 'ind_barrier_bypass',
          name: 'Critical Barrier Bypass Frequency',
          category: 'barrier_integrity',
          categoryLabel: 'Barrier Integrity',
          currentValue: 0.4,
          threshold: 2.0,
          unit: 'events/10k hrs',
          status: 'nominal',
          contributionPct: 35.0,
          relevance: 'Lockout/tagout procedures strictly observed with double verification on 230kV disconnect switches.',
          observedEvidence: 'Zero unlogged interlock bypasses discovered during live audit inspection.',
          interpretation: 'Engineered interlocks and administrative controls functioning within validated tolerance parameters.',
          historicalDeltaPct: -20.0
        },
        {
          id: 'ind_interlock_defeat',
          name: 'Mechanical & Electrical Interlock Defeat Rate',
          category: 'barrier_integrity',
          categoryLabel: 'Barrier Integrity',
          currentValue: 0.0,
          threshold: 1.0,
          unit: 'defeats/month',
          status: 'nominal',
          contributionPct: 35.0,
          relevance: 'All earthing switch interlocks verified locked and keyed in proper sequence.',
          observedEvidence: '100% adherence across 48 switching cycles.',
          interpretation: 'Primary electrical safety barriers intact and fully operational.',
          historicalDeltaPct: 0.0
        },
        {
          id: 'ind_audit_closure',
          name: 'Level-1 Safety Audit Action Overdue Rate',
          category: 'systems_governance',
          categoryLabel: 'Systems Governance',
          currentValue: 2.1,
          threshold: 10.0,
          unit: '% overdue',
          status: 'nominal',
          contributionPct: 30.0,
          relevance: 'Corrective actions closed out within target 30-day window.',
          observedEvidence: 'Only 1 minor labeling action pending out of 46 recorded items.',
          interpretation: 'Management governance loop active and responsive.',
          historicalDeltaPct: -50.0
        }
      ],
      primaryContributors: [
        {
          indicatorId: 'ind_barrier_bypass',
          name: 'Critical Barrier Bypass Frequency',
          weightPct: 35.0,
          severity: 'nominal',
          impactSummary: 'Low background rate of authorized temporary test overrides.'
        }
      ],
      explanation: {
        summary: 'All precursor indicators evaluated are well within nominal operating benchmarks. Electrical isolation barriers, interlocks, and grounding verification show strict compliance with zero unmitigated high-energy exposures.',
        observedEvidence: [
          'Zero unapproved electrical bypasses or defeats observed across 48 switching schedules.',
          'All grounding test equipment calibrated and within certified inspection dates.'
        ],
        criticalFailures: [],
        systemicPreconditions: [],
        recommendedMitigations: [
          'Maintain current quarterly audit cadence and continuing supervisor field verifications.'
        ]
      },
      timeSeriesData: [
        { timestamp: '2026-08-15', label: 'Audit 1', precursorScore: 19.5, barrierIntegrityScore: 18.0, energyExposureScore: 15.0, threshold: 70 },
        { timestamp: '2026-08-22', label: 'Audit 2', precursorScore: 17.2, barrierIntegrityScore: 16.5, energyExposureScore: 14.2, threshold: 70 },
        { timestamp: '2026-08-29', label: 'Audit 3', precursorScore: 18.8, barrierIntegrityScore: 17.0, energyExposureScore: 16.0, threshold: 70 },
        { timestamp: '2026-09-05', label: 'Audit 4', precursorScore: 16.9, barrierIntegrityScore: 15.5, energyExposureScore: 14.0, threshold: 70 },
        { timestamp: '2026-09-12', label: 'Audit 5', precursorScore: 18.2, barrierIntegrityScore: 17.0, energyExposureScore: 15.0, threshold: 70 }
      ],
      distributionData: [
        { range: '0 - 20 (Nominal)', observedCount: 420, expectedBaseline: 400 },
        { range: '21 - 40 (Low)', observedCount: 75, expectedBaseline: 80 },
        { range: '41 - 60 (Elevated)', observedCount: 5, expectedBaseline: 15 },
        { range: '61 - 80 (Significant)', observedCount: 0, expectedBaseline: 5 },
        { range: '81 - 100 (Critical)', observedCount: 0, expectedBaseline: 0 }
      ]
    }
  },
  {
    id: 'ANL-2026-0734',
    title: 'Deep Drilling Platform Rig 7 - Secondary Well Barrier Degradation',
    createdAt: '2026-08-29T16:45:00Z',
    updatedAt: '2026-08-29T16:48:30Z',
    sourceType: 'file_upload',
    sourceFileName: 'rig7_bop_annular_pressure_logs.json',
    sourceFileSize: 3120000,
    recordsCount: 22100,
    status: 'complete',
    engineVersion: 'SIF-PE v2.3-Core',
    config: {
      analysisType: 'barrier_decay_focus',
      dateRange: {
        startDate: '2026-07-01',
        endDate: '2026-08-28'
      },
      indicatorSet: ['ind_barrier_bypass', 'ind_maintenance_backlog', 'ind_valve_drift'],
      sensitivity: 0.80,
      criticalThreshold: 75,
      metadata: {
        facilityOrSite: 'Offshore Sector 14',
        operatingUnit: 'Blowout Preventer Stack (BOP-3)',
        analystId: 'ANL-DRILL-552',
        notes: 'Investigation of pressure bleeding on annular preventer closing chamber hydraulic circuit.'
      }
    },
    result: {
      compositeScore: 76.5,
      classification: 'Significant Precursor Threat',
      severityLevel: 'significant',
      confidenceScore: 0.93,
      thresholdMet: true,
      activePrecursorsCount: 3,
      totalIndicatorsEvaluated: 3,
      criticalBarriersDegraded: 2,
      indicators: [
        {
          id: 'ind_barrier_bypass',
          name: 'Critical Barrier Bypass Frequency',
          category: 'barrier_integrity',
          categoryLabel: 'Barrier Integrity',
          currentValue: 3.2,
          threshold: 2.0,
          unit: 'events/10k hrs',
          status: 'significant',
          contributionPct: 38.0,
          relevance: 'Secondary hydraulic accumulator backup bottle isolate valve placed in closed bypass position during hose swap.',
          observedEvidence: 'Telemetry showed 44 hours operating without tertiary pod auto-switch.',
          interpretation: 'Redundancy layer absent in secondary well control barrier.',
          historicalDeltaPct: 60.0
        },
        {
          id: 'ind_valve_drift',
          name: 'Safety Relief Valve Calibration Drift',
          category: 'barrier_integrity',
          categoryLabel: 'Barrier Integrity',
          currentValue: 6.8,
          threshold: 5.0,
          unit: '% variance',
          status: 'significant',
          contributionPct: 34.0,
          relevance: 'Choke manifold pressure transducer reading 6.8% variance against calibrated gauge.',
          observedEvidence: 'Weekly pressure test log PT-2026-W34.',
          interpretation: 'Uncertainty in real-time bottom-hole pressure reading increases influx risk.',
          historicalDeltaPct: 36.0
        },
        {
          id: 'ind_maintenance_backlog',
          name: 'Safety-Critical Maintenance Backlog',
          category: 'operational_drift',
          categoryLabel: 'Operational Drift',
          currentValue: 18.0,
          threshold: 14.0,
          unit: 'days overdue',
          status: 'elevated',
          contributionPct: 28.0,
          relevance: 'BOP control pod seal replacement past inspection interval.',
          observedEvidence: 'SAP PM order 88401 overdue by 18 calendar days.',
          interpretation: 'Risk of seal extrusion under extreme shock pressure.',
          historicalDeltaPct: 28.5
        }
      ],
      primaryContributors: [
        {
          indicatorId: 'ind_barrier_bypass',
          name: 'Critical Barrier Bypass Frequency',
          weightPct: 38.0,
          severity: 'significant',
          impactSummary: 'Secondary control pod backup isolation bypass active during high-pressure drilling.'
        },
        {
          indicatorId: 'ind_valve_drift',
          name: 'Safety Relief Valve Calibration Drift',
          weightPct: 34.0,
          severity: 'significant',
          impactSummary: 'Transducer variance compromises wellhead margin of error.'
        }
      ],
      explanation: {
        summary: 'Significant precursor conditions identified in well control secondary barrier systems. High pressure hydraulic redundancy was compromised while drilling through formation transition zones.',
        observedEvidence: [
          'Secondary accumulator isolate valve bypassed without written MOC variance.',
          'Transducer calibration drift on choke line manifold exceeding 5% tolerance.'
        ],
        criticalFailures: [
          'Loss of automated backup pod fail-safe closure readiness.'
        ],
        systemicPreconditions: [
          'Long lead time on specialized subsea replacement seals.'
        ],
        recommendedMitigations: [
          'Perform in-situ hydraulic lock test before continuing rotary drilling.',
          'Recalibrate pressure transmitters PT-101 and PT-102.'
        ]
      },
      timeSeriesData: [
        { timestamp: '2026-07-01', label: 'W1 Jul', precursorScore: 38.0, barrierIntegrityScore: 32.0, energyExposureScore: 40.0, threshold: 75 },
        { timestamp: '2026-07-15', label: 'W3 Jul', precursorScore: 48.2, barrierIntegrityScore: 45.0, energyExposureScore: 46.0, threshold: 75 },
        { timestamp: '2026-08-01', label: 'W1 Aug', precursorScore: 61.0, barrierIntegrityScore: 60.0, energyExposureScore: 55.0, threshold: 75 },
        { timestamp: '2026-08-15', label: 'W3 Aug', precursorScore: 71.4, barrierIntegrityScore: 73.0, energyExposureScore: 60.0, threshold: 75 },
        { timestamp: '2026-08-28', label: 'W4 Aug', precursorScore: 76.5, barrierIntegrityScore: 78.0, energyExposureScore: 62.0, threshold: 75 }
      ],
      distributionData: [
        { range: '0 - 20 (Nominal)', observedCount: 160, expectedBaseline: 300 },
        { range: '21 - 40 (Low)', observedCount: 290, expectedBaseline: 350 },
        { range: '41 - 60 (Elevated)', observedCount: 380, expectedBaseline: 220 },
        { range: '61 - 80 (Significant)', observedCount: 170, expectedBaseline: 30 },
        { range: '81 - 100 (Critical)', observedCount: 0, expectedBaseline: 0 }
      ]
    }
  }
];

export const METHODOLOGY_SECTIONS: MethodologySection[] = [
  {
    id: 'overview',
    title: '1. Theoretical Framework & Objective',
    summary: 'The mathematical and operational foundation of Serious Injury and Fatality (SIF) precursor detection.',
    content: `Traditional safety metrics (e.g., Total Recordable Incident Rate, OSHA TRIR, lost-time case frequency) exhibit weak or non-existent statistical correlation with catastrophic events, serious injuries, and fatalities. Empirical safety research (Heinrich revised, Manuele 2008, Campbell Institute 2018) demonstrates that the root causes of minor incidents differ fundamentally from the precursors that precede fatal and life-altering events.

The SIF Precursor Engine is built specifically to address this discrepancy. Rather than aggregating minor injuries, the engine isolates, normalizes, and evaluates precursor indicators: specific high-energy states combined with missing, degraded, or bypassed critical safety controls.

The primary objective is early precursor detection: identifying the decay of critical defenses and unmitigated energy potential long before an incident sequence proceeds to an irreversible outcome.`
  },
  {
    id: 'inputs',
    title: '2. Required Input Data & Schema Validation',
    summary: 'Data requirements, supported ingestion formats, and validation checks.',
    content: `The engine accepts operational logs, maintenance records, computerized maintenance management system (CMMS) work orders, permit-to-work (PTW) logs, telematics, and telemetry exports in structured formats (CSV, XLSX, or JSON).

Every ingested record must pass four validation criteria:
1. Temporal Integrity: Verified UTC timestamp or date sequence without unindexed gaps.
2. Asset/System Identifier: Explicit mapping to a physical plant, facility, operating unit, or process boundary.
3. Event Classification: Tagged with primary hazard category (e.g., pressurized gas, electrical, kinetic, gravitational, chemical) or barrier classification.
4. Barrier Operational State: Recorded state of primary containment, active interlock, permit authorization, or calibration tolerance.

Data failing schema verification is rejected at Stage 1 (Validation) with exact row and column reference error codes.`
  },
  {
    id: 'indicators',
    title: '3. Precursor Indicators Taxonomy',
    summary: 'The five operational indicator families monitored by the engine.',
    content: `Precursor indicators are organized into five structural domains:

A. Barrier Integrity: Evaluates the physical and instrumented safeguards designed to prevent energy release (e.g., relief valve drift, interlock defeat frequency, safety-instrumented function bypasses).
B. Energy Exposure: Evaluates work execution occurring within the line of fire of high-energy sources (hydraulic pressure > 100 psi, electrical > 50V, suspended mass > 500 kg, hazardous chemical concentration > IDLH).
C. Operational Drift: Measures the deviation of actual day-to-day work practices from engineered procedures (shift handover discrepancies, unapproved permit extensions, procedural workarounds).
D. Pre-Incident Conditions: Analyzes leading signals including high-potential near-miss reports, equipment micro-stoppages, and alarm flooding rates.
E. Systems Governance: Measures management response latency, specifically overdue closure rates for high-risk audit findings and preventative maintenance backlogs.`
  },
  {
    id: 'processing',
    title: '4. Processing Pipeline',
    summary: 'The five deterministic stages of precursor analysis.',
    content: `The analytical pipeline operates in five sequential stages:

Stage 1: Validating Input
Verifies column headers, data types, timestamp continuity, and boundary constraints. Corrupt or malformed records are isolated and logged.

Stage 2: Preparing Data
Normalizes heterogeneous data scales into dimensionless indicator rates (events per 10,000 asset operating hours, deviation percentages, exposure densities).

Stage 3: Evaluating Indicators
Computes specific indicator values against empirical thresholds and industry baseline reference distributions (e.g., API, IEC, ISO, OSHA standards).

Stage 4: Generating Results
Computes the composite Precursor Score using multi-criteria weighted vector synthesis, evaluates contributor sensitivity, and calculates empirical confidence intervals.

Stage 5: Finalizing Analysis
Generates structured narrative explanations, highlights specific observed evidence, identifies critical barrier failures, and formats exportable analytical artifacts.`
  },
  {
    id: 'scoring',
    title: '5. Scoring & Classification Methodology',
    summary: 'Mathematical formulation of the Composite Precursor Index.',
    content: `The Composite Precursor Index (P_I) is calculated using a non-linear barrier-weighting function that heavily penalizes simultaneous failure across independent protection layers:`,
    equations: [
      {
        name: 'Composite Precursor Index (P_I)',
        latexOrAscii: 'P_I = 100 * [ 1 - exp( - ( sum_{i=1}^{n} w_i * (V_i / T_i)^{alpha} ) ) ]',
        description: 'Where V_i is the observed indicator value, T_i is the reference threshold, w_i is the indicator domain weight (sum of w_i = 1), and alpha is the non-linear coupling factor (default alpha = 1.4).'
      },
      {
        name: 'Barrier Degradation Factor (D_B)',
        latexOrAscii: 'D_B = ( sum_{k=1}^{m} c_k * delta_k ) / m',
        description: 'Quantifies cumulative loss of barrier reliability across m monitored critical safety elements.'
      }
    ],
    notes: [
      'Classification Bands:',
      '• 0.0 to 24.9: Nominal — Safeguards intact; baseline variation within normal operating tolerances.',
      '• 25.0 to 44.9: Low Precursor Density — Minor procedural or maintenance lag; no active barrier bypass.',
      '• 45.0 to 69.9: Elevated Precursor Risk — One or more warning thresholds breached; barrier erosion evident.',
      '• 70.0 to 84.9: Significant Precursor Threat — Multiple compromised barriers with active high-energy exposure.',
      '• 85.0 to 100.0: Critical SIF Potential — Imminent vulnerability; multiple barrier layers bypassed simultaneously.'
    ]
  },
  {
    id: 'interpretation',
    title: '6. Interpretation & Evidence Grounding',
    summary: 'How analytical outputs must be interpreted and acted upon.',
    content: `A high Precursor Index does not predict the exact day or hour an incident will occur; rather, it establishes that the statistical and physical conditions necessary for a Serious Injury or Fatality are currently present and unmitigated in the operating environment.

Every finding generated by the engine is explicitly anchored to observed data:
- The system never produces a warning without citing the specific log entry, permit ID, or sensor tag that exceeded threshold.
- The system distinguishes between direct evidence (e.g., valve bench pop at 108%) and derived inferences (e.g., estimated pressure margin loss).
- Analysts are required to verify the physical field conditions before initiating operational shut-down or modification.`
  },
  {
    id: 'limitations',
    title: '7. Analytical Assumptions & Limitations',
    summary: 'Known boundaries, model constraints, and edge cases.',
    content: `To preserve analytical rigor, users must recognize the following limitations:

1. Reporting Bias: If near-misses or bypass permits are suppressed or not entered into digital logs, the engine cannot infer their existence through telematics alone.
2. Sensor Accuracy: Telemetry analysis assumes field instrumentation is within calibration; sensor drift in upstream hardware propagates into analysis unless cross-checked.
3. Lagging Indicators Excluded: The engine explicitly does not account for lost workday cases or minor first-aid counts, as these introduce statistical noise into catastrophic risk evaluation.
4. Qualitative Context: High-energy tasks occurring in unusual, non-routine maintenance configurations may require manual sensitivity adjustment.`
  },
  {
    id: 'version',
    title: '8. Version & Standard Alignment',
    summary: 'Engine release specifications and standards compliance.',
    content: `Engine Specifications:
• Current Core Engine Version: SIF-PE v2.4-Core
• Algorithmic Framework: Multi-Layer Barrier Degradation Model (MLBDM-2026.1)
• Standards Alignment:
  - ANSI/ASSP Z16.1 Leading Indicators
  - CCPS Process Safety Leading and Lagging Metrics
  - IEC 61508 / IEC 61511 Safety Instrumented Systems
  - Campbell Institute Serious Injury and Fatality Prevention Framework
• Release Verification Date: September 2026`
  }
];

export const SAMPLE_CSV_CONTENT = `timestamp,facility_id,operating_unit,hazard_category,indicator_type,observed_value,threshold_ref,unit,notes
2026-09-01T08:00:00Z,FAC-ROTT-B,HPU-04,barrier_integrity,ind_barrier_bypass,2.4,2.0,events/10k hrs,Bypass valve PT-401 active
2026-09-03T10:30:00Z,FAC-ROTT-B,HPU-04,barrier_integrity,ind_valve_drift,6.2,5.0,% variance,Relief valve PSV-402 benchmark drift
2026-09-07T14:15:00Z,FAC-ROTT-B,HPU-04,energy_exposure,ind_energy_uncontrolled,48.0,35.0,exposure index,High pressure gas line maintenance
2026-09-12T09:00:00Z,FAC-ROTT-B,HPU-04,operational_drift,ind_maintenance_backlog,22.0,14.0,days overdue,WO-99120 deferred
2026-09-18T16:45:00Z,FAC-ROTT-B,HPU-04,pre_incident_conditions,ind_hipo_nearmiss,0.22,0.15,ratio,Flange drop incident
2026-09-24T11:20:00Z,FAC-ROTT-B,HPU-04,barrier_integrity,ind_barrier_bypass,4.8,2.0,events/10k hrs,Unit C-4 secondary override`;
