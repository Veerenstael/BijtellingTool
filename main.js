document.getElementById('bijtelling-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Voorkom dat het formulier automatisch wordt verstuurd
  
  // Haal de invoerwaarden op
  const cataloguswaarde = parseFloat(document.getElementById('cataloguswaarde').value);
  const brutoJaarinkomen = parseFloat(document.getElementById('bruto-jaarinkomen').value);
  const eigenBijdrage = parseFloat(document.getElementById('eigen-bijdrage').value);
  const belastingjaar = document.getElementById('belastingjaar').value;
  const isElektrisch = document.getElementById('elektrische-auto').value === 'ja';

  let bijtellingPercentage;
  let bijtellingCap;

  // Stel de bijtelling in op basis van het belastingjaar en het type auto
  if (isElektrisch) {
    if (belastingjaar === "2025") {
      bijtellingPercentage = 16;  // Voor 2025, 16% bijtelling voor elektrische auto's
      bijtellingCap = 30000;
    } else if (belastingjaar === "2026") {
      bijtellingPercentage = 22;  // Voor 2026, 22% bijtelling voor elektrische auto's
      bijtellingCap = 30000;
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
  const infoText = `Voor het belastingjaar ${belastingjaar} is het bijtellingpercentage voor een ${
    isElektrisch ? 'elektrische' : 'verbrandingsmotor'
  } auto ${bijtellingPercentage}% van de cataloguswaarde.`;

  document.getElementById('info').textContent = infoText;
});
