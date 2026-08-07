import type { Patient } from '~~/shared/types/models/patient';

export default defineEventHandler(async (event) => {
  const body = await readBody<Patient>(event);

  return await apiFetch<Patient>(event, '/patients', {
    method: 'POST',
    body,
  });
});
