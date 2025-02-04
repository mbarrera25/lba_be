class resultDto{
    constructor(
        analisis,
        prueba,
        resultado,
        indicador
    ){
        this.analisis = analisis;
        this.prueba = prueba;
        this.resultado = resultado;
        this.indicador = indicador;
    }
}
module.exports = resultDto;