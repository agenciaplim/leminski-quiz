import Dexie, { type EntityTable } from 'dexie';

export interface Participant {
  id?: number;
  cpf: string;
  fullName: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  displayName: string;
  termsAccepted: boolean;
  festivalAccepted: boolean;
  sponsorAccepted: boolean;
  score: number;
  timeMs: number;
  playedAt: number;
  synced: boolean;
}

const db = new Dexie('LeminskiQuizDB') as Dexie & {
  participants: EntityTable<Participant, 'id'>;
};

// Configuração do schema (versão 1)
db.version(1).stores({
  participants: '++id, cpf, score, timeMs, playedAt, synced'
});

export { db };
