const puzzles = [
  {
    number: "1.618",
    formatted: "1.618",
    answer: "Golden ratio",
    acceptableGuesses: ["golden ratio", "divine proportion", "golden mean", "phi"],
    date: "2025-04-14",
    category: "maths",
    clues: [
      "You might say it's irrationally attractive.",
      "Between Fibonacci steps, it quietly hides.",
      "Beauty in ratio, found in art and spirals."
    ],
    keywords: ["fibonacci", "ratio", "geometry", "phi"],
    funFact: "The golden ratio, often denoted by the Greek letter φ (phi), is called “golden” because it shows up in art, architecture, and nature — from the Parthenon to sunflower seeds, seashell spirals, and even the layout of galaxies."
  },
  {
    number: 6.022,
    formatted: "6.022",
    answer: "Avogadro’s number (short form)",
    acceptableGuesses: ["avogadro's number", "avogadro constant", "6.022e23", "mole constant"],
    date: "2025-04-15",
    category: "science",
    clues: [
      "It’s the bridge between the microscopic and the measurable.",
      "Used to count atoms the way you count eggs — by the dozen.",
      "This number defines how many particles are in one mole."
    ],
    keywords: ["avogadro", "mole", "atoms", "particles", "constant"],
    funFact: "One mole of a substance contains 6.022×10²³ entities — more than stars in the observable universe!"
  },
  {
    number: "7",
    formatted: "7",
    answer: "Number of continents",
    acceptableGuesses: ["Continents", "seven continents", "7 continents", "number of continents"],
    date: "2025-04-16",
    category: "geography",
    clues: [
      "They're all major, but not equal.",
      "They split the world’s landmasses.",
      "Asia. Africa. Europe."
    ],
    keywords: ["landmasses", "earth"],
    funFact: "Zealandia is a mostly submerged landmass beneath New Zealand — and some scientists argue it qualifies as an eighth continent. It’s 93% underwater, making it easy to miss!"
  },
  {
    number: 9.58,
    formatted: "9.58s",
    answer: "100m sprint world record",
    acceptableGuesses: ["usain bolt", "100m world record", "fastest 100m", "bolt 9.58"],
    date: "2025-04-17",
    category: "sport",
    clues: [
      "This number left the competition in its dust — and the clock in disbelief.",
      "Look again at the number - caught up to speed?",
      "This world record was set in Berlin in 2009."
    ],
    "revealFormattedAt": 2,
    keywords: ["sprint", "bolt", "track", "100m", "berlin"],
    funFact: "Usain Bolt hit a top speed of 27.8 mph (44.7 km/h) during his 9.58-second 100m dash — faster than most electric scooters!"
  },
  {
    number: "9.81",
    formatted: "9.81 m/s²",
    answer: "Gravitational acceleration on Earth",
    acceptableGuesses: ["gravity on earth", "gravity earth", "earth gravity", "gravity acceleration", "gravitational acceleration"],
    date: "2025-04-18",
    category: "science",
    clues: [
      "A pull you can’t escape (unless you're in orbit).",
      "Physics students know it as 'g' — but it's not a letter here.",
      "Take another look at the number - finally up to speed?"
    ],
    "revealFormattedAt": 3,
    keywords: ["gravity", "acceleration", "physics", "earth"],
    funFact: "Gravity isn't perfectly uniform — it’s slightly weaker at the equator than at the poles due to Earth’s rotation and bulging shape. You literally weigh a tiny bit less in Ecuador than in Greenland!"
  },
  {
    number: 19,
    formatted: "19",
    answer: "Number of weeks 'Old Town Road' topped the Billboard Hot 100",
    acceptableGuesses: ["old town road record", "old town road", "ol town road", "19 weeks billboard", "longest #1 single"],
    date: "2025-04-19",
    category: "culture",
    clues: [
      "A remix-powered reign that refused to end.",
      "Country, trap, and meme culture fused into one unstoppable ride.",
      "It became the longest-running #1 single in U.S. chart history."
    ],
    keywords: ["lil nas x", "billboard", "record", "music"],
    funFact: "'Old Town Road' topped the Billboard Hot 100 for 19 weeks — the longest run at #1 in U.S. history — helped by viral memes, TikTok, and multiple remixes."
  },
  {
    number: "23",
    formatted: "23",
    answer: "Michael Jordan's jersey number",
    acceptableGuesses: ["michael jordan", "jordan jersey", "jordan number 23"],
    date: "2025-04-20",
    category: "sport",
    clues: [
      "This number flew high in the 1990s.",
      "Iconic in basketball and worn by greatness.",
      "Abducted by Bugs Bunny in Space Jam (1996)."
    ],
    keywords: ["nba", "basketball", "jordan", "MJ"],
    funFact: "After retiring from the NBA, Jordan played baseball with the Birmingham Barons, impressing with a 13-game hitting streak and 30 stolen bases — then returned to the Bulls and led them to another championship."
  },
  {
    number: "26.2",
    formatted: "26.2 miles",
    answer: "Marathon distance",
    acceptableGuesses: ["marathon distance", "marathon race", "marathon run", "run 26.2 miles"],
    date: "2025-04-21",
    category: "sport",
    clues: [
      "Born in battle, glorified in sport.",
      "A long run with an ancient origin.",
      "London. New York. Boston."
    ],
    "revealFormattedAt": 3,
    keywords: ["marathon", "run", "distance", "race"],
    funFact: "The event was born out of the legend of the Athenian courier Pheidippides, who in 490BC ran from the site of the battle of marathon to Athens with the message of Nike ('Victory') before promptly collapsing and dying."
  },
  {
    number: 33,
    formatted: "33",
    answer: "Vertebrae in the Human Spine",
    acceptableGuesses: ["33 vertebrae", "spine bones", "human vertebrae"],
    date: "2025-04-22",
    category: "science",
    clues: [
      "This number is tied to balance, motion, and structural support.",
      "It’s a count of segmented bones crucial for standing upright.",
      "Grouped into five regions: cervical, thoracic, lumbar, sacral, coccygeal."
    ],
    keywords: ["spine", "vertebrae", "skeleton"],
    funFact: "While the human spine has 33 vertebrae, only 24 are truly movable — the rest are fused into the sacrum and coccyx. Fun twist: giraffes also have just 7 neck vertebrae, just like humans!"
  },
  {
    number: 39,
    formatted: "39",
    answer: "Shakespeare's Plays",
    acceptableGuesses: ["shakespeare's plays", "39 plays", "bard plays"],
    date: "2025-04-23",
    category: "culture",
    clues: [
      "This number reflects a legacy of kings, daggers, and mistaken identities.",
      "It spans comedies, tragedies, and histories — and a few debates among scholars.",
      "From Hamlet to The Tempest, this is the total count of works attributed to one playwright."
    ],
    keywords: ["shakespeare", "bard", "plays", "theatre"],
    funFact: "In A Midsummer Night’s Dream, a hilariously bad play-within-a-play features a character named “Wall” — one of the earliest examples of meta-theater."
  },
  {
    number: 42,
    formatted: "42",
    answer: "The Answer to Life, the Universe, and Everything",
    acceptableGuesses: ["42", "life the universe everything", "hitchhiker's guide answer"],
    date: "2025-04-24",
    category: "culture",
    clues: [
      "This number is the most famous punchline in British sci-fi.",
      "You’ll find it in a book, a towel, and deep thought.",
      "Douglas Adams made it hilariously meaningless."
    ],
    keywords: ["42", "hitchhiker", "deep thought", "douglas adams"],
    funFact: "Douglas Adams picked 42 arbitrarily. He later said, 'I sat down at my desk, stared out the window, and thought: 42 will do.'"
  },
  {
    number: 46,
    formatted: "46",
    answer: "Human chromosomes",
    acceptableGuesses: ["human chromosomes", "46 chromosomes", "dna pairs"],
    date: "2025-04-25",
    category: "science",
    clues: [
      "This number is found in nearly every cell in your body.",
      "First confirmed by microscope-based studies in the 1950s.",
      "They come in pairs, one from each parent."
    ],
    keywords: ["genetics", "chromosomes", "dna", "biology"],
    funFact: "Humans have 46 chromosomes — 44 autosomes and 2 sex chromosomes — in nearly every cell. This number was correctly established in the 1950s after decades of miscounting!"
  },
  {
    number: 54,
    formatted: "54",
    answer: "Rubik's Cube Squares",
    acceptableGuesses: ["rubik's cube", "cube squares", "54 squares"],
    date: "2025-04-26",
    category: "maths",
    clues: [
      "This number is a patchwork of color, symmetry, and frustration.",
      "It’s made up of 6 sides, each a perfect 3 by 3.",
      "You’ll find it on a cube known for twisting minds and fingers alike."
    ],
    keywords: ["rubik's cube", "puzzle", "3x3", "colors"],
    funFact: "A standard Rubik’s Cube has 54 colored squares — 9 on each of its 6 faces. There are over 43 quintillion possible combinations, but any cube can be solved in 20 moves or fewer!"
  },
  {
    number: 64,
    formatted: "64",
    answer: "Tiles on a Chessboard",
    acceptableGuesses: ["64 tiles", "chess board squares", "chessboard"],
    date: "2025-04-27",
    category: "maths",
    clues: [
      "It’s a perfect square, often seen but rarely counted.",
      "This number sits at the heart of a battlefield — equal parts black and white.",
      "It’s part of a grid that has seen kings fall and pawns rise."
    ],
    keywords: ["chess", "board", "strategy", "checkmate"],
    funFact: "“Checkmate” comes from the Persian phrase *shāh māt*, meaning “the king is helpless” — not dead, as often assumed."
  },
  {
    number: 73,
    formatted: "73",
    answer: "The Best Number (Sheldon Cooper)",
    acceptableGuesses: ["73", "sheldon's number", "best number", "binary prime"],
    date: "2025-04-28",
    category: "culture",
    clues: [
      "It’s a prime number, but with prime quirks.",
      "Its mirror (37) and binary (1001001) are also primes.",
      "A fictional physicist claimed it as the 'best number'."
    ],
    keywords: ["sheldon cooper", "big bang theory", "prime"],
    funFact: "In *The Big Bang Theory*, Sheldon declares 73 the best number: it's the 21st prime, its reverse (37) is the 12th, and 21 = 7×3."
  },
  {
    number: "90",
    formatted: "90° N",
    answer: "Latitude of the North Pole",
    acceptableGuesses: ["north pole", "90 degrees north", "latitude north pole"],
    date: "2025-04-29",
    category: "geography",
    clues: [
      "It’s at the very top of the world.",
      "There are penguins in the opposite direction.",
      "Saint Nick's said to live there."
    ],
    keywords: ["north pole", "latitude", "90°"],
    funFact: "At the North Pole, every direction is south. And all time zones meet there — meaning it’s every time and no time at once."
  },
  {
    number: 118,
    formatted: "118",
    answer: "Total number of elements in the periodic table",
    acceptableGuesses: ["118 elements", "periodic table count", "total elements"],
    date: "2025-04-30",
    category: "science",
    clues: [
      "The known building blocks of matter end here — for now.",
      "This number includes the noble, the reactive, and the radioactive.",
      "Oganesson is the last one, discovered in 2002."
    ],
    keywords: ["periodic table", "elements", "chemistry"],
    funFact: "Element 118, Oganesson, is named after physicist Yuri Oganessian. It's incredibly unstable and was only confirmed in 2006."
  },
  {
    number: 206,
    formatted: "206",
    answer: "Bones in the human body",
    acceptableGuesses: ["206 bones", "human bones", "skeleton count"],
    date: "2025-05-01",
    category: "science",
    clues: [
      "The framework is all there — 206 strong.",
      "This number supports posture, protection, and movement.",
      "You might be familiar with it from an X-ray count."
    ],
    keywords: ["bones", "skeleton", "osteology"],
    funFact: "More than half of your 206 bones are in your hands and feet — 106 of them!"
  },
  {
    number: "212",
    formatted: "212°F",
    answer: "Boiling point of water in Fahrenheit",
    acceptableGuesses: ["boiling point fahrenheit", "212 f", "boiling water"],
    date: "2025-05-02",
    category: "science",
    clues: [
      "A fundamental number in physics.",
      "Things start bubbling at this temperature.",
      "Now look at the number. Psst! It's metric counterpart is 100."
    ],
    "revealFormattedAt": 3,
    keywords: ["boiling", "water", "fahrenheit"],
    funFact: "At sea level, water boils at 212°F (100°C). On Everest? Closer to 160°F (71°C) — not even hot enough for tea."
  },
  {
    number: "221",
    formatted: "221B",
    answer: "Sherlock Holmes’ address",
    acceptableGuesses: ["221b", "sherlock holmes address", "baker street"],
    date: "2025-05-03",
    category: "culture",
    clues: [
      "A very specific London address.",
      "You might find a violin-playing genius here.",
      "'You know my methods, Watson.'"
    ],
    keywords: ["sherlock holmes", "baker street", "detective"],
    funFact: "*Elementary, my dear Watson* — never actually written by Doyle. A pop culture myth!"
  },
  {
    number: 273,
    formatted: "-273°C",
    answer: "Absolute zero in Celsius",
    acceptableGuesses: ["absolute zero", "0 kelvin", "-273", "lowest possible temperature"],
    date: "2025-05-04",
    category: "science",
    clues: [
      "This number marks a total molecular shutdown.",
      "You’ll never go colder in a lab.",
      "It’s zero Kelvin on the absolute scale."
    ],
    "revealFormattedAt": 2,
    keywords: ["absolute zero", "kelvin", "temperature"],
    funFact: "At −273.15°C, atoms stop vibrating — it's the coldest theoretical temperature possible, known as absolute zero."
  },
  {
    number: "451",
    formatted: "451°F",
    answer: "The temperature at which paper burns (Fahrenheit 451)",
    acceptableGuesses: ["fahrenheit 451", "paper burns at 451", "temperature paper burns"],
    date: "2025-05-05",
    category: "culture",
    clues: [
      "Look again at the number — what do you see?",
      "A dystopian temperature where books meet their fate.",
      "Ray Bradbury warned us about a future where knowledge is set on fire."
    ],
    "revealFormattedAt": 1,
    keywords: ["ray bradbury", "451", "book", "temperature"],
    funFact: "The U.S. military once tested fire-resistant documents that wouldn't ignite until over 600°F!"
  },
  {
    number: 687,
    formatted: "687",
    answer: "Martian Year",
    acceptableGuesses: ["martian year", "mars orbit", "days on mars"],
    date: "2025-05-06",
    category: "science",
    clues: [
      "This number is closely tied to dusty red landscapes and cosmic orbits.",
      "It marks how long something would take to go full circle — far from home.",
      "If you moved here, you'd only have a birthday every 687 Earth days."
    ],
    keywords: ["mars", "orbit", "martian year", "space"],
    funFact: "Sunsets on Mars are blue! The atmosphere scatters red light, allowing blue to shine through."
  },
  {
    number: 1215,
    formatted: "1215",
    answer: "Signing of the Magna Carta",
    acceptableGuesses: ["magna carta", "1215", "king john charter"],
    date: "2025-05-07",
    category: "history",
    clues: [
      "This number marks a moment when royal power met resistance.",
      "It’s tied to a king, a group of barons, and a meadow called Runnymede.",
      "Often seen as the birth year of constitutional law and civil liberties."
    ],
    keywords: ["magna carta", "king john", "liberty", "rights"],
    funFact: "In 2007, a forgotten copy of the Magna Carta was found in a town archive — worth over £20 million!"
  },
  {
    number: 1600,
    formatted: "1,600",
    answer: "Grand Canyon Depth",
    acceptableGuesses: ["grand canyon depth", "1600 meters deep", "deepest canyon usa"],
    date: "2025-05-08",
    category: "geography",
    clues: [
      "This chasm is over a mile deep at its deepest point.",
      "Formed over millions of years by a stubborn river.",
      "Arizona’s most photographed attraction."
    ],
    keywords: ["grand canyon", "depth", "arizona"],
    funFact: "The Grand Canyon creates its own weather! You can see rain, sun, and snow all at once from different spots."
  },
  {
    number: "1776",
    formatted: "1776",
    answer: "The year the American Declaration of Independence was signed",
    acceptableGuesses: ["1776", "declaration of independence", "independence usa"],
    date: "2025-05-09",
    category: "history",
    clues: [
      "Ink and ideals flowed freely.",
      "Fireworks and freedom began here.",
      "A revolutionary year — quite literally."
    ],
    keywords: ["independence", "usa", "founding", "july 4th"],
    funFact: "The original Declaration of Independence has a giant smudged handprint on it — possibly from an inky founding father."
  },
  {
    number: "1865",
    formatted: "1865",
    answer: "The year Abraham Lincoln was assassinated",
    acceptableGuesses: ["1865", "lincoln assassinated", "ford's theatre"],
    date: "2025-05-10",
    category: "history",
    clues: [
      "A tragic event in American history.",
      "A theater visit that changed the course of a nation.",
      "The first POTUS to sport a beard."
    ],
    keywords: ["lincoln", "assassinated", "1865"],
    funFact: "Lincoln's death was part of a broader plot: assassins also targeted the VP and Secretary of State."
  },
  {
    number: 1969,
    formatted: "1969",
    answer: "Moon Landing",
    acceptableGuesses: ["moon landing", "apollo 11", "1969 nasa"],
    date: "2025-05-11",
    category: "history",
    clues: [
      "This year changed how we look at the sky.",
      "A TV broadcast seen by over 600 million people.",
      "One small step made here."
    ],
    keywords: ["moon landing", "apollo", "nasa", "armstrong"],
    funFact: "Buzz Aldrin took communion on the Moon — but NASA kept it under wraps due to legal concerns about religion in space."
  },
  {
    number: 6174,
    formatted: "6,174",
    answer: "Kaprekar's Constant",
    acceptableGuesses: ["kaprekar's constant", "6174", "math number trick"],
    date: "2025-05-12",
    category: "maths",
    clues: [
      "Pick any 4-digit number. Rearrange, subtract, repeat...",
      "It pulls almost any number into a numerical vortex.",
      "This constant was discovered by an Indian mathematician with a flair for magic."
    ],
    keywords: ["kaprekar", "constant", "number trick", "6174"],
    funFact: "Most 4-digit numbers (with at least two different digits) reach 6174 in seven steps or fewer."
  },
  {
    number: "6371",
    formatted: "6,371km",
    answer: "Earth's radius",
    acceptableGuesses: ["earth radius", "6371", "mean earth radius"],
    date: "2025-05-13",
    category: "geography",
    clues: [
      "This number is used in calculations for GPS and satellite positioning.",
      "Look again at the number — measured in km it's a cut above, (or more accurately 'below').",
      "It's the average distance from the surface to the core — not the circumference!"
    ],
    "revealFormattedAt": 2,
    keywords: ["earth", "radius", "measurement"],
    funFact: "Earth isn’t a perfect sphere — it’s about 21 km wider at the equator than pole-to-pole!"
  },
  {
    number: 6650,
    formatted: "6,650km",
    answer: "Length of the Nile River (in kilometers)",
    acceptableGuesses: ["nile river length", "length of the nile", "6650"],
    date: "2025-05-14",
    category: "geography",
    clues: [
      "This river flows through ancient history and modern nations.",
      "Some say it’s the longest; others argue for the Amazon.",
      "It winds through Egypt, Sudan, and Uganda."
    ],
    keywords: ["nile", "river", "egypt", "africa", "length"],
    funFact: "The Nile flows **northward**, one of the few major rivers to do so — a fact that puzzled early explorers."
  },
  {
    number: "8848",
    formatted: "8,848 m",
    answer: "Height of Mount Everest",
    acceptableGuesses: ["mount everest height", "everest", "8848", "mt everest"],
    date: "2025-05-15",
    category: "geography",
    clues: [
      "It’s all downhill from here.",
      "Chomolungma by another name.",
      "The highest point above sea level on Earth."
    ],
    "revealFormattedAt": 3,
    keywords: ["everest", "mount everest", "height"],
    funFact: "Everest grows about 4mm per year due to tectonic activity. It’s still getting taller!"
  },
  {
    number: 11034,
    formatted: "11,034",
    answer: "Mariana Trench",
    acceptableGuesses: ["mariana trench", "deepest ocean", "challenger deep"],
    date: "2025-05-16",
    category: "geography",
    clues: [
      "This number is measured in meters… straight down.",
      "It’s deeper than Everest is tall.",
      "The Challenger Deep lives here."
    ],
    keywords: ["mariana trench", "deepest", "ocean", "pacific"],
    funFact: "If you dropped Mount Everest into the Mariana Trench, it would still be over a mile underwater!"
  },
  {
    number: "24601",
    formatted: "24601",
    answer: "Jean Valjean's prisoner number",
    acceptableGuesses: ["jean valjean", "24601", "les mis prisoner"],
    date: "2025-05-17",
    category: "culture",
    clues: [
      "To some, just five digits. To one man, a lifelong curse.",
      "An ex-convict seeking redemption in 19th-century France.",
      "Hunted by Javert, this number belonged to Victor Hugo's famous fugitive."
    ],
    keywords: ["jean valjean", "les mis", "prisoner"],
    funFact: "Victor Hugo started writing *Les Misérables* in 1845 — and finished it nearly 17 years later while exiled from France."
  },
  {
    number: 31500,
    formatted: "31,500sq mi",
    answer: "Surface area of the Caspian Sea (in square miles)",
    acceptableGuesses: ["caspian sea", "largest inland sea", "31500 sq mi"],
    date: "2025-05-18",
    category: "geography",
    clues: [
      "It’s a sea by name, but not by saltwater standards.",
      "Five countries touch this massive inland body of water.",
      "It’s larger than all the Great Lakes combined."
    ],
    "revealFormattedAt": 3,
    keywords: ["caspian sea", "lake", "surface area", "largest lake"],
    funFact: "Despite its name, the Caspian Sea is technically a lake — the largest enclosed inland body of water on Earth."
  },
  {
    number: "299792458",
    formatted: "299,792,458",
    answer: "The speed of light",
    acceptableGuesses: ["speed of light", "light speed", "299792458 m/s"],
    date: "2025-05-19",
    category: "science",
    clues: [
      "Einstein's faithful courier, never late.",
      "The ultimate universal speed limit. No ticket required.",
      "Take another look at the number — measured in metres per second, nothing outruns it."
    ],
    "revealFormattedAt": 3,
    keywords: ["light speed", "physics", "universal constant"],
    funFact: "It takes sunlight about 8 minutes and 20 seconds to reach Earth. You’re always seeing the Sun as it *was*."
  }
];

export default puzzles;
