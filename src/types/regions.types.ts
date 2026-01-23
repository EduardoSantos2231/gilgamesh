export const SUPPORTED_REGIONS = {
  salvador_ba: {
    state: 'ba',
    city: 'salvador',
    label: 'Salvador (BA)'
  },
  sao_paulo_sp: {
    state: 'sp',
    city: 'sao-paulo',
    label: 'São Paulo (SP)'
  },
  goiania_go: {
    state: 'go',
    city: 'goiania',
    label: 'Goiânia (GO)'
  },
} as const;

export type RegionKey = keyof typeof SUPPORTED_REGIONS;
