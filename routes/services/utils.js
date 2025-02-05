const moment = require('moment');

/**
 * Calcula la edad a partir de la fecha de nacimiento.
 * @param {string} birthdate - La fecha de nacimiento en formato YYYY-MM-DD.
 * @returns {number} - Edad en años.
 */
function calculateAge(birthdate) {
    if (!birthdate) throw new Error("La fecha de nacimiento es requerida.");

    const birthMoment = moment(birthdate, "YYYY-MM-DD");
    if (!birthMoment.isValid()) throw new Error("Formato de fecha inválido.");

    return moment().diff(birthMoment, 'years');
}

function formatDate(date) {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
}

function groupAnalisys(data) {
    // Agrupamos por 'analisis'
    const groupedByAnalisis = Object.values(
        data.reduce((acc, curr) => {
            // Si aún no existe el análisis en el acumulador, lo creamos
            if (!acc[curr.analisis]) {
                acc[curr.analisis] = {
                    analisis: curr.analisis, // Nombre del análisis
                    pruebas: [] // Inicializamos un array vacío para las pruebas
                };
            }
            // Agregamos la prueba al array correspondiente
            acc[curr.analisis].pruebas.push({
                prueba: curr.prueba,
                resultado: curr.resultado,
                indicador: curr.indicador,
            });

            return acc;
        }, {})
    );
    return groupedByAnalisis;
}

module.exports = { calculateAge, formatDate, groupAnalisys };
