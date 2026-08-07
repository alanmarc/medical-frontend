export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'El ID del paciente es obligatorio.',
    });
  }

  // Control de acceso de grano fino para eliminar datos médicos sensibles
  const session = await getUserSession(event);
  const userRole = (session?.user as { role?: string })?.role;

  if (userRole === 'user' || !userRole) {
    throw createError({
      statusCode: 403,
      statusMessage: 'No tienes permisos suficientes para eliminar expedientes de pacientes.',
    });
  }

  return await apiFetch<{ success: boolean; message?: string }>(event, `/patients/${id}`, {
    method: 'DELETE',
  });
});
