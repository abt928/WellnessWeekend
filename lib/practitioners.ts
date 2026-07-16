export interface Practitioner {
  slug: string;
  name: string;
  role: string;
  offering: string;
  bio: string;
  photo?: string;
  website?: string;
  instagram?: string;
  isMusician?: boolean;
}

export const practitioners: Practitioner[] = [
  {
    slug: "avalon-starling",
    name: "Avalon Starling",
    role: "Master Sound Healer & Festival Director",
    offering: "Lionsgate Activation · Floating Sound Bath",
    bio: "Avalon Starling is a master sound healer and the founder and director of Wellness Weekend. Her Lionsgate Activation on the morning of August 8th invites participants to float in an aerial silk hammock or on the lake by paddleboard — a ceremony of sound, embodied presence, and light held under the Alaskan sky.",
  },
  {
    slug: "ashleigh",
    name: "Ashleigh Bicknell",
    role: "Dance & Movement Facilitator",
    offering: "Dance Alchemy · Opening Ceremony",
    bio: "Ashleigh is a movement medicine facilitator whose Dance Alchemy sessions dissolve the boundary between dance and healing. Through improvisational movement, breath, and live music, she creates a container where the body can finally say what words cannot. Expect to sweat, shake, and arrive home in yourself.",
  },
  {
    slug: "peace-pixy",
    name: "Peace Pixy",
    role: "Handpan Artist & Sound Healer",
    offering: "Floating Sound Bath · Sound Journey",
    bio: "Peace Pixy is a handpan musician and ambient sound healer whose performances blur the line between music and meditation. Their floating sound baths on the lake are a Wellness Weekend signature — healing tones carried across the water under the Alaskan sky.",
  },
  {
    slug: "logan-forehand",
    name: "Logan Forehand",
    role: "Yoga Instructor & Meditation Teacher",
    offering: "Yoga for Health · Miracle of Mind",
    bio: "Logan Forehand brings a science-meets-spirit approach to yoga and meditation. His sessions integrate breathwork, sound, and asanas to build genuine health from the inside out. Miracle of Mind is a beginner-friendly exploration of the meditation research that's changing how we understand the human brain.",
  },
  {
    slug: "shawn",
    name: "Shawn",
    role: "Phototherapy & Quantum Wellness Practitioner",
    offering: "Quantum Light Activation",
    bio: "Shawn is a biohacking and phototherapy specialist who works at the intersection of light, frequency, and cellular healing. His Quantum Light Activation session uses evidence-informed light protocols to support energy, recovery, and nervous system regulation.",
  },
  {
    slug: "alice",
    name: "Alice Sullivan",
    role: "Aerial Silk Artist & SUP Yoga Instructor",
    offering: "Aerial Silk · Paddleboard Yoga",
    bio: "Alice is a certified aerial silk artist and stand-up paddleboard yoga instructor with a gift for making both disciplines accessible and joyful. Whether you're floating on fabric or floating on water, she meets you exactly where you are with encouragement, laughter, and skill.",
  },
  {
    slug: "jenni",
    name: "Jenni",
    role: "Yoga & Movement Instructor",
    offering: "Feel Good Flow",
    bio: "Jenni's Feel Good Flow is exactly what it sounds like — a joyful, feel-good yoga class designed to get you out of your head and into your body. Open to all levels, her sessions blend fluid movement, breath, and music into a practice that leaves you lighter than when you arrived.",
  },
  {
    slug: "az",
    name: "AZ",
    role: "Ceremony Holder & Authentic Relating Facilitator",
    offering: "Heart Activation · Cacao Ceremony · Authentic Relating",
    bio: "AZ is a ceremony holder, cacao practitioner, and Authentic Relating facilitator whose work creates safe, charged containers for genuine human connection and heart opening. Their sessions are a reminder that being truly seen and truly heard is one of the most healing experiences available to us.",
  },
  {
    slug: "j-brave",
    name: "J Brave",
    role: "Sound Alchemist & Keys Artist",
    offering: "Keys to Kreation · Ecstatic Dance",
    bio: "J Brave is a visionary keys artist and sonic alchemist who performs at the intersection of music, consciousness, and creative activation. Keys to Kreation is his signature immersive experience — two hours of live improvisation, frequencies, and presence designed to unlock the creative infinite within you.",
  },
  {
    slug: "jon",
    name: "Jon",
    role: "Yoga Therapist & MFR Practitioner",
    offering: "Roots for Recovery",
    bio: "Jon is a yoga therapist and myofascial release specialist whose Roots for Recovery class was built for people who carry their stress in their body — which is most of us. Long-held restorative poses, MFR props, and a closing Tibetan bowl sound bath make this one of the weekend's most deeply healing offerings.",
  },
  {
    slug: "white-eagle",
    name: "White Eagle Medicine Woman",
    role: "Traditional Ceremony Leader",
    offering: "Lionsgate Drumming Ceremony",
    bio: "White Eagle Medicine Woman is a keeper of traditional ceremony and holder of the sacred Grandmother Drum. Her guided drumming ceremonies create a bridge between the personal and the ancestral, inviting participants into the healing intelligence of rhythm, prayer, and collective intention. Bring your drum.",
  },
  {
    slug: "kuf-knotz",
    name: "Kuf Knotz",
    role: "Hip Hop Artist & Conscious Lyricist",
    offering: "Live Music · Sunday Main Stage",
    bio: "Kuf Knotz is an award-winning hip hop artist, producer, and poet whose music has been described as soul medicine in rhyme form. His live performances weave conscious lyricism with groove-heavy production into something that moves the body and the spirit simultaneously.",
    isMusician: true,
  },
  {
    slug: "christine-elise",
    name: "Christine Elise",
    role: "Singer-Songwriter & Multi-Instrumentalist",
    offering: "Live Music · Sunday Main Stage",
    bio: "Christine Elise is a singer-songwriter and multi-instrumentalist whose intimate performances are powered by raw honesty and melodic precision. She performs alongside Kuf Knotz for a Sunday afternoon set that will leave you sitting in silence for a moment before you remember to applaud.",
    isMusician: true,
  },
  {
    slug: "flowscape",
    name: "Flowscape",
    role: "Electronic Music Producer & DJ",
    offering: "Ecstatic Dance · Friday & Sunday",
    bio: "Flowscape is an electronic music producer and DJ whose genre-dissolving sets are purpose-built for ecstatic dance, ceremony, and late-night exploration. Expect deep bass, ethereal textures, and the kind of music that makes your body move before your mind has caught up.",
    isMusician: true,
  },
  {
    slug: "shawn-zuke",
    name: "Shawn Zuke",
    role: "DJ & Music Producer",
    offering: "Live Music · Ecstatic Dance",
    bio: "Shawn Zuke is a DJ and music producer known for blending deep electronic soundscapes with healing frequencies. His sets move seamlessly between ceremony and dancefloor, creating a sonic container where transformation feels inevitable.",
    isMusician: true,
  },
  {
    slug: "s7ngrae",
    name: "S7ngrae",
    role: "Artist & Performer",
    offering: "Live Music · Wellness Weekend",
    bio: "S7ngrae brings a unique voice to the Wellness Weekend stage — an artist whose performances sit at the intersection of music, movement, and conscious expression.",
    isMusician: true,
  },
  {
    slug: "dixie",
    name: "Dixie",
    role: "Meditation Teacher & Somatic Guide",
    offering: "Guided Meditation · Labyrinth Garden",
    bio: "Dixie is a certified meditation teacher specializing in somatic and bilateral techniques that guide the nervous system into deep, grounded stillness. Her labyrinth garden sessions are one of the weekend's most beloved offerings — arrive with a busy mind and leave with a quiet one.",
  },
  {
    slug: "mary",
    name: "Mary",
    role: "Yin Yoga & Sound Healing Teacher",
    offering: "Yin Yoga & Sound Savasana",
    bio: "Mary is a yin yoga teacher and sound healer whose slow, intentional classes work deep into the connective tissue while her soundscapes carry you further than stretching alone ever could. Expect long holds, deep release, and a savasana you won't want to leave.",
  },
  {
    slug: "gail",
    name: "Gail Jackson",
    role: "Founder of CreativeRhythms · Earth-Based Educator",
    offering: "Earth Awareness Practice",
    bio: "Gail Jackson is the owner of CreativeRhythms and an earth-based wellness educator whose Earth Awareness Practice guides participants into deep sensory relationship with the living landscape. Her sessions draw on indigenous ecology, nature therapy, and the simple, radical act of paying attention to the world around you.",
  },
  {
    slug: "sarah",
    name: "Sarah",
    role: "Yogassage Practitioner",
    offering: "Yogassage",
    bio: "Sarah offers Yogassage — a deeply restorative fusion of assisted yoga stretching and Thai massage that works on the whole body at once. Sessions are done fully clothed on a mat and leave participants in a state of physical ease that's hard to describe and easy to feel.",
  },
  {
    slug: "beth",
    name: "Beth",
    role: "Aerial Silk Artist",
    offering: "Aerial Silk · All Weekend",
    bio: "Beth is an aerial silk artist and movement educator who brings warmth, technical skill, and genuine joy to every session. Her beginner-friendly aerial classes create a safe, encouraging space for people of all backgrounds to discover what it feels like to leave the ground. Small groups of 6 ensure everyone gets hands-on attention.",
  },
  {
    slug: "akatale",
    name: "ÂKÅTÂLĖ",
    role: "Visiting Artist · Lyran Dragon Warrior · Hawaii",
    offering: "Sacred Voice Activation · Past Life Regression · Live Music",
    bio: "GOLDEN DRAGGON MASTER ÂKÅTÂLĖ KUMARA ZORO REHU is a visiting artist from Hawaii and keeper of the Mâkâhâ lineage. Through sacred toning, Waikara chanting, and Dragon breath techniques, he unlocks frequencies dormant within us since before this lifetime. At Wellness Weekend 2026 he leads Sacred Voice Activation — a dimensional activation of the cosmic voice — and co-facilitates the Past Life Guided Meditation with Avalon Starling.",
    website: "https://www.goldendraggon.com/",
    isMusician: true,
  },
];
