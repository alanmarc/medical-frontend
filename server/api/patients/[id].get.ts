import type { Patient } from '~~/shared/types/models/patient';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El ID del paciente es obligatorio.',
    });
  }

  return await apiFetch<Patient>(event, `/patients/${id}`);
});
