PORTAFOLIO UPLA - VERSIÓN FINAL CORREGIDA

Página pública:
- MI PORTAFOLIO + explicación cuando no hay sesión.
- Trabajos visibles y descargables.
- 2 cursos, 4 períodos por curso, 4 semanas por período.
- No permite subir ni eliminar.

Con sesión iniciada:
- La misma pantalla visual muestra los datos del usuario.
- Panel privado con la misma identidad visual.
- Subir trabajos por curso/período/semana/actividad.
- Ver y eliminar trabajos propios.
- Mantiene el mismo proyecto Supabase.

REGLAS DE ALGORITMOS
- Semana 1: exactamente 2 actividades (Actividad 1 y Actividad 2).
- Semana 2: exactamente 1 actividad (Actividad 1).
- Semana 3: NO se modifica la configuración existente.
- Semana 4: NO se modifica la configuración existente.

CORRECCIÓN DEL ERROR DE CARGA
El proyecto intenta usar la columna public.trabajos.actividad para separar las entregas.
Ejecuta supabase_upgrade.sql en el SQL Editor de Supabase para crear la columna y recargar
la caché de PostgREST.

Además, el JavaScript incluye compatibilidad para instalaciones donde la columna todavía
no haya sido creada: las nuevas entregas se guardan con el número de actividad en el título
(por ejemplo, "Actividad 2 - Inventario de Computadoras UPLA") y la interfaz oculta ese
prefijo al mostrar el trabajo. Los trabajos anteriores no se modifican.

IMPORTANTE
- No se borran trabajos existentes.
- No se reasignan trabajos existentes.
- No se modifica la Semana 3.
