const afangar = [];
const allirAfangar = [];
const mainDiv = document.getElementById('maingrid');
const modaloverlay = document.getElementsByClassName('modal-overlay')[0];
let isModal = false;

(function saekjaJson() {
    fetch("assets/tbr/afangar.json")
        .then(res => res.json())
        .then(json => {
            json.filter(j => j.active)
                .forEach(afangi => afangar.push(new Afangi(afangi)));
            afangar.forEach(afangi => {
                afangi.parents = afangi.parents.map(p => afangar.find(a => a.id === p));
                synaDiv(afangi);                
            });
            opna();
            teiknaParUndanfara();
            
        })
        .catch(e => console.log("villa:", e));
})();

function synaDiv(afangi) {
    const btn = document.createElement('button');
    btn.className = "afangar";
    btn.className += afangi.core ? " core" : "";
    if(afangi.bval === 1) btn.className += " bval1";
/*     btn.className += afangi.tbr ? "" : " nontbr";
    if(afangi.bval === 2) btn.className += " bval2";
    if(afangi.bval === 9) btn.className += " bval9"; */
/*  btn.className += ` ${afangi.id.substring(0,4)}`; */
    btn.style.gridArea = afangi.id.split('0')[0];
    btn.id = afangi.id;
    btn.innerHTML = afangi.button;
    mainDiv.appendChild(btn);
    allirAfangar.push(btn);
}

function teiknaParUndanfara() {
    Array.from(document.getElementsByClassName('leader-line'))
        .forEach(l => l.remove());
    afangar.forEach(afangi => {
        const curDiv = document.getElementById(afangi.id);
        const undanfaraLinur = [];
        const undanfaraAfangar = new Set();
        undanfaraAfangar.add(curDiv);

        function teikna(afangi, cDiv, ulinur) {
            afangi.parents.forEach(undanfari => {
                //console.log(afangi.id);
                uDiv = document.getElementById(undanfari.id);
                undanfaraAfangar.add(uDiv);
                const undanfaraLina = new LeaderLine(
                    uDiv,
                    cDiv, {
                        hide: true,
                        color: "rgba(45, 52, 54,1.0)",
                        //color: "rgba(214, 48, 49, 1.0)",
                        size: 4,
                        startPlug: "behind",
                        dash: {
                            animation: true
                        }
                    }
                );

                if (afangi.id === 'VAL05') {
                    undanfaraLina.setOptions({
                        startSocket: 'top',
                        color: "rgba(9, 132, 227, 1.0)",
                        dash: false
                    });
                    ulinur.push(undanfaraLina);
                    return;
                }
                ulinur.push(undanfaraLina);
                teikna(undanfari, document.getElementById(undanfari.id), ulinur);
            });
        }

        teikna(afangi, curDiv, undanfaraLinur);

        curDiv.addEventListener("mouseover", e => {
            //curDiv.title = afangi.description;
            // curDiv.dataTooltip = afangi.description;
            if (!isModal) {
                undanfaraLinur.forEach(l => l.show("draw"));
                allirAfangar.forEach(a => undanfaraAfangar.has(a) ? a.style.opacity = 1 :
                    a.style.opacity = 0.3);
            }
        });

        curDiv.addEventListener("mouseleave", e => {
            undanfaraLinur.forEach(l => l.hide());
            allirAfangar.forEach(a => a.style.opacity = 1.0);
        });
    });

}

mainDiv.addEventListener("click", synaModal);
const modal = document.getElementById('simpleModal');

function synaModal(e) {
    const id = e.target.id || e;
    const afangi = afangar.find(a => a.id === e.target.id);
    if (!afangi) return;
    isModal = true;
    modaloverlay.style.direction = 'block';
    document.getElementsByClassName("mnafn")[0].textContent = afangi.name;
    document.getElementsByClassName("mlysing")[0].textContent = afangi.description;
    document.getElementsByClassName("mcomment")[0].textContent = afangi.comment;
    // document.getElementsByClassName("mundanfarar")[0].textContent = `${afangi.parents.map(p => p.id).join(', ')}`;
    

    document.getElementsByClassName("mnumer")[0].textContent = afangi.id;
    const undanfaraTexti = afangi.parents.length === 0 ? '' :
        afangi.parents.length === 1 ? 'Undanfari: ' : 'Undanfarar: ';
    //document.getElementsByClassName("mundanfarar")[0].textContent = `${undanfaraTexti} ${afangi.parents.map(p => p.id).join(', ')}`;
    document.getElementsByClassName("mundanfarar")[0] = undanFararModal(afangi);
    if (afangi.link) {
        document.getElementsByClassName("mlinkur")[0].href = afangi.link;
        document.getElementsByClassName("mlinkur")[0].textContent = 'Sjá nánar á námskrá.is';
    } else {
        document.getElementsByClassName("mlinkur")[0].href = "";
        document.getElementsByClassName("mlinkur")[0].textContent = '';
    }
    

    document.getElementsByClassName("mcomment")[0].textContent = afangi.comment;
    if(afangi.core) document.getElementsByClassName("mcomment")[0].textContent = "Skylduáfangi.";

    if (afangi.id === "VAL05") {
        document.getElementsByClassName("mlinkur")[0].textContent = '';
        document.getElementsByClassName("mnumer")[0].textContent = '';
    }


    //console.log(document.getElementsByClassName("modal"));
    document.getElementsByClassName("modal")[0].style.display = "block";


    modaloverlay.style.display = 'block';
    window.addEventListener('click', e => {
        if(e.target === modaloverlay) {
            //console.log(e.target);
            lokaModal();
        }
    }); 

    mainDiv.removeEventListener("click", synaModal);
    //document.getElementById("maingrid").opacity = "0.2";
    e.preventDefault();
}


function undanFararModal(afangi) {
    const undanfaraDiv = document.getElementsByClassName('mundanfarar')[0];
/*     undanfaraDiv.childNodes.forEach(c => c.remove());
    undanfaraDiv.childNodes.forEach(c => c.remove()); */

        while(undanfaraDiv.firstChild) {
            undanfaraDiv.removeChild(undanfaraDiv.firstChild);
        }
    
    if(afangi.parents.length > 0) {
        if(afangi.parents.length === 1) {
            undanfaraDiv.textContent = "Undanfari:";
        } else {
            undanfaraDiv.textContent = "Undanfarar:";
        }
        if(afangi.id === "VAL05") {
            undanfaraDiv.textContent = "";
        }
    }

    afangi.parents.forEach(p => {
        //console.log(p);
        const undanfaraBtn = document.createElement('button');
        undanfaraBtn.textContent = p.id;
        undanfaraBtn.id = p.id;
        undanfaraBtn.className = "mafangi";
        //undanfaraBtn.className += ` ${p.id.substring(0,4)}`
        
        undanfaraBtn.addEventListener("click", synaModal);
        //console.log(toString(undanfaraBtn));
        undanfaraDiv.appendChild(undanfaraBtn);
    });
    //console.log(undanfaraDiv);
    return undanfaraDiv;
}

function lokaModal() {
    document.getElementsByClassName("modal")[0].style.display = "none";
    modaloverlay.style.display = 'none';
    //document.getElementById("yfir").classList.remove("modal-overlay");
    mainDiv.addEventListener("click", synaModal);
    isModal = false;
}

document.getElementById("close-button").addEventListener("click", lokaModal);

function opna() {
    const load_screen = document.getElementById("loada");
    document.body.removeChild(load_screen);
    const yfir = document.getElementById("yfir");
    yfir.style.display = "block";    
}
