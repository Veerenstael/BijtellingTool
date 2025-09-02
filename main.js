document.getElementById('bijtelling-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Voorkom dat het formulier automatisch wordt verstuurd
  
  // Haal de invoerwaarden op
  const cataloguswaarde = parseFloat(document.getElementById('cataloguswaarde').value);
  const brutoMaandinkomen = parseFloat(document.getElementById('bruto-maandinkomen').value);
  const eigenBijdrage = parseFloat(document.getElementById('eigen-bijdrage').value);
  const belastingjaar = document.getElementById('belastingjaar').value;
  const kentekenjaar = parseInt(document.getElementById('kentekenjaar').value);
  const isElektrisch = document.getElementById('elektrische-auto').value === 'ja';

  let bijtellingPercentage;
  let bijtellingCap;

  // Stel de bijtelling in op basis van het belastingjaar, het jaar van op kenteken zetten en het type auto
  if (isElektrisch) {
    if (kentekenjaar >= 2019 && kentekenjaar <= 2025) {
      bijtellingPercentage = 4; // Voor 2019-2025, 4% voor elektrische auto's
      bijtellingCap = 50000; // Tot €50.000 geldt dit percentage
    } else if (kentekenjaar > 2025) {
      bijtellingPercentage = 22; // Voor auto's op kenteken na 2025, 22%
      bijtellingCap = 30000; // Tot €30.000 geldt dit percentage
    }
  } else {
    bijtellingPercentage = 22; // Voor verbrandingsmotoren is de bijtelling 22%
    bijtellingCap = 0; // Geen cap voor niet-elektrische auto's
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
    isElektrisch ? 'elektrische' : 'verbrandingsmotor'
  } auto ${bijtellingPercentage}% van de cataloguswaarde.`;

  document.getElementById('info').textContent = infoText;
});
