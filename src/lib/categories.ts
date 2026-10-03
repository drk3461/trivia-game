import geography from "@data/questions/geography.json";
import flags from "@data/questions/flags.json";
import generalKnowledge from "@data/questions/general-knowledge.json";
import celebrities from "@data/questions/celebrities.json";
import showsMovies from "@data/questions/shows-movies.json";
import { COUNTRY_QUESTIONS } from "@data/questions/countries";

export type Q = { id: string; level: 1 | 2 | 3 | 4; question: string; answer: string; explanation: string; image?: string; tags: string[]; needs_native_review?: boolean };
export type Cat = { id: string; name: string; emoji: string; group: string; paid: boolean; isCountry: boolean; questions: Q[] };

const as = (x: unknown) => x as Q[];
export const GENERAL: Cat[] = [
  { id: "geography", name: "Geography", emoji: "🗺️", group: "General", paid: false, isCountry: false, questions: as(geography) },
  { id: "flags", name: "Guess the Flag", emoji: "🚩", group: "General", paid: false, isCountry: false, questions: as(flags) },
  { id: "general-knowledge", name: "General Knowledge", emoji: "🧠", group: "General", paid: false, isCountry: false, questions: as(generalKnowledge) },
  { id: "celebrities", name: "Celebrities", emoji: "⭐", group: "General", paid: true, isCountry: false, questions: as(celebrities) },
  { id: "shows-movies", name: "Shows & Movies", emoji: "🎬", group: "General", paid: true, isCountry: false, questions: as(showsMovies) },
];

// slug, display name, ISO code, region
const META: [string, string, string, string][] = [
  ["usa","USA","US","Americas"],["canada","Canada","CA","Americas"],["mexico","Mexico","MX","Americas"],["brazil","Brazil","BR","Americas"],["argentina","Argentina","AR","Americas"],["colombia","Colombia","CO","Americas"],["chile","Chile","CL","Americas"],["peru","Peru","PE","Americas"],["cuba","Cuba","CU","Americas"],["venezuela","Venezuela","VE","Americas"],
  ["china","China","CN","Asia"],["india","India","IN","Asia"],["japan","Japan","JP","Asia"],["south-korea","South Korea","KR","Asia"],["indonesia","Indonesia","ID","Asia"],["pakistan","Pakistan","PK","Asia"],["bangladesh","Bangladesh","BD","Asia"],["philippines","Philippines","PH","Asia"],["vietnam","Vietnam","VN","Asia"],["thailand","Thailand","TH","Asia"],["turkey","Turkey","TR","Asia"],["iran","Iran","IR","Asia"],["saudi-arabia","Saudi Arabia","SA","Asia"],["uae","UAE","AE","Asia"],["malaysia","Malaysia","MY","Asia"],
  ["nigeria","Nigeria","NG","Africa"],["egypt","Egypt","EG","Africa"],["south-africa","South Africa","ZA","Africa"],["kenya","Kenya","KE","Africa"],["ethiopia","Ethiopia","ET","Africa"],["morocco","Morocco","MA","Africa"],["ghana","Ghana","GH","Africa"],["algeria","Algeria","DZ","Africa"],["tanzania","Tanzania","TZ","Africa"],["senegal","Senegal","SN","Africa"],
  ["uk","UK","GB","Europe"],["france","France","FR","Europe"],["germany","Germany","DE","Europe"],["italy","Italy","IT","Europe"],["spain","Spain","ES","Europe"],["russia","Russia","RU","Europe"],["poland","Poland","PL","Europe"],["netherlands","Netherlands","NL","Europe"],["sweden","Sweden","SE","Europe"],["greece","Greece","GR","Europe"],
  ["australia","Australia","AU","Oceania"],["new-zealand","New Zealand","NZ","Oceania"],["papua-new-guinea","Papua New Guinea","PG","Oceania"],["fiji","Fiji","FJ","Oceania"],["samoa","Samoa","WS","Oceania"],
];
const flagEmoji = (iso: string) => String.fromCodePoint(...[...iso].map((c) => 127397 + c.charCodeAt(0)));

// Only countries that have a question file are playable.
export const COUNTRIES: Cat[] = META.filter(([slug]) => COUNTRY_QUESTIONS[slug]).map(([slug, name, iso, region]) => ({
  id: slug, name, emoji: flagEmoji(iso), group: region, paid: true, isCountry: true, questions: as(COUNTRY_QUESTIONS[slug]),
}));

export const ALL: Cat[] = [...GENERAL, ...COUNTRIES];
export const REGIONS = ["Americas", "Asia", "Africa", "Europe", "Oceania"];
