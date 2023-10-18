const select = document.getElementById('selectCountry');
const sorter = MySort('AaÀàÁáÂâÃãÄäÅåĀāĂăĄąǍǎǺǻÆæBbCcÇçĆćĈĉĊċČčDdĎďĐđEeÈèÉéÊêËëĒēĔĕĖėĘęĚěFfGgĜĝĞğĠġĢģǦǧHhĤĥĦħIiÌìÍíÎîÏïĨĩĪīĬĭĮįİıǏǐJjĴĵKkĶķǨǩLlĹĺĻļĽľĿŀŁłMmNnÑñŃńŅņŇňŉŊŋOoÒòÓóÔôÕõÖöØøŌōŎŏŐőƠơǑǒPpQqRrŔŕŖŗŘřSsŚśŜŝŞşŠšTtŢţŤťŦŧUuÙùÚúÛûÜüŨũŪūŬŭŮůŰűŲųŴŵXxYyÝýŶŷŸÿZzŹźŻżŽž');
const alphabet = 'AaÀàÁáÂâÃãÄäÅåĀāĂăĄąǍǎǺǻÆæBbCcÇçĆćĈĉĊċČčDdĎďĐđEeÈèÉéÊêËëĒēĔĕĖėĘęĚěFfGgĜĝĞğĠġĢģǦǧHhĤĥĦħIiÌìÍíÎîÏïĨĩĪīĬĭĮįİıǏǐJjĴĵKkĶķǨǩLlĹĺĻļĽľĿŀŁłMmNnÑñŃńŅņŇňŉŊŋOoÒòÓóÔôÕõÖöØøŌōŎŏŐőƠơǑǒPpQqRrŔŕŖŗŘřSsŚśŜŝŞşŠšTtŢţŤťŦŧUuÙùÚúÛûÜüŨũŪūŬŭŮůŰűŲųŴŵXxYyÝýŶŷŸÿZzŹźŻżŽž';
/**
 * 
 * @param {*} date 
 * @param {*} h heures que l'on veut ajouter à la date
 * @returns la date avec les heures ajoutées
 */
function addHours(date, h) {
    date = (date + (h*60*60*1000));
    return date;
}

/**
 * fonction executée au lancement de l'app
 */
async function init(){
    if (!('countries' in localStorage)) {
        let data = await getAllCountries();
        data = JSON.stringify(sortData(data));
        localStorage.setItem('countries',data);
        localStorage.setItem('expDate',addHours(Date.now(),1));
    }
    if (('expDate' in localStorage)) {
        if (Date.now() > getExpDateFromLocal()) {
            let data = await getAllCountries();
            data = JSON.stringify(sortData(data));
            localStorage.setItem('countries',data);
            localStorage.setItem('expDate',addHours(Date.now(),1));
        }
    }
    getCountriesFromLocal().forEach((country) => {
        createCountryLabel(country);
    });
}
/**
 * 
 * @returns {data} les données apres la requete get à https://restcountries.com/v3.1/all
 */
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

/**
 * prends le resultat de la requete get à l'API le trie et renvoie les elements importants (pour l'instant que les pays)
 * @param {*} data 
 * @returns {Array} The array of countries sorted by name
 */
function sortData(data){
    let list = Array();
    data.forEach(country => {
        let c = {
            frenchName : country['translations']['fra']['official'],
            flag : country['flags']['png']
        }
        list.push(c);
    });
    list.sort((a, b) => {
        var index_a = alphabet.indexOf(a.frenchName[0]),
        index_b = alphabet.indexOf(b.frenchName[0]);
        if (index_a === index_b) {
            if (a.frenchName < b.frenchName) {
                return -1;
            } else if (a.frenchName > b.frenchName) {
                return 1;
            }
            return 0;
        } else {
            return index_a - index_b;
        }
    });
    return list;
}

/**
 * 
 * @returns tout les pays stockés dans le localhost
 */
function getCountriesFromLocal(){
    return listCountries = JSON.parse(localStorage.getItem('countries'));
}

/**
 * 
 * @returns la date d'expiration des pays
 */
function getExpDateFromLocal(){
    return expirationDate = JSON.parse(localStorage.getItem('expDate'));
}

/**
 * NOT USED ANYMORE !!!
 * @param {*} alphabet un string avec touts les caractères à trier dans l'ordre 
 * @returns une fonction pour sort une liste
 */
function MySort(alphabet)
{
    return function(a, b) {
        var index_a = alphabet.indexOf(a[0]),
        index_b = alphabet.indexOf(b[0]);

        if (index_a === index_b) {
            // same first character, sort regular
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            }
            return 0;
        } else {
            return index_a - index_b;
        }
    }
}

/**
 * 
 * @param {string} countryName 
 */
function createCountryLabel(country){
    
    let w3PanelDiv = document.createElement("div");
    w3PanelDiv.classList.add("w3-panel");
    
    let w3RowDiv = document.createElement("div");
    w3RowDiv.classList.add("w3-row");
    
    let w3ColS3Div = document.createElement("div");
    w3ColS3Div.classList.add("w3-col", "s3");
    
    let imgElement = document.createElement("img");
    imgElement.src = country.flag;
    imgElement.style.width = "100%";
    
    w3ColS3Div.appendChild(imgElement);
    
    let w3ColS9Div = document.createElement("div");
    w3ColS9Div.classList.add("w3-col", "s9", "w3-container");
    
    let h3Element = document.createElement("h3");
    h3Element.textContent = country.frenchName;
    
    let pElement = document.createElement("p");
    pElement.textContent = "The response to the animations was ridiculous.";
    
    w3ColS9Div.appendChild(h3Element);
    w3ColS9Div.appendChild(pElement);
    
    w3RowDiv.appendChild(w3ColS3Div);
    w3RowDiv.appendChild(w3ColS9Div);
    
    let hrElement = document.createElement("hr");
    
    w3PanelDiv.appendChild(w3RowDiv);
    w3PanelDiv.appendChild(hrElement);
    
    document.body.appendChild(w3PanelDiv);
}

self.addEventListener("fetch", (e) => {
    console.log(`[Service Worker] Fetched resource ${e.request.url}`);
});


init();