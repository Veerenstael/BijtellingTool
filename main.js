document.getElementById('bijtelling-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Voorkom dat het formulier automatisch wordt verstuurd
  
  // Haal de invoerwaarden op
  const cataloguswaarde = parseFloat(document.getElementById('cataloguswaarde').value);
  const autoType = document.getElementById('auto-type').value;

  let bijtellingPercentage;
  
  // Bereken het bijtelling percentage op basis van het type auto
  if (autoType === 'elektrisch') {
    bijtellingPercentage = 0.16; // 16% voor elektrische auto's
  } else {
    bijtellingPercentage = 0.22; // 22% voor verbrandingsmotoren
  }

  // Bereken de bijtelling
  const bijtelling = cataloguswaarde * bijtellingPercentage;

  // Toon het resultaat
  document.getElementById('bijtelling-bedrag').textContent = bijtelling.toFixed(2);
});
