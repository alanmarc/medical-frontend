import type { Patient } from '~~/shared/types/models/patient';

export default defineEventHandler(async (event) => {
  return await apiFetch<Patient[]>(event, '/patients');
});
