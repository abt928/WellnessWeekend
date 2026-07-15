export type Element = "fire" | "water" | "air" | "earth";

export interface ScheduleEvent {
  time: string;
  event: string;
  detail?: string;
  element: Element;
  secondElement?: Element;
  location?: string;
  gloss?: string;
  limited?: boolean;
  fee?: string;
  hosts?: string[];
}

export interface ScheduleDay {
  label: string;
  headingText: string;
  headingIcon: "moon" | "flame" | "leaf";
  theme: string;
  events: ScheduleEvent[];
}

export const LIONSGATE_GLOSS =
  "Our gathering falls on August 8th — the Lion's Gate Portal. A day of heightened energy and intentional outdoor ceremony. We step outside together at 8:08 AM to meet the day with full presence — mountain air, open sky, and the earth beneath bare feet. Led by White Eagle Medicine Woman.";
export const AYNI_GLOSS =
  "An Andean ceremony of reciprocity. A small bundle of seeds, flowers, and offerings is built and given back to the mountain spirits.";
export const CONTRAST_GLOSS =
  "Alternating cold water immersion and heat activates circulation, reduces inflammation, and powerfully grounds the nervous system. Sessions run all day Friday–Sunday in 30-minute slots — sauna holds 4 people maximum. Must be booked in advance. Facilitated by Ashleigh Bicknell.";
export const LABYRINTH_GLOSS =
  "One path in. One path out. The labyrinth garden is open throughout the weekend for silent walking, integration, and personal reflection between ceremonies.";

export const scheduleDays: ScheduleDay[] = [
  {
    label: "Friday · Aug 7",
    headingText: "Arrival + Grounding",
    headingIcon: "moon",
    theme: "Land, Arrival, Intention",
    events: [
      {
        time: "1:00 PM",
        event: "Opening Ceremony",
        detail: "Land Acknowledgement · Dance Alchemy with Ashleigh — the movement medicine your soul has been craving",
        element: "fire", location: "Main Stage",
        hosts: ["ashleigh"],
      },
      {
        time: "2:00 PM",
        event: "Past Life Guided Meditation",
        detail: "For those ready to go deep — an epic cleanse focusing on past lives in the multidimensional world",
        element: "fire", location: "Main Stage",
        hosts: ["akatale", "avalon-starling"],
      },
      {
        time: "2:00 PM",
        event: "Paddleboard Yoga",
        detail: "All levels, beginner flow — you might get wet!",
        element: "water", location: "Lakeside",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "3:00 PM",
        event: "Guided Meditation",
        detail: "Guided bilateral movement for a relaxing grounding session",
        element: "earth", location: "Labyrinth Garden",
        gloss: LABYRINTH_GLOSS,
        hosts: ["dixie"],
      },
      {
        time: "3:00 PM",
        event: "Intro Aerial",
        detail: "Beginner silks flow · 6 people max",
        element: "air",
        limited: true,
        hosts: ["beth"],
      },
      {
        time: "3:00 PM",
        event: "Contrast Therapy",
        detail: "30 min · Cold plunge + heat cycling to activate circulation, reduce inflammation, and ground your nervous system",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "4:00 PM",
        event: "Yin Yoga & Sound Savasana",
        detail: "Restorative poses with sound savasana",
        element: "earth", location: "Main Stage",
        hosts: ["mary"],
      },
      {
        time: "4:00 PM",
        event: "Tea Lounge",
        detail: "Come as you are. Community tea in the garden — a daily gathering to slow down, connect, and be.",
        element: "earth", location: "Labyrinth Garden",
      },
      {
        time: "5:00 PM",
        event: "Keys to Kreation",
        detail: "Unlock your infinite potential of creative expression · 2 hours",
        element: "fire", location: "Main Stage",
        hosts: ["j-brave"],
      },
      {
        time: "7:30 PM",
        event: "Sacred Heart Activation",
        detail: "Cacao ceremony and heart activation — an opening of the sacred heart through ceremony, sound, and intention",
        element: "fire", location: "Main Stage",
        hosts: ["az", "avalon-starling"],
      },
      {
        time: "8:00 PM",
        event: "Ecstatic Dance",
        element: "fire", location: "Main Stage",
        hosts: ["flowscape"],
      },
    ],
  },
  {
    label: "Saturday · Aug 8",
    headingText: "Activation + Transformation",
    headingIcon: "flame",
    theme: "Lion's Gate · Expansion · Ceremony",
    events: [
      {
        time: "7:00 AM",
        event: "Floating Sound Bath",
        detail: "Handpan music and ambient sound bath on the lake",
        element: "water", location: "Lakeside",
        hosts: ["peace-pixy"],
      },
      {
        time: "8:00 AM",
        event: "Lionsgate Activation + Floating Sound Bath",
        detail: "Float in an aerial silk hammock or on the lake on a paddleboard — ceremony at 8:08 AM",
        element: "water", secondElement: "air",
        location: "Lake · Aerial",
        gloss: LIONSGATE_GLOSS,
        hosts: ["avalon-starling"],
      },
      {
        time: "9:00 AM",
        event: "Yoga for Health",
        detail: "Yoga with sound, breath and asanas",
        element: "fire", location: "Main Stage",
        hosts: ["logan-forehand"],
      },
      {
        time: "9:30 AM",
        event: "Contrast Therapy",
        detail: "30 min · Cold plunge + heat cycling — ground and reset at the midpoint of your day",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "10:00 AM",
        event: "Quantum Light Activation",
        detail: "Activate your healing with phototherapy",
        element: "earth", location: "Main Stage",
        hosts: ["shawn"],
      },
      {
        time: "10:00 AM",
        event: "Intro Aerial",
        detail: "Floating in silks · 6 people max",
        element: "air",
        limited: true,
        hosts: ["beth"],
      },
      {
        time: "11:00 AM",
        event: "Feel Good Flow",
        element: "air",
        hosts: ["jenni"],
      },
      {
        time: "11:00 AM",
        event: "Dragon Stargates",
        detail: "A multidimensional ceremony opening galactic portal energy — journey through cosmic lineage and dragon consciousness",
        element: "fire", location: "Lodge",
        hosts: ["akatale"],
      },
      {
        time: "12:00 PM",
        event: "Heartbeat of the Lion's Gate: Riding the Fire Horse into Your Destiny",
        detail: "A Drumming Ceremony of Courage, Sovereignty and Sacred Purpose — bring your drum",
        element: "fire", location: "Main Stage",
        hosts: ["white-eagle"],
      },
      {
        time: "1:00 PM",
        event: "Paddleboard Yoga",
        element: "water", location: "Lakeside",
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "2:00 PM",
        event: "Ayni Despacho Ceremony",
        element: "fire", location: "Lodge",
        gloss: AYNI_GLOSS,
        fee: "Workshop materials fee · $75",
      },
      {
        time: "2:00 PM",
        event: "Intro Aerial",
        element: "air",
        limited: true,
        hosts: ["beth"],
      },
      {
        time: "2:30 PM",
        event: "Yogassage",
        detail: "A blend of yoga assists and massage — receive hands-on adjustments in restorative poses",
        element: "earth",
        hosts: ["sarah"],
      },
      {
        time: "3:00 PM",
        event: "Authentic Relating Practice",
        element: "fire", location: "Lodge",
        hosts: ["az"],
      },
      {
        time: "3:00 PM",
        event: "Miracle of Mind",
        detail: "Beginner-friendly guided meditation and discussion",
        element: "earth", location: "Main Stage",
        hosts: ["logan-forehand"],
      },
      {
        time: "4:00 PM",
        event: "Roots for Recovery",
        detail: "Yin yoga with long holds, MFR props, ending in a Tibetan bowl and gong sound bath",
        element: "earth", location: "Main Stage",
        hosts: ["jon"],
      },
      {
        time: "4:00 PM",
        event: "Tea Lounge",
        detail: "Come as you are. Community tea in the garden — a daily gathering to slow down, connect, and be.",
        element: "earth", location: "Labyrinth Garden",
      },
      {
        time: "5:30 PM",
        event: "Contrast Therapy",
        detail: "30 min · Final session of the day — prepare your body for an evening of ceremony",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "6:00 PM",
        event: "S7ngrae",
        detail: "Live music",
        element: "fire", location: "Main Stage",
        hosts: ["s7ngrae"],
      },
      {
        time: "7:00 PM",
        event: "Cacao Ceremony",
        element: "fire", location: "Main Stage",
      },
      {
        time: "8:00 PM",
        event: "Ecstatic Dance",
        element: "fire", location: "Main Stage",
        hosts: ["j-brave"],
      },
    ],
  },
  {
    label: "Sunday · Aug 9",
    headingText: "Integration + Community",
    headingIcon: "leaf",
    theme: "Soft Landing · Heart Opening · Family Day",
    events: [
      {
        time: "9:00 AM",
        event: "Sound Journey",
        detail: "Handpan music and ambient sound bath in the labyrinth garden",
        element: "earth", location: "Labyrinth Garden",
        gloss: LABYRINTH_GLOSS,
        hosts: ["peace-pixy"],
      },
      {
        time: "9:00 AM",
        event: "Contrast Therapy",
        detail: "30 min · Available all day — cold plunge + sauna cycling. Must be booked in advance.",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "10:00 AM",
        event: "Tai Chi Dance",
        detail: "Flowing movement meditation — drawing from the traditions of Tai Chi to awaken the body with grace and presence",
        element: "fire", location: "Main Stage",
      },
      {
        time: "10:00 AM",
        event: "Earthing Practice with Gail",
        detail: "Barefoot connection to the land — grounding through breath, movement, and direct contact with the earth",
        element: "earth", location: "Outdoor Space",
        hosts: ["gail"],
      },
      {
        time: "10:30 AM",
        event: "Intro Aerial for Kids",
        element: "air",
        limited: true,
        hosts: ["beth"],
      },
      {
        time: "11:11 AM",
        event: "Message from the Bees — Ecstatic Dance",
        element: "earth", location: "Labyrinth Garden",
        hosts: ["mary"],
      },
      {
        time: "11:30 AM",
        event: "Contrast Therapy",
        detail: "30 min · Invigorate and integrate — available all day, must be booked in advance",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "12:00 PM",
        event: "Shawn Zuke",
        detail: "Live music",
        element: "fire", location: "Main Stage",
        hosts: ["shawn-zuke"],
      },
      {
        time: "1:00 PM",
        event: "Kuf Knotz + Christine Elise",
        detail: "Live music",
        element: "fire", location: "Main Stage",
        hosts: ["kuf-knotz", "christine-elise"],
      },
      {
        time: "3:15 PM",
        event: "J Brave",
        detail: "45 minutes",
        element: "fire", location: "Main Stage",
        hosts: ["j-brave"],
      },
      {
        time: "4:00 PM",
        event: "ÂKÅTÂLĖ",
        detail: "Live music",
        element: "fire", location: "Main Stage",
        hosts: ["akatale"],
      },
      {
        time: "4:00 PM",
        event: "Tarot + Tea Party",
        detail: "Divinators gather in the garden to share readings, activate the space, and close the weekend with mystery and magic",
        element: "earth", location: "Labyrinth Garden",
      },
      {
        time: "4:00 PM",
        event: "Tea Lounge",
        detail: "Come as you are. Community tea in the garden — a daily gathering to slow down, connect, and be.",
        element: "earth", location: "Labyrinth Garden",
      },
      {
        time: "5:00 PM",
        event: "Closing Ceremony",
        element: "fire", location: "Main Stage",
      },
      {
        time: "6:00 PM",
        event: "Ecstatic Dance",
        detail: "6–8 PM · Close the weekend dancing",
        element: "fire", location: "Main Stage",
        hosts: ["flowscape"],
      },
    ],
  },
];
