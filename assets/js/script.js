
const getmonedas = async function(){

    try {
        let monedas = await fetch("https://mindicador.cl/api/")
        let data = await monedas.json()
        //guardamos los valores del dolar y euro en variables
        let valordolar = data.dolar.valor;
        let valoreuro = data.euro.valor;
        let valoruf = data.uf.valor

        return {valordolar, valoreuro, valoruf}

        // console.log(valordolar)
        // console.log(valoreuro)

        // return{
        //     valordolar,
        //     valoreuro
        // }

    } catch (error) {
        console.log("Error al cargar la API",error)
        resultado.innerHTML = `<p><strong>Error al cargar la API</strong></p>`
    }

    
}

getmonedas()

const input = document.getElementById("pesos_CLP");
const btn = document.getElementById("Buscar")
const conversion = document.getElementById("resultado");
const selectmoneda = document.getElementById("Selec_moneda");

//cuando hacemos click al boton
btn.addEventListener("click",async() =>{

    
    const monedas = await getmonedas();
    const monto = input.value;
    const tipomoneda = selectmoneda.value;

    console.log("valor a convertir: " + monto)
    console.log("Precio del dolar: " + monedas.valordolar)
    console.log("Precio del Euro: " + monedas.valoreuro)
    console.log("Precio de la UF: " + monedas.valoruf)

    if(tipomoneda == "UF"){

        const montofinal = (monto/monedas.valoruf);
        console.log("el total es: " + montofinal)
        resultado.innerHTML = `<strong>${montofinal.toFixed(2)} UF</strong>`
    }
    
    if(tipomoneda == "USD"){

        const montofinal = (monto/monedas.valordolar);
        console.log("el total es: " + montofinal)
        resultado.innerHTML = `<strong>$${montofinal.toFixed(2)} Dolares</strong>`
        if(montofinal >= 1 && montofinal < 2){
            resultado.innerHTML = `<strong>$ ${montofinal} Dolar</strong>`
        }
    }

    if(tipomoneda == "EUR"){

        const montofinal = (monto/monedas.valoreuro);
        console.log("el total es: " + montofinal)
        resultado.innerHTML = `<strong>€${montofinal.toFixed(2)} Euros</strong>`
        if(montofinal >= 1 && montofinal < 2){
            resultado.innerHTML = `<strong>€ ${montofinal} Euro</strong>`
        }
    }
    
    input.value = "";
})


