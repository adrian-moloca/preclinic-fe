import { useMemo, useState, useCallback } from 'react';
import { usePatientsContext } from '../../providers/patients';
import { useAppointmentsContext } from '../../providers/appointments';
import { usePrescriptionContext } from '../../providers/prescriptions';
import { useProductsContext } from '../../providers/products';
import { useDoctorsContext } from '../../providers/doctor/context';
import { useAssistentsContext } from '../../providers/assistent';
import { SearchHistory, SearchResult } from '../../components/global-serch/components/types';

const SEARCH_HISTORY_KEY = 'preclinic-search-history';
const MAX_HISTORY_ITEMS = 10;

export const useGlobalSearch = () => {
  const { patients } = usePatientsContext();
  const { appointments } = useAppointmentsContext();
  const { prescription } = usePrescriptionContext();
  const { products } = useProductsContext();
  const { doctors } = useDoctorsContext();
  const { assistents } = useAssistentsContext();

  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const allData = useMemo(() => {
    try {
      const allPatients = Array.isArray(patients) ? patients : [];
      const allAppointments = Array.isArray(appointments) ? appointments : [];
      const allPrescriptions = prescription ? Object.values(prescription) : [];
      const allProducts = Array.isArray(products) ? products : [];
      const allDoctors = Array.isArray(doctors) ? doctors : [];
      const allAssistents = Array.isArray(assistents) ? assistents : [];

      return {
        patients: allPatients,
        appointments: allAppointments,
        prescriptions: allPrescriptions,
        products: allProducts,
        doctors: allDoctors,
        assistents: allAssistents,
      };
    } catch (error) {
      console.error('Error processing data:', error);
      return {
        patients: [],
        appointments: [],
        prescriptions: [],
        products: [],
        doctors: [],
        assistents: [],
      };
    }
  }, [patients, appointments, prescription, products, doctors, assistents]);

  const searchGlobally = useCallback((query: string): SearchResult[] => {
    if (!query || !query.trim()) return [];
    
    try {
      const normalizedQuery = query.toLowerCase().trim();
      const results: SearchResult[] = [];

      if (allData.patients) {
        allData.patients.forEach(patient => {
          try {
            const fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase();
            const searchFields = [
              fullName,
              patient.email?.toLowerCase(),
              patient.phoneNumber?.toLowerCase(),
              patient.address?.toLowerCase(),
            ].filter(Boolean);

            if (searchFields.some(field => field?.includes(normalizedQuery))) {
              results.push({
                id: patient._id,
                type: 'patient',
                title: `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
                subtitle: patient.email || patient.phoneNumber || '',
                description: patient.address || '',
                route: `/patients/${patient._id}`,
                avatar: patient.profileImg,
              });
            }
          } catch (error) {
            console.error('Error processing patient:', error);
          }
        });
      }

      if (allData.appointments) {
        allData.appointments.forEach(appointment => {
          try {
            const patient = allData.patients.find(p => p._id === appointment.patientId);
            const patientName = patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase() : '';
            const searchFields = [
              patientName,
              appointment.reason?.toLowerCase(),
              appointment.type?.toLowerCase(),
              appointment.status?.toLowerCase(),
              appointment.date,
            ].filter(Boolean);

            if (searchFields.some(field => field?.includes(normalizedQuery))) {
              results.push({
                id: appointment.id ?? '',
                type: 'appointment',
                title: `Appointment - ${patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : 'Unknown Patient'}`,
                subtitle: `${appointment.date} at ${appointment.time}`,
                description: appointment.reason || '',
                route: `/appointments/${appointment.id}`,
                status: appointment.status,
                date: appointment.date,
              });
            }
          } catch (error) {
            console.error('Error processing appointment:', error);
          }
        });
      }

      if (allData.prescriptions) {
        allData.prescriptions.forEach(prescriptionItem => {
          try {
            const patient = allData.patients.find(p => p._id === prescriptionItem.patientId);
            const patientName = patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.toLowerCase() : '';
            const medicationNames = prescriptionItem.medications?.map(m => m.name?.toLowerCase()).join(' ') || '';
            const searchFields = [
              patientName,
              medicationNames,
              prescriptionItem.diagnosis?.toLowerCase(),
              prescriptionItem.notes?.toLowerCase(),
            ].filter(Boolean);

            if (searchFields.some(field => field?.includes(normalizedQuery))) {
              results.push({
                id: prescriptionItem.id ?? '',
                type: 'prescription',
                title: `Prescription - ${patient ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim() : 'Unknown Patient'}`,
                subtitle: prescriptionItem.diagnosis || 'No diagnosis',
                description: prescriptionItem.medications?.map(m => m.name).join(', ') || '',
                route: `/prescriptions/${prescriptionItem.id}`,
                date: prescriptionItem.dateIssued,
              });
            }
          } catch (error) {
            console.error('Error processing prescription:', error);
          }
        });
      }

      return results.slice(0, 50);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }, [allData]);

  const addToSearchHistory = useCallback((query: string, resultsCount: number) => {
    try {
      const newEntry: SearchHistory = {
        id: crypto.randomUUID(),
        query: query.trim(),
        timestamp: new Date().toISOString(),
        resultsCount,
      };

      setSearchHistory(prev => {
        const filtered = prev.filter(item => item.query.toLowerCase() !== query.toLowerCase());
        const newHistory = [newEntry, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (error) {
      console.error('Error adding to search history:', error);
    }
  }, []);

  const clearSearchHistory = useCallback(() => {
    try {
      setSearchHistory([]);
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing search history:', error);
    }
  }, []);

  const removeFromSearchHistory = useCallback((id: string) => {
    try {
      setSearchHistory(prev => {
        const newHistory = prev.filter(item => item.id !== id);
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (error) {
      console.error('Error removing from search history:', error);
    }
  }, []);

  return {
    searchGlobally,
    searchHistory,
    addToSearchHistory,
    clearSearchHistory,
    removeFromSearchHistory,
    allData,
  };
};