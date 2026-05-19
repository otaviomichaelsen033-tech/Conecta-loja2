let map = L.map('map').setView([-25.4, -54.5], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:19
}).addTo(map);

let clientes = {};
let rota;
let minhaPosicao;

// ===== ATUALIZAR TABELA =====
function atualizarTabela(){

    let corpo = document.querySelector("#tabelaClientes tbody");
    corpo.innerHTML="";

    for(let nome in clientes){

        let c = clientes[nome];

        let linha = `
        <tr>
            <td>${nome}</td>
            <td>${c.lat}</td>
            <td>${c.lng}</td>
        </tr>
        `;

        corpo.innerHTML += linha;
    }
}

// ===== ADICIONAR CLIENTE =====
function adicionarCliente(){

    let nome=document.getElementById("nome").value;
    let lat=parseFloat(document.getElementById("lat").value);
    let lng=parseFloat(document.getElementById("lng").value);

    if(!nome || isNaN(lat)||isNaN(lng)){
        alert("Preencha corretamente");
        return;
    }

    let marker=L.marker([lat,lng])
        .addTo(map)
        .bindPopup(nome);

    marker.on("click",()=>{
        navegarAte(lat,lng);
    });

    clientes[nome]={
        marker:marker,
        lat:lat,
        lng:lng
    };

    atualizarTabela();

    alert("Cliente adicionado!");
}

// ===== EXCLUIR CLIENTE =====
function excluirCliente(){

    let nome=document.getElementById("nome").value;

    if(clientes[nome]){

        map.removeLayer(clientes[nome].marker);

        delete clientes[nome];

        atualizarTabela();

        alert("Cliente removido!");
    }else{
        alert("Cliente não encontrado");
    }
}

// ===== MINHA LOCALIZAÇÃO =====
function minhaLocalizacao(){

    navigator.geolocation.getCurrentPosition(pos=>{

        minhaPosicao=[
            pos.coords.latitude,
            pos.coords.longitude
        ];

        L.marker(minhaPosicao)
            .addTo(map)
            .bindPopup("Você está aqui")
            .openPopup();

        map.setView(minhaPosicao,15);
    });
}

// ===== NAVEGAÇÃO =====
function navegarAte(destLat,destLng){

    if(!minhaPosicao){
        alert("Clique primeiro em Minha localização");
        return;
    }

    if(rota){
        map.removeLayer(rota);
    }

    fetch(`https://router.project-osrm.org/route/v1/driving/
${minhaPosicao[1]},${minhaPosicao[0]};
${destLng},${destLat}?overview=full&geometries=geojson`)

    .then(r=>r.json())
    .then(data=>{

        let coords=data.routes[0].geometry.coordinates
            .map(c=>[c[1],c[0]]);

        rota=L.polyline(coords,{weight:6})
            .addTo(map);

        map.fitBounds(rota.getBounds());
    });
}