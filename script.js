document.addEventListener("DOMContentLoaded", function() {
    const statusTitel = document.getElementById("statusTitel");
    const statusIndicator = document.getElementById("statusIndicator");
    const redenTekst = document.getElementById("redenTekst");
    const reserveringForm = document.getElementById("reserveringForm");
    const planningList = document.getElementById("planningList");

    // Check of de auto vandaag beschikbaar is
    function checkBeschikbaarheid() {
        const vandaag = new Date().toISOString().split('T')[0];
        const reserveringen = getReserveringen();
        const vandaagReservering = reserveringen.find(reservering => reservering.datum === vandaag);

        if (vandaagReservering) {
            statusTitel.textContent = "Niet Beschikbaar";
            statusIndicator.parentElement.classList.add("niet-beschikbaar");
            redenTekst.textContent = `Gereseveerd door: ${vandaagReservering.naam} - ${vandaagReservering.reden}`;
        } else {
            statusTitel.textContent = "Beschikbaar";
            statusIndicator.parentElement.classList.remove("niet-beschikbaar");
            redenTekst.textContent = "";
        }
    }

    // Reserveringen ophalen uit lokale opslag (localStorage)
    function getReserveringen() {
        const reserveringen = localStorage.getItem("reserveringen");
        return reserveringen ? JSON.parse(reserveringen) : [];
    }

    // Reserveringen opslaan in lokale opslag (localStorage)
    function saveReserveringen(reserveringen) {
        localStorage.setItem("reserveringen", JSON.stringify(reserveringen));
    }

    // Controleer beschikbaarheid voor de geselecteerde datum
    function isBeschikbaar(datum) {
        const reserveringen = getReserveringen();
        return !reserveringen.some(reservering => reservering.datum === datum);
    }

    // Reservering toevoegen
    reserveringForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const naam = document.getElementById("naam").value;
        const datum = document.getElementById("datum").value;
        const reden = document.getElementById("reden").value;

        // Controleer of de wagen beschikbaar is op de opgegeven datum
        if (!isBeschikbaar(datum)) {
            alert("De wagen is niet beschikbaar op de geselecteerde datum.");
            return; // Stop het toevoegen van de reservering
        }

        const nieuweReservering = { naam, datum, reden };
        const reserveringen = getReserveringen();
        reserveringen.push(nieuweReservering);
        saveReserveringen(reserveringen);

        toonPlanning();
        checkBeschikbaarheid();
        reserveringForm.reset();
    });

    // Planning weergeven
    function toonPlanning() {
        const reserveringen = getReserveringen();
    
        // Sorteer de reserveringen op datum in oplopende volgorde
        reserveringen.sort((a, b) => new Date(a.datum) - new Date(b.datum));
        
        planningList.innerHTML = "";  // Leeg de lijst
        
        reserveringen.forEach((reservering, index) => {
            const li = document.createElement("li");
    
            // Maak een tekstknooppunt voor de reserveringsinformatie
            const reserveringTekst = document.createTextNode(`${reservering.datum} - ${reservering.naam}: ${reservering.reden}`);
            li.appendChild(reserveringTekst);
    
            // Maak en voeg de delete-knop toe
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("delete-button");
    
            const deleteIcon = document.createElement("span");
            deleteIcon.classList.add("material-symbols-outlined");
            deleteIcon.textContent = "delete"; // Dit is het symbool voor verwijderen
            deleteButton.appendChild(deleteIcon);
    
            deleteButton.addEventListener("click", function() {
                reserveringen.splice(index, 1);
                saveReserveringen(reserveringen);
                toonPlanning();
                checkBeschikbaarheid();
            });
    
            li.appendChild(deleteButton);
    
            // Voeg de li toe aan de lijst
            planningList.appendChild(li);
        });
    }
    
    // Voeg de stylesheet toe voor de Material Icons
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
    document.head.appendChild(link);
    
    // Initialisatie
    checkBeschikbaarheid();
    toonPlanning();
});
