# Página de notificación de calificaciones de [Moodle](https://moodle.org/)

Como docente utilizo [Moodle](https://moodle.org/) como herramienta para la gestión de contenidos, actividades y calificaciones de mis alumnos. En el contexto de la educación secundaria (Argentina) es importante notificar constantemente a los padres/tutores del desempeño de los estudiantes. Tradicionalmente se usa el cuaderno de comunicados que obliga a los docentes destinar un tiempo valioso de clase a la actualización manual de las notas.

La ventaja de usar [Moodle](https://moodle.org/) como gestor de calificaciones es que permite tener un registro actualizado y detallado de todas las calificaciones. Sin embargo, el uso de la plataforma no esta libre de fricciones y es prácticamente inmanejable para los padres/tutores. Por ello, este conjuntos de herramientas tiene la intensión de producir una página web de fácil acceso y dónde queden plasmadas todas las calificaciones de la plataforma [Moodle](https://moodle.org/).

## Forma de implementación 

- Scripting en [Node.js](https://nodejs.org)
- Web scraping mediante la librería [Pupperteer](https://pptr.dev/) 

La plataforma [Moodle](https://moodle.org/) permite usar una API pero es necesario que estén habilitada. Muchas veces los docentes trabajamos en instancias de Moodle dónde no somos administradores y/o dónde no pueden habilitarnos los permisos necesarios. Por esta razón se eligió hacer web scrapting del cuaderno de calificaciones.

## Flujo de información 

1. Ingreso a la dirección donde se puede hacer una exportación de las calificaciones en formato csv. En Moodle eso se encuentra en 
```
https//dominio_mooodle/grade/export/txt/index.php?id=ID_DEL_CURSO
```
2. La plataforma pide las credenciales del docente, se ingrensan.
3. Se descarga en formato .csv las calificaciones del curso.

Estas acciones de actualización de calificaciones se puede automatizar con el uso del crontab. Esta operación además permite tener un backup de las calificaciones por posibles inconvenientes con la plataforma Moodle.

4. Se despliega una página con un formulario para ingresar el curso y el documento de identidad del alumno. Enviados los datos, la página devuelve todas las calificaciones del archivo .csv del alumno con un formato enriquecido. 

## Tipos de calificaciones

Las calificaciones se separarán en tres categorías: 
- _Trabajos prácticos (TP)_: son tareas realizadas en clase presencial, generalmente en grupo y con el ayuda del docente.
- _Actividades virtuales (AV)_: son tareas que se realizan en forma autónoma y asincrónica.
- _Evaluaciones (EV)_: Instancias de pruebas escritas y/o lecciones orales.


## TODO

- [ ] Implementar variables de entorno para cada curso y las credenciales.
- [x] Iniciar sesión en el sitio Moodle del curso y bajar el archivo csv.
- [ ] Hacer la página con el formulario seleccionar el curso y consultar las notas del estudiante.
- [ ] Mostrar las notas en formato enriquecido.
- [ ] Servicio de notificaciones con un bot de Telegram para saber cuando se realizaron las actualizaciones y el estado de las mismas.


