export type Lemma = string;
export type LemmaEncoding = Lemma;
export type LemmaState = {
  id: string;
  valid: boolean;
  encoding: LemmaEncoding;
  dependencies: LemmaState[];
};
export type EncodingFunction = (lemma: Lemma) => LemmaEncoding;
export type GenerationFunction = (states: LemmaState[]) => LemmaState[];
