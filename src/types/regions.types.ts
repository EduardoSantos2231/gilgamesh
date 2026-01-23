export const SUPPORTED_REGIONS = {
  salvador_ba: { state: 'ba', city: 'salvador' },
  sao_paulo_sp: { state: 'sp', city: 'sao-paulo' },
  goiania_go: { state: 'go', city: 'goiania' },
} as const;

// Isso extrai as chaves ('salvador_ba' | 'sao_paulo_sp' | ...) automaticamente
export type RegionKey = keyof typeof SUPPORTED_REGIONS;
