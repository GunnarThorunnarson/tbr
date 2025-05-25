class Afangi {

    constructor(jsonData) {
        this.id = jsonData.id;
        this.name = jsonData.name;
        this.link = jsonData.link;
        this.comment = jsonData.comment;
        this.parents = jsonData.parents;
        this.description = jsonData.description;
        this.core = jsonData.core;
        this.active = jsonData.active;
        this.tbr = jsonData.tbr;
        this.bval = jsonData.bval;
    }

    get div() {
        const comment = this.comment ? `<strong class='comment fela'>${this.comment}</strong>` : "";
        let undanfarar = `<div class='undnafarar fela'><strong class="undanfaracomment fela">Undanfarar:</strong> </div>`;

        if (this.parents.length > 0) {

            if (this.parents.length === 1) {
                undanfarar = `<div class='undnafarar fela'><strong class="undanfaracomment fela">Undanfari:</strong> </div>`;
            }
            if (this.id === "VAL05") {
                undanfarar = ""; 
            }
            this.parents.map(p => undanfarar += `<div class="undanfarar fela ${p.id.split('0')[0].substring(0,4)}"><b>${p.name}</b><br><a target="_blank" href="${p.link}">${p.id}</a></div>`);
            undanfarar += `</div></div>`;
        } else {
            undanfarar = "";
        }

        let div = `<div class="afangi" id="${this.id}">${this.name}</div><div class="linkur" id="${this.id}">${this.id}</div>${undanfarar}${comment}`;
        if (this.id === "VAL05") {
            div = `<div class="afangi" id="${this.id}">${this.name}</div>${undanfarar}`;
        }

        return div;
    }

    get button() {
        let button = `<div class="afangi" id="${this.id}">${this.name}</div><div class="linkur" id="${this.id}">${this.id}</div>`;
        if (this.id === "VAL05") {
            button = `<div class="afangi" id="${this.id}">${this.name}</div>`;
        }

        return button;
    }

}