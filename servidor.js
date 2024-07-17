const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;
const filePath = './listas/20244aIAF Calificaciones-20240717_0402-comma_separated.csv'; // Reemplaza con la ruta real de tu archivo CSV

app.get('/:email', (req, res) => {
  const emailToFind = req.params.email;
  let found = false;
  console.log(`Petición ${emailToFind}`)
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      if (row['Dirección de correo'] === emailToFind && found === false) {
        found = true;
        const notas = {
          'Nombre': row['Nombre'],
          'Apellido': row['Apellido(s)'],
          'Evaluaciones': filtrarNotas(row, 'EV '),
          'Notas de actividades virtual': filtrarNotas(row, 'AV '),
          'Notas de trabajos prácticos': filtrarNotas(row, 'TP '),
        };

        res.json(notas);
        // Termina el proceso de lectura después de encontrar la fila
      }
    })
    .on('end', () => {
      if (!found) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    })
    .on('error', (error) => {
      console.error('Error al leer el archivo CSV:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

app.listen(PORT, HOST = '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


const filtrarNotas = (notasAlumno, prefijo) => {
  // Busca todos los key que contienen el filtro en forma de expresión regular.
  const filtroRegExp = new RegExp(`${prefijo}`)
  const keyNotas = Object.keys(notasAlumno).filter((key) => filtroRegExp.test(key));
  const arrayNotasAlumno = keyNotas.map((key) => {
    const nota = {}
    const nombreNotaLimpio = limpiarNombreNota(key, prefijo)
    nota[nombreNotaLimpio] = notasAlumno[key]
    return nota;
  })
  return arrayNotasAlumno;
}

const limpiarNombreNota = (nombreNotaAModificar, prefijo) => {
  const filtroInicialRegExp = new RegExp(`^.+${prefijo}`, "g");
  const nombreNotaNuevo = nombreNotaAModificar
    .replace(filtroInicialRegExp, prefijo)
  return nombreNotaNuevo
}
