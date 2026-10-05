/* Expressions : phrases utiles, phrasal verbs, idiomes, faux amis, anglais familier, sons. */

const P = raw => raw.trim().split("\n").map(l => { const [en, fr, note] = l.split("|").map(s => (s || "").trim()); return { en, fr, note }; });

window.PHRASES = [
{ id: "meet", name: "Se présenter & saluer", emoji: "🤝", items: P(`
Nice to meet you.|Enchanté(e).|La première fois qu’on rencontre quelqu’un.
How’s it going?|Comment ça va ?|Familier et très courant.
What’s your name?|Comment tu t’appelles ?|
My name is… / I’m…|Je m’appelle… / Je suis…|
Where are you from?|D’où viens-tu ?|
I’m from France.|Je viens de France.|
What do you do?|Que fais-tu dans la vie ?|Demande le métier.
How old are you?|Quel âge as-tu ?|On dit I’m 25 (pas I have 25).
Long time no see!|Ça fait longtemps !|Retrouvailles.
See you soon!|À bientôt !|
Take care!|Prends soin de toi !|Pour finir une conversation amicale.
Have a nice day!|Bonne journée !|
`)},
{ id: "conversation", name: "Faire vivre la conversation", emoji: "💬", items: P(`
What do you think?|Qu’est-ce que tu en penses ?|Demander l’avis.
I agree.|Je suis d’accord.|On ne dit pas « I am agree ».
I don’t agree.|Je ne suis pas d’accord.|
I’m not sure, but…|Je ne suis pas sûr(e), mais…|Nuancer.
That’s a good point.|C’est un bon argument.|
Really?|Vraiment ?|Montrer qu’on écoute.
That makes sense.|Ça se tient / C’est logique.|
By the way…|Au fait…|Changer de sujet.
Anyway…|Bref… / Enfin bref…|Revenir au sujet.
What do you mean?|Qu’est-ce que tu veux dire ?|
Let me think.|Laisse-moi réfléchir.|Gagner du temps.
In my opinion…|À mon avis…|
`)},
{ id: "understand", name: "Quand on ne comprend pas", emoji: "🤔", items: P(`
Sorry, I don’t understand.|Désolé, je ne comprends pas.|
Could you repeat that, please?|Pourriez-vous répéter, s’il vous plaît ?|
Could you speak more slowly?|Pourriez-vous parler plus lentement ?|
What does “…” mean?|Que veut dire « … » ?|
How do you say “…” in English?|Comment dit-on « … » en anglais ?|
How do you spell it?|Comment ça s’écrit ?|
Can you write it down?|Pouvez-vous l’écrire ?|
I’m still learning English.|J’apprends encore l’anglais.|Les gens ralentissent souvent.
Sorry? / Pardon?|Pardon ? (je n’ai pas entendu)|Plus poli que What?
Is that right?|C’est bien ça ?|Vérifier.
`)},
{ id: "restaurant", name: "Au restaurant & au café", emoji: "🍽️", items: P(`
A table for two, please.|Une table pour deux, s’il vous plaît.|
Could I see the menu, please?|Puis-je voir la carte ?|
I’d like the soup, please.|Je voudrais la soupe, s’il vous plaît.|I’d like = forme polie.
What do you recommend?|Que me conseillez-vous ?|
I’m allergic to nuts.|Je suis allergique aux fruits à coque.|
Is it spicy?|C’est épicé ?|
Could I have some water?|Pourrais-je avoir de l’eau ?|Tap water = eau du robinet.
Can we have the bill, please?|L’addition, s’il vous plaît.|Check en anglais américain.
Can I pay by card?|Je peux payer par carte ?|
Keep the change.|Gardez la monnaie.|
It was delicious, thank you.|C’était délicieux, merci.|
To eat in or take away?|Sur place ou à emporter ?|To go en américain.
`)},
{ id: "shop", name: "Faire les magasins", emoji: "🛍️", items: P(`
How much is it?|Combien ça coûte ?|
I’m just looking, thanks.|Je regarde seulement, merci.|
Can I try it on?|Je peux l’essayer ?|
Do you have it in a smaller size?|Vous l’avez en plus petit ?|
Do you have it in blue?|Vous l’avez en bleu ?|
Where are the fitting rooms?|Où sont les cabines d’essayage ?|
I’ll take it.|Je le prends.|
Is it on sale?|C’est en promo ?|
Can I get a refund?|Puis-je être remboursé ?|
Do you need a bag?|Il vous faut un sac ?|
`)},
{ id: "travel", name: "Voyager & demander son chemin", emoji: "🧭", items: P(`
How do I get to the station?|Comment aller à la gare ?|
Is it far from here?|C’est loin d’ici ?|
Is this the right platform for London?|C’est bien le quai pour Londres ?|
A return ticket to Oxford, please.|Un aller-retour pour Oxford, s’il vous plaît.|
What time does the next train leave?|À quelle heure part le prochain train ?|
Where is the nearest bus stop?|Où est l’arrêt de bus le plus proche ?|
Could you show me on the map?|Pourriez-vous me montrer sur le plan ?|
I’m lost.|Je suis perdu(e).|
I have a reservation under the name…|J’ai une réservation au nom de…|
What time is check-out?|À quelle heure faut-il libérer la chambre ?|
Is breakfast included?|Le petit déjeuner est-il compris ?|
My luggage is missing.|Mes bagages ont disparu.|
`)},
{ id: "phone", name: "Au téléphone & par message", emoji: "📞", items: P(`
Hello, this is Paul speaking.|Bonjour, c’est Paul à l’appareil.|
Can I speak to Anna, please?|Puis-je parler à Anna ?|
Hold on, please.|Ne quittez pas.|
I’ll call you back.|Je te rappelle.|
Sorry, you’re breaking up.|Désolé, ça coupe.|
Can I leave a message?|Puis-je laisser un message ?|
Wrong number, sorry.|Mauvais numéro, désolé.|
Text me when you arrive.|Envoie-moi un message quand tu arrives.|
Thanks for getting back to me.|Merci de m’avoir répondu.|
I look forward to hearing from you.|Dans l’attente de votre réponse.|Fin d’e-mail formel.
Best regards,|Cordialement,|Fin d’e-mail.
`)},
{ id: "work", name: "En classe & au travail", emoji: "💼", items: P(`
I have a question.|J’ai une question.|
Could you explain this part?|Pourriez-vous expliquer ce passage ?|
Let’s get started.|Commençons.|Début de réunion.
Let me share my screen.|Je partage mon écran.|
Can you hear me?|Vous m’entendez ?|Visio.
You’re on mute.|Ton micro est coupé.|
Let’s schedule a meeting.|Organisons une réunion.|
I’ll get back to you.|Je reviens vers vous.|
Could you send me the file?|Pourriez-vous m’envoyer le fichier ?|
The deadline is Friday.|La date limite est vendredi.|
Good job, everyone!|Beau travail, tout le monde !|
`)},
{ id: "help", name: "Urgences & besoin d’aide", emoji: "🆘", items: P(`
Help!|À l’aide !|
Could you help me, please?|Pourriez-vous m’aider ?|
Call an ambulance!|Appelez une ambulance !|
I need a doctor.|J’ai besoin d’un médecin.|
I’ve lost my passport.|J’ai perdu mon passeport.|
Someone stole my wallet.|On m’a volé mon portefeuille.|
Where is the nearest hospital?|Où est l’hôpital le plus proche ?|
It hurts here.|J’ai mal ici.|
I don’t feel well.|Je ne me sens pas bien.|
Is there a pharmacy near here?|Y a-t-il une pharmacie près d’ici ?|
`)},
{ id: "feelings", name: "Dire ce qu’on ressent", emoji: "💛", items: P(`
I’m so happy for you!|Je suis tellement content pour toi !|
I’m sorry to hear that.|Je suis désolé d’apprendre ça.|Compassion.
Don’t worry about it.|Ne t’en fais pas.|
I can’t wait!|J’ai trop hâte !|
I’m fed up.|J’en ai marre.|
It’s not a big deal.|Ce n’est pas grave.|
I miss you.|Tu me manques.|Attention à l’ordre !
I’m proud of you.|Je suis fier de toi.|
That’s amazing!|C’est génial !|
I’m exhausted.|Je suis épuisé.|
`)},
{ id: "smalltalk", name: "Small talk (papoter)", emoji: "☕", items: P(`
Lovely weather, isn’t it?|Il fait beau, hein ?|Le grand classique britannique.
How was your weekend?|C’était comment ton week-end ?|
Any plans for the holidays?|Des projets pour les vacances ?|
Did you watch the match?|Tu as vu le match ?|
How’s work?|Et le boulot ?|
It’s been ages!|Ça fait une éternité !|
What have you been up to?|Qu’est-ce que tu deviens ?|
I’d better get going.|Je ferais mieux d’y aller.|Pour partir poliment.
Say hi to your family!|Salue ta famille !|
`)}
];

/* Phrasal verbs : verbe + particule = nouveau sens. */
window.PHRASALS = P(`
get up|se lever|I get up at 7.
wake up|se réveiller|I woke up late.
give up|abandonner / arrêter|Don't give up!
look for|chercher|I'm looking for my keys.
look after|s'occuper de|She looks after her little brother.
look forward to|avoir hâte de|I'm looking forward to the holidays.
look up|chercher (une info)|Look it up in the dictionary.
find out|découvrir / se renseigner|I found out the truth.
turn on|allumer|Turn on the light.
turn off|éteindre|Turn off your phone.
turn up|monter (le son) / arriver|Turn up the music! He turned up late.
turn down|baisser / refuser|She turned down the offer.
put on|mettre (un vêtement)|Put on your coat.
take off|enlever / décoller|Take off your shoes. The plane took off.
put off|reporter|Don't put off your homework.
call off|annuler|The match was called off.
call back|rappeler|I'll call you back.
come back|revenir|Come back soon!
go back|retourner|I want to go back home.
go out|sortir|Let's go out tonight.
go on|continuer / se passer|Go on! What's going on?
carry on|continuer|Carry on, please.
get on|monter (bus) / s'entendre|Get on the bus. We get on well.
get off|descendre|Get off at the next stop.
get over|se remettre de|She got over her cold.
get along (with)|bien s'entendre (avec)|I get along with my boss.
get back|revenir / récupérer|When did you get back?
break down|tomber en panne|My car broke down.
break up|rompre|They broke up.
fill in|remplir (un formulaire)|Fill in this form.
grow up|grandir|I grew up in Lyon.
hang out|traîner|We hang out at the park.
hang up|raccrocher|Don't hang up!
hold on|patienter|Hold on a second.
keep on|continuer à|Keep on trying.
let down|décevoir|Don't let me down.
make up|inventer / se réconcilier|He made up a story. They made up.
pick up|ramasser / aller chercher|I'll pick you up at 8.
point out|faire remarquer|She pointed out a mistake.
run out of|être à court de|We've run out of milk.
set up|créer / installer|She set up her own company.
show off|frimer|Stop showing off!
show up|se pointer / venir|He didn't show up.
sit down|s'asseoir|Please sit down.
stand up|se lever|Stand up, please.
take after|ressembler à (un parent)|She takes after her mother.
take up|commencer (une activité)|I took up yoga.
throw away|jeter|Don't throw it away.
try on|essayer (un vêtement)|Can I try it on?
work out|s'entraîner / trouver la solution|I work out at the gym. I can't work it out.
come up with|trouver (une idée)|She came up with a great idea.
catch up|rattraper (son retard)|I need to catch up on sleep.
check in|s'enregistrer|We checked in at the hotel.
check out|partir de l'hôtel / regarder|Check out this video!
drop off|déposer|Drop me off here.
end up|finir par|We ended up in a bar.
fall apart|tomber en morceaux|The old house is falling apart.
figure out|comprendre / résoudre|I can't figure it out.
give back|rendre|Give me back my pen!
look out|faire attention|Look out! A car!
run into|tomber sur (quelqu'un)|I ran into Tom yesterday.
set off|partir (en voyage)|We set off at dawn.
slow down|ralentir|Slow down!
sort out|régler / trier|Let's sort this out.
take care of|prendre soin de|Take care of yourself.
put up with|supporter|I can't put up with this noise.
look down on|mépriser|Don't look down on people.
cut down on|réduire|Cut down on sugar.
`);

/* Expressions idiomatiques. */
window.IDIOMS = P(`
It's raining cats and dogs.|Il pleut des cordes.|🌧️
Break a leg!|Bonne chance ! (avant un spectacle, un examen)|🎭
A piece of cake.|C'est du gâteau / facile.|🍰
Once in a blue moon.|Tous les 36 du mois.|🌕
To cost an arm and a leg.|Coûter les yeux de la tête.|💸
To be under the weather.|Ne pas être dans son assiette.|🤒
To hit the nail on the head.|Mettre le doigt dessus.|🔨
To let the cat out of the bag.|Vendre la mèche.|🐱
To kill two birds with one stone.|Faire d'une pierre deux coups.|🐦
When pigs fly.|Quand les poules auront des dents.|🐷
To pull someone's leg.|Faire marcher quelqu'un.|🦵
To be on cloud nine.|Être aux anges.|☁️
Better late than never.|Mieux vaut tard que jamais.|⏰
To feel blue.|Avoir le cafard.|💙
Actions speak louder than words.|Les actes valent mieux que les mots.|💪
The ball is in your court.|La balle est dans ton camp.|🎾
To have butterflies in your stomach.|Avoir le trac.|🦋
To call it a day.|S'arrêter là pour aujourd'hui.|🏁
To beat around the bush.|Tourner autour du pot.|🌳
To break the ice.|Briser la glace.|🧊
To get cold feet.|Se dégonfler.|🥶
To have a sweet tooth.|Aimer les sucreries.|🍬
It's not my cup of tea.|Ce n'est pas mon truc.|🍵
To be in hot water.|Être dans le pétrin.|♨️
To spill the beans.|Cracher le morceau.|🫘
The early bird catches the worm.|Le monde appartient à ceux qui se lèvent tôt.|🐦
Every cloud has a silver lining.|À quelque chose malheur est bon.|⛅
To be all ears.|Être tout ouïe.|👂
To keep an eye on.|Garder un œil sur.|👁️
To go the extra mile.|Faire un effort supplémentaire.|🛣️
To sit on the fence.|Ne pas prendre parti.|🚧
To bite off more than you can chew.|Avoir les yeux plus gros que le ventre.|🍔
No pain, no gain.|On n'a rien sans rien.|🏋️
Practice makes perfect.|C'est en forgeant qu'on devient forgeron.|🎯
Don't judge a book by its cover.|L'habit ne fait pas le moine.|📕
Time flies.|Le temps passe vite.|⏳
To be fed up.|En avoir marre.|😤
To make ends meet.|Joindre les deux bouts.|💰
Out of the blue.|À l'improviste / tout à coup.|💙
To have second thoughts.|Avoir des doutes / hésiter.|🤔
To take it easy.|Se détendre / y aller doucement.|😌
To be over the moon.|Être fou de joie.|🌙
To ring a bell.|Rappeler quelque chose.|🔔
Easier said than done.|Plus facile à dire qu'à faire.|😅
To be a couch potato.|Être un pantouflard.|🛋️
Let's play it by ear.|On verra sur le moment.|🎶
To hit the sack.|Aller se coucher.|🛏️
To cut corners.|Bâcler (pour gagner du temps ou de l’argent).|✂️
To get the hang of it.|Prendre le coup de main.|👌
Speak of the devil!|Quand on parle du loup !|😈
`);

/* Faux amis : ils ressemblent au français mais ne veulent pas dire la même chose. */
window.FALSE_FRIENDS = [
["actually","en fait","actuellement → currently / nowadays"],
["eventually","finalement / à la longue","éventuellement → possibly"],
["library","bibliothèque","librairie → bookshop"],
["sensible","raisonnable","sensible → sensitive"],
["sympathetic","compatissant","sympathique → nice / friendly"],
["to attend","assister à","attendre → to wait"],
["to assist","aider","assister à → to attend"],
["deception","tromperie","déception → disappointment"],
["to pretend","faire semblant","prétendre → to claim"],
["to realise","se rendre compte","réaliser (un projet) → to achieve / to carry out"],
["chance","hasard / occasion","chance (bonne fortune) → luck"],
["college","enseignement supérieur","collège → secondary school"],
["journey","trajet / voyage","journée → day"],
["lecture","conférence / cours magistral","lecture → reading"],
["preservative","conservateur (alimentaire)","préservatif → condom"],
["coin","pièce de monnaie","coin (angle) → corner"],
["crayon","crayon de cire","crayon (à papier) → pencil"],
["store","magasin","store (fenêtre) → blind"],
["location","emplacement / lieu","location → rental"],
["to rest","se reposer","rester → to stay"],
["envy","jalousie","envie → want / desire"],
["affair","liaison / affaire publique","affaire (business) → business / deal"],
["agenda","ordre du jour","agenda → diary / planner"],
["comprehensive","complet / exhaustif","compréhensif → understanding"],
["delay","retard","délai → deadline / time limit"],
["exciting","passionnant","excitant → stimulating"],
["fabric","tissu","fabrique → factory"],
["grape","raisin","grappe → bunch"],
["large","grand","large → wide"],
["to demand","exiger","demander → to ask"],
["a novel","un roman","une nouvelle → a short story / news"],
["money","argent (monnaie)","monnaie (rendue) → change"],
["parents","parents (père et mère)","parents (la famille au sens large) → relatives"],
["photograph","photo","photographe → photographer"],
["to resume","reprendre","résumer → to sum up"],
["résumé (US)","CV","résumé → summary"],
["mobile","portable (téléphone)","mobile (motif) → motive"],
["petrol","essence","pétrole → oil"],
["to supply","fournir","supplier → to beg"],
["inconvenient","gênant / pas pratique","inconvénient → drawback"],
["achieve","réaliser / atteindre","achever → to finish"],
["candid","franc / sincère","candide → naive"],
["cave","grotte","cave → cellar"],
["entrée (US)","plat principal","entrée → starter"],
["formidable","redoutable","formidable → great / terrific"],
["introduce","présenter (quelqu’un)","introduire → to insert"],
["isolation","isolement","isolation (maison) → insulation"],
["notice","remarquer / avis","notice (mode d’emploi) → instructions"],
["rude","impoli","rude (dur) → harsh / tough"],
["slip","glissade / lapsus","slip → briefs / underpants"]
].map(([en, fr, trap]) => ({ en, fr, trap }));

/* Anglais familier : à comprendre (et à utiliser avec des amis). */
window.SLANG = P(`
gonna|going to (aller + verbe)|I'm gonna call you.
wanna|want to (vouloir)|Do you wanna come?
gotta|have got to (devoir)|I gotta go.
kinda|kind of (un peu / genre)|It's kinda weird.
y'all|vous tous (sud des USA)|How are y'all doing?
mate|pote (UK, AUS)|Cheers, mate!
dude|mec (US)|Hey dude!
cool|cool / génial|That's so cool!
awesome|génial|That was awesome!
chill|tranquille / se détendre|Just chill out.
LOL|mdr|That's so funny, LOL.
BRB|je reviens (be right back)|BRB, dinner's ready.
OMG|oh mon dieu|OMG, look at this!
no worries|pas de souci|“Thanks!” “No worries!”
my bad|ma faute / autant pour moi|Oops, my bad!
I'm down|je suis partant|A movie tonight? I'm down.
hang on|attends une seconde|Hang on, I'm coming.
to be broke|être fauché|I can't come, I'm broke.
fancy|avoir envie de (UK)|Fancy a cup of tea?
knackered|crevé (UK)|I'm absolutely knackered.
quid|livre sterling (UK)|It cost ten quid.
bucks|dollars (US)|Twenty bucks.
cheers|merci / santé (UK)|Cheers for that!
lit|génial / d'enfer|The party was lit!
to binge|faire des excès de|I binged the whole series.
no way!|pas possible ! / sûrement pas !|No way! Really?
whatever|peu importe / bref|Whatever, let's go.
sort of|en quelque sorte|It's sort of blue.
`);

/* Les sons de l'anglais. */
window.SOUNDS = [
{ symbol: "θ / ð", title: "Les deux « th »", text: "Pointe de la langue entre les dents, puis souffle. La voix vibre pour this (ð), pas pour think (θ).", words: ["think", "three", "both", "this", "mother", "they"], hint: "Ne remplace pas par s ou z : think ≠ sink." },
{ symbol: "h", title: "Le h soufflé", text: "Le h s’entend : un petit souffle, comme sur une vitre pour faire de la buée.", words: ["happy", "hello", "house", "behind", "hotel"], hint: "Mais il est muet dans hour, honest, honour." },
{ symbol: "r", title: "Le r anglais", text: "La langue recule sans toucher le palais, sans rouler et sans racler la gorge.", words: ["red", "right", "very", "around", "sorry"], hint: "En anglais britannique, on ne prononce pas le r en fin de mot : car, teacher." },
{ symbol: "ə", title: "Le schwa", text: "La voyelle la plus fréquente : un « e » très court et relâché dans les syllabes faibles.", words: ["about", "banana", "teacher", "doctor", "the"], hint: "Les petits mots (a, to, of, for) se réduisent souvent au schwa." },
{ symbol: "iː / ɪ", title: "Sheep ou ship ?", text: "Le i long de sheep et le i court de ship changent le sens du mot.", words: ["sheep", "ship", "leave", "live", "seat", "sit"], hint: "Exagère la longueur : sheeeep, puis ship très bref." },
{ symbol: "æ", title: "Le a de cat", text: "Bouche bien ouverte, entre « a » et « è ».", words: ["cat", "black", "man", "apple", "hat"], hint: "Compare cat et cut, hat et hut." },
{ symbol: "ʌ", title: "Le u de cup", text: "Un son bref et sourd, entre le « a » de « patte » et le « eu » de « heure ».", words: ["cup", "bus", "love", "money", "sun"], hint: "Love et money s’écrivent avec o, mais se prononcent avec ce son." },
{ symbol: "uː / ʊ", title: "Food ou foot ?", text: "Long dans food, court dans foot.", words: ["food", "moon", "foot", "book", "good"], hint: "Pull et pool ne sonnent pas pareil." },
{ symbol: "-ed", title: "Trois façons de dire -ed", text: "Le prétérit régulier se prononce /t/, /d/ ou /ɪd/.", words: ["worked", "played", "wanted", "stopped", "needed"], hint: "On ajoute une syllabe seulement après t ou d : wan-ted, nee-ded." },
{ symbol: "ˈ", title: "L’accent tonique", text: "Dans chaque mot long, une syllabe est plus forte. Se tromper d’accent gêne plus qu’une mauvaise voyelle.", words: ["photograph", "photographer", "important", "comfortable", "vegetable"], hint: "comFORtable ? Non : COMF-ta-ble !" },
{ symbol: "∅", title: "Les lettres muettes", text: "Beaucoup de lettres ne se prononcent pas.", words: ["knife", "know", "write", "listen", "island", "Wednesday"], hint: "k muet devant n, w muet devant r." },
{ symbol: "ŋ", title: "Le son -ing", text: "Le son nasal à l’arrière de la gorge, sans prononcer de g dur.", words: ["sing", "thing", "morning", "king", "long"], hint: "Ne fais pas « sing-gue »." }
];

/* Paires minimales pour entraîner l'oreille. */
window.MINIMAL_PAIRS = [
["ship", "sheep"], ["live", "leave"], ["sit", "seat"], ["full", "fool"], ["cat", "cut"], ["hat", "hut"], ["think", "sink"], ["three", "tree"],
["thin", "tin"], ["walk", "work"], ["bed", "bad"], ["pen", "pan"], ["hair", "air"], ["heat", "eat"], ["light", "right"], ["fan", "van"],
["berry", "very"], ["cheap", "jeep"], ["sun", "sung"], ["want", "won't"], ["fifteen", "fifty"], ["thirteen", "thirty"]
];
