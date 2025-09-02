// Functie om getallen mooi weer te geven
function formatCurrency(number) {
  return number.toLocaleString('nl-NL') + ',-'; // Gebruik de Nederlandse opmaak
}

// Functie om de waarde in te stellen op basis van de geformatteerde waarde
function formatInputValue(inputElement) {
  let waarde = parseFloat(inputElement.value.replace(/[^0-9.,-]+/g, ''));
  if (!isNaN(waarde)) {
    inputElement.value = formatCurrency(waarde);
  }
}

// Format de getallen wanneer de gebruiker het invoerveld verlaat (blur event)
document.getElementById('cataloguswaarde').addEventListener('blur', function() {
  formatInputValue(this);
});

document.getElementById('bruto-jaarinkomen').addEventListener('blur', function() {
  formatInputValue(this);
});

// Bij het indienen van het formulier, formateer de waarden correct
document.getElementById('bijtelling-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Haal de invoerwaarden op en converteer ze naar getallen
  const cataloguswaarde = parseFloat(document.getElementById('cataloguswaarde').value.replace(/[^0-9.-]+/g, ''));
  const brutoJaarinkomen = parseFloat(document.getElementById('bruto-jaarinkomen').value.replace(/[^0-9.-]+/g, ''));
  const eigenBijdrage = parseFloat(document.getElementById('eigen-bijdrage').value); // Eigen bijdrage
  const belastingjaar = document.getElementById('belastingjaar').value;
  const kentekenjaar = parseInt(document.getElementById('kentekenjaar').value);
  const isElektrisch = document.getElementById('elektrisch-auto').value === 'ja';

  // Logica voor de berekening (zoals eerder beschreven)
  let bijtellingPercentage;
  let bijtellingCap;

  if (isElektrisch) {
    if (kentekenjaar === 2019) {
      bijtellingPercentage = 4;
      bijtellingCap = 50000;
    } else if (kentekenjaar === 2020) {
      bijtellingPercentage = 8;
      bijtellingCap = 45000;
    } else if (kentekenjaar === 2021) {
      bijtellingPercentage = 12;
      bijtellingCap = 40000;
    } else if (kentekenjaar === 2022) {
      bijtellingPercentage = 16;
      bijtellingCap = 35000;
    } else if (kentekenjaar === 2023 || kentekenjaar === 2024) {
      bijtellingPercentage = 16;
      bijtellingCap = 30000;
    } else if (kentekenjaar === 2025) {
      bijtellingPercentage = 17;
      bijtellingCap = 30000;
    } else if (kentekenjaar === 2026) {
      bijtellingPercentage = 22;
      bijtellingCap = null; // Geen cap vanaf 2026
    }
  } else {
    bijtellingPercentage = 22; // 22% voor benzine auto's
    bijtellingCap = null; // Geen cap voor benzine auto's
  }

  let bijtelling = 0;

  if (bijtellingCap && cataloguswaarde > bijtellingCap) {
    bijtelling += bijtellingCap * (bijtellingPercentage / 100);
    bijtelling += (cataloguswaarde - bijtellingCap) * 0.22;
  } else {
    bijtelling = cataloguswaarde * (bijtellingPercentage / 100);
  }

  const brutoMaandbijtelling = bijtelling / 12;
  let belastingPercentage;
  if (brutoJaarinkomen <= 38441) {
    belastingPercentage = 35.85 / 100;  
  } else if (brutoJaarinkomen <= 76816) {
    belastingPercentage = 37.48 / 100;
  } else {
    belastingPercentage = 49.50 / 100;
  }

  const brutoNaEigenBijdrage = brutoMaandbijtelling - eigenBijdrage;
  const nettoMaandbijtelling = brutoNaEigenBijdrage * belastingPercentage;
  const nettoMaandbijtellingFinal = nettoMaandbijtelling + eigenBijdrage;

  document.getElementById('bijtelling-bedrag').textContent = nettoMaandbijtellingFinal.toFixed(2);

  document.getElementById('info').textContent = isElektrisch
    ? (bijtellingCap ? `Voor het belastingjaar ${belastingjaar} en het jaar van op kenteken zetten ${kentekenjaar}, geldt voor een elektrische auto een bijtellingpercentage van ${bijtellingPercentage}% van de cataloguswaarde. Tot een maximum van €${bijtellingCap} wordt dit percentage toegepast. Bedragen boven dit maximum worden belast tegen 22%.` 
                    : `Voor het belastingjaar ${belastingjaar} en het jaar van op kenteken zetten ${kentekenjaar}, geldt voor een elektrische auto een bijtellingpercentage van ${bijtellingPercentage}% over de volledige cataloguswaarde. Er is geen maximum voor de bijtelling, dus het percentage geldt voor de volledige waarde van de auto.`)
    : `Voor het belastingjaar ${belastingjaar} en het jaar van op kenteken zetten ${kentekenjaar}, geldt voor een benzineauto een bijtelling van 22% over de volledige cataloguswaarde, zonder maximum. Dit betekent dat het percentage voor de volledige waarde van de auto geldt, zonder enige limiet.`;
});
