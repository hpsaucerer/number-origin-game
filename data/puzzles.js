// data/puzzles.js

const puzzles = [
  {
    number: "1865",
    formatted: "1865",
    clues: [
      "A tragic event in American history.",
      "A theater visit that changed the course of a nation.",
      "The first POTUS to sport a beard."
    ],
    answer: "The year Abraham Lincoln was assassinated",
    keywords: ["lincoln", "abraham", "assassinated", "1865"],
    funFact: "Lincoln’s assassination was part of a coordinated plot to also kill Vice President Andrew Johnson and Secretary of State William Seward. Seward was brutally attacked but survived, while Johnson’s would-be assassin lost his nerve."
  },
  {
    number: "212",
    formatted: "212°F",
    clues: [
      "A fundamental number in physics.",
      "Things start bubbling at this temperature.",
      "H2O by another name"
    ],
    answer: "Boiling point of water in Fahrenheit",
    keywords: ["boiling", "water", "fahrenheit", "212"],
    funFact: "At sea level, water boils at 212°F (100°C). But at the top of Mount Everest, the air pressure is so low that water boils at just 160°F (71°C) — not even hot enough to make decent tea."
  },
  {
  number: "26.2",
  formatted: "26.2 miles",
  clues: [
    "Born in battle, glorified in sport.",
    "A long run with an ancient origin.",
    "London. New York. Boston."
  ],
  answer: "Marathon distance",
  keywords: ["marathon", "26.2", "miles", "race", "distance"],
funFact: "The event was born out of the legend of the Athenian courier Pheidippides, who in 490BC ran from the site of the battle of marathon to Athens with the message of Nike ('Victory') before promptly collapsing and dying."
},
{
  number: "9.81",
  formatted: "9.81 m/s²",
  clues: [
    "A pull you can’t escape (unless you're in orbit).",
    "Physics students know it as 'g' — but it's not a letter here."
    "Take another look at the number - finally up to speed?"
  ],
  revealFormattedAt: 3,
  answer: "Gravitational acceleration on Earth",
  keywords: ["gravity", "9.81", "earth gravity", "acceleration", "m/s²"],
funFact: "Gravity isn't perfectly uniform — it’s slightly weaker at the equator than at the poles due to Earth’s rotation and bulging shape. You literally weigh a tiny bit less in Ecuador than in Greenland!"
},
{
  number: "23",
  formatted: "23",
  clues: [
    "This number flew high in the 1990s.",
    "Iconic in basketball and worn by greatness.",
    "Abducted by Bugs Bunny in Space Jam (1996)."
  ],
  answer: "Michael Jordan's jersey number",
  keywords: ["23", "michael jordan", "basketball", "jersey", "nba"],
funFact: "After retiring from the NBA, Jordan played baseball with the Birmingham Barons, impressing with a 13-game hitting streak and 30 stolen bases — then returned to the Bulls and led them to another championship."
},
{
  number: "221",
  formatted: "221B",
  clues: [
    "A very specific London address.",
    "You might find a violin-playing genius here.",
    "'You know my methods, Watson.'"
  ],
  answer: "Sherlock Holmes’ address",
  keywords: ["221b", "sherlock holmes", "baker street", "detective"],
funFact: "The iconic phrase most associated with Holmes never appears in the original books. It’s a line popularized by films and adaptations — a bit of pop culture Mandela Effect."
},
{
  number: "8848",
  formatted: "8,848 m",
  clues: [
    "It’s all downhill from here.",
    "Chomolungma by another name.",
    "The highest point above sea level on Earth."
  ],
  answer: "Height of Mount Everest",
  keywords: ["8848", "everest", "mount everest", "mt everest", "highest mountain", "height"],
funFact: "Everest isn’t a fixed height — thanks to tectonic activity, it gains about 4mm each year as the Indian Plate pushes under the Eurasian Plate. It's literally still growing!"
},
{
  number: "7",
  formatted: "7",
  clues: [
    "They're all major, but not equal.",
    "They split the world’s landmasses.",
    "Asia. Africa. Europe."
  ],
  answer: "Number of continents",
  keywords: ["7", "continents", "world", "landmasses"],
  funFact: "Zealandia is a mostly submerged landmass beneath New Zealand — and some scientists argue it qualifies as an eighth continent. It’s 93% underwater, making it easy to miss!"
},
{
  number: "90",
  formatted: "90° N",
  clues: [
    "It’s at the very top of the world.",
    "There are penguins in the opposite direction.",
    "Saint Nick's said to live there."
  ],
  answer: "Latitude of the North Pole",
  keywords: ["north pole", "90", "90°", "latitude"],
  funFact: "At the North Pole, every direction is south — there’s no east or west. And because all the time zones converge there, it’s technically every time and no time at once."
},
{
  number: "299792458",
  formatted: "299,792,458",
  clues: [
    "Einstein's faithful courier, never late.",
    "The ultimate universal speed limit. No ticket required.",
    " Take another look at the number - measured in metres per second, nothing outruns it."
  ],
  revealFormattedAt: 3,
  answer: "The speed of light",
  keywords: ["lightspeed", "light speed"],
  funFact: "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth — meaning every sunrise, sunset, and sunbeam is slightly out of date. You’re always seeing the Sun as it was, not as it is."
},
{
  number: "24601",
  formatted: "24601",
  clues: [
    "To some, just five digits. To one man, a lifelong curse.",
    "An ex-convict seeking redemption in 19th-century France.",
    "Hunted by Javert, this number belonged to Victor Hugo's famous fugitive."
  ],
  answer: "Jean Valjean's prisoner number",
  keywords: ["Jean", "Valjean", "prisoner", "convict", "number"],
  funFact: "Victor Hugo began writing Les Misérables in 1845, but much of it was completed while he was exiled from France for opposing Napoleon III. The novel was finally published in 1862, after nearly 17 years of work."
},
{
  number: "451",
  formatted: "451°F",
  clues: [
    "Look again at the number — what do you see?",
    "A dystopian temperature where books meet their fate.",
    "Ray Bradbury warned us about a future where knowledge is set on fire."
  ],
  revealFormattedAt: 1,
  answer: "The temperature at which paper burns (Fahrenheit 451)",
  keywords: ["paper burns", "Ray", "Bradbury", "book", "Fahrenheit", "451"],
  funFact: "Written in 1953, Fahrenheit 451 featured wall-sized televisions, interactive soap operas, and “seashells” that fed sound directly into the ear — eerily close to flat-screens, binge shows, and AirPods."
},
  {
  number: "1776",
  formatted: "1776",
  clues: [
    "Ink and ideals flowed freely.",
    "Fireworks and freedom began here.",
    "A revolutionary year — quite literally."
  ],
  answer: "The year the American Declaration of Independence was signed",
  keywords: ["independence", "usa", "founding", "july 4th"],
  funFact: "The original Declaration of Independence has a giant handprint on it — likely from someone handling the parchment with dirty hands!"
},
  {
  number: "1.618",
  formatted: "1.618",
  clues: [
    "You might say it's irrationally attractive.",
    "Between Fibonacci steps, it quietly hides.",
    "Beauty in ratio, found in art and spirals."
  ],
  answer: "Golden ratio",
  keywords: ["phi", "fibonacci", "divine proportion", "golden mean"],
  funFact: "The golden ratio, often denoted by the Greek letter φ (phi), is called “golden” because it shows up in art, architecture, and nature — from the Parthenon to sunflower seeds, seashell spirals, and even the layout of galaxies."
},
{
  number: "6371",
  formatted: "6,371km",
  clues: [
    "This number is used in calculations for GPS and satellite positioning.",
    "Look again at the number - measured in km it's a cut above, or more accurately 'below'."
    "It's the average distance from the surface to the core — not the circumference!"
  ],
  revealFormattedAt: 2,
  answer: "Earth's radius",
  keywords: ["earth", "radius", "planet", "core", "km", "kilometers", "mean radius", "equatorial", "measurement", "distance"],
  funFact: "The Earth's radius isn't the same everywhere! It's about 6,378 km at the equator and 6,357 km at the poles — but 6,371 km is the commonly used average."
},
  {
  number: 1969,
  formatted: "1969",
  answer: "Moon Landing",
  clues: [
    "This year changed how we look at the sky.",
    "A TV broadcast seen by over 600 million people.",
    "One small step made here.",
  ],
  keywords: ["moon landing", "apollo", "nasa", "buzz aldrin", "neil armstrong"],
  funFact: "Buzz Aldrin took communion on the Moon using a tiny chalice and wine — but NASA kept it secret due to a lawsuit about religion in space."
},
 {
  number: 42,
  formatted: "42",
  answer: "The Answer to Life, the Universe, and Everything",
  clues: [
    "This number is the most famous punchline in British sci-fi.",
    "You’ll find it in a book, a towel, and deep thought.",
    "Douglas Adams made it hilariously meaningless."
  ],
  keywords: ["42", "hitchhiker", "douglas adams", "life universe everything", "deep thought"],
  funFact: "Douglas Adams picked 42 arbitrarily. He later said, 'I sat down at my desk, stared out the window, and thought: 42 will do.'"
},
{
  number: 742,
  formatted: "742",
  answer: "The Simpsons’ House",
  clues: [
    "This number appears in Springfield, just off Evergreen Terrace.",
    "It’s where a yellow family with four fingers lives.",
    "Homer calls it home (when he's not at Moe’s)."
  ],
  keywords: ["simpsons", "742 evergreen", "homer", "marge", "springfield"],
  funFact: "The full address of The Simpsons is 742 Evergreen Terrace — a number creator Matt Groening picked from a street near his own childhood home."
}, 
 {
  number: 11034,
  formatted: "11,034",
  answer: "Mariana Trench",
  clues: [
    "This number is measured in meters… straight down.",
    "It’s deeper than Everest is tall.",
    "The Challenger Deep lives here."
  ],
  keywords: ["mariana trench", "deepest", "ocean", "pacific", "challenger deep"],
  funFact: "The Mariana Trench is so deep, if Mount Everest were dropped into it, the peak would still be over a mile underwater."
},
  {
  number: 1600,
  formatted: "1,600",
  answer: "Grand Canyon Depth",
  clues: [
    "This chasm is over a mile deep at its deepest point.",
    "Formed over millions of years by a stubborn river.",
    "Arizona’s most photographed attraction."
  ],
  keywords: ["grand canyon", "colorado river", "arizona", "canyon", "depth"],
  funFact: "The Grand Canyon is so vast, it creates its own weather patterns — you can see sun, snow, and storms in different parts at the same time."
},
  {
  number: 3.14159,
  formatted: "3.14159",
  answer: "Pi",
  clues: [
    "This number is never-ending, never-repeating.",
    "It relates to both pies and circles.",
    "March 14 is its unofficial holiday."
  ],
  keywords: ["pi", "π", "circle", "irrational", "math constant"],
  funFact: "The digits of Pi go on forever — but in 2019, Google calculated it to 31.4 trillion digits. That’s a lot of dessert."
},
  {
  number: 1729,
  formatted: "1,729",
  answer: "Hardy-Ramanujan Number",
  clues: [
    "It’s the smallest number expressible as the sum of two cubes in two different ways.",
    "Came up in a cab ride with two mathematicians.",
    "A legend from India made it famous."
  ],
  keywords: ["1729", "ramanujan", "math", "hardy", "cube sum"],
  funFact: "When Hardy told Ramanujan 1729 was a dull number, Ramanujan immediately replied: 'No, it’s the smallest number expressible as the sum of two cubes in two ways!'"
},
  {
  number: 6174,
  formatted: "6,174",
  answer: "Kaprekar's Constant",
  clues: [
    "Pick any 4-digit number. Rearrange, subtract, repeat...",
    "It pulls almost any number into a numerical vortex.",
    "This constant was discovered by an Indian mathematician with a flair for magic."
  ],
  keywords: ["kaprekar", "kaprekar's constant", "6174", "math trick", "number magic"],
  funFact: "Almost any 4-digit number (with at least two different digits) will reach 6174 in 7 steps or less. It’s like math’s version of gravity."
},
 {
  number: 1089,
  formatted: "1,089",
  answer: "Reverse Math Trick",
  clues: [
    "Start with any 3-digit number, reverse it, subtract, reverse again…",
    "You’ll always land here, no matter what.",
    "A math magician’s favorite reveal."
  ],
  keywords: ["1089", "number trick", "math magic", "reversal", "puzzle"],
  funFact: "Try it: Pick 732. Reverse (237), subtract (732−237 = 495), reverse (594), add: 495 + 594 = 1089. It always works. Spooky."
},
 {
  number: 73,
  formatted: "73",
  answer: "The Best Number (Sheldon Cooper)",
  clues: [
    "It’s a prime number, but with prime quirks.",
    "Its mirror (37) and binary (1001001) are also primes.",
    "A fictional physicist claimed it as the 'best number'."
  ],
  keywords: ["sheldon cooper", "prime", "binary", "73", "big bang theory"],
  funFact: "In *The Big Bang Theory*, Sheldon declares 73 the best number: it's the 21st prime, its reverse (37) is the 12th prime, and 21 = 7×3. Geek heaven."
} 
];

export default puzzles;
