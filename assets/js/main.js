const pokeApi = {}

class Pokemon {
    constructor() {
        this.number = '';
        this.name = '';
        this.types = [];
        this.type = '';
        this.photo = '';
    }
}

function convertPokeDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonsDetail = (pokemon) => {
    return fetch(pokemon.url)
                .then((response) => response.json())
                .then(convertPokeDetailToPokemon)
}
pokeApi.getPokemons = (offset = 0, limit = 200) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url).then((response) => response.json())
                                        .then((jsonBody) => jsonBody.results)
                                        .then((pokemons) => pokemons.map(pokeApi.getPokemonsDetail))
                                        .then((detailRequests) => Promise.all(detailRequests))
                                        .then((pokemonsDetails) => pokemonsDetails)
}

const pokemonsTypes = document.getElementById("pokemonsTypes");
const pokemonList = document.querySelector(".pokemons");

function filterPokemonList() {
    // Obtém o tipo selecionado no menu suspenso
    const selectedType = pokemonsTypes.value;

    // Limpa a lista de Pokémon existente
    pokemonList.innerHTML = "";

    // Obtém a lista de Pokémon da API
    pokeApi.getPokemons()
        .then(pokemonsDetails => {
            // Filtra e exibe apenas os Pokémon do tipo selecionado
            pokemonsDetails.forEach(pokemon => {
                const pokemonTypes = pokemon.types;
                if (selectedType === "" || pokemonTypes.includes(selectedType)) {
                    const listItem = document.createElement("li");
                    listItem.innerHTML = `<li class="pokemon ${pokemon.type}">
                    <span class="number">#${pokemon.number}</span>
                    <a class="a-link-default" href="https://www.google.com/search?q=${pokemon.name}" target="_blank"><span class="name">${pokemon.name}</span></a>
                    
                    <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type} typeOrigin" >${type}</li>`).join('')}
                        </ol>
                        <img src="${pokemon.photo}" 
                        alt="${pokemon.name}">
                    </div>
                </li>`;
                    pokemonList.appendChild(listItem);
                }
            });
        });
}

// Event listener para o menu suspenso de tipos de Pokémon
pokemonsTypes.addEventListener("change", filterPokemonList);

// Inicialmente, exibe todos os Pokémon
filterPokemonList();