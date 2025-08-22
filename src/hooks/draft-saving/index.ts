import { useState, useCallback, useEffect } from 'react';

export interface DraftData {
  id: string;
  formType: string;
  data: Record<string, any>;
  lastSaved: number;
  expiresAt?: number;
}

const DRAFTS_KEY = 'preclinic-drafts';
const DEFAULT_EXPIRY_DAYS = 7;

export const useDraftSaving = (formType: string, formId?: string) => {
  const draftId = formId || `${formType}-${Date.now()}`;
  const [draftKey] = useState(draftId);

  const [drafts, setDrafts] = useState<Record<string, DraftData>>(() => {
    try {
      const stored = localStorage.getItem(DRAFTS_KEY);
      const allDrafts = stored ? JSON.parse(stored) : {};
      
      const now = Date.now();
      const validDrafts: Record<string, DraftData> = {};
      
      Object.entries(allDrafts).forEach(([key, draft]) => {
        const draftData = draft as DraftData;
        if (!draftData.expiresAt || draftData.expiresAt > now) {
          validDrafts[key] = draftData;
        }
      });
      
      return validDrafts;
    } catch {
      return {};
    }
  });

  const saveDraft = useCallback((data: Record<string, any>, expiryDays = DEFAULT_EXPIRY_DAYS) => {
    const now = Date.now();
    const expiresAt = now + (expiryDays * 24 * 60 * 60 * 1000);
    
    const draftData: DraftData = {
      id: draftKey,
      formType,
      data,
      lastSaved: now,
      expiresAt,
    };

    setDrafts(prev => {
      const updated = { ...prev, [draftKey]: draftData };
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [draftKey, formType]);

  const loadDraft = useCallback((): Record<string, any> | null => {
    const draft = drafts[draftKey];
    if (draft && (!draft.expiresAt || draft.expiresAt > Date.now())) {
      return draft.data;
    }
    return null;
  }, [drafts, draftKey]);

  const deleteDraft = useCallback(() => {
    setDrafts(prev => {
      const updated = { ...prev };
      delete updated[draftKey];
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [draftKey]);

  const getAllDrafts = useCallback((filterByFormType?: string) => {
    const now = Date.now();
    return Object.values(drafts)
      .filter(draft => !draft.expiresAt || draft.expiresAt > now)
      .filter(draft => !filterByFormType || draft.formType === filterByFormType)
      .sort((a, b) => b.lastSaved - a.lastSaved);
  }, [drafts]);

  const clearExpiredDrafts = useCallback(() => {
    const now = Date.now();
    setDrafts(prev => {
      const updated: Record<string, DraftData> = {};
      Object.entries(prev).forEach(([key, draft]) => {
        if (!draft.expiresAt || draft.expiresAt > now) {
          updated[key] = draft;
        }
      });
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    clearExpiredDrafts();
  }, [clearExpiredDrafts]);

  return {
    saveDraft,
    loadDraft,
    deleteDraft,
    getAllDrafts,
    clearExpiredDrafts,
    draftExists: !!drafts[draftKey],
    lastSaved: drafts[draftKey]?.lastSaved,
  };
};