(function () {
  const listElement = document.getElementById("group-list");
  const searchElement = document.getElementById("group-search");
  const categoryElement = document.getElementById("group-category");
  const zoneElement = document.getElementById("group-zone");
  const countElement = document.getElementById("group-result-count");
  const statusElement = document.getElementById("group-status");

  if (!listElement || !searchElement || !categoryElement || !zoneElement || !countElement || !statusElement) return;

  const plans = [
    {
      category: "deporte",
      categoryLabel: "Running",
      zone: "san-salvador",
      zoneLabel: "San Salvador · Parque Xibi Xibi",
      title: "¿Quién para correr por el Xibi Xibi?",
      when: "Hoy · 18:00",
      details: "Ritmo tranqui, ideal para mover las piernas y conocer gente.",
      spots: 3
    },
    {
      category: "mateada",
      categoryLabel: "Mateada",
      zone: "san-salvador",
      zoneLabel: "San Salvador · Cabildo",
      title: "Mateada en el Cabildo",
      when: "Hoy · 17:30",
      details: "Traé tu equipo de mate y sumate a una charla al aire libre.",
      spots: 4
    },
    {
      category: "trekking",
      categoryLabel: "Trekking",
      zone: "yala",
      zoneLabel: "Yala · Reserva Natural",
      title: "Sendero compartido en Yala",
      when: "Sábado · 08:00",
      details: "Una caminata para disfrutar la naturaleza en grupo.",
      spots: 2
    },
    {
      category: "cultural",
      categoryLabel: "Paseo cultural",
      zone: "purmamarca",
      zoneLabel: "Purmamarca · Plaza principal",
      title: "Atardecer y paseo por Purmamarca",
      when: "Mañana · 16:30",
      details: "Recorramos el pueblo y sus paisajes, cámara en mano.",
      spots: 5
    },
    {
      category: "mateada",
      categoryLabel: "Mateada",
      zone: "tilcara",
      zoneLabel: "Tilcara · Plaza central",
      title: "¿Quién se prende a unos mates en Tilcara?",
      when: "Hoy · 16:00",
      details: "Una ronda tranquila para compartir historias y vistas de la Quebrada.",
      spots: 3
    },
    {
      category: "deporte",
      categoryLabel: "Bicicleta",
      zone: "san-salvador",
      zoneLabel: "San Salvador · Parque Xibi Xibi",
      title: "Vuelta en bici por la ciudad",
      when: "Sábado · 10:00",
      details: "Paseo urbano a ritmo tranquilo. Traé tu bici y casco.",
      spots: 4
    },
    {
      category: "trekking",
      categoryLabel: "Trekking",
      zone: "purmamarca",
      zoneLabel: "Purmamarca · Paseo de los Colorados",
      title: "Caminata por los Colorados",
      when: "Domingo · 09:00",
      details: "Recorrido a pie para disfrutar los cerros y sacar fotos.",
      spots: 3
    },
    {
      category: "cultural",
      categoryLabel: "Paseo cultural",
      zone: "humahuaca",
      zoneLabel: "Humahuaca · Monumento a los Héroes de la Independencia",
      title: "Tarde de historia en Humahuaca",
      when: "Sábado · 15:00",
      details: "Conozcamos el centro y sus historias en una salida compartida.",
      spots: 4
    },
    {
      category: "gastronomia",
      categoryLabel: "Gastronomía",
      zone: "maimara",
      zoneLabel: "Maimará · Centro",
      title: "Sabores jujeños en Maimará",
      when: "Sábado · 13:00",
      details: "Busquemos algo rico para almorzar y probar sabores de la zona.",
      spots: 2
    },
    {
      category: "deporte",
      categoryLabel: "Running",
      zone: "yala",
      zoneLabel: "Yala · Laguna de Yala",
      title: "Trote suave entre naturaleza",
      when: "Domingo · 08:30",
      details: "Una salida recreativa para movernos y disfrutar el aire libre.",
      spots: 5
    },
    {
      category: "mateada",
      categoryLabel: "Mateada",
      zone: "humahuaca",
      zoneLabel: "Humahuaca · Plaza principal",
      title: "Ronda de mates y charla viajera",
      when: "Mañana · 17:00",
      details: "Compartí unos mates y recomendaciones para recorrer la Quebrada.",
      spots: 3
    }
  ];

  function normalize(value) {
    return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function createPlanCard(plan) {
    const card = document.createElement("article");
    card.className = "tribo-group-card";

    const meta = document.createElement("div");
    meta.className = "tribo-group-meta";
    const category = document.createElement("span");
    category.className = "tribo-group-category";
    category.textContent = plan.categoryLabel;
    const when = document.createElement("span");
    when.textContent = plan.when;
    meta.append(category, when);

    const title = document.createElement("h5");
    title.textContent = plan.title;
    const zone = document.createElement("p");
    zone.className = "tribo-group-zone";
    zone.textContent = plan.zoneLabel;
    const details = document.createElement("p");
    details.className = "tribo-group-details";
    details.textContent = plan.details;

    const footer = document.createElement("div");
    footer.className = "tribo-group-card-footer";
    const spots = document.createElement("span");
    spots.textContent = plan.spots + (plan.spots === 1 ? " lugar disponible" : " lugares disponibles");
    const joinButton = document.createElement("button");
    joinButton.className = "tribo-group-join";
    joinButton.type = "button";
    joinButton.textContent = "Me interesa";
    joinButton.setAttribute("aria-pressed", "false");
    joinButton.addEventListener("click", function () {
      const selected = joinButton.getAttribute("aria-pressed") !== "true";
      joinButton.setAttribute("aria-pressed", String(selected));
      joinButton.textContent = selected ? "Interés marcado" : "Me interesa";
      statusElement.textContent = selected
        ? "Marcaste interés en “" + plan.title + "”. En esta demo no se envió una solicitud real."
        : "Quitaste tu interés en “" + plan.title + "”. En esta demo no se envió una solicitud real.";
    });
    footer.append(spots, joinButton);
    card.append(meta, title, zone, details, footer);
    return card;
  }

  function renderPlans() {
    const query = normalize(searchElement.value.trim());
    const selectedCategory = categoryElement.value;
    const selectedZone = zoneElement.value;
    const filteredPlans = plans.filter(function (plan) {
      const searchableText = normalize([
        plan.title,
        plan.categoryLabel,
        plan.zoneLabel,
        plan.details
      ].join(" "));
      return (!query || searchableText.includes(query))
        && (!selectedCategory || plan.category === selectedCategory)
        && (!selectedZone || plan.zone === selectedZone);
    });

    listElement.replaceChildren();
    filteredPlans.forEach(function (plan) {
      listElement.append(createPlanCard(plan));
    });
    countElement.textContent = filteredPlans.length + (filteredPlans.length === 1 ? " plan encontrado" : " planes encontrados");

    if (filteredPlans.length === 0) {
      const emptyState = document.createElement("p");
      emptyState.className = "tribo-group-empty";
      emptyState.textContent = "No encontramos planes con esos filtros. Probá con otra búsqueda o zona.";
      listElement.append(emptyState);
    }
  }

  document.getElementById("group-filters").addEventListener("submit", function (event) {
    event.preventDefault();
  });
  searchElement.addEventListener("input", renderPlans);
  categoryElement.addEventListener("change", renderPlans);
  zoneElement.addEventListener("change", renderPlans);
  renderPlans();
})();
