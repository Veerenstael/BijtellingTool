document.getElementById('bijtelling-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Voorkom dat het formulier automatisch wordt verstuurd

  // Haal de invoerwaarden op
  const cataloguswaarde = parseFloat(document.getElementById('cataloguswaarde').value);
  const brutoJaarinkomen = parseFloat(document.getElementById('bruto-jaarinkomen').value);
  const eigenBijdrage = parseFloat(document.getElementById('eigen-bijdrage').value) || 0;
  const belastingjaar = document.getElementById('belastingjaar').value;
  const kentekenjaar = parseInt(document.getElementById('kentekenjaar').value);
  const isElektrisch = document.getElementById('elektrisch-auto').value === 'ja';

  let bijtellingPercentage;
  let bijtellingCap;

  // Bijtellingpercentages en cap per jaar/type
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
      bijtellingCap = null; // Geen cap voor 2026
    }
  } else {
    bijtellingPercentage = 22; // 22% voor benzine auto's
    bijtellingCap = null; // Geen cap voor benzine auto's
  }

  // Bereken de bijtelling op basis van de cataloguswaarde en het bijtellingpercentage
  let bijtelling = 0;

  // Deel de cataloguswaarde op in het gedeelte onder de cap en boven de cap
  if (bijtellingCap && cataloguswaarde > bijtellingCap) {
    bijtelling += bijtellingCap * (bijtellingPercentage / 100);
    bijtelling += (cataloguswaarde - bijtellingCap) * 0.22;
  } else {
    bijtelling = cataloguswaarde * (bijtellingPercentage / 100);
  }

  // Bereken de bruto maandbijtelling
  const brutoMaandbijtelling = bijtelling / 12;

  // Bereken het percentage inkomstenbelasting afhankelijk van het bruto jaarinkomen
  let belastingPercentage;
  if (brutoJaarinkomen <= 38441) {
    belastingPercentage = 35.85 / 100;
  } else if (brutoJaarinkomen <= 76816) {
    belastingPercentage = 37.48 / 100;
  } else {
    belastingPercentage = 49.50 / 100;
  }

  // Trek eigen bijdrage af
  const brutoNaEigenBijdrage = brutoMaandbijtelling - eigenBijdrage;

  // Bereken netto bijtelling volgens belastingtarief
  const nettoMaandbijtelling = brutoNaEigenBijdrage * belastingPercentage;

  // Voeg eigen bijdrage weer toe aan de netto bijtelling per maand
  const nettoMaandbijtellingFinalExKorting = nettoMaandbijtelling + eigenBijdrage;

  // ---- HEFFINGSKORTINGEN 2025 FORMULES ----
  // Algemene Heffingskorting
  function berekenAlgemeneHeffingskorting(inkomen) {
    if (inkomen <= 22660) return 3304;
    let korting = 3304 - 0.06095 * (inkomen - 22660);
    return Math.max(0, korting);
  }
  // Arbeidskorting
  function berekenArbeidskorting(inkomen) {
    if (inkomen <= 12676) {
      return 0.089 * inkomen;
    } else if (inkomen <= 22661) {
      return 1127 + 0.2853 * (inkomen - 12676);
    } else if (inkomen <= 39957) {
      return 3249 + 0.0119 * (inkomen - 22661);
    } else if (inkomen <= 123362) {
      return 5553 - 0.0608 * (inkomen - 39957);
    } else {
      return 0;
    }
  }
  const algemeneHeffingskorting = berekenAlgemeneHeffingskorting(brutoJaarinkomen);
  const arbeidskorting = berekenArbeidskorting(brutoJaarinkomen);
  const totaleHeffingskorting = algemeneHeffingskorting + arbeidskorting;

  // Heffingskorting: per maand toepassen
  const heffingskortingPerMaand = totaleHeffingskorting / 12;

  // Netto bijtelling: na toepassing heffingskorting
  const nettoMaandbijtellingFinal = nettoMaandbijtellingFinalExKorting + heffingskortingPerMaand;

  // Toon het resultaat
  document.getElementById('bijtelling-bedrag').textContent = nettoMaandbijtellingFinal.toFixed(2);

  // Extra informatie over de bijtelling
  document.getElementById('info').innerHTML = `
    Bruto maandbijtelling: €${brutoMaandbijtelling.toFixed(2)}<br>
    Eigen bijdrage: €${eigenBijdrage.toFixed(2)}<br>
    Belastbaar deel: €${brutoNaEigenBijdrage.toFixed(2)}<br>
    Toegepast belastingtarief: ${(belastingPercentage*100).toFixed(2)}%<br>
    Algemene heffingskorting (jaar): €${algemeneHeffingskorting.toFixed(2)}<br>
    Arbeidskorting (jaar): €${arbeidskorting.toFixed(2)}<br>
    Totaal heffingskorting (maand): €${heffingskortingPerMaand.toFixed(2)}<br>
    <b>Netto bijtelling per maand: €${nettoMaandbijtellingFinal.toFixed(2)}</b>
  `;
});

