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
    funFact: "John Wilkes Booth assassinated Lincoln just days after the Civil War ended — during a play at Ford’s Theatre."
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
    funFact: "The boiling point of water actually depends on the oxygen content and atmospheric pressure. The higher the altitude, the lower the temperature at which water boils."
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
    "Acceleration affecting every object on Earth.",
    "Take another look at the number - finally up to speed?"
  ],
  revealFormattedAt: 3,
  answer: "Gravitational acceleration on Earth",
  keywords: ["gravity", "9.81", "earth gravity", "acceleration", "m/s²"],
funFact: "Galileo was the first to show by experiment that bodies fall with the same acceleration whatever their composition (the weak principle of equivalence)."
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
funFact: "Aside from basketball, Jordan also competed in minor league baseball too, where he hit 3 home runs for the Chicago White Sox."
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
funFact: "The Sherlock Holmes Museum isn't at 221b Baker Street - it's actually a few doors down at number 239!"
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
funFact: "Everest grows approximately 44 millimetres every year. This occurs because of the continuous shift of tectonic plates, pushing the Himalayas upwards."
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
  funFact: "During the Triassic Period (about 230 million years ago), the continents were arranged together as a single supercontinent called Pangea."
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
  funFact: "Unlike Antarctica, there's no land at the North Pole. Instead, it's all ice that's floating on top of the Arctic Ocean."
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
  funFact: "Sunlight takes roughly 8 minutes 17 seconds to travel the average distance from the surface of the Sun to the Earth."
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
  funFact: "The musical production has played over 45,000 performances worldwide to a total audience of more than 57 million - almost the population of Italy!"
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
  funFact: "In Fahrenheit 451 (published in 1953) - books were outlawed and burned at 451°F, a metaphor for censorship and loss of knowledge."
},
  {
  number: "1776",
  formatted: "1776",
  clues: [
    "Ink and ideals flowed freely.",
    "The colonies made a declaration.",
    "Fireworks and freedom began here."
  ],
  answer: "The year the American Declaration of Independence was signed",
  keywords: ["independence", "usa", "founding", "july 4th"],
  funFact: "On July 4, 1776, the U.S. declared independence from Britain. The Declaration, penned in Philadelphia, became a cornerstone of American democracy."
},
  {
  number: "1.618",
  formatted: "1.618",
  clues: [
    "Beauty in ratio, found in art and spirals.",
    "You might say it's irrationally attractive.",
    "Between Fibonacci steps, it quietly hides."
  ],
  answer: "Golden ratio",
  keywords: ["phi", "fibonacci", "divine proportion", "golden mean"],
  funFact: "The golden ratio (about 1.618) appears in nature, art, and architecture. It's often associated with aesthetically pleasing proportions."
},
{
  number: "6381",
  formatted: "6,381 km",
  clues: [
    "The average journey from core to cloud.",
    "Roughly the radius of our rocky home.",
    "Half the story of a planetary diameter."
  ],
  revealFormattedAt: 3,
  answer: "Radius of the Earth",
  keywords: ["earth", "radius", "planet", "geometry"],
  funFact: "The Earth's mean radius is approximately 6,371 km. It varies slightly due to the planet's equatorial bulge."
}
];

export default puzzles;
