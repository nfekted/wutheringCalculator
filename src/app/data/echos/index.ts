import { EchoData, EchoValues, SonataData } from './echo-data.model';

import echoValues from './echo-values.json';
import echos from './echos.json';
import sonatas from './sonatas.json';

export const ECHO_VALUES = echoValues as unknown as EchoValues;
export const ECHOS = echos as unknown as EchoData[];
export const SONATAS = sonatas as SonataData[];

export function getEcho(id: number): EchoData | undefined {
  return ECHOS.find(e => e.id === id);
}

export function getSonata(id: number): SonataData | undefined {
  return SONATAS.find(s => s.id === id);
}
