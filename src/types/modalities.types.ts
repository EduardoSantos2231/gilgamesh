export type Modalitie = "estagio" | "efetivo";

export const MODALITY_TO_SOLIDES: Record<Modalitie, string> = {
  estagio: "estagio",
  efetivo: "clt",
};
