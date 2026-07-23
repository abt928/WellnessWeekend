export type Element = "fire" | "water" | "air" | "earth" | "quantum";

export interface ScheduleEvent {
  time: string;
  event: string;
  detail?: string;
  element: Element;
  secondElement?: Element;
  thirdElement?: Element;
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
  "Our gathering falls on August 8th — the Lion's Gate Portal. A day of heightened energy and intentional outdoor ceremony. We step outside together at 8:08 AM to meet the day with full presence — mountain air, open sky, and the earth beneath bare feet.";
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
    theme: "Land · Arrival · Intention · Past",
    events: [
      {
        time: "1:00 PM",
        event: "Opening Ceremony",
        detail: "Land acknowledgement and Dance Alchemy — the movement medicine your soul has been craving. We gather as one community to open the portal of the weekend.",
        element: "fire", location: "Main Stage",
        hosts: ["ashleigh"],
      },
      {
        time: "2:00 PM",
        event: "Quantum Light Activation",
        detail: "Activate your healing with phototherapy — quantum light technology to spark cellular renewal and elevate your energy field as you arrive.",
        element: "quantum", location: "Main Stage",
        hosts: ["shawn"],
      },
      {
        time: "2:00 PM",
        event: "Paddleboard Yoga",
        detail: "All levels, beginner-friendly flow on the lake — you might get wet!",
        element: "water", location: "Lakeside",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "3:00 PM",
        event: "Dragon Stargates",
        detail: "A multidimensional ceremony opening galactic portal energy — journey through cosmic lineage and dragon consciousness.",
        element: "fire", location: "Bonfire",
        hosts: ["akatale"],
      },
      {
        time: "3:00 PM",
        event: "Guided Meditation",
        detail: "Guided bilateral movement for a deeply relaxing, grounding session.",
        element: "earth", location: "Labyrinth Garden",
        gloss: LABYRINTH_GLOSS,
        hosts: ["dixie"],
      },
      {
        time: "3:00 PM",
        event: "Intro Aerial",
        detail: "Beginner silks flow — learn the basics of floating and flying. 6 people max.",
        element: "air", location: "Aerial Rig",
        limited: true,
        hosts: ["beth"],
      },
      {
        time: "3:00 PM",
        event: "Contrast Therapy",
        detail: "30 min · Cold plunge + heat cycling to activate circulation, reduce inflammation, and ground your nervous system.",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "4:00 PM",
        event: "Tarot + Tea Party",
        detail: "Divinators gather in the garden to share readings, sip community tea, and activate the space. Come as you are — daily at 4 PM.",
        element: "earth", location: "Labyrinth Garden",
      },
      {
        time: "5:00 PM",
        event: "Yin Yoga & Sound Savasana",
        detail: "Restorative long-hold poses melting into a full sound savasana.",
        element: "earth", secondElement: "quantum",
        location: "Main Stage",
        hosts: ["mary"],
      },
      {
        time: "5:00 PM",
        event: "Keys of Kreation",
        detail: "Unlock your infinite potential of creative expression in this 2-hour immersive workshop.",
        element: "fire", location: "Main Stage",
        hosts: ["j-brave"],
      },
      {
        time: "7:30 PM",
        event: "Sacred Heart Activation",
        detail: "Cacao ceremony and heart activation — an opening of the sacred heart through ceremony, sound, and intention around the fire.",
        element: "fire", location: "Bonfire",
        hosts: ["az", "avalon-starling"],
      },
      {
        time: "8:00 PM",
        event: "Ecstatic Dance",
        element: "fire", secondElement: "air", thirdElement: "quantum",
        location: "Main Stage",
        hosts: ["flowscape"],
      },
    ],
  },
  {
    label: "Saturday · Aug 8",
    headingText: "Activation + Transformation",
    headingIcon: "flame",
    theme: "Lion's Gate · Expansion · Ceremony · Present",
    events: [
      {
        time: "7:00 AM",
        event: "Floating Sound Bath",
        detail: "Handpan music and ambient sound washing over the still morning lake.",
        element: "water", secondElement: "air", thirdElement: "quantum",
        location: "Lakeside",
        hosts: ["avalon-starling"],
      },
      {
        time: "8:00 AM",
        event: "Lionsgate Activation 🦁 + Floating Sound Bath",
        detail: "Float in an aerial silk hammock or on a paddleboard as the Lion's Gate opens — ceremony at 8:08 AM.",
        element: "water", secondElement: "air", thirdElement: "quantum",
        location: "Lakeside · Aerial",
        gloss: LIONSGATE_GLOSS,
        hosts: ["avalon-starling"],
      },
      {
        time: "9:00 AM",
        event: "Yoga for Health",
        detail: "An energizing embodiment practice weaving sound, breath, and asana.",
        element: "earth", location: "Main Stage",
        hosts: ["logan-forehand"],
      },
      {
        time: "9:30 AM",
        event: "Contrast Therapy",
        detail: "30 min · Cold plunge + heat cycling — ground and reset at the midpoint of your day.",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "10:00 AM",
        event: "Quantum Light Activation",
        detail: "Activate your healing with phototherapy — harness quantum light to renew the body and brighten the field.",
        element: "quantum", location: "Main Stage",
        hosts: ["shawn"],
      },
      {
        time: "10:00 AM",
        event: "Intro Aerial",
        detail: "Floating in silks — a supported introduction to aerial flight. 6 people max.",
        element: "air", location: "Aerial Rig",
        limited: true,
        hosts: ["beth"],
      },
      {
        time: "11:00 AM",
        event: "Feel Good Flow",
        detail: "An uplifting all-levels flow to embody the breath, open the body, and raise your vibration.",
        element: "earth", secondElement: "air",
        location: "Main Stage",
        hosts: ["jenni"],
      },
      {
        time: "11:00 AM",
        event: "Miracle of Mind",
        detail: "Beginner-friendly guided meditation and open discussion on the power of the mind.",
        element: "earth", location: "Labyrinth Garden",
        hosts: ["logan-forehand"],
      },
      {
        time: "12:00 PM",
        event: "The Expression of the Soul",
        detail: "A 2-hour immersion in guided meditation and multidimensional visualization — release limiting energetic patterns, reconnect with your Higher Self, and align with your sacred purpose.",
        element: "fire", location: "Main Stage",
        hosts: ["akatale", "avalon-starling"],
      },
      {
        time: "1:00 PM",
        event: "Paddleboard Yoga",
        detail: "A midday flow on the water — all levels welcome.",
        element: "water", location: "Lakeside",
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "2:00 PM",
        event: "Ayni Despacho Ceremony",
        detail: "An Andean gratitude ceremony — weave prayers and offerings into a despacho bundle in sacred reciprocity with the land.",
        element: "fire", location: "Lodge",
        gloss: AYNI_GLOSS,
        fee: "Workshop materials fee · $75",
      },
      {
        time: "2:00 PM",
        event: "Intro Aerial",
        detail: "Beginner silks session — float, stretch, and play. 6 people max.",
        element: "air", location: "Aerial Rig",
        limited: true,
        hosts: ["beth"],
      },
      {
        time: "2:30 PM",
        event: "Yogassage",
        detail: "A blend of yoga assists and massage — receive hands-on adjustments in deeply restorative poses.",
        element: "earth", location: "Main Stage",
        hosts: ["sarah"],
      },
      {
        time: "3:00 PM",
        event: "Authentic Relating Practice",
        detail: "Connection games and guided practices that drop us below small talk into real presence with one another.",
        element: "fire", location: "Labyrinth Garden",
        hosts: ["az"],
      },
      {
        time: "4:00 PM",
        event: "Roots for Recovery",
        detail: "Yin yoga with long holds and MFR props, ending in a Tibetan bowl and gong sound bath.",
        element: "earth", secondElement: "quantum",
        location: "Main Stage",
        hosts: ["jon"],
      },
      {
        time: "4:00 PM",
        event: "Tarot + Tea Party",
        detail: "Daily gathering of readers and seekers in the garden — tea, cards, and connection.",
        element: "earth", location: "Labyrinth Garden",
      },
      {
        time: "5:30 PM",
        event: "Contrast Therapy",
        detail: "30 min · Final session of the day — prepare your body for an evening of ceremony.",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "6:00 PM",
        event: "S7INGRAE & Brackish · Live Music",
        detail: "A live set to carry the community from afternoon practice into the evening's ceremony.",
        element: "air", secondElement: "quantum",
        location: "Main Stage",
        hosts: ["s7ngrae"],
      },
      {
        time: "7:00 PM",
        event: "Cacao Ceremony",
        detail: "Gather at the fire to share ceremonial cacao and open the heart before the night's dance.",
        element: "fire", location: "Bonfire",
      },
      {
        time: "8:00 PM",
        event: "8/8 Lionsgate Drumming Ceremony",
        detail: "A ceremonial drumming circle to honor the Lion's Gate — an open call to the heartbeat of the earth and the fire of transformation. Bring your drum.",
        element: "fire", secondElement: "quantum",
        location: "Bonfire",
      },
      {
        time: "9:30 PM",
        event: "Ecstatic Dance",
        element: "fire", secondElement: "air", thirdElement: "quantum",
        location: "Main Stage",
        hosts: ["j-brave"],
      },
    ],
  },
  {
    label: "Sunday · Aug 9",
    headingText: "Integration + Community",
    headingIcon: "leaf",
    theme: "Soft Landing · Heart Opening · Family Day · Future",
    events: [
      {
        time: "9:00 AM",
        event: "Sound Journey",
        detail: "Handpan music and ambient sound bath nestled in the labyrinth garden.",
        element: "earth", secondElement: "air", thirdElement: "quantum",
        location: "Labyrinth Garden",
        gloss: LABYRINTH_GLOSS,
        hosts: ["peace-pixy"],
      },
      {
        time: "9:00 AM",
        event: "Contrast Therapy",
        detail: "30 min · Cold plunge + sauna cycling, available all day. Must be booked in advance.",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "10:00 AM",
        event: "Quantum Light Activation",
        detail: "A final phototherapy activation — integrate the weekend's medicine in quantum light.",
        element: "quantum", location: "Main Stage",
        hosts: ["shawn"],
      },
      {
        time: "10:00 AM",
        event: "Floating Sound Bath",
        detail: "A final morning float — ambient sound washing over the water to integrate the weekend's medicine.",
        element: "water", secondElement: "air", thirdElement: "quantum",
        location: "Lakeside",
        hosts: ["avalon-starling"],
      },
      {
        time: "10:00 AM",
        event: "Earthing Practice",
        detail: "Barefoot connection to the land — grounding through breath, movement, and direct contact with the earth.",
        element: "earth", location: "Labyrinth Garden",
        hosts: ["gail"],
      },
      {
        time: "10:30 AM",
        event: "Intro Aerial for Kids",
        detail: "A playful introduction to silks for little flyers. 6 kids max.",
        element: "air", location: "Aerial Rig",
        limited: true,
        hosts: ["beth"],
      },
      {
        time: "11:00 AM",
        event: "TBA — New Offering",
        detail: "A new offering to be announced — stay tuned.",
        element: "fire", location: "Main Stage",
      },
      {
        time: "11:11 AM",
        event: "Message from the Bees · Earth Ceremony",
        detail: "Activate the Labyrinth Garden portal energy with ecstatic dance.",
        element: "earth", secondElement: "fire", thirdElement: "quantum",
        location: "Labyrinth Garden",
        hosts: ["mary"],
      },
      {
        time: "11:30 AM",
        event: "Contrast Therapy",
        detail: "30 min · Invigorate and integrate — book in advance.",
        element: "water", secondElement: "fire",
        location: "Lakeside",
        gloss: CONTRAST_GLOSS,
        limited: true,
        hosts: ["ashleigh"],
      },
      {
        time: "12:00 PM",
        event: "Shawn Zuke · Live Music",
        detail: "Soulful live music to open the family-day afternoon.",
        element: "air", secondElement: "quantum",
        location: "Main Stage",
        hosts: ["shawn-zuke"],
      },
      {
        time: "1:00 PM",
        event: "Kuf Knotz + Christine Elise · Live Music",
        detail: "Conscious hip-hop meets raw folk — an uplifting 2-hour live collaboration.",
        element: "air", secondElement: "quantum",
        location: "Main Stage",
        hosts: ["kuf-knotz", "christine-elise"],
      },
      {
        time: "1:00 PM",
        event: "Kids Paddleboard",
        detail: "A playful, safe introduction to paddleboarding for young adventurers — family day on the lake!",
        element: "water", location: "Lakeside",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "3:00 PM",
        event: "Paddleboard Yoga",
        detail: "A final all-levels flow on the water — integrate the weekend floating under the open sky.",
        element: "water", location: "Lakeside",
        limited: true,
        hosts: ["alice"],
      },
      {
        time: "3:15 PM",
        event: "J Brave · Live Set",
        detail: "45 minutes of conscious lyricism and heart-forward music.",
        element: "air", secondElement: "quantum",
        location: "Main Stage",
        hosts: ["j-brave"],
      },
      {
        time: "4:00 PM",
        event: "ÂKÅTÂLĖ · Live Music",
        detail: "A live sonic journey to gather the community toward closing.",
        element: "air", secondElement: "quantum",
        location: "Main Stage",
        hosts: ["akatale"],
      },
      {
        time: "4:00 PM",
        event: "Tarot + Tea Party",
        detail: "The final daily garden gathering — close the weekend with mystery and magic.",
        element: "earth", location: "Labyrinth Garden",
        hosts: ["mystical-moon-dance"],
      },
      {
        time: "5:00 PM",
        event: "Closing Ceremony",
        detail: "Circle up to seal the container — gratitude, integration, and carrying the medicine home.",
        element: "fire", location: "Main Stage",
      },
      {
        time: "6:00 PM",
        event: "Band Jam",
        detail: "The weekend's musicians take the stage together for a live collaborative jam — one last wave of sound as a community.",
        element: "air", secondElement: "quantum",
        location: "Main Stage",
      },
      {
        time: "7:00 PM",
        event: "Ecstatic Dance",
        detail: "7–9 PM · Close the weekend dancing.",
        element: "fire", secondElement: "air", thirdElement: "quantum",
        location: "Main Stage",
        hosts: ["flowscape"],
      },
    ],
  },
];
