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
        
        // Find all unsynced participants
        const unsynced = await db.participants.filter(p => p.synced === false).toArray();
        
        if (unsynced.length === 0) {
          isSyncing = false;
          return;
        }

        // Prepare data for Supabase (only send exactly what the DB expects)
        const dataToInsert = unsynced.map(p => {
          return {
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
          };
        });

        // Insert into Supabase
        const { error } = await supabase
          .from('participants')
          .insert(dataToInsert);

        if (error) {
          console.error("Erro ao sincronizar com o Supabase:", error);
          isSyncing = false;
          return;
        }

        // If success, mark as synced locally
        for (const p of unsynced) {
          if (p.id) {
            await db.participants.update(p.id, { synced: true });
          }
        }
        
        console.log(`Sincronizados ${unsynced.length} registros com sucesso!`);
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

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
