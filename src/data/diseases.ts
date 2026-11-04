import type { ImageSourcePropType } from 'react-native';

type L = { es: string; en: string };

export type Disease = {
  id: string;
  name: L;
  /** Scientific name of the organism, when there is one. */
  scientific?: string;
  kind: L;
  severity: 'common' | 'moderate' | 'serious';
  contagious: boolean;
  description: L;
  symptoms: L;
  cause: L;
  treatment: L;
  prevention: L;
  image?: ImageSourcePropType;
};

/**
 * Common problems in home freshwater aquariums. General guidance only:
 * the app never gives medication doses; it points to the product label.
 */
export const DISEASES: Disease[] = [
  {
    id: 'ich',
    name: { es: 'Punto blanco (Ich)', en: 'White spot (Ich)' },
    scientific: 'Ichthyophthirius multifiliis',
    kind: { es: 'Parásito', en: 'Parasite' },
    severity: 'common',
    contagious: true,
    description: {
      es: 'La enfermedad más común en acuarios de agua dulce. Un parásito se aloja bajo la piel y forma puntos blancos.',
      en: 'The most common disease in freshwater tanks. A parasite settles under the skin and forms white spots.',
    },
    symptoms: {
      es: 'Puntos blancos como granos de sal en cuerpo y aletas. El pez se roza contra objetos, cierra las aletas y respira rápido.',
      en: 'White spots like grains of salt on body and fins. The fish rubs against objects, clamps its fins and breathes fast.',
    },
    cause: {
      es: 'Aparece con cambios bruscos de temperatura, estrés o al introducir peces nuevos sin cuarentena.',
      en: 'Triggered by sudden temperature swings, stress, or adding new fish without quarantine.',
    },
    treatment: {
      es: 'Sube la temperatura poco a poco si las especies lo toleran y usa un tratamiento comercial contra el Ich en todo el acuario. Retira el carbón activado del filtro. Completa el tratamiento unos días después de que desaparezcan los puntos, porque solo la fase libre del parásito es vulnerable.',
      en: 'Raise the temperature gradually if your species tolerate it and treat the whole tank with a commercial ich remedy. Remove activated carbon from the filter. Keep treating a few days after the spots are gone, because only the free-swimming stage is vulnerable.',
    },
    prevention: {
      es: 'Cuarentena de 2 a 4 semanas para peces nuevos y temperatura estable.',
      en: 'Quarantine new fish for 2 to 4 weeks and keep the temperature stable.',
    },
  },
  {
    id: 'velvet',
    name: { es: 'Terciopelo (Oodinium)', en: 'Velvet (Oodinium)' },
    scientific: 'Piscinoodinium pillulare',
    kind: { es: 'Parásito', en: 'Parasite' },
    severity: 'moderate',
    contagious: true,
    description: {
      es: 'Un parásito microscópico que cubre la piel con un polvo fino dorado. Avanza rápido y daña las branquias.',
      en: 'A microscopic parasite that coats the skin with a fine golden dust. It spreads fast and damages the gills.',
    },
    symptoms: {
      es: 'Polvo dorado u óxido sobre la piel (se ve mejor con una linterna), aletas cerradas, respiración rápida, falta de apetito.',
      en: 'Gold or rust-colored dust on the skin (easier to see with a flashlight), clamped fins, fast breathing, loss of appetite.',
    },
    cause: {
      es: 'Peces nuevos sin cuarentena, estrés y mala calidad del agua.',
      en: 'New fish without quarantine, stress and poor water quality.',
    },
    treatment: {
      es: 'Oscurece el acuario unos días, ya que el parásito usa la luz. Trata todo el acuario con un medicamento contra terciopelo (muchos llevan cobre) y retira el carbón. El cobre es tóxico para camarones y caracoles.',
      en: 'Keep the tank dark for a few days, since the parasite uses light. Treat the whole tank with a velvet remedy (many contain copper) and remove carbon. Copper is toxic to shrimp and snails.',
    },
    prevention: {
      es: 'Cuarentena y buena calidad del agua.',
      en: 'Quarantine and good water quality.',
    },
  },
  {
    id: 'fin-rot',
    name: { es: 'Podredumbre de aletas', en: 'Fin rot' },
    kind: { es: 'Bacteriana', en: 'Bacterial' },
    severity: 'common',
    contagious: false,
    description: {
      es: 'Infección bacteriana que va comiendo las aletas desde los bordes.',
      en: 'A bacterial infection that eats away the fins from the edges.',
    },
    symptoms: {
      es: 'Aletas deshilachadas o cada vez más cortas, con bordes blancos, rojos o negros.',
      en: 'Ragged or shrinking fins with white, red or black edges.',
    },
    cause: {
      es: 'Casi siempre mala calidad del agua (amoníaco o nitritos), heridas, peces que muerden aletas o estrés.',
      en: 'Usually poor water quality (ammonia or nitrite), injuries, fin-nipping tankmates or stress.',
    },
    treatment: {
      es: 'Mide los parámetros y haz cambios de agua hasta corregirlos. Separa a los peces agresores. Los casos leves sanan con agua limpia; los graves necesitan un antibacteriano según la etiqueta.',
      en: 'Test the water and do water changes until it is right. Separate aggressive tankmates. Mild cases heal with clean water; severe ones need an antibacterial treatment as labeled.',
    },
    prevention: {
      es: 'Cambios de agua regulares y compañeros compatibles.',
      en: 'Regular water changes and compatible tankmates.',
    },
  },
  {
    id: 'columnaris',
    name: { es: 'Columnaris', en: 'Columnaris' },
    scientific: 'Flavobacterium columnare',
    kind: { es: 'Bacteriana', en: 'Bacterial' },
    severity: 'serious',
    contagious: true,
    description: {
      es: 'Infección bacteriana agresiva que avanza en horas o pocos días. Se confunde a menudo con hongos.',
      en: 'An aggressive bacterial infection that can progress in hours to days. Often mistaken for fungus.',
    },
    symptoms: {
      es: 'Manchas blanquecinas en la piel, una mancha en forma de silla cerca de la aleta dorsal, boca algodonosa y branquias dañadas.',
      en: 'Whitish patches on the skin, a saddle-shaped patch near the dorsal fin, cottony mouth and damaged gills.',
    },
    cause: {
      es: 'La bacteria vive en casi todos los acuarios y ataca con estrés, temperatura alta o agua de mala calidad.',
      en: 'The bacterium lives in most tanks and strikes with stress, high temperature or poor water.',
    },
    treatment: {
      es: 'Actúa rápido: aísla a los afectados, baja un poco la temperatura y usa un antibacteriano específico según la etiqueta. Mejora la calidad del agua.',
      en: 'Act fast: isolate affected fish, lower the temperature slightly and use a specific antibacterial treatment as labeled. Improve water quality.',
    },
    prevention: {
      es: 'Cuarentena, buena calidad del agua y evitar el hacinamiento.',
      en: 'Quarantine, good water quality and no overcrowding.',
    },
  },
  {
    id: 'fungus',
    name: { es: 'Hongos (Saprolegnia)', en: 'Fungus (Saprolegnia)' },
    scientific: 'Saprolegnia spp.',
    kind: { es: 'Fúngica', en: 'Fungal' },
    severity: 'common',
    contagious: false,
    description: {
      es: 'Moho de agua oportunista que crece sobre heridas, peces debilitados o huevos muertos.',
      en: 'An opportunistic water mold that grows on wounds, weakened fish or dead eggs.',
    },
    symptoms: {
      es: 'Mechones algodonosos blancos o grises sobre piel, aletas o huevos.',
      en: 'White or grey cotton-like tufts on skin, fins or eggs.',
    },
    cause: {
      es: 'Heridas, estrés, agua sucia y restos de comida o huevos en descomposición.',
      en: 'Injuries, stress, dirty water and decaying food or eggs.',
    },
    treatment: {
      es: 'Mejora el agua, retira huevos muertos y restos, y usa un antifúngico según la etiqueta. Busca la causa de la herida.',
      en: 'Improve the water, remove dead eggs and debris, and use an antifungal treatment as labeled. Find what caused the wound.',
    },
    prevention: {
      es: 'Evitar heridas, no sobrealimentar y mantener el agua limpia.',
      en: 'Avoid injuries, do not overfeed and keep the water clean.',
    },
  },
  {
    id: 'dropsy',
    name: { es: 'Hidropesía', en: 'Dropsy' },
    kind: { es: 'Síntoma de infección interna', en: 'Sign of internal infection' },
    severity: 'serious',
    contagious: false,
    description: {
      es: 'No es una enfermedad en sí, sino acumulación de líquido por fallo de órganos internos, casi siempre por infección.',
      en: 'Not a disease itself but fluid buildup from internal organ failure, usually caused by infection.',
    },
    symptoms: {
      es: 'Vientre hinchado, escamas levantadas como una piña vista desde arriba, ojos saltones y letargo.',
      en: 'Swollen belly, scales sticking out like a pinecone seen from above, bulging eyes and lethargy.',
    },
    cause: {
      es: 'Infección bacteriana interna favorecida por mala calidad del agua, estrés o mala alimentación.',
      en: 'Internal bacterial infection helped by poor water, stress or poor diet.',
    },
    treatment: {
      es: 'Aísla al pez en un acuario hospital. Se usa sal de Epsom para reducir la hinchazón y antibacterianos según la etiqueta. El pronóstico suele ser malo; si el pez sufre, consulta sobre eutanasia humanitaria.',
      en: 'Move the fish to a hospital tank. Epsom salt is used to reduce swelling, with antibacterial treatment as labeled. The outlook is often poor; if the fish is suffering, look into humane euthanasia.',
    },
    prevention: {
      es: 'Agua estable y limpia y dieta variada.',
      en: 'Clean, stable water and a varied diet.',
    },
  },
  {
    id: 'swim-bladder',
    name: { es: 'Problemas de vejiga natatoria', en: 'Swim bladder disorder' },
    kind: { es: 'Trastorno', en: 'Disorder' },
    severity: 'moderate',
    contagious: false,
    description: {
      es: 'El pez pierde el control de su flotación. Es común en goldfish de fantasía y bettas.',
      en: 'The fish loses control of its buoyancy. Common in fancy goldfish and bettas.',
    },
    symptoms: {
      es: 'Nada de lado o boca abajo, flota sin control o no puede subir desde el fondo.',
      en: 'Swims sideways or upside down, floats helplessly or cannot rise from the bottom.',
    },
    cause: {
      es: 'Sobrealimentación, estreñimiento, comida seca que se hincha, tragar aire al comer, forma del cuerpo o infección.',
      en: 'Overfeeding, constipation, dry food that swells, gulping air while eating, body shape or infection.',
    },
    treatment: {
      es: 'Ayuno de 2 a 3 días y luego arvejas peladas y escaldadas o dafnia. Remoja la comida seca antes de darla. Si no mejora, puede ser una infección.',
      en: 'Fast for 2 to 3 days, then feed blanched shelled peas or daphnia. Soak dry food before feeding. If it does not improve, it may be an infection.',
    },
    prevention: {
      es: 'Raciones pequeñas y comida remojada.',
      en: 'Small portions and soaked food.',
    },
  },
  {
    id: 'popeye',
    name: { es: 'Ojo saltón (exoftalmia)', en: 'Pop-eye (exophthalmia)' },
    kind: { es: 'Síntoma', en: 'Symptom' },
    severity: 'moderate',
    contagious: false,
    description: {
      es: 'Uno o ambos ojos se hinchan y sobresalen por líquido detrás del ojo.',
      en: 'One or both eyes swell and bulge from fluid behind the eye.',
    },
    symptoms: {
      es: 'Ojo saltón, a veces turbio o con un anillo blanco.',
      en: 'Bulging eye, sometimes cloudy or with a white ring.',
    },
    cause: {
      es: 'En un solo ojo suele ser un golpe. En ambos, infección bacteriana o mala calidad del agua.',
      en: 'In one eye it is usually an injury. In both, a bacterial infection or poor water quality.',
    },
    treatment: {
      es: 'Cambios de agua y revisión de parámetros. La sal de Epsom ayuda a bajar la hinchazón; si hay infección, antibacteriano según la etiqueta. Sana despacio.',
      en: 'Water changes and a parameter check. Epsom salt helps reduce swelling; if infected, an antibacterial treatment as labeled. It heals slowly.',
    },
    prevention: {
      es: 'Decoración sin bordes filosos y buena calidad del agua.',
      en: 'Decor without sharp edges and good water quality.',
    },
  },
  {
    id: 'hlle',
    name: { es: 'Agujeros en la cabeza (HLLE)', en: 'Hole in the head (HLLE)' },
    kind: { es: 'Trastorno', en: 'Disorder' },
    severity: 'moderate',
    contagious: false,
    description: {
      es: 'Erosión de la cabeza y la línea lateral, frecuente en cíclidos grandes como óscar y disco.',
      en: 'Erosion of the head and lateral line, common in large cichlids such as oscars and discus.',
    },
    symptoms: {
      es: 'Pequeños hoyos o lesiones claras en la cabeza y a lo largo de los costados.',
      en: 'Small pits or pale lesions on the head and along the sides.',
    },
    cause: {
      es: 'No está del todo clara. Se asocia a nitratos altos, dieta pobre, carbón activado y al parásito Hexamita.',
      en: 'Not fully understood. Linked to high nitrate, poor diet, activated carbon and the Hexamita parasite.',
    },
    treatment: {
      es: 'Baja los nitratos con cambios de agua, da una dieta variada y rica en vitaminas y retira el carbón. Si se sospecha Hexamita, un tratamiento con metronidazol según la etiqueta.',
      en: 'Lower nitrate with water changes, feed a varied vitamin-rich diet and remove carbon. If Hexamita is suspected, a metronidazole treatment as labeled.',
    },
    prevention: {
      es: 'Nitratos bajos y buena alimentación.',
      en: 'Low nitrate and good nutrition.',
    },
  },
  {
    id: 'camallanus',
    name: { es: 'Gusanos Camallanus', en: 'Camallanus worms' },
    scientific: 'Camallanus spp.',
    kind: { es: 'Parásito interno', en: 'Internal parasite' },
    severity: 'moderate',
    contagious: true,
    description: {
      es: 'Gusanos intestinales comunes en vivíparos como guppys y mollys.',
      en: 'Intestinal worms common in livebearers such as guppies and mollies.',
    },
    symptoms: {
      es: 'Hilos rojos que asoman por el ano, pez delgado aunque coma, vientre hundido o hinchado.',
      en: 'Red threads sticking out of the vent, a thin fish even though it eats, sunken or swollen belly.',
    },
    cause: {
      es: 'Peces nuevos infectados o alimento vivo contaminado.',
      en: 'Infected new fish or contaminated live food.',
    },
    treatment: {
      es: 'Desparasitante para nematodos (por ejemplo levamisol o flubendazol) en todo el acuario según la etiqueta, repitiendo a las 2 o 3 semanas. Sifonea bien el fondo.',
      en: 'A nematode dewormer (for example levamisole or flubendazole) in the whole tank as labeled, repeated after 2 to 3 weeks. Vacuum the substrate well.',
    },
    prevention: {
      es: 'Cuarentena y revisar a los vivíparos nuevos.',
      en: 'Quarantine and check new livebearers.',
    },
  },
  {
    id: 'anchor-worm',
    name: { es: 'Gusano ancla (Lernaea)', en: 'Anchor worm (Lernaea)' },
    scientific: 'Lernaea spp.',
    kind: { es: 'Parásito externo', en: 'External parasite' },
    severity: 'moderate',
    contagious: true,
    description: {
      es: 'Un crustáceo parásito que se clava en la piel. Frecuente en goldfish y peces de estanque.',
      en: 'A parasitic crustacean that anchors into the skin. Common in goldfish and pond fish.',
    },
    symptoms: {
      es: 'Hilos blanquecinos o verdosos pegados a la piel con un punto rojo inflamado en la base.',
      en: 'Whitish or greenish threads stuck to the skin with a red, inflamed spot at the base.',
    },
    cause: {
      es: 'Llega con peces nuevos o plantas de estanque.',
      en: 'Arrives with new fish or pond plants.',
    },
    treatment: {
      es: 'Retira cada parásito con pinzas desde la base y desinfecta la herida. Trata el acuario con un antiparasitario para crustáceos según la etiqueta para eliminar las larvas. No es seguro con camarones.',
      en: 'Pull each parasite out from the base with tweezers and disinfect the wound. Treat the tank with an anti-crustacean parasite remedy as labeled to kill the larvae. Not shrimp safe.',
    },
    prevention: {
      es: 'Cuarentena para peces y plantas nuevas.',
      en: 'Quarantine for new fish and plants.',
    },
  },
  {
    id: 'ammonia',
    name: { es: 'Intoxicación por amoníaco', en: 'Ammonia poisoning' },
    kind: { es: 'Calidad del agua', en: 'Water quality' },
    severity: 'serious',
    contagious: false,
    description: {
      es: 'El amoníaco de los desechos quema las branquias. Es la causa más común de muertes en acuarios nuevos.',
      en: 'Ammonia from waste burns the gills. It is the most common cause of deaths in new tanks.',
    },
    symptoms: {
      es: 'Peces boqueando en la superficie, branquias rojas, letargo, aletas cerradas. El test marca amoníaco mayor a 0.',
      en: 'Fish gasping at the surface, red gills, lethargy, clamped fins. The test shows ammonia above 0.',
    },
    cause: {
      es: 'Acuario sin ciclar, demasiados peces, sobrealimentación, restos en descomposición o filtro lavado con agua de la llave.',
      en: 'Uncycled tank, too many fish, overfeeding, decaying matter or a filter rinsed in tap water.',
    },
    treatment: {
      es: 'Cambio de agua inmediato del 30 al 50 % con agua declorada a la misma temperatura. Usa un acondicionador que neutralice amoníaco, reduce la comida y repite a diario hasta que el test marque 0.',
      en: 'Do an immediate 30 to 50% water change with dechlorinated water at the same temperature. Use a conditioner that binds ammonia, cut feeding and repeat daily until the test reads 0.',
    },
    prevention: {
      es: 'Ciclar el acuario antes de agregar peces y lavar el filtro con agua del propio acuario.',
      en: 'Cycle the tank before adding fish and rinse the filter in tank water.',
    },
  },
];

export function getDisease(id: string) {
  return DISEASES.find((d) => d.id === id);
}
