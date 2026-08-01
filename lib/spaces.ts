export interface SacredSpace {
  key: string;
  name: string;
  element: string;
  elementColor: string;
  icon: string;
  tagline: string;
  description: string;
  offerings: string[];
  photo?: string;
}

export const SPACES: Record<string, SacredSpace> = {
  "Lakeside": {
    key: "Lakeside",
    name: "The Lake",
    element: "Water",
    elementColor: "#3DB8AF",
    icon: "🌊",
    tagline: "Where sky meets water and the body remembers how to float.",
    description: "The lake is one of Warrior Lodge's most alive spaces — still in the morning, carrying sound across its surface in ways that feel impossible on land. Floating sound baths, paddleboard yoga, the cold plunge of contrast therapy, and the Lionsgate Activation all happen here. The water holds ceremony the way it holds light: completely, without effort. When you arrive at the lake, something in you exhales.",
    offerings: [
      "Floating Sound Bath",
      "Lionsgate Activation",
      "Paddleboard Yoga",
      "Sauna · Contrast Therapy",
      "Activate Your Light Sound Bath",
    ],
  },
  "Bonfire": {
    key: "Bonfire",
    name: "The Bonfire",
    element: "Fire",
    elementColor: "#FF6B35",
    icon: "🔥",
    tagline: "The oldest medicine — gather, witness, and be transformed.",
    description: "Fire is the original ceremony. The Warrior Lodge bonfire is the heart of our evening rituals — where cacao is passed, the Sacred Heart is opened, and the community drums together as the weekend closes. There is no performance here, only presence. The fire witnesses everything: your arrival, your surrender, your becoming. Community drumming begins here and ends wherever the night takes you.",
    offerings: [
      "Sacred Heart Activation",
      "Cacao Ceremony",
      "Community Drumming",
      "Draggon Stargates",
    ],
  },
  "Main Stage": {
    key: "Main Stage",
    name: "The Main Stage",
    element: "Fire · Air · Sound",
    elementColor: "#D4AF3C",
    icon: "🎤",
    tagline: "The heartbeat of the weekend — where every modality lives.",
    description: "The main stage is where the full range of Wellness Weekend's programming breathes — yoga, movement, sound healing, live music, ecstatic dance, workshops, and ceremony. It is a flexible sacred container that transforms across the day: morning stillness, afternoon activation, evening ceremony. Three nights of ecstatic dance begin and end here. Our visiting artists perform here. This is the gathering point, the commons, the center of the weekend.",
    offerings: [
      "Ecstatic Dance (3 nights)",
      "Yoga for Health · Feel Good Flow",
      "Keys of Kreation",
      "Live Music · All Weekend",
      "Sound Healing · Workshops",
    ],
  },
  "Labyrinth Garden": {
    key: "Labyrinth Garden",
    name: "The Labyrinth Garden",
    element: "Earth",
    elementColor: "#5E8A6A",
    icon: "🌀",
    tagline: "One path in. One path out. The garden holds what the ceremony releases.",
    description: "The labyrinth is a portal. Its single winding path leads you inward and then — eventually — back out into the world, changed. Open throughout the entire weekend for silent walking, integration, and reflection, it is the space between the ceremonies. The Sound Journey happens here on Sunday morning. And on Sunday at 11:11 AM, the Message from the Bees ecstatic dance activates this garden's full portal energy — one of the most sacred moments of the entire weekend.",
    offerings: [
      "Sound Journey · Sunday 8 AM",
      "Message from the Bees · Sunday 11:11 AM",
      "Pendulum Readings & Salt Intentions",
      "Open for Integration · All Weekend",
    ],
  },
  "Aerial Rig": {
    key: "Aerial Rig",
    name: "The Aerial Rig",
    element: "Air",
    elementColor: "#9B7FD4",
    icon: "🎋",
    tagline: "Leave the ground behind — and discover what lives above it.",
    description: "The aerial silk rig is where gravity becomes negotiable. Instructor Beth creates an intimate, encouraging space for beginners of all backgrounds to discover what it feels like to leave the ground — floating, stretching, and moving in three dimensions. The silks and paddleboards are provided by Alaska Fly Dog, our adventure equipment partner. Sessions run beginner-friendly, small-group classes (six max) at least twice a day, every day of the weekend. Prefer to fly solo? Silk hammocks are also available to rent during any Sound offering — settle in, go still, and let the frequency hold you. The Lionsgate Aerial Activation on Saturday morning — floating in a silk hammock as the Lion's Gate portal opens — is one of the most extraordinary experiences of the weekend.",
    offerings: [
      "Intro Aerial Silks · 2+ classes daily, Friday–Sunday",
      "Lionsgate Aerial Activation · Saturday 8 AM",
      "Intro Aerial for Kids · Sunday 2 PM",
      "Solo Silk Hammock Rental · Every Sound offering · $20/30 min · See /aerial",
    ],
  },
  "Sauna": {
    key: "Sauna",
    name: "The Sauna",
    element: "Steam · Fire · Water",
    elementColor: "#C05A2A",
    icon: "🪵",
    tagline: "Cedar walls, wood fire, and a view of the lake. The oldest healing ritual.",
    description: "Solstice Saunas brings their legendary barrel sauna to the edge of the lake at Warrior Lodge — a cedar-lined sanctuary with a circular window that frames the water like a painting. The wood-fired stove heats the room to a slow, deep burn. The lake is right there for your cold plunge. Sauna bathing is one of the most ancient healing modalities on earth: heat opens what armor keeps closed, and the contrast of hot and cold resets the nervous system at a cellular level. At Wellness Weekend, this is where you come to integrate, to sweat out what no longer belongs, and to emerge clearer.",
    offerings: [
      "Open Sauna Bathing · All Weekend",
      "Lakeside Cold Plunge",
      "Contrast Therapy · Heat + Cold",
      "Integration Sessions · Between Ceremonies",
    ],
    photo: "/images/client-2026/sauna-interior.jpg",
  },
};

export function getSpaceForLocation(location: string): SacredSpace | null {
  const primary = location.split(" · ")[0].trim();
  return SPACES[primary] ?? null;
}
