import { defaultData, defaultVariable, variablePresets } from "../config";

export const INITIAL_STATE = {
  storedGeojson: {},
  aqSummary: [],
  aqLastUpdated: {
    start:null,
    end:null
  },
  aqIdw: [],
  currentData: defaultData,
  columnNames: [
    "acs_population",
    // "cities_casthma_prev",
    // "cities_copd_prev",
    "svi_pecentile",
    "trees_n",
    "trees_area",
    "trees_den",
    "trees_crown_den",
    "asthma_5yr_avg",
    "asthma_age_adj_rate",
    "urban_flood_suscep",
    "heatisl",
    "nn_q3_pm2_5",
    // "uchosp_casthma_visit",
    "logtraf",
    "hardship",
    "ndvi",
    "simpson",
    "topline_median"
  ],
  ranges: {},
  selectionData: {},
  filterValues: {},
  mapParams: {
    ...variablePresets[defaultVariable],
    // defaults
    zAxisParams: null,
    storedRange: null,
    bins: [],
    overlay: "community_areas",
  },
  panelState: {
    variables: window.innerWidth > 768,
    info: window.innerWidth > 768,
    tutorial: false,
    context: false,
    contextPos: { x: null, y: null },
  },
  sidebarData: {},
  anchorEl: null,
  mapLoaded: false,
  notification: null,
  urlParams: {},
};
