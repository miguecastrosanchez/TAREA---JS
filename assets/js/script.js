const input = document.getElementById("pesos_CLP");
const btn = document.getElementById("Buscar");
const conversion = document.getElementById("resultado");
const selectmoneda = document.getElementById("Selec_moneda");

let miGrafico = null;

const getmonedas = async function(){

    try {
        let monedas = await fetch("https://mindicador.cl/api/");
        let data = await monedas.json();

        let valordolar = data.dolar.valor;
        let valoreuro = data.euro.valor;
        let valoruf = data.uf.valor;

        return {valordolar, valoreuro, valoruf};

    } catch (error) {
        console.log("Error al cargar la API", error);
        conversion.innerHTML = `<strong>Error al cargar la API</strong>`;
    }
};

getmonedas();

// FUNCIÓN NUEVA: OBTENER HISTORIAL DE LA MONEDA
const getHistorial = async function(monedaSeleccionada) {
    try {
        let tipoIndicador = "";

        if (monedaSeleccionada === "USD") {
            tipoIndicador = "dolar";
        } else if (monedaSeleccionada === "EUR") {
            tipoIndicador = "euro";
        } else if (monedaSeleccionada === "UF") {
            tipoIndicador = "uf";
        }

        let respuesta = await fetch(`https://mindicador.cl/api/${tipoIndicador}`);
        let data = await respuesta.json();

        let ultimos10dias = data.serie.slice(0, 10).reverse();

        let labels = ultimos10dias.map((item) => {
            let fecha = new Date(item.fecha);
            return fecha.toLocaleDateString("es-CL");
        });

        let valores = ultimos10dias.map((item) => item.valor);

        return { labels, valores, tipoIndicador };

    } catch (error) {
        console.log("Error al obtener historial", error);
    }
};

// FUNCIÓN NUEVA: DIBUJAR GRÁFICO
const renderGrafico = async function(monedaSeleccionada) {
    const historial = await getHistorial(monedaSeleccionada);

    if (!historial) return;

    const ctx = document.getElementById("graficoMoneda");

    if (miGrafico) {
        miGrafico.destroy();
    }

    miGrafico = new Chart(ctx, {
        type: "line",
        data: {
            labels: historial.labels,
            datasets: [{
                label: `Historial últimos 10 días (${monedaSeleccionada})`,
                data: historial.valores,
                borderColor: "#db7ec2",
                backgroundColor: "rgba(219, 126, 194, 0.2)",
            }]
        }
    });
};

//cuando hacemos click al boton
btn.addEventListener("click", async () => {

    const monedas = await getmonedas();
    const monto = Number(input.value);
    const tipomoneda = selectmoneda.value;

    console.log("valor a convertir: " + monto);
    console.log("Precio del dolar: " + monedas.valordolar);
    console.log("Precio del Euro: " + monedas.valoreuro);
    console.log("Precio de la UF: " + monedas.valoruf);

    if (monto <= 0 || tipomoneda === "") {
        conversion.innerHTML = `<strong>Ingresa un monto y selecciona una moneda</strong>`;
        return;
    }

    if (tipomoneda == "UF") {
        const montofinal = (monto / monedas.valoruf);
        console.log("el total es: " + montofinal);
        conversion.innerHTML = `<strong>${montofinal.toFixed(2)} UF</strong>`;
    }
    
    if (tipomoneda == "USD") {
        const montofinal = (monto / monedas.valordolar);
        console.log("el total es: " + montofinal);
        conversion.innerHTML = `<strong>$${montofinal.toFixed(2)} Dólares</strong>`;

        if (montofinal >= 1 && montofinal < 2) {
            conversion.innerHTML = `<strong>$${montofinal.toFixed(2)} Dólar</strong>`;
        }
    }

    if (tipomoneda == "EUR") {
        const montofinal = (monto / monedas.valoreuro);
        console.log("el total es: " + montofinal);
        conversion.innerHTML = `<strong>€${montofinal.toFixed(2)} Euros</strong>`;

        if (montofinal >= 1 && montofinal < 2) {
            conversion.innerHTML = `<strong>€${montofinal.toFixed(2)} Euro</strong>`;
        }
    }

    // NUEVO: MOSTRAR EL GRÁFICO
    renderGrafico(tipomoneda);

    input.value = "";
});