"use client";

import { useEffect } from "react";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export default function SyncEngine() {
  useEffect(() => {
    // Flag to prevent overlapping syncs
    let isSyncing = false;

    const syncData = async () => {
      if (isSyncing || !navigator.onLine) return;
      
      try {
        isSyncing = true;
        
        // Encontra todos que não estão sincronizados (mesmo incompletos)
        const unsynced = await db.participants.filter(p => p.synced === false).toArray();
        
        if (unsynced.length === 0) {
          isSyncing = false;
          return;
        }

        // Processa um por um para evitar duplicatas (update se já existir CPF, insert se não)
        for (const p of unsynced) {
          const payload = {
            cpf: p.cpf,
            fullName: p.fullName,
            displayName: p.displayName,
            whatsapp: p.whatsapp || "",
            email: p.email || "",
            city: p.city || "",
            state: p.state || "",
            termsAccepted: p.termsAccepted || false,
            festivalAccepted: p.festivalAccepted || false,
            sponsorAccepted: p.sponsorAccepted || false,
            score: p.score,
            timeMs: p.timeMs,
            playedAt: p.playedAt,
            ip: p.ip || null
          };

          // Verifica se o lead já existe na nuvem pelo CPF
          const { data: existingLead } = await supabase
            .from('participants')
            .select('id')
            .eq('cpf', p.cpf)
            .maybeSingle();

          let syncError = null;

          if (existingLead?.id) {
            // Atualiza o registro existente (ex: pessoa terminou o quiz e agora tem pontuação)
            const { error } = await supabase
              .from('participants')
              .update(payload)
              .eq('id', existingLead.id);
            syncError = error;
          } else {
            // Cria um novo registro
            const { error } = await supabase
              .from('participants')
              .insert([payload]);
            syncError = error;
          }

          if (syncError) {
            console.error(`Erro ao sincronizar CPF ${p.cpf}:`, syncError);
          } else if (p.id) {
            // Marca como sincronizado localmente se deu certo
            await db.participants.update(p.id, { synced: true });
          }
        }
        
        console.log(`Sincronização processou ${unsynced.length} registros.`);
      } catch (err) {
        console.error("Falha no SyncEngine:", err);
      } finally {
        isSyncing = false;
      }
    };

    // Run sync every 10 seconds
    const intervalId = setInterval(syncData, 10000);
    
    // Also run once on mount after 2 seconds
    const timeoutId = setTimeout(syncData, 2000);

    // Listen for manual trigger (e.g. quiz completion)
    const handleForceSync = () => { syncData(); };
    window.addEventListener('force-sync', handleForceSync);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      window.removeEventListener('force-sync', handleForceSync);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
