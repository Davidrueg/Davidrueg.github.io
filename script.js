
async function init(){
    document.body.innerHTML = '';
    if (getCountriesFromLocal() === null) {
        let data = await getAllCountries();
        data = JSON.stringify(sortData(data));
        localStorage.setItem('countries',data);
    }

    getCountriesFromLocal().forEach((country) => {
        document.body.innerHTML += country + '<br>';
    });
}

async function getAllCountries(){
    let jsonResult = '';
    const url = 'https://restcountries.com/v3.1/all';

    let requestOptions = {
        method: 'GET'
    };

    let result = await fetch(url,requestOptions);
    let data = result.json();

    return data;
}

function sortData(data){
    let sortedList = [];
    data.forEach(country => {
        sortedList.push(country['name']['common']);
    });
    return sortedList;
}


function getCountriesFromLocal(){
    return listCountries = JSON.parse(localStorage.getItem('countries'));
}

init();