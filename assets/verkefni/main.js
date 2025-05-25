const el = document.getElementById("nemendaverkefni");
const formEl = document.querySelector('.leit #search')
const dropEl = document.querySelector('.leit .drop')
const searchEl = document.querySelector(".input-wrapper button:first-child");
const elCal = document.getElementById("calendar");
let words = [];
let nemaverkefni = [];

// Sækja JSON (bæta catch skilaboðin og bæta við spinner etc.)
async function getData() {
    // let url = '';  //  assets/verkefni/verkefni.json
    try {
        let response = await fetch("https://gunnarthorunnarson.github.io/tbr/assets/verkefni/verkefni.json");
        let data = await response.json();
        let filterData = data.filter((v) => v.show == true);
        return filterData;
    } catch (error) {  console.log(error);}
}

function renderTemplate(verkefni) {
    const imgRoot = "assets/images/verkefni/"
    let template = verkefni.map( temp => { return `<a href="${temp.linkur}">
                <div class="verkefni3">
                    <img src="${imgRoot}${temp.mynd}" />	
                    <p class="fag"><strong>${temp.titill}</strong><br />${temp.afangaheiti}</p>	
                </div>
            </a>`;}).join('');
    if(template.length === 0 || template === null){
        // template = "<span>Engin verkefni fundust!</span>"
        // bæta við css #lagfaering  skítafix sem virkar í desktop
        // document.getElementById("lagfaering").style.marginLeft = "170px";
    }
    el.innerHTML = template;
}

// Fisher-Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]];
    }
}

// fylki sem geymir leitarorð (byggt á gögnum úr JSON)
function searchArray(){ 
    nemaverkefni.forEach(ord => {
        words.push(ord.titill, ord.afangi, ord.afangaheiti, ...ord.flokkur);
    });
    words = [...new Set(words)];  // remove duplicates, Set doesn't allow duplicate values
}

const searchHandler = (e) => {
    const userInput = e.target.value.toLowerCase()
    if(userInput.length === 0) {
        dropEl.style.height = 0
        return dropEl.innerHTML = ''              
    }
    let filteredWords = words.filter(word => word.toLowerCase().includes(userInput)).sort().splice(0, 6);
    dropEl.innerHTML = ''
    filteredWords.forEach(item => {
        const listEl = document.createElement('li')
        listEl.textContent = item;

        // Highlight matching characters
        const regex = new RegExp(`(${userInput})`, 'gi');
        listEl.innerHTML = item.replace(
            regex,
            '<span class="highlight">$1</span>'
        );

        // If word matches input close dropdown and filter
        if(item.toLowerCase() === userInput) {
            searchCloseHandler(e);
            formEl.blur();
        }
        dropEl.appendChild(listEl);
    })
    if(dropEl.children[0] === undefined) {
        return dropEl.style.height = 0
    }
    let totalChildrenHeight = dropEl.children[0].offsetHeight * filteredWords.length
    dropEl.style.height = totalChildrenHeight + 'px'
}

function searchCloseHandler(e){
    if( e.target.nodeName.toLowerCase() === "li" ){   
        formEl.value = e.target.textContent;  // formEl.value = e.target.firstChild.nodeValue;
    }
    // of fljótur að loka og nær ekki að skrifa í input 
    setTimeout(() => {
        dropEl.style.height = 0;
        let verkefni = filters(nemaverkefni, formEl.value);  // filter objects based on input
        if (verkefni && verkefni.length){
            dagatal(verkefni); // sendum síuð verkefni í calander
        }
        // þarf að rendera tómt renderTempate
        renderTemplate(verkefni); 
    }, "250");
}

function searchButtonHandler(e){
    e.preventDefault();
    // smá tími til að loka á dropdown
    setTimeout(() => {
        dropEl.style.height = 0;
        // formEl.focus();
        formEl.blur();
        let verkefni = filters(nemaverkefni, formEl.value);  // filter objects based on input
        if (verkefni && verkefni.length){
            dagatal(verkefni); // sendum síuð verkefni í calander
        }
        renderTemplate(verkefni); 
    }, "250");
}

function filters(fylki, gildi){
    let filteredArray;
    filteredArray = fylki.filter(function(obj){
        if( obj.titill.toLowerCase().includes(gildi.toLowerCase()) || obj.afangaheiti.toLowerCase().includes(gildi.toLowerCase()) || obj.afangi.toLowerCase().includes(gildi.toLowerCase()) ) {
            return true; 
        }
        for(let i= 0; i < obj.flokkur.length; i++){
            if( obj.flokkur[i].toLowerCase().includes(gildi.toLowerCase()) ){
                return true;
            }
        }
        return false;
    });
    return filteredArray;
}

function dagatal(verkefni){
    let calVerkefni = verkefni; 
    const dates = calVerkefni.map(item => new Date(item.dagsetning));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    let startDate = minDate;
    let endDate = maxDate;
    
    const flatpickrInstance = flatpickr(elCal, {
       // altInput: true,  // input: td. Janúar 2025
       // altFormat: "M j",  // input
        mode: "range",
        disableMobile: "true", // ath iphone
        minDate: minDate, // "2025-01",  
        maxDate: maxDate, // "2026-01",   
        locale: {
            ...flatpickr.l10ns.is,  // íslenska 
            rangeSeparator: " til "  // fyrir input reit
        },
        plugins: [ new monthSelectPlugin({ shorthand: true, dateFormat: "m.y", altFormat: "F y", theme: "light" })],
        onclick: () => { flatpickrInstance.open(); },
        onChange: (selectedDates) => { 
            startDate = selectedDates[0];
            endDate = selectedDates[1];
            if (selectedDates.length === 1) {
                let arr = calVerkefni.filter( function (item) {
                    const date = new Date(item.dagsetning);
                    if (startDate.valueOf() === date.valueOf()){ return true}; 
                });
               // renderTemplate(arr) nýjasta prófun
            }
            if (selectedDates.length === 2) {
                let arr = calVerkefni.filter( function (item) {
                    const date = new Date(item.dagsetning);
                    if ((!startDate || date >= startDate) && (!endDate || date <= endDate )){ return true};
                });
                renderTemplate(arr)
            } 
            else {
                startDate = null;
                endDate = null;
            }
        },
        onClose: () => {  flatpickrInstance.clear(true); }  
    });
}

async function setup(){
    nemaverkefni = await getData();
    shuffle(nemaverkefni);
    searchArray(); 
    dagatal(nemaverkefni);
    renderTemplate(nemaverkefni);
}
setup();

formEl.addEventListener('input', searchHandler);        // listen to input value
formEl.addEventListener("blur", searchCloseHandler);    // tap from input
formEl.addEventListener("click", searchCloseHandler);   // click on input
dropEl.addEventListener("click", searchCloseHandler);   // click on li in ul
searchEl.addEventListener("click", searchButtonHandler);  // click on search button or Enter
