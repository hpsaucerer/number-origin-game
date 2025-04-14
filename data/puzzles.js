const puzzles = [
  {
    "number": "1.618",
    "formatted": "1.618",
    "clues": [
      "You might say it's irrationally attractive.",
      "Between Fibonacci steps, it quietly hides.",
      "Beauty in ratio, found in art and spirals."
    ],
    "answer": "Golden ratio",
    "keywords": [
      "phi",
      "fibonacci",
      "divine proportion",
      "golden mean"
    ],
    "funFact": "The golden ratio, often denoted by the Greek letter φ (phi), is called “golden” because it shows up in art, architecture, and nature — from the Parthenon to sunflower seeds, seashell spirals, and even the layout of galaxies."
  },
  {
    "number": 6.022,
    "formatted": "6.022",
    "answer": "Avogadro’s number (short form)",
    "clues": [
      "It’s the bridge between the microscopic and the measurable.",
      "Used to count atoms the way you count eggs — by the dozen.",
      "This number defines how many particles are in one mole."
    ],
    "keywords": [
      "Avogadro",
      "mole",
      "chemistry",
      "constant",
      "atoms",
      "particles"
    ],
    "funFact": "One mole of a substance contains 6.022×10²³ entities — more than stars in the observable universe!"
  },
  {
    "number": "7",
    "formatted": "7",
    "clues": [
      "They're all major, but not equal.",
      "They split the world’s landmasses.",
      "Asia. Africa. Europe."
    ],
    "answer": "Number of continents",
    "keywords": [
      "7",
      "continents",
      "world",
      "landmasses"
    ],
    "funFact": "Zealandia is a mostly submerged landmass beneath New Zealand — and some scientists argue it qualifies as an eighth continent. It’s 93% underwater, making it easy to miss!"
  },
  {
    "number": 9.58,
    "formatted": "9.58s",
    "answer": "100m sprint world record",
    "clues": [
      "This number left the competition in its dust — and the clock in disbelief.",
      "Look again at the number - caught up to speed?",
      "This world record was set in Berlin in 2009."
    ],
    "revealFormattedAt": 2,
    "keywords": [
      "sprint",
      "100m",
      "track",
      "world record",
      "speed",
      "Usain Bolt",
      "athletics",
      "running"
    ],
    "funFact": "Usain Bolt hit a top speed of 27.8 mph (44.7 km/h) during his 9.58-second 100m dash — faster than most electric scooters!"
  },
  {
    "number": "9.81",
    "formatted": "9.81 m/s²",
    "clues": [
      "A pull you can’t escape (unless you're in orbit).",
      "Physics students know it as 'g' — but it's not a letter here.",
      "Take another look at the number - finally up to speed?"
    ],
    "revealFormattedAt": 3,
    "answer": "Gravitational acceleration on Earth",
    "keywords": [
      "gravity",
      "9.81",
      "earth gravity",
      "acceleration",
      "m/s²"
    ],
    "funFact": "Gravity isn't perfectly uniform — it’s slightly weaker at the equator than at the poles due to Earth’s rotation and bulging shape. You literally weigh a tiny bit less in Ecuador than in Greenland!"
  },
  {
    "number": 19,
    "formatted": "19",
    "answer": "Number of weeks 'Old Town Road' topped the Billboard Hot 100",
    "clues": [
      "A remix-powered reign that refused to end.",
      "Country, trap, and meme culture fused into one unstoppable ride.",
      "It became the longest-running #1 single in U.S. chart history."
    ],
    "keywords": [
      "Old Town Road",
      "Lil Nas X",
      "Billboard",
      "music",
      "charts",
      "record",
      "pop"
    ],
    "funFact": "'Old Town Road' topped the Billboard Hot 100 for 19 weeks — the longest run at #1 in U.S. history — helped by viral memes, TikTok, and multiple remixes."
  },
  {
    "number": "23",
    "formatted": "23",
    "clues": [
      "This number flew high in the 1990s.",
      "Iconic in basketball and worn by greatness.",
      "Abducted by Bugs Bunny in Space Jam (1996)."
    ],
    "answer": "Michael Jordan's jersey number",
    "keywords": [
      "23",
      "michael jordan",
      "basketball",
      "jersey",
      "nba"
    ],
    "funFact": "After retiring from the NBA, Jordan played baseball with the Birmingham Barons, impressing with a 13-game hitting streak and 30 stolen bases — then returned to the Bulls and led them to another championship."
  },
  {
    "number": "26.2",
    "formatted": "26.2 miles",
    "clues": [
      "Born in battle, glorified in sport.",
      "A long run with an ancient origin.",
      "London. New York. Boston."
    ],
    "revealFormattedAt": 3,
    "answer": "Marathon distance",
    "keywords": [
      "marathon",
      "26.2",
      "miles",
      "race",
      "distance"
    ],
    "funFact": "The event was born out of the legend of the Athenian courier Pheidippides, who in 490BC ran from the site of the battle of marathon to Athens with the message of Nike ('Victory') before promptly collapsing and dying."
  },
  {
    "number": 33,
    "formatted": "33",
    "answer": "Vertebrae in the Human Spine",
    "clues": [
      "This number is tied to balance, motion, and structural support.",
      "It’s a count of segmented bones crucial for standing upright.",
      "Grouped into five regions: cervical, thoracic, lumbar, sacral, coccygeal."
    ],
    "keywords": [
      "vertebrae",
      "spine",
      "back",
      "backbone",
      "skeletal",
      "anatomy",
      "bones",
      "human skeleton"
    ],
    "funFact": "While the human spine has 33 vertebrae, only 24 are truly movable — the rest are fused into the sacrum and coccyx. Fun twist: giraffes also have just 7 neck vertebrae, just like humans!"
  },
  {
    "number": 39,
    "formatted": "39",
    "answer": "Shakespeare's Plays",
    "clues": [
      "This number reflects a legacy of kings, daggers, and mistaken identities.",
      "It spans comedies, tragedies, and histories — and a few debates among scholars.",
      "From Hamlet to The Tempest, this is the total count of works attributed to one playwright."
    ],
    "keywords": [
      "shakespeare",
      "plays",
      "bard",
      "hamlet",
      "macbeth",
      "comedies",
      "tragedies",
      "histories"
    ],
    "funFact": "In A Midsummer Night’s Dream, a hilariously bad play-within-a-play features a character named “Wall” — one of the earliest examples of meta-theater."
  },
  {
    "number": 42,
    "formatted": "42",
    "answer": "The Answer to Life, the Universe, and Everything",
    "clues": [
      "This number is the most famous punchline in British sci-fi.",
      "You’ll find it in a book, a towel, and deep thought.",
      "Douglas Adams made it hilariously meaningless."
    ],
    "keywords": [
      "42",
      "hitchhiker",
      "douglas adams",
      "life universe everything",
      "deep thought"
    ],
    "funFact": "Douglas Adams picked 42 arbitrarily. He later said, 'I sat down at my desk, stared out the window, and thought: 42 will do.'"
  },
  {
    "number": 46,
    "formatted": "46",
    "answer": "Human chromosomes",
    "clues": [
      "This number is found in nearly every cell in your body.",
      "First confirmed by microscope-based studies in the 1950s.",
      "They come in pairs, one from each parent."
    ],
    "keywords": [
      "genetics",
      "chromosomes",
      "human",
      "DNA",
      "biology",
      "diploid"
    ],
    "funFact": "Humans have 46 chromosomes — 44 autosomes and 2 sex chromosomes — in nearly every cell. This number was correctly established in the 1950s after decades of miscounting!"
  },
  {
    "number": 54,
    "formatted": "54",
    "answer": "Rubik's Cube Squares",
    "clues": [
      "This number is a patchwork of color, symmetry, and frustration.",
      "It’s made up of 6 sides, each a perfect 3 by 3.",
      "You’ll find it on a cube known for twisting minds and fingers alike."
    ],
    "keywords": [
      "rubik's cube",
      "cube",
      "colors",
      "puzzle",
      "faces",
      "3x3",
      "squares",
      "twist"
    ],
    "funFact": "A standard Rubik’s Cube has 54 colored squares — 9 on each of its 6 faces. There are over **43 quintillion** possible combinations, but any cube can be solved in **20 moves or fewer**!"
  },
  {
    "number": 64,
    "formatted": "64",
    "answer": "Tiles on a Chessboard",
    "clues": [
      "It’s a perfect square, often seen but rarely counted.",
      "This number sits at the heart of a battlefield — equal parts black and white.",
      "It’s part of a grid that has seen kings fall and pawns rise."
    ],
    "keywords": [
      "chess",
      "board",
      "squares",
      "tiles",
      "black and white",
      "strategy",
      "checkmate"
    ],
    "funFact": "“Checkmate” comes from the Persian phrase shāh māt, meaning “the king is helpless” — not dead, as often assumed. The game’s deep roots stretch back over 1,500 years."
  },
  {
    "number": 73,
    "formatted": "73",
    "answer": "The Best Number (Sheldon Cooper)",
    "clues": [
      "It’s a prime number, but with prime quirks.",
      "Its mirror (37) and binary (1001001) are also primes.",
      "A fictional physicist claimed it as the 'best number'."
    ],
    "keywords": [
      "sheldon cooper",
      "prime",
      "binary",
      "73",
      "big bang theory"
    ],
    "funFact": "In 'The Big Bang Theory', Sheldon declares 73 the best number: it's the 21st prime, its reverse (37) is the 12th prime, and 21 = 7×3. Geek heaven."
  },
  {
    "number": "90",
    "formatted": "90° N",
    "clues": [
      "It’s at the very top of the world.",
      "There are penguins in the opposite direction.",
      "Saint Nick's said to live there."
    ],
    "answer": "Latitude of the North Pole",
    "keywords": [
      "north pole",
      "90",
      "90°",
      "latitude"
    ],
    "funFact": "At the North Pole, every direction is south — there’s no east or west. And because all the time zones converge there, it’s technically every time and no time at once."
  },
  {
    "number": 118,
    "formatted": "118",
    "answer": "Total number of elements in the periodic table",
    "clues": [
      "The known building blocks of matter end here — for now.",
      "This number includes the noble, the reactive, and the radioactive.",
      "Oganesson is the last one, discovered in 2002."
    ],
    "keywords": [
      "periodic table",
      "elements",
      "chemistry",
      "oganesson",
      "atomic number"
    ],
    "funFact": "Element 118, Oganesson, is named after physicist Yuri Oganessian. It's incredibly unstable and was only confirmed in 2006."
  },
  {
    "number": 206,
    "formatted": "206",
    "answer": "Bones in the human body",
    "clues": [
      "The framework is all there — 206 strong.",
      "This number supports posture, protection, and movement.",
      "You might be familiar with it from an X-ray count."
    ],
    "keywords": [
      "bones",
      "skeleton",
      "human",
      "anatomy",
      "x-ray",
      "osteology"
    ],
    "funFact": "More than half of your 206 bones are in your hands and feet — 106 of them, to be exact. Your limbs are biomechanical masterpieces of structure and movement."
  },
  {
    "number": "212",
    "formatted": "212°F",
    "clues": [
      "A fundamental number in physics.",
      "Things start bubbling at this temperature.",
      "Now look at the number. Psst! It's metric counterpart is 100."
    ],
    "revealFormattedAt": 3,
    "answer": "Boiling point of water in Fahrenheit",
    "keywords": [
      "boiling",
      "water",
      "fahrenheit",
      "212"
    ],
    "funFact": "At sea level, water boils at 212°F (100°C). But at the top of Mount Everest, the air pressure is so low that water boils at just 160°F (71°C) — not even hot enough to make decent tea."
  },
  {
    "number": "221",
    "formatted": "221B",
    "clues": [
      "A very specific London address.",
      "You might find a violin-playing genius here.",
      "'You know my methods, Watson.'"
    ],
    "answer": "Sherlock Holmes’ address",
    "keywords": [
      "221b",
      "sherlock holmes",
      "baker street",
      "detective"
    ],
    "funFact": "'Elementary, my dear Watson', the phrase most associated with Holmes never actually appears in the original books. It’s a line popularized by films and adaptations — a bit of pop culture Mandela Effect."
  },
  {
    "number": 273,
    "formatted": "-273°C",
    "answer": "Absolute zero in Celsius",
    "clues": [
      "This number marks a total molecular shutdown.",
      "You’ll never go colder in a lab.",
      "It’s zero Kelvin on the absolute scale."
    ],
    "revealFormattedAt": 2,
    "keywords": [
      "absolute zero",
      "temperature",
      "Kelvin",
      "Celsius",
      "physics",
      "molecules"
    ],
    "funFact": "At −273.15°C, atoms stop vibrating — it's the coldest theoretical temperature possible, known as absolute zero."
  },
  {
    "number": "451",
    "formatted": "451°F",
    "clues": [
      "Look again at the number — what do you see?",
      "A dystopian temperature where books meet their fate.",
      "Ray Bradbury warned us about a future where knowledge is set on fire."
    ],
    "revealFormattedAt": 1,
    "answer": "The temperature at which paper burns (Fahrenheit 451)",
    "keywords": [
      "paper burns",
      "Ray",
      "Bradbury",
      "book",
      "Fahrenheit",
      "451"
    ],
    "funFact": "During WWII, the U.S. military tested flame-resistant secret documents that wouldn’t ignite below 600°F, just in case they were intercepted."
  },
  {
    "number": 687,
    "formatted": "687",
    "answer": "Martian Year",
    "clues": [
      "This number is closely tied to dusty red landscapes and cosmic orbits.",
      "It marks how long something would take to go full circle — far from home.",
      "If you moved here, you'd only have a birthday every 687 Earth days."
    ],
    "keywords": [
      "mars",
      "martian",
      "orbit",
      "sun",
      "planet",
      "solar system",
      "earth days",
      "space"
    ],
    "funFact": "Sunsets on Mars are blue. Fine dust in its atmosphere scatters red light away, letting blue light pass through — the opposite of Earth."
  },
  {
    "number": 1215,
    "formatted": "1215",
    "answer": "Signing of the Magna Carta",
    "clues": [
      "This number marks a moment when royal power met resistance.",
      "It’s tied to a king, a group of barons, and a meadow called Runnymede.",
      "Often seen as the birth year of constitutional law and civil liberties."
    ],
    "keywords": [
      "magna carta",
      "king john",
      "runnymede",
      "british history",
      "liberty",
      "rights",
      "1215"
    ],
    "funFact": "In 2007, a 700-year-old copy of the Magna Carta was discovered in a British town council’s archive — folded up in a desk, unnoticed for decades. It was later valued at over £20 million."
  },
  {
    "number": 1600,
    "formatted": "1,600",
    "answer": "Grand Canyon Depth",
    "clues": [
      "This chasm is over a mile deep at its deepest point.",
      "Formed over millions of years by a stubborn river.",
      "Arizona’s most photographed attraction."
    ],
    "keywords": [
      "grand canyon",
      "colorado river",
      "arizona",
      "canyon",
      "depth"
    ],
    "funFact": "The Grand Canyon is so vast, it creates its own weather patterns — you can see sun, snow, and storms in different parts at the same time."
  },
  {
    "number": "1776",
    "formatted": "1776",
    "clues": [
      "Ink and ideals flowed freely.",
      "Fireworks and freedom began here.",
      "A revolutionary year — quite literally."
    ],
    "answer": "The year the American Declaration of Independence was signed",
    "keywords": [
      "independence",
      "usa",
      "founding",
      "july 4th"
    ],
    "funFact": "The original Declaration of Independence has a giant handprint on it — likely from someone handling the parchment with dirty hands!"
  },
  {
    "number": "1865",
    "formatted": "1865",
    "clues": [
      "A tragic event in American history.",
      "A theater visit that changed the course of a nation.",
      "The first POTUS to sport a beard."
    ],
    "answer": "The year Abraham Lincoln was assassinated",
    "keywords": [
      "lincoln",
      "abraham",
      "assassinated",
      "1865"
    ],
    "funFact": "Lincoln’s assassination was part of a coordinated plot to also kill Vice President Andrew Johnson and Secretary of State William Seward. Seward was brutally attacked but survived, while Johnson’s would-be assassin lost his nerve."
  },
  {
    "number": 1969,
    "formatted": "1969",
    "answer": "Moon Landing",
    "clues": [
      "This year changed how we look at the sky.",
      "A TV broadcast seen by over 600 million people.",
      "One small step made here."
    ],
    "keywords": [
      "moon landing",
      "apollo",
      "nasa",
      "buzz aldrin",
      "neil armstrong"
    ],
    "funFact": "Buzz Aldrin took communion on the Moon using a tiny chalice and wine — but NASA kept it secret due to a lawsuit about religion in space."
  },
  {
    "number": 6174,
    "formatted": "6,174",
    "answer": "Kaprekar's Constant",
    "clues": [
      "Pick any 4-digit number. Rearrange, subtract, repeat...",
      "It pulls almost any number into a numerical vortex.",
      "This constant was discovered by an Indian mathematician with a flair for magic."
    ],
    "keywords": [
      "kaprekar",
      "kaprekar's constant",
      "6174",
      "math trick",
      "number magic"
    ],
    "funFact": "Almost any 4-digit number (with at least two different digits) will reach 6174 in 7 steps or less. It’s like math’s version of gravity."
  },
  {
    "number": "6371",
    "formatted": "6,371km",
    "clues": [
      "This number is used in calculations for GPS and satellite positioning.",
      "Look again at the number - measured in km it's a cut above, (or more accurately 'below').",
      "It's the average distance from the surface to the core — not the circumference!"
    ],
    "revealFormattedAt": 2,
    "answer": "Earth's radius",
    "keywords": [
      "earth",
      "radius",
      "planet",
      "core",
      "km",
      "kilometers",
      "mean radius",
      "equatorial",
      "measurement",
      "distance"
    ],
    "funFact": "The Earth's radius isn't the same everywhere! It's about 6,378 km at the equator and 6,357 km at the poles — but 6,371 km is the commonly used average."
  },
  {
    "number": 6650,
    "formatted": "6,650km",
    "answer": "Length of the Nile River (in kilometers)",
    "clues": [
      "This river flows through ancient history and modern nations.",
      "Some say it’s the longest; others argue for the Amazon.",
      "It winds through Egypt, Sudan, and Uganda."
    ],
    "keywords": [
      "Nile",
      "river",
      "Egypt",
      "Africa",
      "geography",
      "waterway",
      "longest river"
    ],
    "funFact": "Unlike most major rivers, the Nile flows northward, from Central Africa toward the Mediterranean Sea — a direction that once confused early European explorers."
  },
  {
    "number": "8848",
    "formatted": "8,848 m",
    "clues": [
      "It’s all downhill from here.",
      "Chomolungma by another name.",
      "The highest point above sea level on Earth."
    ],
    "revealFormattedAt": 3,
    "answer": "Height of Mount Everest",
    "keywords": [
      "8848",
      "everest",
      "mount everest",
      "mt everest",
      "highest mountain",
      "height"
    ],
    "funFact": "Everest isn’t a fixed height — thanks to tectonic activity, it gains about 4mm each year as the Indian Plate pushes under the Eurasian Plate. It's literally still growing!"
  },
  {
    "number": 11034,
    "formatted": "11,034",
    "answer": "Mariana Trench",
    "clues": [
      "This number is measured in meters… straight down.",
      "It’s deeper than Everest is tall.",
      "The Challenger Deep lives here."
    ],
    "keywords": [
      "mariana trench",
      "deepest",
      "ocean",
      "pacific",
      "challenger deep"
    ],
    "funFact": "The Mariana Trench is so deep, if Mount Everest were dropped into it, the peak would still be over a mile underwater."
  },
  {
    "number": "24601",
    "formatted": "24601",
    "clues": [
      "To some, just five digits. To one man, a lifelong curse.",
      "An ex-convict seeking redemption in 19th-century France.",
      "Hunted by Javert, this number belonged to Victor Hugo's famous fugitive."
    ],
    "answer": "Jean Valjean's prisoner number",
    "keywords": [
      "Jean",
      "Valjean",
      "prisoner",
      "convict",
      "number"
    ],
    "funFact": "Victor Hugo began writing Les Misérables in 1845, but much of it was completed while he was exiled from France for opposing Napoleon III. The novel was finally published in 1862, after nearly 17 years of work."
  },
  {
    "number": 31500,
    "formatted": "31,500sq mi",
    "answer": "Surface area of the Caspian Sea (in square miles)",
    "clues": [
      "It’s a sea by name, but not by saltwater standards.",
      "Five countries touch this massive inland body of water.",
      "It’s larger than all the Great Lakes combined."
    ],
    "revealFormattedAt": 3,
    "keywords": [
      "Caspian Sea",
      "lake",
      "largest lake",
      "surface area",
      "geography",
      "inland sea"
    ],
    "funFact": "Though called a sea, the Caspian is the world’s largest inland body of water by area — about the size of Germany — and is technically a lake!"
  },
  {
    "number": "299792458",
    "formatted": "299,792,458",
    "clues": [
      "Einstein's faithful courier, never late.",
      "The ultimate universal speed limit. No ticket required.",
      " Take another look at the number - measured in metres per second, nothing outruns it."
    ],
    "revealFormattedAt": 3,
    "answer": "The speed of light",
    "keywords": [
      "lightspeed",
      "light speed"
    ],
    "funFact": "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth — meaning every sunrise, sunset, and sunbeam is slightly out of date. You’re always seeing the Sun as it was, not as it is."
  }
];

export default puzzles;
