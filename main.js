document.getElementById('bijtelling-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Voorkom dat het formulier automatisch wordt verstuurd

  // Haal de invoerwaarden op
  const cataloguswaarde = parseFloat(document.getElementById('cataloguswaarde').value);
  const brutoMaandinkomen = parseFloat(document.getElementById('bruto-maandinkomen').value);
  const eigenBijdrage = parseFloat(document.getElementById('eigen-bijdrage').value);
  const belastingjaar = document.getElementById('belastingjaar').value;
  const kentekenjaar = parseInt(document.getElementById('kentekenjaar').value);
  const isElektrisch = document.getElementById('elektrisch-auto').value === 'ja';

  let bijtellingPercentage;
  let bijtellingCap;

  // Stel de bijtelling in op basis van het jaar van op kenteken zetten en het type auto
  if (isElektrisch) {
    // Bereken de bijtelling voor elektrische auto's
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
    // Bereken de bijtelling voor benzine auto's
    bijtellingPercentage = 22; // 22% voor benzine auto's
    bijtellingCap = null; // Geen cap voor benzine auto's
  }

  // Bereken de bijtelling op basis van de cataloguswaarde en het bijtellingpercentage
  let bijtelling = cataloguswaarde * (bijtellingPercentage / 100);

  // Als de cataloguswaarde boven de cap uitkomt, pas dan de bijtelling aan
  if (bijtellingCap && cataloguswaarde > bijtellingCap) {
    bijtelling = bijtellingCap * (bijtellingPercentage / 100);
  }

  // Toon het resultaat
  document.getElementById('bijtelling-bedrag').textContent = bijtelling.toFixed(2);

  // Extra informatie over de bijtelling
  const infoText = `Voor het belastingjaar ${belastingjaar} en het jaar van op kenteken zetten ${kentekenjaar}, is het bijtellingpercentage voor een ${
    isElektrisch ? 'elektrische' : 'benzine'
  } auto ${bijtellingPercentage}% van de cataloguswaarde.`;

  document.getElementById('info').textContent = infoText;
});
