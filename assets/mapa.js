(function () {
  const mapElement = document.getElementById("jujuy-map");
  if (!mapElement) return;

  if (!window.L) {
    mapElement.textContent = "No se pudo cargar el mapa. Podés explorar las actividades sugeridas en la lista.";
    return;
  }

  mapElement.textContent = "";

  const activities = [
    {
      id: "purmamarca-trekking",
      category: "trekking",
      label: "Trekking",
      title: "Caminata entre cerros",
      zone: "Purmamarca",
      description: "Una idea para recorrer los paisajes de la Quebrada a pie.",
      coordinates: [-23.7468, -65.4992]
    },
    {
      id: "termas-trekking",
      category: "trekking",
      label: "Trekking",
      title: "Senderos y naturaleza",
      zone: "Termas de Reyes",
      description: "Explorá el entorno de las yungas y la montaña en una salida al aire libre.",
      coordinates: [-24.128, -65.49]
    },
    {
      id: "tilcara-mate",
      category: "mate",
      label: "Mateada",
      title: "Una ronda con vista a la Quebrada",
      zone: "Tilcara",
      description: "Compartí unos mates y conocé a otras personas viajeras.",
      coordinates: [-23.5776, -65.3952]
    },
    {
      id: "san-salvador-social",
      category: "social",
      label: "Encuentro social",
      title: "Conocé gente de la ciudad",
      zone: "San Salvador de Jujuy",
      description: "Ideas para encontrarse, conversar y descubrir propuestas locales.",
      coordinates: [-24.1858, -65.2995]
    },
    {
      id: "humahuaca-social",
      category: "social",
      label: "Encuentro social",
      title: "Compartí una experiencia en comunidad",
      zone: "Humahuaca",
      description: "Un punto de encuentro para conectar con la cultura y las personas de la zona.",
      coordinates: [-23.2051, -65.3500]
    },
    {
      id: "tilcara-social",
      category: "social",
      label: "Encuentro social",
      title: "Plan compartido en la Quebrada",
      zone: "Tilcara",
      description: "Sumate a una salida grupal y descubrí el destino en compañía.",
      coordinates: [-23.584, -65.39]
    }
  ];

  const markerColors = {
    trekking: "#287a58",
    mate: "#c66b32",
    social: "#8a4c88"
  };
  const map = window.L.map(mapElement, { scrollWheelZoom: true });
  const markers = new Map();

  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  const bounds = [];
  activities.forEach(function (activity) {
    const marker = window.L.circleMarker(activity.coordinates, {
      radius: 9,
      color: "#fff",
      weight: 2,
      fillColor: markerColors[activity.category],
      fillOpacity: 1
    });
    const popup = document.createElement("div");
    popup.className = "tribo-map-popup";
    const category = document.createElement("span");
    category.textContent = activity.label + " · " + activity.zone;
    const title = document.createElement("strong");
    title.textContent = activity.title;
    const description = document.createElement("div");
    description.textContent = activity.description;
    popup.append(category, title, description);
    marker.bindPopup(popup);
    marker.bindTooltip(activity.zone);
    marker.addTo(map);
    markers.set(activity.id, marker);
    bounds.push(activity.coordinates);
  });

  map.fitBounds(bounds, { padding: [24, 24], maxZoom: 8 });

  document.querySelectorAll("[data-map-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      const selectedCategory = button.dataset.mapFilter;
      document.querySelectorAll("[data-map-filter]").forEach(function (filter) {
        filter.setAttribute("aria-pressed", String(filter === button));
      });
      document.querySelectorAll("[data-place-id]").forEach(function (card) {
        const visible = selectedCategory === "all" || card.dataset.category === selectedCategory;
        card.hidden = !visible;
        const marker = markers.get(card.dataset.placeId);
        if (marker) {
          if (visible) marker.addTo(map);
          else map.removeLayer(marker);
        }
      });
    });
  });

  document.querySelectorAll("[data-place-id]").forEach(function (card) {
    card.addEventListener("click", function () {
      const marker = markers.get(card.dataset.placeId);
      if (!marker) return;
      map.flyTo(marker.getLatLng(), 11, { duration: 0.6 });
      marker.openPopup();
    });
  });

  window.setTimeout(function () {
    map.invalidateSize();
  }, 0);
})();
