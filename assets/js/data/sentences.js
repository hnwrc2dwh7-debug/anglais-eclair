/* Banque de phrases pour générer les fiches d'exercices.
   Format : verbe|complément|options
   options : s = verbe d'état (pas de forme en -ing) · d = action qui dure (possible avec « for two hours »)
             o = action ponctuelle, pas une habitude · r = action qui produit un résultat (already, yet, by Friday…)
             @Sujet = sujet imposé (ex. @The phone) */
window.SENTENCE_FRAMES = `
be|at home|s
be|very tired|s
have|a big dog|s
have|lunch at noon|
do|the shopping|d r
do|the dishes|d r
make|a chocolate cake|d r
make|a lot of noise|d
go|to the cinema|
go|to London|
get|a letter from Canada|o
get|up early|
run|in the park|d
run|a marathon|r
eat|a sandwich|r
eat|pizza with friends|d
write|a long email|d r
write|a letter to Grandma|d r
speak|English with the tourists|d
speak|to the teacher|d
take|the bus to school|
take|a lot of photos|d
become|a doctor|o
come|to the party|o
come|home late|
cut|the bread|r
let|the cat in|
put|the keys on the table|
read|a detective story|d r
read|the newspaper|d
build|a tree house|d r
learn|Spanish|d
send|a message to Anna|r
spend|a lot of money|o
hear|a strange noise|s o
win|the match|o
dream|about the holidays|d
feel|tired|s
keep|the secret|o
leave|the house early|
lose|the keys|o
meet|Anna at the café|o
sit|next to the window|d
sleep|in the garden|d
sell|the old car|o r
tell|a funny story|r
pay|the bill|r
say|hello to the neighbours|
understand|the lesson|s
break|a glass|o
fly|to New York|o
wake|up at six|
drive|to work|d
forgive|Tom|o
give|a present to Anna|o r
hide|the chocolate|o r
bite|the postman|o @The dog
forget|the password|o
know|the answer|s
choose|a new phone|o r
steal|a bike|o @The thief
draw|a picture of a horse|d r
fall|off the bike|o
find|a wallet in the street|o
begin|the lesson|o
drink|a lot of water|d
ring||o @The phone
sing|a song|d
swim|in the sea|d
think|about the future|d
see|a great film|s o
bring|a cake|o
buy|a new jacket|o r
catch|the train|
teach|English|d
hold|the baby|d
stand|in the queue|d
feed|the cat|r
grow|vegetables in the garden|d
throw|the ball|
show|the photos to Tom|o r
wear|a blue coat|d
lend|some money to Tom|o
ride|a horse|d
shake|the bottle|o
shut|the door|
light|a candle|o
hang|a picture on the wall|o r
dig|a hole in the garden|d r
blow|out the candles|o
beat|the other team|o
sweep|the floor|d r
tear|the paper|o
spill|the coffee|o
burn|the toast|o
withdraw|money from the bank|o
misunderstand|the question|s o
rewrite|the essay|d r
oversleep||o
freeze||o @The lake
cost|twenty euros|s @The ticket
fight|with the neighbours|d
lead|the team|d
play|football|d
watch|TV|d
work|in an office|d
study|English|d
visit|London|o
cook|dinner|d r
clean|the kitchen|d r
listen|to music|d
travel|to Spain|o
stop|the car|
carry|the heavy boxes|d
try|a new recipe|o
plan|a trip to Italy|d r
dance|at the party|d
live|in Paris|s
want|a new phone|s
like|chocolate|s
help|the neighbours|d
open|the window|
close|the door|
arrive|at school|
call|the doctor|o
wait|for the bus|d
walk|to school|d
finish|the homework|r
start|a new job|o
use|the computer|d
ask|a question|
answer|the phone|
paint|the kitchen|d r
`;

/* Repères de temps : ils indiquent quel temps utiliser. */
window.TIME_MARKERS = {
  "present-simple": ["every day", "every morning", "on Mondays", "twice a week", "every afternoon", "on Fridays"],
  "present-continuous": ["right now", "at the moment", "now"],
  "past-simple": ["yesterday", "last week", "last summer", "two days ago", "in 2019", "last night"],
  "past-continuous": ["when the phone rang", "at eight o'clock last night", "when I arrived"],
  "present-perfect": ["just", "already", "never"],
  "present-perfect-continuous": ["for two hours", "since this morning", "for ages"],
  "past-perfect": ["already|when we arrived", "just|when the bell rang", "never|before that day"],
  "past-perfect-continuous": ["for an hour when I called", "for years before the accident"],
  "future-simple": ["tomorrow", "next week", "next year", "one day"],
  "future-continuous": ["this time tomorrow", "at nine o'clock tomorrow"],
  "future-perfect": ["by next Friday", "by the end of the year", "by tomorrow evening"],
  "future-perfect-continuous": ["for three hours by noon", "for a year by June"],
  "going-to": ["next weekend", "this evening", "tomorrow morning"]
};
