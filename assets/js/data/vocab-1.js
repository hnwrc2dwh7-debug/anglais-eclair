/* Vocabulaire — partie 1 : les bases (A1).
   Format d'une ligne : image | anglais | français | exemple anglais | exemple français */
window.VOCAB = window.VOCAB || [];
window.V = window.V || function (id, name, emoji, level, cat, raw) {
  const words = raw.trim().split("\n").map(line => {
    const [img, en, fr, ex, exFr] = line.split("|").map(s => (s || "").trim());
    return { img, en, fr, ex, exFr };
  }).filter(w => w.en);
  window.VOCAB.push({ id, name, emoji, level, cat, words });
};

V("essentials", "Premiers mots", "👋", "A1", "Bases", `
👋|hello|bonjour / salut|Hello! How are you?|Salut ! Comment ça va ?
🙋|hi|salut|Hi, I'm Sam.|Salut, je suis Sam.
🌅|good morning|bonjour (le matin)|Good morning, everyone!|Bonjour tout le monde !
🌇|good evening|bonsoir|Good evening, sir.|Bonsoir, monsieur.
🌙|good night|bonne nuit|Good night, sleep well.|Bonne nuit, dors bien.
👋|goodbye|au revoir|Goodbye, see you soon!|Au revoir, à bientôt !
🙏|please|s’il te plaît / s’il vous plaît|A coffee, please.|Un café, s’il vous plaît.
💐|thank you|merci|Thank you for your help.|Merci pour ton aide.
😊|you're welcome|de rien|“Thanks!” “You're welcome.”|« Merci ! » « De rien. »
✅|yes|oui|Yes, I agree.|Oui, je suis d’accord.
❌|no|non|No, thank you.|Non, merci.
😬|sorry|désolé(e) / pardon|Sorry, I'm late.|Désolé, je suis en retard.
🙇|excuse me|excusez-moi|Excuse me, where is the station?|Excusez-moi, où est la gare ?
👌|okay|d’accord|Okay, let's go!|D’accord, on y va !
🤝|nice to meet you|enchanté(e)|Nice to meet you, Anna.|Enchanté, Anna.
❓|how are you?|comment ça va ?|Hi Tom, how are you?|Salut Tom, comment ça va ?
👍|fine|bien|I'm fine, thanks.|Je vais bien, merci.
🏷️|name|nom / prénom|What's your name?|Comment tu t’appelles ?
🤷|I don't know|je ne sais pas|Sorry, I don't know.|Désolé, je ne sais pas.
💡|I understand|je comprends|Okay, I understand now.|D’accord, je comprends maintenant.
🔁|again|encore / de nouveau|Can you say that again?|Tu peux répéter ?
🐢|slowly|lentement|Please speak slowly.|Parle lentement, s’il te plaît.
🆘|help|aide / aider|Can you help me?|Tu peux m’aider ?
🎉|welcome|bienvenue|Welcome to London!|Bienvenue à Londres !
👀|see you later|à plus tard|See you later, guys!|À plus tard, les gars !
🍀|good luck|bonne chance|Good luck with your exam!|Bonne chance pour ton examen !
🥂|cheers|santé ! / merci (UK)|Cheers, everybody!|Santé, tout le monde !
🎂|happy birthday|joyeux anniversaire|Happy birthday, Mum!|Joyeux anniversaire, maman !
🤔|maybe|peut-être|Maybe tomorrow.|Peut-être demain.
💯|of course|bien sûr|Of course you can come.|Bien sûr que tu peux venir.
`);

V("numbers", "Nombres", "🔢", "A1", "Bases", `
0️⃣|zero|zéro|It's zero degrees outside.|Il fait zéro degré dehors.
1️⃣|one|un|I have one brother.|J’ai un frère.
2️⃣|two|deux|Two coffees, please.|Deux cafés, s’il vous plaît.
3️⃣|three|trois|We have three cats.|Nous avons trois chats.
4️⃣|four|quatre|The table has four legs.|La table a quatre pieds.
5️⃣|five|cinq|I get up at five.|Je me lève à cinq heures.
6️⃣|six|six|She is six years old.|Elle a six ans.
7️⃣|seven|sept|There are seven days in a week.|Il y a sept jours dans une semaine.
8️⃣|eight|huit|School starts at eight.|L’école commence à huit heures.
9️⃣|nine|neuf|Nine people came.|Neuf personnes sont venues.
🔟|ten|dix|Count to ten.|Compte jusqu’à dix.
🕚|eleven|onze|It's eleven o'clock.|Il est onze heures.
🕛|twelve|douze|A dozen is twelve.|Une douzaine, c’est douze.
🎰|thirteen|treize|He is thirteen.|Il a treize ans.
🧮|fifteen|quinze|Fifteen minutes, please.|Quinze minutes, s’il vous plaît.
🎓|twenty|vingt|I'm twenty years old.|J’ai vingt ans.
⏱️|thirty|trente|Wait thirty seconds.|Attends trente secondes.
🗓️|forty|quarante|My dad is forty.|Mon père a quarante ans.
🖐️|fifty|cinquante|Fifty percent off!|Moins cinquante pour cent !
💯|a hundred|cent|A hundred people were there.|Cent personnes étaient là.
🏦|a thousand|mille|It costs a thousand euros.|Ça coûte mille euros.
🌍|a million|un million|Millions of people speak English.|Des millions de gens parlent anglais.
🥇|first|premier / première|She came first.|Elle est arrivée première.
🥈|second|deuxième / seconde|This is my second visit.|C’est ma deuxième visite.
🥉|third|troisième|Take the third street on the left.|Prends la troisième rue à gauche.
➗|half|moitié / demi|Half an hour.|Une demi-heure.
🍰|a quarter|un quart|A quarter past six.|Six heures et quart.
✖️|twice|deux fois|I've been there twice.|J’y suis allé deux fois.
🔢|number|nombre / numéro|What's your phone number?|Quel est ton numéro de téléphone ?
➕|plus|plus|Two plus two is four.|Deux plus deux font quatre.
➖|minus|moins|Ten minus three is seven.|Dix moins trois font sept.
`);

V("colors", "Couleurs", "🎨", "A1", "Bases", `
🟥|red|rouge|I love red roses.|J’adore les roses rouges.
🟦|blue|bleu|The sky is blue.|Le ciel est bleu.
🟩|green|vert|Grass is green.|L’herbe est verte.
🟨|yellow|jaune|A yellow taxi.|Un taxi jaune.
🟧|orange|orange|An orange T-shirt.|Un tee-shirt orange.
🟪|purple|violet|Purple is my favourite colour.|Le violet est ma couleur préférée.
🩷|pink|rose|She has pink shoes.|Elle a des chaussures roses.
⬛|black|noir|A black cat.|Un chat noir.
⬜|white|blanc|White snow.|De la neige blanche.
🩶|grey / gray|gris|The sky is grey today.|Le ciel est gris aujourd’hui.
🟫|brown|marron / brun|He has brown eyes.|Il a les yeux marron.
🥇|gold|doré / or|A gold medal.|Une médaille d’or.
🥈|silver|argenté / argent|A silver ring.|Une bague en argent.
🌌|dark blue|bleu foncé|A dark blue jacket.|Une veste bleu foncé.
🩵|light blue|bleu clair|Light blue walls.|Des murs bleu clair.
🌊|turquoise|turquoise|Turquoise water.|Une eau turquoise.
🍷|burgundy|bordeaux|A burgundy dress.|Une robe bordeaux.
🍦|beige|beige|Beige trousers.|Un pantalon beige.
🌈|colourful|coloré|A colourful painting.|Un tableau coloré.
🖍️|colour / color|couleur|What colour is it?|C’est de quelle couleur ?
🌗|pale|pâle|You look pale.|Tu as l’air pâle.
✨|bright|vif / lumineux|Bright colours.|Des couleurs vives.
🦓|striped|rayé|A striped shirt.|Une chemise rayée.
🔴|spotted|à pois|A spotted tie.|Une cravate à pois.
`);

V("calendar", "Jours, mois & saisons", "📅", "A1", "Bases", `
📅|Monday|lundi|I work on Monday.|Je travaille lundi.
📅|Tuesday|mardi|See you on Tuesday.|À mardi.
📅|Wednesday|mercredi|Wednesday is in the middle of the week.|Mercredi est au milieu de la semaine.
📅|Thursday|jeudi|The meeting is on Thursday.|La réunion est jeudi.
🎉|Friday|vendredi|Thank God it's Friday!|Enfin vendredi !
🛍️|Saturday|samedi|We go shopping on Saturday.|On fait les courses le samedi.
☀️|Sunday|dimanche|Sunday is a quiet day.|Le dimanche est un jour calme.
❄️|January|janvier|My birthday is in January.|Mon anniversaire est en janvier.
💘|February|février|Valentine's Day is in February.|La Saint-Valentin est en février.
🌱|March|mars|Spring starts in March.|Le printemps commence en mars.
🌧️|April|avril|It rains a lot in April.|Il pleut beaucoup en avril.
🌷|May|mai|Flowers grow in May.|Les fleurs poussent en mai.
🏖️|June|juin|School ends in June.|L’école se termine en juin.
🎆|July|juillet|We go on holiday in July.|On part en vacances en juillet.
🌞|August|août|August is very hot.|Août est très chaud.
🎒|September|septembre|School starts in September.|L’école reprend en septembre.
🎃|October|octobre|Halloween is in October.|Halloween est en octobre.
🍂|November|novembre|November is grey.|Novembre est gris.
🎄|December|décembre|Christmas is in December.|Noël est en décembre.
🌸|spring|printemps|I love spring.|J’adore le printemps.
🌻|summer|été|Summer holidays are long.|Les vacances d’été sont longues.
🍁|autumn / fall|automne|Leaves fall in autumn.|Les feuilles tombent en automne.
⛄|winter|hiver|It snows in winter.|Il neige en hiver.
🗓️|week|semaine|See you next week.|À la semaine prochaine.
🗓️|weekend|week-end|Have a nice weekend!|Bon week-end !
📆|month|mois|Once a month.|Une fois par mois.
🎇|year|année / an|Happy New Year!|Bonne année !
🌞|day|jour / journée|Have a nice day!|Bonne journée !
🎊|holiday|vacances / jour férié|We're on holiday.|Nous sommes en vacances.
📌|date|date|What's the date today?|Quelle est la date aujourd’hui ?
`);

V("time", "L’heure & le temps qui passe", "⏰", "A1", "Bases", `
⏰|time|heure / temps|What time is it?|Quelle heure est-il ?
🕐|o'clock|heure(s) pile|It's three o'clock.|Il est trois heures.
⏱️|minute|minute|Wait a minute.|Attends une minute.
⌛|hour|heure (durée)|An hour later.|Une heure plus tard.
⚡|second|seconde|Just a second!|Une seconde !
🌄|morning|matin|In the morning.|Le matin.
🌞|noon / midday|midi|We eat at noon.|On mange à midi.
🌤️|afternoon|après-midi|See you this afternoon.|À cet après-midi.
🌆|evening|soir / soirée|In the evening.|Le soir.
🌃|night|nuit|At night.|La nuit.
🕛|midnight|minuit|The party ended at midnight.|La fête s’est finie à minuit.
📍|today|aujourd’hui|I'm busy today.|Je suis occupé aujourd’hui.
⏪|yesterday|hier|I saw her yesterday.|Je l’ai vue hier.
⏩|tomorrow|demain|See you tomorrow.|À demain.
⚡|now|maintenant|Do it now!|Fais-le maintenant !
🔜|soon|bientôt|See you soon.|À bientôt.
🐌|late|en retard / tard|Don't be late.|Ne sois pas en retard.
🐇|early|tôt / en avance|I got up early.|Je me suis levé tôt.
🕰️|always|toujours|I always drink tea.|Je bois toujours du thé.
🔄|often|souvent|We often go to the cinema.|Nous allons souvent au cinéma.
🎲|sometimes|parfois|Sometimes I walk to work.|Parfois je vais au travail à pied.
🚫|never|jamais|I never smoke.|Je ne fume jamais.
📆|every day|tous les jours|I read every day.|Je lis tous les jours.
⏮️|ago|il y a (passé)|Two years ago.|Il y a deux ans.
➡️|then|puis / ensuite / alors|First eat, then sleep.|D’abord manger, puis dormir.
⏳|later|plus tard|I'll call you later.|Je t’appellerai plus tard.
📅|last week|la semaine dernière|I was ill last week.|J’étais malade la semaine dernière.
🗓️|next month|le mois prochain|We move next month.|On déménage le mois prochain.
🕘|half past nine|neuf heures et demie|The film starts at half past nine.|Le film commence à neuf heures et demie.
🕣|a quarter to nine|neuf heures moins le quart|Meet me at a quarter to nine.|Retrouve-moi à neuf heures moins le quart.
⌚|watch|montre|My watch is slow.|Ma montre retarde.
⏰|alarm clock|réveil|My alarm clock rings at seven.|Mon réveil sonne à sept heures.
`);

V("family", "Famille", "👨‍👩‍👧", "A1", "Les gens", `
👨‍👩‍👧|family|famille|I have a big family.|J’ai une grande famille.
👩|mother / mum|mère / maman|My mum is a doctor.|Ma mère est médecin.
👨|father / dad|père / papa|My dad cooks well.|Mon père cuisine bien.
👫|parents|parents|My parents live in Lyon.|Mes parents habitent à Lyon.
👦|brother|frère|My brother is older than me.|Mon frère est plus âgé que moi.
👧|sister|sœur|I have two sisters.|J’ai deux sœurs.
👶|baby|bébé|The baby is sleeping.|Le bébé dort.
🧒|child (children)|enfant(s)|They have three children.|Ils ont trois enfants.
👦|son|fils|Their son is ten.|Leur fils a dix ans.
👧|daughter|fille (enfant)|My daughter loves music.|Ma fille adore la musique.
👵|grandmother / grandma|grand-mère / mamie|My grandma bakes cakes.|Ma mamie fait des gâteaux.
👴|grandfather / grandpa|grand-père / papi|Grandpa tells stories.|Papi raconte des histoires.
👪|grandparents|grands-parents|I visit my grandparents.|Je rends visite à mes grands-parents.
🧑|uncle|oncle|My uncle lives in Canada.|Mon oncle vit au Canada.
👩|aunt|tante|My aunt is funny.|Ma tante est drôle.
🧑‍🤝‍🧑|cousin|cousin / cousine|My cousin is my best friend.|Mon cousin est mon meilleur ami.
👦|nephew|neveu|My nephew is two.|Mon neveu a deux ans.
👧|niece|nièce|My niece plays the piano.|Ma nièce joue du piano.
💍|husband|mari|Her husband is Irish.|Son mari est irlandais.
👰|wife|femme / épouse|His wife is a teacher.|Sa femme est professeure.
❤️|boyfriend|petit ami|Her boyfriend is nice.|Son petit ami est sympa.
💕|girlfriend|petite amie|His girlfriend is Spanish.|Sa petite amie est espagnole.
👯|twins|jumeaux / jumelles|They are twins.|Ce sont des jumeaux.
🧓|grandchildren|petits-enfants|She has five grandchildren.|Elle a cinq petits-enfants.
🤵|father-in-law|beau-père|My father-in-law is retired.|Mon beau-père est à la retraite.
👩‍🦳|mother-in-law|belle-mère|My mother-in-law is kind.|Ma belle-mère est gentille.
🏡|relatives|proches / famille|All my relatives came.|Toute ma famille est venue.
🎎|only child|enfant unique|I'm an only child.|Je suis enfant unique.
🌳|to grow up|grandir|I grew up in Paris.|J’ai grandi à Paris.
🍼|to be born|naître|I was born in 2001.|Je suis né en 2001.
`);

V("body", "Le corps", "🧍", "A1", "Les gens", `
🗣️|head|tête|My head hurts.|J’ai mal à la tête.
👁️|eye|œil (yeux)|She has green eyes.|Elle a les yeux verts.
👂|ear|oreille|Listen with your ears.|Écoute avec tes oreilles.
👃|nose|nez|My nose is cold.|J’ai le nez froid.
👄|mouth|bouche|Open your mouth.|Ouvre la bouche.
🦷|tooth (teeth)|dent(s)|Brush your teeth!|Brosse-toi les dents !
👅|tongue|langue|Don't stick out your tongue.|Ne tire pas la langue.
💇|hair|cheveux|She has long hair.|Elle a les cheveux longs.
😀|face|visage|Wash your face.|Lave-toi le visage.
🧔|beard|barbe|He has a beard.|Il a une barbe.
🦒|neck|cou|A long neck.|Un long cou.
💪|arm|bras|My arm is broken.|J’ai le bras cassé.
✋|hand|main|Raise your hand.|Lève la main.
☝️|finger|doigt|Point with your finger.|Montre du doigt.
👍|thumb|pouce|Thumbs up!|Pouce levé !
🦵|leg|jambe|He hurt his leg.|Il s’est blessé à la jambe.
🦶|foot (feet)|pied(s)|My feet are tired.|J’ai mal aux pieds.
🦴|knee|genou|I fell on my knee.|Je suis tombé sur le genou.
🫀|heart|cœur|My heart is beating fast.|Mon cœur bat vite.
🧠|brain|cerveau|Use your brain!|Utilise ton cerveau !
🫁|lungs|poumons|Breathe with your lungs.|Respire avec tes poumons.
🤰|stomach / belly|ventre / estomac|My stomach hurts.|J’ai mal au ventre.
🔙|back|dos|I have back pain.|J’ai mal au dos.
🤷|shoulder|épaule|He shrugged his shoulders.|Il a haussé les épaules.
🦾|elbow|coude|Don't put your elbows on the table.|Ne mets pas les coudes sur la table.
⌚|wrist|poignet|A watch on my wrist.|Une montre au poignet.
🦶|toe|orteil|I hurt my toe.|Je me suis fait mal à l’orteil.
💋|lips|lèvres|Red lips.|Des lèvres rouges.
🩸|blood|sang|A drop of blood.|Une goutte de sang.
🧴|skin|peau|Protect your skin from the sun.|Protège ta peau du soleil.
🤨|eyebrow|sourcil|He raised an eyebrow.|Il a haussé un sourcil.
😗|cheek|joue|A kiss on the cheek.|Un bisou sur la joue.
`);

V("pets", "Animaux de compagnie & de la ferme", "🐶", "A1", "Animaux", `
🐶|dog|chien|My dog is very friendly.|Mon chien est très gentil.
🐱|cat|chat|The cat is sleeping on the sofa.|Le chat dort sur le canapé.
🐰|rabbit|lapin|A white rabbit.|Un lapin blanc.
🐹|hamster|hamster|My hamster runs all night.|Mon hamster court toute la nuit.
🐠|fish|poisson|A goldfish in a bowl.|Un poisson rouge dans un bocal.
🐦|bird|oiseau|A bird is singing.|Un oiseau chante.
🐢|turtle / tortoise|tortue|Tortoises are slow.|Les tortues sont lentes.
🐭|mouse (mice)|souris|A little mouse.|Une petite souris.
🐮|cow|vache|Cows give milk.|Les vaches donnent du lait.
🐷|pig|cochon|Pigs love mud.|Les cochons adorent la boue.
🐑|sheep|mouton|A flock of sheep.|Un troupeau de moutons.
🐐|goat|chèvre|Goat cheese is delicious.|Le fromage de chèvre est délicieux.
🐴|horse|cheval|She rides a horse.|Elle monte à cheval.
🫏|donkey|âne|The donkey is stubborn.|L’âne est têtu.
🐔|chicken / hen|poule / poulet|The hen lays eggs.|La poule pond des œufs.
🐓|rooster|coq|The rooster crows at dawn.|Le coq chante à l’aube.
🦆|duck|canard|Ducks swim on the lake.|Les canards nagent sur le lac.
🐣|chick|poussin|A cute yellow chick.|Un mignon poussin jaune.
🐄|bull|taureau|The bull is angry.|Le taureau est en colère.
🐕|puppy|chiot|What a cute puppy!|Quel chiot mignon !
🐈|kitten|chaton|The kitten plays with a ball.|Le chaton joue avec une balle.
🦃|turkey|dinde|Turkey for Thanksgiving.|De la dinde pour Thanksgiving.
🪿|goose|oie|A white goose.|Une oie blanche.
🦜|parrot|perroquet|The parrot can talk.|Le perroquet sait parler.
🐾|pet|animal de compagnie|Do you have a pet?|Tu as un animal de compagnie ?
🚜|farm|ferme|They live on a farm.|Ils vivent dans une ferme.
🦴|to feed|nourrir|Don't forget to feed the cat.|N’oublie pas de nourrir le chat.
🐕‍🦺|to walk the dog|promener le chien|I walk the dog every morning.|Je promène le chien tous les matins.
`);

V("wild", "Animaux sauvages", "🦁", "A1", "Animaux", `
🦁|lion|lion|The lion is the king of the jungle.|Le lion est le roi de la jungle.
🐯|tiger|tigre|Tigers have stripes.|Les tigres ont des rayures.
🐘|elephant|éléphant|Elephants never forget.|Les éléphants n’oublient jamais.
🦒|giraffe|girafe|A giraffe has a long neck.|La girafe a un long cou.
🦓|zebra|zèbre|Zebras are black and white.|Les zèbres sont noirs et blancs.
🐒|monkey|singe|Monkeys love bananas.|Les singes adorent les bananes.
🦍|gorilla|gorille|A huge gorilla.|Un énorme gorille.
🐻|bear|ours|Bears sleep in winter.|Les ours dorment en hiver.
🐼|panda|panda|Pandas eat bamboo.|Les pandas mangent du bambou.
🐺|wolf (wolves)|loup(s)|The wolf howls at the moon.|Le loup hurle à la lune.
🦊|fox|renard|A clever fox.|Un renard rusé.
🦌|deer|cerf / biche|A deer in the forest.|Un cerf dans la forêt.
🐿️|squirrel|écureuil|The squirrel hides nuts.|L’écureuil cache des noisettes.
🦔|hedgehog|hérisson|Hedgehogs have spikes.|Les hérissons ont des piquants.
🐍|snake|serpent|Be careful, a snake!|Attention, un serpent !
🐊|crocodile|crocodile|Crocodiles live in rivers.|Les crocodiles vivent dans les rivières.
🦘|kangaroo|kangourou|Kangaroos live in Australia.|Les kangourous vivent en Australie.
🐨|koala|koala|Koalas sleep a lot.|Les koalas dorment beaucoup.
🦛|hippo|hippopotame|Hippos are dangerous.|Les hippopotames sont dangereux.
🦏|rhino|rhinocéros|A rhino has a horn.|Un rhinocéros a une corne.
🐪|camel|chameau|Camels live in the desert.|Les chameaux vivent dans le désert.
🦉|owl|hibou / chouette|Owls hunt at night.|Les hiboux chassent la nuit.
🦅|eagle|aigle|The eagle flies high.|L’aigle vole haut.
🐧|penguin|manchot / pingouin|Penguins can't fly.|Les manchots ne volent pas.
🦇|bat|chauve-souris|Bats sleep upside down.|Les chauves-souris dorment la tête en bas.
🐸|frog|grenouille|A green frog.|Une grenouille verte.
🦎|lizard|lézard|A lizard in the sun.|Un lézard au soleil.
🐆|leopard|léopard|The leopard runs fast.|Le léopard court vite.
🦬|buffalo|buffle / bison|A herd of buffalo.|Un troupeau de bisons.
🌿|wildlife|faune sauvage|Protect wildlife!|Protégez la faune sauvage !
`);

V("minibeasts", "Oiseaux, insectes & animaux marins", "🦋", "A2", "Animaux", `
🦋|butterfly|papillon|A beautiful butterfly.|Un beau papillon.
🐝|bee|abeille|Bees make honey.|Les abeilles font du miel.
🐜|ant|fourmi|Ants work hard.|Les fourmis travaillent dur.
🕷️|spider|araignée|I'm scared of spiders.|J’ai peur des araignées.
🦟|mosquito|moustique|A mosquito bit me.|Un moustique m’a piqué.
🪰|fly|mouche|There's a fly in my soup!|Il y a une mouche dans ma soupe !
🐞|ladybird / ladybug|coccinelle|A red ladybird.|Une coccinelle rouge.
🐛|caterpillar|chenille|The caterpillar becomes a butterfly.|La chenille devient papillon.
🐌|snail|escargot|The snail is slow.|L’escargot est lent.
🪱|worm|ver|Birds eat worms.|Les oiseaux mangent des vers.
🦗|cricket / grasshopper|grillon / sauterelle|Crickets sing at night.|Les grillons chantent la nuit.
🐳|whale|baleine|Whales are huge.|Les baleines sont énormes.
🐬|dolphin|dauphin|Dolphins are clever.|Les dauphins sont intelligents.
🦈|shark|requin|A shark in the water!|Un requin dans l’eau !
🐙|octopus|pieuvre|An octopus has eight arms.|Une pieuvre a huit bras.
🦀|crab|crabe|Crabs walk sideways.|Les crabes marchent de côté.
🦞|lobster|homard|Lobster is expensive.|Le homard est cher.
🦐|shrimp / prawn|crevette|Grilled prawns.|Des crevettes grillées.
🦭|seal|phoque|A seal on the rocks.|Un phoque sur les rochers.
🪼|jellyfish|méduse|Watch out for jellyfish.|Attention aux méduses.
⭐|starfish|étoile de mer|A starfish on the beach.|Une étoile de mer sur la plage.
🐚|shell|coquillage|I collect shells.|Je collectionne les coquillages.
🕊️|pigeon / dove|pigeon / colombe|A white dove of peace.|Une colombe blanche de la paix.
🐦‍⬛|crow|corbeau|A black crow.|Un corbeau noir.
🦢|swan|cygne|Swans on the lake.|Des cygnes sur le lac.
🦩|flamingo|flamant rose|Flamingos are pink.|Les flamants sont roses.
🪶|feather|plume|A light feather.|Une plume légère.
🪺|nest|nid|A bird's nest.|Un nid d’oiseau.
🪽|wing|aile|Birds have wings.|Les oiseaux ont des ailes.
🐟|tail|queue|The dog wags its tail.|Le chien remue la queue.
`);

V("fruits", "Fruits", "🍓", "A1", "Manger & boire", `
🍎|apple|pomme|An apple a day keeps the doctor away.|Une pomme par jour éloigne le médecin.
🍐|pear|poire|A juicy pear.|Une poire juteuse.
🍌|banana|banane|Bananas are yellow.|Les bananes sont jaunes.
🍊|orange|orange|Orange juice.|Du jus d’orange.
🍋|lemon|citron|Tea with lemon.|Du thé au citron.
🍓|strawberry|fraise|Strawberries and cream.|Des fraises à la crème.
🍒|cherry|cerise|Cherry pie.|Une tarte aux cerises.
🍇|grapes|raisin|A bunch of grapes.|Une grappe de raisin.
🍉|watermelon|pastèque|Watermelon in summer.|De la pastèque en été.
🍈|melon|melon|A sweet melon.|Un melon sucré.
🍑|peach|pêche|A soft peach.|Une pêche bien mûre.
🍍|pineapple|ananas|Pineapple on pizza?|De l’ananas sur la pizza ?
🥭|mango|mangue|Mango smoothie.|Un smoothie à la mangue.
🥝|kiwi|kiwi|Kiwis are full of vitamins.|Les kiwis sont pleins de vitamines.
🥥|coconut|noix de coco|Coconut milk.|Du lait de coco.
🫐|blueberry|myrtille|Blueberry muffins.|Des muffins aux myrtilles.
🍑|apricot|abricot|Apricot jam.|De la confiture d’abricots.
🟣|plum|prune|A ripe plum.|Une prune mûre.
🫐|raspberry|framboise|Raspberries are red.|Les framboises sont rouges.
🍈|lime|citron vert|Lime and mint.|Citron vert et menthe.
🍎|fig|figue|Fresh figs.|Des figues fraîches.
🥑|avocado|avocat|Avocado toast.|Une tartine d’avocat.
🌰|nut|noix / fruit à coque|I'm allergic to nuts.|Je suis allergique aux fruits à coque.
🥜|peanut|cacahuète|Peanut butter.|Du beurre de cacahuète.
🌰|chestnut|châtaigne / marron|Roasted chestnuts.|Des châtaignes grillées.
🍇|raisin|raisin sec|Raisins in my cereal.|Des raisins secs dans mes céréales.
🧺|ripe|mûr|The bananas are ripe.|Les bananes sont mûres.
🍏|juicy|juteux|A juicy orange.|Une orange juteuse.
`);

V("vegetables", "Légumes", "🥕", "A1", "Manger & boire", `
🥕|carrot|carotte|Carrots are good for your eyes.|Les carottes sont bonnes pour les yeux.
🥔|potato|pomme de terre|Mashed potatoes.|De la purée de pommes de terre.
🍅|tomato|tomate|Tomato sauce.|De la sauce tomate.
🥒|cucumber|concombre|A cucumber salad.|Une salade de concombre.
🥬|lettuce|laitue / salade|Wash the lettuce.|Lave la salade.
🧅|onion|oignon|Onions make me cry.|Les oignons me font pleurer.
🧄|garlic|ail|Garlic bread.|Du pain à l’ail.
🌽|corn|maïs|Corn on the cob.|Un épi de maïs.
🥦|broccoli|brocoli|Eat your broccoli!|Mange ton brocoli !
🫑|pepper|poivron|A red pepper.|Un poivron rouge.
🌶️|chilli|piment|This chilli is hot!|Ce piment est fort !
🍆|aubergine / eggplant|aubergine|Grilled aubergine.|De l’aubergine grillée.
🥒|courgette / zucchini|courgette|Courgette soup.|Une soupe de courgettes.
🍄|mushroom|champignon|Mushroom risotto.|Un risotto aux champignons.
🫛|peas|petits pois|Peas and carrots.|Petits pois carottes.
🫘|beans|haricots|Baked beans on toast.|Des haricots sur du pain grillé.
🥬|cabbage|chou|Red cabbage.|Du chou rouge.
🥬|spinach|épinards|Popeye eats spinach.|Popeye mange des épinards.
🟠|pumpkin|citrouille|Pumpkin soup.|Une soupe à la citrouille.
🥗|salad|salade (plat)|A green salad.|Une salade verte.
🌿|celery|céleri|A stick of celery.|Une branche de céleri.
🥬|leek|poireau|Leek and potato soup.|Une soupe poireaux-pommes de terre.
🟣|beetroot|betterave|Beetroot is purple.|La betterave est violette.
🌱|herbs|herbes aromatiques|Fresh herbs.|Des herbes fraîches.
🌿|parsley|persil|Add some parsley.|Ajoute du persil.
🍃|basil|basilic|Tomato and basil.|Tomate et basilic.
🥗|vegetarian|végétarien|I'm vegetarian.|Je suis végétarien.
🥦|vegetable|légume|Eat more vegetables.|Mange plus de légumes.
`);
