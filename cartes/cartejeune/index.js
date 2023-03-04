class CarteJeune {
    constructor(nom, prenom, etab, num_top, code, photob64) {
        this.nom = nom;
        this.prenom = prenom;
        this.etab = etab;
        this.num_top = num_top;
        this.code = code;
        this.photob64 = photob64;
    }

    setNom(nom) {
        this.nom = nom;
    }

    setPrenom(prenom) {
        this.prenom = prenom;
    }

    setEtab(etab) {
        this.etab = etab;
    }

    setNumTop(num_top) {
        this.num_top = num_top;
    }

    setCode(code) {
        this.code = code;
    }

    getNom() {
        return this.nom;
    }

    getPrenom() {
        return this.prenom;
    }

    getEtab() {
        return this.etab;
    }

    getNumTop() {
        return this.num_top;
    }

    getCode() {
        return this.code;
    }

    getPhotoB64() {
        return this.photob64;
    }

    getCard() {
        return {
            nom: this.nom,
            prenom: this.prenom,
            etab: this.etab,
            num_top: this.num_top,
            code: this.code,
            photob64: this.photob64
        };
    }

    setCard(card) {
        console.log(card.nom);
        this.nom = card.nom;
        this.prenom = card.prenom;
        this.etab = card.etab;
        this.num_top = card.num_top;
        this.code = card.code;
        this.photob64 = card.photob64; // 
    }

    getCardAsJson() {
        return JSON.stringify(this.getCard());
    }

    setCardFromJson(json) {
        this.setCard(JSON.parse(json));
    }

    replaceIdsWithRandomIds(svg) {
        const svgDoc = svg


        // Obtenir tous les éléments avec un identificateur
        const elementsWithIds = svgDoc.querySelectorAll("[id]");

        // Stockez les anciens identificateurs et les nouveaux identificateurs associés
        const idMapping = new Map();

        // Générer des identificateurs aléatoires pour chaque élément
        elementsWithIds.forEach(element => {
            const oldId = element.getAttribute("id");
            const newId = Math.random().toString(36).slice(2); // probabilité de collision très faible
            idMapping.set(oldId, newId);
            element.setAttribute("id", newId);
        });

        // Mettre à jour toutes les références à l'ancien identificateur
        idMapping.forEach((newId, oldId) => {
            const elementsReferencingOldId = svgDoc.querySelectorAll(`[href="#${oldId}"], [fill="url(#${oldId})"]`);
            elementsReferencingOldId.forEach(element => {
                const attributeName = element.hasAttribute("href") ? "href" : "fill";
                element.setAttribute(attributeName, `url(#${newId})`);
            });
        });

        // Mettre à jour les références aux images
        const imageElements = svgDoc.querySelectorAll("image");
        imageElements.forEach(imageElement => {
            const oldHref = imageElement.getAttribute("xlink:href");
            if (oldHref.startsWith("#")) {
                const oldId = oldHref.slice(1);
                const newId = idMapping.get(oldId);
                if (newId) {
                    imageElement.setAttribute("xlink:href", `#${newId}`);
                }
            }
        });

        // Mettre à jour les références à <use>
        const useElements = svgDoc.querySelectorAll("use");
        useElements.forEach(useElement => {
            const oldHref = useElement.getAttribute("xlink:href");
            if (oldHref.startsWith("#")) {
                const oldId = oldHref.slice(1);
                const newId = idMapping.get(oldId);
                if (newId) {
                    useElement.setAttribute("xlink:href", `#${newId}`);
                }
            }
        });

        return svgDoc;
    }

    getSvgCardFace() {
        const self = this;
        return new Promise((resolve, reject) => {
            fetch("https://cdn.githubraw.com/andronedev/extension_papillon_wallet/master/cartes/cartejeune/cartejeunev1_face.svg").then(response => response.text()).then(svg => {

                // replace el_nom, el_prenom, el_etab, el_num_top, el_code
                // example of svg :
                /*
            <text id="el_code" fill="black" xml:space="preserve" style="white-space: pre" font-family="CODE3X" font-size="70" letter-spacing="0em"><tspan x="546.012" y="120.46">0000000</tspan></text>
            photo : 
            <rect id="el_photo" x="22" y="22" width="262" height="282" fill="url(#pattern4)" xlink:href=""></rect>
            */

                let svgelement = new DOMParser().parseFromString(svg, "text/xml");
                // remove all outside the svg tag
                svgelement = svgelement.querySelector("svg");

                svgelement.querySelector("#el_nom > tspan").innerHTML = self.getNom();
                svgelement.querySelector("#el_prenom > tspan").innerHTML = self.getPrenom();
                svgelement.querySelector("#el_etab > tspan").innerHTML = self.getEtab();
                svgelement.querySelector("#el_num_top > tspan").innerHTML = self.getNumTop();
                svgelement.querySelector("#el_code > tspan").innerHTML = self.getCode();

                // create new pattern
                let pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
                pattern.setAttribute("id", "patternphoto");
                pattern.setAttribute("patternUnits", "userSpaceOnUse");
                pattern.setAttribute("width", "262");
                pattern.setAttribute("height", "282");
                pattern.setAttribute("x", "22");
                pattern.setAttribute("y", "22");
                let image = document.createElementNS("http://www.w3.org/2000/svg", "image");
                image.setAttribute("width", "262");
                image.setAttribute("height", "282");
                image.setAttribute("xlink:href", self.getPhotoB64());
                pattern.appendChild(image);
                svgelement.querySelector("defs").appendChild(pattern);


                svgelement.querySelector("#el_photo").setAttribute("fill", "url(#patternphoto)");


                // replace all id with unique id to avoid conflict
                svgelement = self.replaceIdsWithRandomIds(svgelement);

                resolve(new XMLSerializer().serializeToString(svgelement));
            });
        });
    }

    getSvgCardBack() {
        const self = this;
        return new Promise((resolve, reject) => {
            fetch("https://cdn.githubraw.com/andronedev/extension_papillon_wallet/master/cartes/cartejeune/cartejeunev1_back.svg").then(response => response.text()).then(svg => { // replace el_annee_haut, el_annee_bas

                let svgelement = new DOMParser().parseFromString(svg, "text/xml");
                // remove all outside the svg tag
                svgelement = svgelement.querySelector("svg");
                let date = new Date();
                let annee_haut = date.getFullYear() - 1;
                let annee_bas = date.getFullYear();
                svgelement.querySelector("#el_annee_haut > tspan").innerHTML = annee_haut;
                svgelement.querySelector("#el_annee_bas > tspan").innerHTML = annee_bas;

                // replace all id with unique id to avoid conflict
                svgelement = self.replaceIdsWithRandomIds(svgelement);

                resolve(new XMLSerializer().serializeToString(svgelement));
            });
        });
    }

    getSvgPreview() {
        const self = this;
        return new Promise((resolve, reject) => {
            fetch("https://cdn.githubraw.com/andronedev/extension_papillon_wallet/master/cartes/cartejeune/cartejeunev1_preview.svg").then(response => response.text()).then(svg => { // replace el_nom, el_prenom, el_etab, el_num_top, el_code
                resolve(svg);
            });
        });
    }

    getManifest() {
        return {
            name: "Carte Jeune",
            short_name: "Carte Jeune",
            theme: {
                background: "#ffffff"
            },
            inputs: {
                nom: {
                    type: "text",
                    label: "Nom",
                    maxlength: 20,
                    required: true
                },
                prenom: {
                    type: "text",
                    label: "Prénom",
                    maxlength: 20,
                    required: true
                },
                etab: {
                    type: "text",
                    label: "Etablissement",
                    maxlength: 20,
                    required: true
                },
                num_top: {
                    type: "text",
                    label: "Numéro TOP",
                    maxlength: 20,
                    required: true
                },
                code: {
                    type: "text",
                    label: "Code",
                    maxlength: 20,
                    required: true
                },
                photob64: {
                    type: "photo",
                    label: "Photo",
                    required: true
                }
            }
        };
    }

    newCard() {
        // return a copy of the card
        return new CarteJeune();
    }
}
