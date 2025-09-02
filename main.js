document.getElementById('bijtelling-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Voorkom dat het formulier automatisch wordt verstuurd

  // Haal de invoerwaarden op
  const cataloguswaarde = parseFloat(document.getElementById('cataloguswaarde').value);
  const brutoJaarinkomen = parseFloat(document.getElementById('bruto-jaarinkomen').value);
  const eigenBijdrage = parseFloat(document.getElementById('eigen-bijdrage').value); // Eigen bijdrage
  const belastingjaar = document.getElementById('belastingjaar').value;
  const kentekenjaar = parseInt(document.getElementById('kentekenjaar').value);
  const isElektrisch = document.getElementById('elektrisch-auto').value === 'ja';

  let bijtellingPercentage;
  let bijtellingCap;

  // Stel de bijtelling in op basis van het jaar van op kenteken zetten en het type auto
  if (isElektrisch) {
    // Bijtelling voor elektrische auto's volgens de tabel
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
  let bijtelling = 0;

  // Deel de cataloguswaarde op in het gedeelte onder de cap en boven de cap
  if (bijtellingCap && cataloguswaarde > bijtellingCap) {
    // Eerste gedeelte (tot de cap) tegen het lagere percentage
    bijtelling += bijtellingCap * (bijtellingPercentage / 100);
    
    // Tweede gedeelte (boven de cap) tegen 22%
    bijtelling += (cataloguswaarde - bijtellingCap) * 0.22;
  } else {
    // Alles wordt belast tegen het standaard bijtellingpercentage
    bijtelling = cataloguswaarde * (bijtellingPercentage / 100);
  }

  // Bereken de bruto maandbijtelling
  const brutoMaandbijtelling = bijtelling / 12;

  // Bereken het percentage inkomstenbelasting afhankelijk van het bruto jaarinkomen
  let belastingPercentage;
  if (brutoJaarinkomen <= 38441) {
    belastingPercentage = 35.85 / 100;  // 35,85% belastingtarief
  } else if (brutoJaarinkomen <= 76816) {
    belastingPercentage = 37.48 / 100;  // 37,48% belastingtarief
  } else {
    belastingPercentage = 49.50 / 100;  // 49,50% belastingtarief
  }

  // Stap 1: Trek de eigen bijdrage af van de bruto maandbijtelling
  const brutoNaEigenBijdrage = brutoMaandbijtelling - eigenBijdrage;

  // Stap 2: Bereken de netto bijtelling (na belastingtarief) met het belastingtarief op de bruto maandbijtelling na eigen bijdrage
  const nettoMaandbijtelling = brutoNaEigenBijdrage * belastingPercentage;

  // Stap 3: Voeg de eigen bijdrage weer toe aan de netto bijtelling per maand
  const nettoMaandbijtellingFinal = nettoMaandbijtelling + eigenBijdrage;

  // Toon het resultaat
  document.getElementById('bijtelling-bedrag').textContent = nettoMaandbijtellingFinal.toFixed(2);

  // Extra informatie over de bijtelling
  document.getElementById('info').textContent = `Voor het belastingjaar ${belastingjaar} en het jaar van op kenteken zetten ${kentekenjaar}, is het bijtellingpercentage voor een ${
    isElektrisch ? 'elektrische' : 'benzine'
  } auto ${bijtellingPercentage}% van de cataloguswaarde, tot de cap van €${bijtellingCap}. Bedragen boven de cap worden belast met 22%.`;

  // Toon het netto bijtelling per maand
  console.log(`De netto bijtelling per maand is €${nettoMaandbijtellingFinal.toFixed(2)}`);
});
