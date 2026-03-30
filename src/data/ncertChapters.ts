export type SubjectChapters = {
  [subject: string]: string[];
};

export type ClassSubjects = {
  [className: string]: SubjectChapters;
};

// Simplified but representative NCERT chapter structure for 2026-27
// Covering Classes 1 to 10 for major subjects.
export const ncertData: ClassSubjects = {
  "1": {
    "Mathematics": ["Shapes and Space", "Numbers from One to Nine", "Addition", "Subtraction", "Numbers from Ten to Twenty", "Time", "Measurement", "Data Handling", "Patterns"],
    "English": ["A Happy Child", "Three Little Pigs", "The Bubble, the Straw and the Shoe", "One Little Kitten", "Lalu and Peelu", "Once I Saw a Little Bird", "Mittu and the Yellow Mango", "Merry Go Round", "Circle"],
    "Hindi": ["झूला", "आम की कहानी", "पत्ते ही पत्ते", "पकौड़ी", "रसोईघर", "चूहो! म्याऊँ सो रही है", "बंदर और गिलहरी", "पतंग", "गेंद-बल्ला"]
  },
  "2": {
    "Mathematics": ["What is Long, What is Round?", "Counting in Groups", "How Much Can You Carry?", "Counting in Tens", "Patterns", "Footprints", "Jugs and Mugs", "Tens and Ones", "My Funday"],
    "English": ["First Day at School", "Haldi's Adventure", "I am Lucky!", "I Want", "A Smile", "The Wind and the Sun", "Rain", "Storm in the Garden", "Zoo Manners", "Funny Bunny"],
    "Hindi": ["ऊँट चला", "भालू ने खेली फुटबॉल", "म्याऊँ, म्याऊँ !!", "अधिक बलवान कौन?", "दोस्त की मदद", "बहुत हुआ", "मेरी किताब", "तितली और कली", "बुलबुल"]
  },
  "3": {
    "Mathematics": ["Where to Look From", "Fun with Numbers", "Give and Take", "Long and Short", "Shapes and Designs", "Fun with Give and Take", "Time Goes On", "Who is Heavier?", "How Many Times?", "Play with Patterns", "Jugs and Mugs", "Can We Share?", "Smart Charts!", "Rupees and Paise"],
    "Science": ["Poonam's Day Out", "The Plant Fairy", "Water O' Water!", "Our First School", "Chhotu's House", "Foods We Eat", "Saying without Speaking", "Flying High", "It's Raining", "What is Cooking", "From Here to There", "Work We Do", "Sharing Our Feelings", "The Story of Food", "Making Pots", "Games We Play"],
    "English": ["Good Morning", "The Magic Garden", "Bird Talk", "Nina and the Baby Sparrows", "Little by Little", "The Enormous Turnip", "Sea Song", "A Little Fish Story", "The Balloon Man", "The Yellow Butterfly", "Trains", "The Story of the Road"],
    "Hindi": ["कक्कू", "शेखीबाज़ मक्खी", "चाँद वाली अम्मा", "मन करता है", "बहादुर बित्तो", "हमसे सब कहते", "टिपटिपवा", "बंदर बाँट", "कब आऊँ", "क्योंजीमल और कैसे-कैसलिया"]
  },
  "4": {
    "Mathematics": ["Building with Bricks", "Long and Short", "A Trip to Bhopal", "Tick-Tick-Tick", "The Way The World Looks", "The Junk Seller", "Jugs and Mugs", "Carts and Wheels", "Halves and Quarters", "Play with Patterns", "Tables and Shares", "How Heavy? How Light?", "A Field and Fences", "Smart Charts"],
    "Science": ["Going to School", "Ear to Ear", "A Day with Nandu", "The Story of Amrita", "Anita and the Honeybees", "Omana's Journey", "From the Window", "Reaching Grandmother's House", "Changing Families", "Hu Tu Tu, Hu Tu Tu", "The Valley of Flowers", "Changing Times", "A River's Tale", "Basva's Farm", "From Market to Home", "A Busy Month"],
    "English": ["Wake Up!", "Neha's Alarm Clock", "Noses", "The Little Fir Tree", "Run!", "Nasruddin's Aim", "Why?", "Alice in Wonderland", "Don't be Afraid of the Dark", "Helen Keller", "The Donkey", "I had a Little Pony", "The Milkman's Cow", "Hiawatha", "The Scholar's Mother Tongue"],
    "Hindi": ["मन के भोले-भाले बादल", "जैसा सवाल वैसा जवाब", "किरमिच की गेंद", "पापा जब बच्चे थे", "दोस्त की पोशाक", "नाव बनाओ नाव बनाओ", "दान का हिसाब", "कौन?", "स्वतंत्रता की ओर", "थप्प रोटी थप्प दाल", "पढ़क्कू की सूझ", "सुनीता की पहिया कुर्सी"]
  },
  "5": {
    "Mathematics": ["The Fish Tale", "Shapes and Angles", "How Many Squares?", "Parts and Wholes", "Does it Look the Same?", "Be My Multiple, I'll be Your Factor", "Can You See the Pattern?", "Mapping Your Way", "Boxes and Sketches", "Tenths and Hundredths", "Area and its Boundary", "Smart Charts", "Ways to Multiply and Divide", "How Big? How Heavy?"],
    "Science": ["Super Senses", "A Snake Charmer's Story", "From Tasting to Digesting", "Mangoes Round the Year", "Seeds and Seeds", "Every Drop Counts", "Experiments with Water", "A Treat for Mosquitoes", "Up You Go!", "Walls Tell Stories", "Sunita in Space", "What if it Finishes...?", "A Shelter so High!", "When the Earth Shook!", "Blow Hot, Blow Cold", "Who will do this Work?", "Across the Wall", "No Place for Us?", "A Seed tells a Farmer's Story", "Whose Forests?", "Like Father, Like Daughter"],
    "English": ["Ice-cream Man", "Wonderful Waste!", "Teamwork", "Flying Together", "My Shadow", "Robinson Crusoe Discovers a footprint", "Crying", "My Elder Brother", "The Lazy Frog", "Rip Van Winkle", "Class Discussion", "The Talkative Barber", "Topsy-turvy Land", "Gulliver's Travels"],
    "Hindi": ["राख की रस्सी", "फसलों के त्योहार", "खिलौनेवाला", "नन्हा फ़नकार", "जहाँ चाह वहाँ राह", "चिट्ठी का सफ़र", "डाकिए की कहानी, कँवरसिंह की ज़ुबानी", "वे दिन भी क्या दिन थे", "एक माँ की बेबसी", "एक दिन की बादशाहत", "चावल की रोटियाँ", "गुरु और चेला", "स्वामी की दादी"]
  },
  "6": {
    "Mathematics": ["Knowing Our Numbers", "Whole Numbers", "Playing with Numbers", "Basic Geometrical Ideas", "Understanding Elementary Shapes", "Integers", "Fractions", "Decimals", "Data Handling", "Mensuration", "Algebra", "Ratio and Proportion", "Symmetry", "Practical Geometry"],
    "Science": ["Food: Where Does It Come From?", "Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "Getting to Know Plants", "Body Movements", "The Living Organisms and Their Surroundings", "Motion and Measurement of Distances", "Light, Shadows and Reflections", "Electricity and Circuits", "Fun with Magnets", "Water", "Air Around Us", "Garbage In, Garbage Out"],
    "English": ["Who Did Patrick's Homework?", "A House, A Home", "How the Dog Found Himself a New Master!", "The Kite", "Taro's Reward", "The Quarrel", "An Indian-American Woman in Space: Kalpana Chawla", "Beauty", "A Different Kind of School", "Where Do All the Teachers Go?", "Who I Am", "The Wonderful Words", "Fair Play", "A Game of Chance", "Vocation", "Desert Animals", "Whatif", "The Banyan Tree"],
    "Hindi": ["वह चिड़िया जो", "बचपन", "नादान दोस्त", "चाँद से थोड़ी-सी गप्पें", "अक्षरों का महत्व", "पार नज़र के", "साथी हाथ बढ़ाना", "ऐसे-ऐसे", "टिकट अलबम", "झाँसी की रानी", "जो देखकर भी नहीं देखते", "संसार पुस्तक है", "मैं सबसे छोटी होऊँ", "लोकगीत", "नौकर", "वन के मार्ग में", "साँस-साँस में बाँस"],
    "Social Science": ["What, Where, How and When?", "From Hunting-Gathering to Growing Food", "In the Earliest Cities", "What Books and Burials Tell Us", "Kingdoms, Kings and an Early Republic", "New Questions and Ideas", "Ashoka, The Emperor Who Gave Up War", "Vital Villages, Thriving Towns", "Traders, Kings and Pilgrims", "New Empires and Kingdoms", "Buildings, Paintings and Books"],
    "Sanskrit": ["शब्दपरिचयः - १", "शब्दपरिचयः - २", "शब्दपरिचयः - ३", "विद्यालयः", "वृक्षाः", "समुद्रतटः", "बकस्य प्रतीकारः", "सूक्तिस्तबकः", "क्रीडास्पर्धा", "कृषिकाः कर्मवीराः", "पुष्पोत्सवः", "दशमः त्वम् असि", "विमानयानं रचयाम", "अहह आः च", "मातुलचन्द्र"]
  },
  "7": {
    "Mathematics": ["Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Practical Geometry", "Perimeter and Area", "Algebraic Expressions", "Exponents and Powers", "Symmetry", "Visualising Solid Shapes"],
    "Science": ["Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations of Animals to Climate", "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms", "Transportation in Animals and Plants", "Reproduction in Plants", "Motion and Time", "Electric Current and its Effects", "Light", "Water: A Precious Resource", "Forests: Our Lifeline", "Wastewater Story"],
    "English": ["Three Questions", "The Squirrel", "A Gift of Chappals", "The Rebel", "Gopal and the Hilsa Fish", "The Shed", "The Ashes That Made Trees Bloom", "Chivvy", "Quality", "Trees", "Expert Detectives", "Mystery of the Talking Fan", "The Invention of Vita-Wonk", "Dad and the Cat and the Tree", "Fire: Friend and Foe", "Meadow Surprises", "A Bicycle in Good Repair", "Garden Snake", "The Story of Cricket"],
    "Hindi": ["हम पंछी उन्मुक्त गगन के", "दादी माँ", "हिमालय की बेटियाँ", "कठपुतली", "मिठाईवाला", "रक्त और हमारा शरीर", "पापा खो गए", "शाम-एक किसान", "चिड़िया की बच्ची", "अपूर्व अनुभव", "रहीम के दोहे", "कंचा", "एक तिनका", "खानपान की बदलती तस्वीर", "नीलकंठ", "भोर और बरखा", "वीर कुँवर सिंह", "संघर्ष के कारण मैं तुनुकमिज़ाज हो गया: धनराज", "आश्रम का अनुमानित व्यय"],
    "Social Science": ["Tracing Changes Through A Thousand Years", "New Kings and Kingdoms", "The Delhi Sultans", "The Mughal Empire", "Rulers and Buildings", "Towns, Traders and Craftspersons", "Tribes, Nomads and Settled Communities", "Devotional Paths to the Divine", "The Making of Regional Cultures", "Eighteenth-Century Political Formations"],
    "Sanskrit": ["सुभाषितानि", "दुर्बुद्धिः विनश्यति", "स्वावलम्बनम्", "पण्डिता रमाबाई", "सदाचारः", "सङ्कल्पः सिद्धिदायकः", "त्रिवर्णः ध्वजः", "अहमपि विद्यालयं गमिष्यामि", "विश्वबन्धुत्वम्", "समवायो हि दुर्जयः", "विद्याधनम्", "अमृतं संस्कृतम्", "अनारिकायाः जिज्ञासा", "लालगीतम्"]
  },
  "8": {
    "Mathematics": ["Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions and Identities", "Visualising Solid Shapes", "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions", "Factorisation", "Introduction to Graphs", "Playing with Numbers"],
    "Science": ["Crop Production and Management", "Microorganisms: Friend and Foe", "Synthetic Fibres and Plastics", "Materials: Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame", "Conservation of Plants and Animals", "Cell — Structure and Functions", "Reproduction in Animals", "Reaching the Age of Adolescence", "Force and Pressure", "Friction", "Sound", "Chemical Effects of Electric Current", "Some Natural Phenomena", "Light", "Stars and the Solar System", "Pollution of Air and Water"],
    "English": ["The Best Christmas Present in the World", "The Ant and the Cricket", "The Tsunami", "Geography Lesson", "Glimpses of the Past", "Macavity: The Mystery Cat", "Bepin Choudhury's Lapse of Memory", "The Last Bargain", "The Summit Within", "The School Boy", "This is Jody's Fawn", "The Duck and the Kangaroo", "A Visit to Cambridge", "When I set out for Lyonnesse", "A Short Monsoon Diary", "On the Grasshopper and Cricket", "The Great Stone Face-I", "The Great Stone Face-II"],
    "Hindi": ["ध्वनि", "लाख की चूड़ियाँ", "बस की यात्रा", "दीवानों की हस्ती", "चिट्ठियों की अनूठी दुनिया", "भगवान के डाकिए", "क्या निराश हुआ जाए", "यह सबसे कठिन समय नहीं", "कबीर की साखियाँ", "कामचोर", "जब सिनेमा ने बोलना सीखा", "सुदामा चरित", "जहाँ पहिया है", "अकबरी लोटा", "सूर के पद", "पानी की कहानी", "बाज और साँप", "टोपी"],
    "Social Science": ["How, When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals, Dikus and the Vision of a Golden Age", "When People Rebel", "Colonialism and the City", "Weavers, Iron Smelters and Factory Owners", "Civilising the Native, Educating the Nation", "Women, Caste and Reform", "The Changing World of Visual Arts", "The Making of the National Movement: 1870s-1947", "India After Independence"],
    "Sanskrit": ["सुभाषितानि", "बिलस्य वाणी न कदापि मे श्रुता", "डिजीभारतम्", "सदैव पुरतो निधेहि चरणम्", "कण्टकेनैव कण्टकम्", "गृहं शून्यं सुतां विना", "भारतजनताऽहम्", "संसारसागरस्य नायकाः", "सप्तभगिन्यः", "नीतिनवनीतम्", "सावित्रीबाई फुले", "कः रक्षति कः रक्षितः", "क्षितौ राजते भारतस्वर्णभूमिः", "आर्यभटः", "प्रहेलिकाः"]
  },
  "9": {
    "Mathematics": ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles", "Constructions", "Heron's Formula", "Surface Areas and Volumes", "Statistics", "Probability"],
    "Science": ["Matter in Our Surroundings", "Is Matter Around Us Pure?", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", "Why Do We Fall Ill?", "Natural Resources", "Improvement in Food Resources"],
    "English": ["The Fun They Had", "The Road Not Taken", "The Sound of Music", "Wind", "The Little Girl", "Rain on the Roof", "A Truly Beautiful Mind", "The Lake Isle of Innisfree", "The Snake and the Mirror", "A Legend of the Northland", "My Childhood", "No Men Are Foreign", "Packing", "The Duck and the Kangaroo", "Reach for the Top", "On Killing a Tree", "The Bond of Love", "The Snake Trying", "Kathmandu", "A Slumber Did My Spirit Seal", "If I Were You"],
    "Hindi": ["दो बैलों की कथा", "ल्हासा की ओर", "उपभोक्तावाद की संस्कृति", "साँवले सपनों की याद", "नाना साहब की पुत्री देवी मैना को भस्म कर दिया गया", "प्रेमचंद के फटे जूते", "मेरे बचपन के दिन", "एक कुत्ता और एक मैना", "साखियाँ एवं सबद", "वाख", "सवैये", "कैदी और कोकिला", "ग्राम श्री", "चंद्र गहना से लौटती बेर", "मेघ आए", "यमराज की दिशा", "बच्चे काम पर जा रहे हैं"],
    "Social Science": ["The French Revolution", "Socialism in Europe and the Russian Revolution", "Nazism and the Rise of Hitler", "Forest Society and Colonialism", "Pastoralists in the Modern World", "Peasants and Farmers", "History and Sport: The Story of Cricket", "Clothing: A Social History"],
    "Sanskrit": ["भारतीवसन्तगीतिः", "स्वर्णकाकः", "गोदोहनम्", "कल्पतरुः", "सूक्तिमौक्तिकम्", "भ्रान्तो बालः", "प्रत्यभिज्ञानम्", "लौहतुला", "सिकतासेतुः", "जटायोः शौर्यम्", "पर्यावरणम्", "वाङ्मनःप्राणस्वरूपम्"]
  },
  "10": {
    "Mathematics": ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"],
    "Science": ["Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and its Compounds", "Periodic Classification of Elements", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Light - Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy", "Our Environment", "Sustainable Management of Natural Resources"],
    "English": ["A Letter to God", "Dust of Snow", "Fire and Ice", "Nelson Mandela: Long Walk to Freedom", "A Tiger in the Zoo", "Two Stories about Flying", "How to Tell Wild Animals", "The Ball Poem", "From the Diary of Anne Frank", "Amanda!", "The Hundred Dresses - I", "The Hundred Dresses - II", "Animals", "Glimpses of India", "The Trees", "Mijbil the Otter", "Fog", "Madam Rides the Bus", "The Tale of Custard the Dragon", "The Sermon at Benares", "For Anne Gregory", "The Proposal"],
    "Hindi": ["सूरदास के पद", "राम-लक्ष्मण-परशुराम संवाद", "सवैया और कवित्त", "आत्मकथ्य", "उत्साह और अट नहीं रही है", "यह दंतुरित मुसकान और फसल", "छाया मत छूना", "कन्यादान", "संगतकार", "नेताजी का चश्मा", "बालगोबिन भगत", "लखनवी अंदाज़", "मानवीय करुणा की दिव्या चमक", "एक कहानी यह भी", "स्त्री शिक्षा के विरोधी कुतर्कों का खंडन", "नौबतखाने में इबादत", "संस्कृति"],
    "Social Science": ["The Rise of Nationalism in Europe", "The Nationalist Movement in Indo-China", "Nationalism in India", "The Making of a Global World", "The Age of Industrialisation", "Work, Life and Leisure", "Print Culture and the Modern World", "Novels, Society and History"],
    "Sanskrit": ["शुचिपर्यावरणम्", "बुद्धिर्बलवती सदा", "व्यायामः सर्वदा पथ्यः", "शिशुलालनम्", "जननी तुल्यवत्सला", "सुभाषितानि", "सौहार्दं प्रकृतेः शोभा", "विचित्रः साक्षी", "सूक्तयः", "भूकम्पविभीषिका", "प्राणेभ्योऽपि प्रियः सुहृद्", "अन्योक्तयः"]
  }
};

export const getSubjectsForClass = (className: string): string[] => {
  return ncertData[className] ? Object.keys(ncertData[className]) : [];
};

export const getChaptersForSubject = (className: string, subject: string): string[] => {
  if (ncertData[className] && ncertData[className][subject]) {
    return ncertData[className][subject];
  }
  return [];
};
