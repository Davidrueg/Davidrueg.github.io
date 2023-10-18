/**
 * @file Retrieves the list of countries in the world from restcountries.com website.
 * Do some caching.
 */

const REFRESH_INTERVAL = 60000 // in miliseconds

displayCountries()

// automatic refresh at regular interval in case the page is left opened for a long time
setInterval(displayCountries, REFRESH_INTERVAL + 1000) // +1 second to ensure the interval is over

/**
 * Converts a binary image into base64
 * @param {Blob} blob The binary image to convert into base64
 * @returns {String} The image in base64 format
 */
async function imageBlobToBase64(blob) {
    return new Promise((onSuccess, onError) => {
        try {
            const reader = new FileReader();
            reader.onload = function () {
                onSuccess(this.result);
            };
            reader.readAsDataURL(blob);
        } catch (e) {
            onError(e);
        }
    });
}

/**
 * Fetch the list of countries from the website restcountries then store the results in cache.
 * Also store the flags pictures locally in cache.
 * @returns {Promise} The list of countries being fetched
 */
async function myFetch() {
    console.log("myFetch::called")
    return fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("timestamp", Date.now())

            // sort the countries by their alphabetic french names
            data = data.sort(function (a, b) {
                return a.translations.fra.common.localeCompare(b.translations.fra.common)
            })

            localStorage.setItem("cache", JSON.stringify(data))
            myFetchFlags(data)
        })
}

/**
 * Display the list of countries in the html body by dynamically creating the relevant html tags
 * @returns {void}
 */
async function displayCountries() {
    console.log("displayCountries: called")

    // if no cache is available locally, we first populate it
    if (!("cache" in localStorage)) {
        console.log("displayCountries: first launch > waiting for cache creation first")
        await myFetch()
        console.log("displayCountries: cache creation done")
    }

    let data = localStorage.getItem("cache")
    data = JSON.parse(data)

    // if the list of countries is already displayed, we first remove its nodes
    while (countries.firstChild) {
        countries.firstChild.remove();
    }

    // we populate the countries
    for (let i = 0; i < data.length; i++) {
        let row = document.createElement("div")
        row.className = "w3-row"

        let col = document.createElement("div")
        col.className = "w3-col s3"

        let myImg = document.createElement("img")
        myImg.style = "width:100%"
        myImg.src = data[i].flags.svg

        col.appendChild(myImg)

        row.appendChild(col)

        col = document.createElement("div")
        col.className = "w3-col s9 w3-container"

        let h3 = document.createElement("h3")
        h3.innerText = data[i].translations.fra.common

        let p = document.createElement("p")
        p.innerText = data[i].region

        col.appendChild(h3)
        col.appendChild(p)

        row.appendChild(col)

        countries.appendChild(row)
    }

    // if cache is too old, we refresh it
    if ("timestamp" in localStorage) {
        let interval = Date.now() - localStorage.getItem("timestamp")
        console.log(`displayCountries: cache age: ${parseInt(interval / 1000)} seconds`)
        if (interval > REFRESH_INTERVAL) {
            console.log(`displayCountries: cache too old => refreshing`)
            await myFetch()
            displayCountries()
        }
    }
}

/**
 * Converts each flag URL to base64,
 * then store the results into localStorage cache,
 * then call displayCountries
 * @param {JSON} data The list of countries to process 
 * @returns {void}
 */
async function myFetchFlags(data) {
    console.log("myFetchFlags: called")
    for (let i = 0; i < data.length; i++) {
        const res = await fetch(data[i].flags.svg);
        const blob = await res.blob();
        const uri = await imageBlobToBase64(blob);
        data[i].flags.svg = uri
    }
    localStorage.setItem("cache", JSON.stringify(data))
    console.log("myFetchFlags: done caching flags")
}