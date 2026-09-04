import { 
  MinistryProgram, 
  SermonTeaching, 
  EventItem, 
  GalleryPhoto, 
  DonationFund, 
  PrayerRequest, 
  Testimonial,
  AnnouncementItem
} from '../types';

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    highlight: 'Upcoming Gathering',
    text: 'Divine Transformation Annual Conference 2026 — Join Ella Ruth in Columbia, MS!',
    linkTab: 'events',
    date: 'Spring 2026',
    active: true
  },
  {
    id: 'ann-2',
    highlight: 'Church Fellowship',
    text: 'Join Ella Ruth this Sunday at Safe Haven Ministries for 10:00 AM Worship Service!',
    linkTab: 'ministry',
    date: 'Sundays',
    active: true
  }
];

export const MINISTRY_PROGRAMS: MinistryProgram[] = [
  {
    id: 'prison-reentry',
    title: 'Prison & Re-Entry Ministry',
    badge: 'Hope Restored',
    shortDesc: 'Promoting spiritual transformation and transitional life services for the incarcerated and former inmates.',
    fullDesc: 'Since 2001, Safe Haven Out Reach Ministries has regularly crossed correctional facility thresholds to preach restoration, mentor inmates before release, and provide compassionate reentry wrap-around support for returning citizens and their families.',
    icon: 'KeyRound',
    image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=900&auto=format&fit=crop',
    impactHighlight: '450+ Returning citizens walked with through transition, housing referrals, and faith mentorship.',
    keyServices: [
      'In-facility spiritual services & biblically based life classes',
      'One-on-one mentorship for returning citizens in Marion County & beyond',
      'Family reunification support and emergency basic needs vouchers',
      'Employment readiness and dignity restoration workshops'
    ],
    location: 'Columbia, MS & Regional Correctional Facilities'
  },
  {
    id: 'homeless-outreach',
    title: 'Homeless & Compassionate Relief',
    badge: 'Emergency Support',
    shortDesc: 'Meeting immediate physical needs with hot meals, hygiene packs, warm blankets, and housing guidance.',
    fullDesc: 'No person is invisible in God\'s kingdom. Safe Haven mobilizes street outreach teams to deliver hot meals, bottled water, weather-appropriate blankets, hygiene essentials, and personal prayer directly to vulnerable individuals experiencing homelessness.',
    icon: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=900&auto=format&fit=crop',
    impactHighlight: 'Hundreds of emergency relief packages and cold-weather gear distributed every winter season.',
    keyServices: [
      'Weekly street hot meal and hydration distributions',
      'Winter weather care kits (blankets, socks, thermal gear)',
      'Hygiene care packs with toiletries and clean essentials',
      'Shelter referral and emergency lodging assistance'
    ],
    location: 'Columbia, MS & surrounding rural communities'
  },
  {
    id: 'youth-advancement',
    title: 'Youth & Children’s Empowerment',
    badge: 'Next Generation',
    shortDesc: 'Cultivating spiritual confidence, scholastic encouragement, and leadership through youth rallies and mentoring.',
    fullDesc: 'Our signature purple-shirted youth teams gather for energetic leadership rallies, scholastic tutoring, character development, and music ministry. We believe in elevating our children early so they never doubt their divine destiny.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=900&auto=format&fit=crop',
    impactHighlight: 'Annual youth back-to-school drives supplying over 300 students with backpacks and uniforms.',
    keyServices: [
      'Safe Haven Youth Fellowship rallies and spiritual empowerment',
      'Back-to-School supply drives and scholastic mentorship',
      'Youth praise team, performing arts, and community service projects',
      'Safe recreation nights and wholesome family fellowship'
    ],
    location: 'Safe Haven Youth Center & Partner Churches'
  },
  {
    id: 'community-dinners',
    title: 'Community Banquets & Fellowship Dinners',
    badge: 'Gathering In Love',
    shortDesc: 'Bringing seniors, families, and neighbors to elegant royal blue-and-gold tables for free banquets of joy.',
    fullDesc: 'Ella Ruth believes that breaking bread together heals community fractures. Safe Haven’s signature banquets feature royal blue linens, golden centerpieces, hot Southern feasts, and honors for community elders, veterans, and youth scholars.',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop',
    impactHighlight: '12,000+ free hot, dignified banquet meals served across Mississippi since 2001.',
    keyServices: [
      'Annual 501(c)(3) Ministry Gala and Senior Honor Banquets',
      'Sacred Thanksgiving community feasts where all are welcomed as family',
      'Holiday food hamper distributions for low-income households',
      'Intergenerational storytelling and community fellowship hours'
    ],
    location: 'Columbia Civic & Community Fellowship Halls'
  },
  {
    id: 'mombasa-kenya',
    title: 'Mombasa, Kenya Children’s Centre',
    badge: 'Global Mission',
    shortDesc: 'Extending Safe Haven’s hands across the Atlantic to support orphaned and vulnerable youth in coastal Kenya.',
    fullDesc: 'What began as a prompt from the Holy Spirit grew into an international bridge of compassion. Safe Haven partners directly with grassroots leadership in Mombasa to fund daily hot school lunches, clean water reserves, and classroom supplies for children.',
    icon: 'Globe2',
    image: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?q=80&w=900&auto=format&fit=crop',
    impactHighlight: 'Supporting education, daily nutrition, and health check-ups for over 80 children in Mombasa.',
    keyServices: [
      'Daily hot lunch sponsorship for vulnerable schoolchildren',
      'Textbooks, uniforms, and classroom learning materials',
      'Clean drinking water filtration systems and sanitation support',
      'Direct pastor-to-pastor missionary collaboration and prayer network'
    ],
    location: 'Mombasa, Coast Province, Kenya'
  }
];

export const SERMON_TEACHINGS: SermonTeaching[] = [
  {
    id: 'sermon-1',
    title: 'You Shall Know the Truth About Healing and Life',
    scripture: 'John 8:32 & 3 John 1:2',
    series: 'Divine Transformation Series',
    date: 'Recent Conference Message',
    duration: '42 min',
    summary: 'Ella Ruth explores how sickness, emotional weariness, and spiritual defeat lose their authority when believers realize God desires wholeness in body, mind, and spirit. Longevity begins in the renewed mind.',
    corePoints: [
      'Healing is not a distant wish; it is God’s covenant promise for today.',
      'How unforgiveness and hidden bitterness act as physical toxins in the body.',
      'Speaking life-giving words over your cells, joints, and organs every morning.',
      'Practical alignment: pairing fervent faith with intentional hydration and bodily stewardship.'
    ],
    reflectionPrayer: 'Lord, make me whole. I surrender every spirit of infirmity and doubt. Renew my youth like the eagle\'s, and grant me strength to run this race with joy and endurance.',
    featuredQuote: '“Do not let anyone convince you that getting older means you must settle for sick and weary. God\'s breath inside you is youthful!”',
    audioPreviewAvailable: true
  },
  {
    id: 'sermon-2',
    title: 'Forgiveness: The Sacred Restoration of Relationships',
    scripture: 'Colossians 3:13 & Matthew 6:14-15',
    series: 'Heart of Ministry',
    date: 'United Christian Baptist Church Teaching',
    duration: '38 min',
    summary: 'A deeply personal sermon on the freedom that comes from releasing debts. Drawing from decades of prison ministry and family reconciliation, Ella Ruth demonstrates that forgiveness does not make you weak — it makes you untamable.',
    corePoints: [
      'The poison of the grudge: why staying bitter only hurts the vessel carrying it.',
      'Forgiving the incarcerated and rebuilding fractured family trees.',
      'Reconciliation vs. boundaries: how to forgive without returning to harm.',
      'The spiritual breakthrough waiting on the other side of your “I let it go.”'
    ],
    reflectionPrayer: 'Heavenly Father, where my heart has hardened, soften it with Your grace. I release those who wounded me into Your hands, that I may walk in unhindered peace.',
    featuredQuote: '“Unforgiveness is drinking poison and expecting someone else to suffer. Open your hands today and live free.”',
    audioPreviewAvailable: true
  },
  {
    id: 'sermon-3',
    title: 'Revealing the Unshakable Nature of God\'s Love',
    scripture: 'Romans 8:38-39 & Lamentations 3:22-23',
    series: 'Divine Transformation Conference',
    date: 'Annual Conference Keynote',
    duration: '51 min',
    summary: 'Neither prison walls, poverty, homelessness, nor years of missteps can sever God’s love for you. Ella Ruth shares moving testimonies from Safe Haven’s 23 years on the frontlines of Marion County.',
    corePoints: [
      'Why God runs to the marginalized, the rejected, and the forgotten.',
      'Overcoming shame: the blood of Jesus covers every chapter of your past.',
      'Becoming an instrument of that same unfailing love in your hometown.',
      'Walking in the confidence of a daughter or son of the Most High.'
    ],
    reflectionPrayer: 'Abba Father, thank You that Your mercies are brand new this morning. Ground me in Your love so firmly that fear can find no room in my thoughts.',
    featuredQuote: '“If God can take an 85-year-old girl from Mississippi and send love all the way to Mombasa, He has not given up on you!”',
    audioPreviewAvailable: true
  },
  {
    id: 'sermon-4',
    title: 'Walking in Deliverance: Breaking Generational Stagnation',
    scripture: 'Galatians 5:1 & Isaiah 61:1',
    series: 'Deliverance & Freedom',
    date: 'Safe Haven Revival Night',
    duration: '45 min',
    summary: 'Breaking repetitive cycles of poverty, addiction, and spiritual apathy. An urgent call to the modern church to step out of passivity and walk in apostolic boldness.',
    corePoints: [
      'Identifying generational snares before they pass to your children.',
      'The authority of the believer\'s voice in prayer.',
      'Practical tools for maintaining deliverance through daily habits and godly community.',
      'Surrounding your family in a fortress of scripture and praise.'
    ],
    reflectionPrayer: 'Lord, shatter every chain that held my ancestors. I declare freedom, clarity, and holy boldness over my household from this day forward.',
    featuredQuote: '“Deliverance is not just getting free; it is staying free by loving righteousness and living with holy purpose.”',
    audioPreviewAvailable: true
  },
  {
    id: 'sermon-5',
    title: 'Wisdom at 85: The Miracle of a Faithful Mind & Body',
    scripture: 'Isaiah 40:29-31 & Psalm 92:14',
    series: 'Wisdom in Motion',
    date: 'Special Longevity Masterclass',
    duration: '35 min',
    summary: 'The intersection of Ella Ruth’s three callings: preacher, coach, and servant-leader. How to eat, pray, move, and laugh every single day so your 80s feel like your prime.',
    corePoints: [
      'They that wait upon the Lord shall renew their strength: what waiting really means.',
      'Treating your temple as holy ground: nutrition and water as acts of worship.',
      'The power of daily movement: why Ella Ruth never sits down for long.',
      'Joy is a medicine with zero harmful side effects.'
    ],
    reflectionPrayer: 'Lord, give me stamina. Teach me to care for my physical temple so I can serve Your kingdom with energy, brightness, and a cheerful heart.',
    featuredQuote: '“I am 85 years young, and I challenge you: don’t you dare count yourself out while God is still writing your story!”',
    audioPreviewAvailable: true
  }
];

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Divine Transformation Annual Conference 2026',
    category: 'Conference',
    date: 'May 15–17, 2026',
    time: 'Friday 6:00 PM – Sunday 2:00 PM',
    location: 'Columbia Civic Center Auditorium, Columbia, MS',
    description: 'Three transformative days of Holy Spirit-led preaching, healing & deliverance ministry, dynamic worship, breakout wellness workshops, and community ordination celebrations with Ella Ruth Johnson and guest speakers.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=900&auto=format&fit=crop',
    isUpcoming: true,
    registrationRequired: true,
    attendeesCount: 280
  },
  {
    id: 'evt-2',
    title: 'Safe Haven Annual Senior & Community Honor Banquet',
    category: 'Community Dinner',
    date: 'June 20, 2026',
    time: '5:30 PM – 8:30 PM',
    location: 'Grand Fellowship Hall, Columbia, MS',
    description: 'An elegant royal blue-and-gold banquet celebrating our elders, volunteers, and reentry graduates. Featuring a 4-course hot dinner, live gospel choir, awards presentation, and ministry keynote.',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=900&auto=format&fit=crop',
    isUpcoming: true,
    registrationRequired: true,
    attendeesCount: 350
  },
  {
    id: 'evt-3',
    title: '85-Years-Young: Women’s Longevity & Vitality Walk',
    category: 'Outreach',
    date: 'July 11, 2026',
    time: '8:00 AM – 10:30 AM',
    location: 'Marion County Recreation Trail & Park Pavilions, Columbia, MS',
    description: 'Join Coach Ella Ruth for an uplifting 1-mile community walk, followed by fresh fruit smoothies, blood pressure & wellness screenings, and Ella Ruth’s coaching challenge on living vibrantly at any age.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=900&auto=format&fit=crop',
    isUpcoming: true,
    registrationRequired: false,
    attendeesCount: 120
  },
  {
    id: 'evt-4',
    title: 'Purple Shirts Youth Summer Empowerment Summit',
    category: 'Youth & Family',
    date: 'August 1, 2026',
    time: '10:00 AM – 3:00 PM',
    location: 'Safe Haven Youth Pavilion, Columbia, MS',
    description: 'Scholastic tutoring, back-to-school backpack giveaways, musical praise breakout, and mentorship panels for young men and women preparing for the upcoming school year.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=900&auto=format&fit=crop',
    isUpcoming: true,
    registrationRequired: true,
    attendeesCount: 160
  }
];

export const PAST_EVENTS_RECAP = [
  {
    id: 'past-1',
    title: '25th Anniversary Ministry Jubilee & Royal Blue Banquet',
    date: 'Autumn Celebration',
    recapNotes: 'Over 320 attendees gathered in royal blue and gold to celebrate decades of grassroots ministry in Columbia. Twelve returning citizens were honored with new vocational toolkits, and $14,000 was raised for our Mombasa school lunch program.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'past-2',
    title: 'Divine Transformation Conference 2025: "Arise & Flourish"',
    date: 'Spring 2025',
    recapNotes: 'A glorious gathering of women from across Mississippi, Alabama, and Louisiana. Over 40 women committed to holistic wellness routines, and dozens received hands-on prayer for physical and emotional healing.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'past-3',
    title: 'Sacred Thanksgiving Fellowship & Hamper Distribution',
    date: 'November 2025',
    recapNotes: 'Thanksgiving is sacred to Ella Ruth. 480 holiday meals were served hot, and 120 full grocery boxes were delivered to families, disabled seniors, and shelters across Marion County.',
    image: 'https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=800&auto=format&fit=crop'
  }
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // ── FAMILY & CELEBRATIONS ──────────────────────────────────────────────────
  {
    id: 'gal-f1',
    url: '/gallery/Good memories!.jpg',
    caption: 'Good memories cherished with loved ones — a tapestry of laughter, love, and life\'s most precious milestones.',
    album: 'family',
    tag: 'Memories',
    dateStr: 'Family Time',
    featured: true
  },
  {
    id: 'gal-f2',
    url: '/gallery/Family is very special to us!.jpg',
    caption: 'Family is the cornerstone of everything. Ella Ruth has always held her loved ones close, pouring into each generation with intention and grace.',
    album: 'family',
    tag: 'Family',
    dateStr: 'Family Gathering'
  },
  {
    id: 'gal-f3',
    url: '/gallery/My children. I love these people!.jpg',
    caption: '"My children — I love these people!" A mother\'s heart overflows with pride and joy for the remarkable lives she\'s shaped.',
    album: 'family',
    tag: 'Children',
    dateStr: 'Family Portrait',
    featured: true
  },
  {
    id: 'gal-f4',
    url: '/gallery/My two sons and daughter on Mother\'s Day. I love family life!.jpg',
    caption: 'A precious Mother\'s Day portrait with her two sons and daughter — a testament to a life built on love and intentional parenting.',
    album: 'family',
    tag: "Mother's Day",
    dateStr: "Mother's Day"
  },
  {
    id: 'gal-f5',
    url: '/gallery/Happy to celebrate daughters day! Love my girls!.jpg',
    caption: 'Celebrating Daughters\' Day with pure joy! Ella Ruth\'s love for her girls is boundless — she is their greatest encourager.',
    album: 'family',
    tag: 'Daughters',
    dateStr: "Daughters' Day"
  },
  {
    id: 'gal-f6',
    url: '/gallery/My Sister and I after lunch. We enjoyed ourselves together..jpg',
    caption: 'A beautiful afternoon shared with her sister over lunch — proof that sibling bonds only grow sweeter with time.',
    album: 'family',
    tag: 'Sisterhood',
    dateStr: 'Sister Lunch'
  },
  {
    id: 'gal-f7',
    url: '/gallery/my children, Sunday evening at my granddaughter and grandson\'s home..jpg',
    caption: 'A warm Sunday evening gathered at her grandchildren\'s home — the kind of multi-generational love story that blesses everyone at the table.',
    album: 'family',
    tag: 'Sunday Family',
    dateStr: 'Sunday Evening'
  },
  // ── BIRTHDAYS & MILESTONES ────────────────────────────────────────────────
  {
    id: 'gal-b1',
    url: '/gallery/I am so thankful to God for the years that I have lived. I am grateful for the years ahead. my 85th birthday.jpg',
    caption: '"I am so thankful to God for the years that I have lived and grateful for the years ahead." — Ella Ruth celebrates her glorious 85th birthday, still vibrant, still full of purpose.',
    album: 'milestones',
    tag: '85th Birthday',
    dateStr: '85th Birthday',
    featured: true
  },
  {
    id: 'gal-b2',
    url: '/gallery/Still happy at age 84!.jpg',
    caption: 'Still radiant and deeply happy at age 84 — living proof that joy is a medicine that never expires.',
    album: 'milestones',
    tag: 'Age 84',
    dateStr: '84th Birthday'
  },
  {
    id: 'gal-b3',
    url: '/gallery/You can flourish at age 82.jpg',
    caption: '"You can flourish at age 82!" Ella Ruth shows the world that vitality has no expiry date — thriving beautifully at 82.',
    album: 'milestones',
    tag: 'Age 82',
    dateStr: '82nd Birthday'
  },
  {
    id: 'gal-b4',
    url: '/gallery/This is me at 11 pm on my 83rd birthday. After lunch with my Sisters, nieces, nephew, Son and Daughter at the Magnolia Grill. NAACP Banquet and cooking dinner for tomorrow..jpg',
    caption: 'The unstoppable Ella Ruth at 11 PM on her 83rd birthday — after a full day of family lunch at Magnolia Grill, the NAACP Banquet, and still preparing dinner for the next day!',
    album: 'milestones',
    tag: '83rd Birthday',
    dateStr: '83rd Birthday'
  },
  {
    id: 'gal-b5',
    url: '/gallery/Saturday. Birthday Luncheon party! Thanks to my niece Linda for treating me with lunch..jpg',
    caption: 'A heartwarming birthday luncheon party — sincere thanks to her niece Linda for the beautiful celebration and generous treat.',
    album: 'milestones',
    tag: 'Birthday Lunch',
    dateStr: 'Birthday Celebration'
  },
  // ── GRANDCHILDREN & GREAT-GRANDCHILDREN ──────────────────────────────────
  {
    id: 'gal-g1',
    url: '/gallery/Great grand children.jpg',
    caption: 'Her great-grandchildren — the 6th generation of a faith-filled family legacy. Ella Ruth\'s greatest treasure on earth.',
    album: 'grandchildren',
    tag: 'Great-Grandchildren',
    dateStr: 'Family Legacy',
    featured: true
  },
  {
    id: 'gal-g2',
    url: '/gallery/grandchildren.jpg',
    caption: 'A beautiful moment with her grandchildren — the next chapter of a family story written in love, prayer, and purpose.',
    album: 'grandchildren',
    tag: 'Grandchildren',
    dateStr: 'Grandchildren'
  },
  {
    id: 'gal-g3',
    url: '/gallery/With great grandchildren.jpg',
    caption: 'Surrounded by her great-grandchildren — laughter, hugs, and the warm legacy of a grandmother who poured everything into her family.',
    album: 'grandchildren',
    tag: 'Great-Grandchildren',
    dateStr: 'Family Time'
  },
  {
    id: 'gal-g4',
    url: '/gallery/Sharing a picture with my Great Grandchildren. 4 are absent in the picture, but present in our hearts..jpg',
    caption: '"4 are absent in the picture, but present in our hearts." A precious photo with most of her great-grandchildren — love stretches even across distance.',
    album: 'grandchildren',
    tag: 'Great-Grandchildren',
    dateStr: 'Family Portrait'
  },
  {
    id: 'gal-g5',
    url: '/gallery/So blessed to live to see the 7th generation! To God be the glory!.jpg',
    caption: '"So blessed to live to see the 7th generation! To God be the glory!" — A milestone testimony of a life well-lived and a family legacy that spans seven generations.',
    album: 'grandchildren',
    tag: '7th Generation',
    dateStr: '7th Generation',
    featured: true
  },
  {
    id: 'gal-g6',
    url: '/gallery/Beautiful Great granddaughter #5 congratulations my dearest Queen!.jpg',
    caption: 'Congratulations to her beautiful great-granddaughter #5 — her proud "dearest Queen"! Every milestone is a cause for celebration.',
    album: 'grandchildren',
    tag: 'Great-Granddaughter',
    dateStr: 'Congratulations'
  },
  {
    id: 'gal-g7',
    url: '/gallery/It was great attending my Great Granddaughters #5 graduation!.jpg',
    caption: 'Attending her great-granddaughter\'s graduation — a proud grandmother beaming with joy as a new chapter begins.',
    album: 'grandchildren',
    tag: 'Graduation',
    dateStr: 'Graduation Day'
  },
  {
    id: 'gal-g8',
    url: '/gallery/Look who is 46! Happy birthday to my Granddaughter#1! Granny loves you. You birthed some awesome, smart children! Enjoy your day!.jpg',
    caption: '"Look who is 46! Happy birthday to my Granddaughter #1! Granny loves you — you birthed some awesome, smart children. Enjoy your day!"',
    album: 'grandchildren',
    tag: 'Granddaughter Birthday',
    dateStr: 'Granddaughter #1 Birthday'
  },
  {
    id: 'gal-g9',
    url: '/gallery/Celebrating my 4th Great grandson 9th birthday. It was a joyful experience! Granny love you!.jpg',
    caption: 'Celebrating her 4th great-grandson\'s 9th birthday — a joyful experience overflowing with love! Granny loves you always.',
    album: 'grandchildren',
    tag: 'Birthday',
    dateStr: '9th Birthday'
  },
  {
    id: 'gal-g10',
    url: '/gallery/Happy birthday to my Great grandson #4! I pray that you are having a wonderful 10th birthday! Granny loves you now and always!.jpg',
    caption: '"Happy birthday to my Great-grandson #4! I pray you are having a wonderful 10th birthday — Granny loves you now and always!"',
    album: 'grandchildren',
    tag: 'Great-Grandson Birthday',
    dateStr: '10th Birthday'
  },
  {
    id: 'gal-g11',
    url: '/gallery/Sharing a photo with my Great grandson #2#Tyler Isaiah Pope#trackrunner!.jpg',
    caption: 'A proud moment with Great-grandson #2, Tyler Isaiah Pope — a gifted track runner with a bright future ahead.',
    album: 'grandchildren',
    tag: 'Great-Grandson',
    dateStr: 'Tyler Isaiah Pope'
  },
  {
    id: 'gal-g12',
    url: '/gallery/My granddaughter\'s parents and grandmother and Raeshon\'s Mother and Grandmother..jpg',
    caption: 'Three generations of family love gathered together — grandparents and grandmothers united in celebration and support.',
    album: 'grandchildren',
    tag: 'Three Generations',
    dateStr: 'Family Portrait'
  },
  // ── MOTHER & HERITAGE ────────────────────────────────────────────────────
  {
    id: 'gal-h1',
    url: '/gallery/Honoring my Mother the one who gave birth to me and nourished and cared for me. I learned so much from her, which helped to shape me into the person I am today!.jpg',
    caption: '"Honoring my Mother — the one who gave birth to me, nourished and cared for me. I learned so much from her, which helped shape me into the person I am today."',
    album: 'heritage',
    tag: 'Honoring Mother',
    dateStr: 'Heritage',
    featured: true
  },
  {
    id: 'gal-h2',
    url: '/gallery/The Seniors of the Ned Ratcliff descendants! By God\'s grace we met again!.jpg',
    caption: '"The Seniors of the Ned Ratcliff descendants — by God\'s grace we met again!" A beautiful reunion of elders carrying forward a proud family name.',
    album: 'heritage',
    tag: 'Family Reunion',
    dateStr: 'Ned Ratcliff Descendants'
  },
  {
    id: 'gal-h3',
    url: '/gallery/My family present at the Family Reunion! It was so much fun!— in Petal, MS, United States..jpg',
    caption: 'A joyful Family Reunion in Petal, MS — so much fun and so much love! The family that prays together stays together.',
    album: 'heritage',
    tag: 'Family Reunion',
    dateStr: 'Petal, MS Reunion'
  },
  {
    id: 'gal-h4',
    url: '/gallery/I was blessed to meet my Cousins for the first time! We all met in McKinney, Tx at another cousin\'s wedding..jpg',
    caption: '"I was blessed to meet my Cousins for the first time!" A divine appointment at a cousin\'s wedding in McKinney, TX — family found across the miles.',
    album: 'heritage',
    tag: 'First Meeting',
    dateStr: 'McKinney, TX'
  },
  {
    id: 'gal-h5',
    url: '/gallery/Enjoying my great and great great nephews and nieces. Dallas, TX.jpg',
    caption: 'Enjoying precious time with her great and great-great nephews and nieces in Dallas, TX — the family circle keeps growing bigger and brighter.',
    album: 'heritage',
    tag: 'Nephews & Nieces',
    dateStr: 'Dallas, TX'
  },
  {
    id: 'gal-h6',
    url: '/gallery/Happy birthday to my beautiful niece. I hope that you had a wonderful day! Love you.jpg',
    caption: '"Happy birthday to my beautiful niece — I hope you had a wonderful day! Love you." Ella Ruth\'s heart for her extended family knows no bounds.',
    album: 'heritage',
    tag: 'Niece Birthday',
    dateStr: 'Birthday Blessing'
  },
  // ── WEDDINGS & CELEBRATIONS ───────────────────────────────────────────────
  {
    id: 'gal-w1',
    url: '/gallery/A beautiful wedding and a wonderful, blessed couple!.jpg',
    caption: '"A beautiful wedding and a wonderful, blessed couple!" — Ella Ruth celebrated love and covenant with joy in her heart.',
    album: 'celebrations',
    tag: 'Wedding',
    dateStr: 'Wedding Celebration'
  },
  // ── MINISTRY & CHURCH ────────────────────────────────────────────────────
  {
    id: 'gal-m1',
    url: '/gallery/Current and some past Board members! Safe Haven celebrated 22 years of serving those in need..jpg',
    caption: 'Current and past Board members of Safe Haven Ministries — celebrating 22 remarkable years of faithfully serving those in need across Marion County.',
    album: 'ministry',
    tag: 'Safe Haven Board',
    dateStr: '22 Years of Service',
    featured: true
  },
  {
    id: 'gal-m2',
    url: '/gallery/Mothers Day family gathering at our home church. I love my family!.jpg',
    caption: 'A heartwarming Mother\'s Day family gathering at Safe Haven Ministries — "I love my family!" — celebrating both earthly family and the family of faith.',
    album: 'ministry',
    tag: "Mother's Day",
    dateStr: 'Church Gathering'
  },
  {
    id: 'gal-m3',
    url: '/gallery/Great and inspiring testimony from these Men. I pray that they will continue to lift up the name of Jesus!.jpg',
    caption: '"Great and inspiring testimony from these Men. I pray they will continue to lift up the name of Jesus!" — powerful moments of transformation and faith.',
    album: 'ministry',
    tag: 'Testimony',
    dateStr: 'Men of Faith'
  },
  {
    id: 'gal-m4',
    url: '/gallery/Love God, and love others as you love yourself! This is the key to happiness and success..jpg',
    caption: '"Love God, and love others as you love yourself — this is the key to happiness and success." A timeless truth Ella Ruth lives and teaches every day.',
    album: 'ministry',
    tag: 'Faith',
    dateStr: 'Words of Wisdom'
  },
  {
    id: 'gal-m5',
    url: '/gallery/Wow! Well stated with emphasis on the last paragraph..jpg',
    caption: '"Wow! Well stated — with emphasis on the last paragraph." Ella Ruth shares a powerful word that stirred her spirit, always passing along wisdom to those she loves.',
    album: 'ministry',
    tag: 'Inspiration',
    dateStr: 'Inspired Word'
  },
  // ── CONFERENCES ───────────────────────────────────────────────────────────
  {
    id: 'gal-c1',
    url: '/gallery/Great april 20 2026 conference.jpg',
    caption: 'A powerful April 20, 2026 conference — the atmosphere was electric with the Holy Spirit as lives were touched and testimonies were born.',
    album: 'conferences',
    tag: 'Conference 2026',
    dateStr: 'April 20, 2026',
    featured: true
  },
  {
    id: 'gal-c2',
    url: '/gallery/Great April 20 2026 conference, 1.jpg',
    caption: 'More stirring moments from the April 20, 2026 conference — Spirit-led worship, heartfelt preaching, and a community gathered in transformative unity.',
    album: 'conferences',
    tag: 'Conference 2026',
    dateStr: 'April 20, 2026'
  },
  {
    id: 'gal-c3',
    url: '/gallery/Great april 20 2026 conference,2.jpg',
    caption: 'The closing sessions of the April 20, 2026 conference — faith declarations, prayer, and lasting impartations that attendees will carry home.',
    album: 'conferences',
    tag: 'Conference 2026',
    dateStr: 'April 20, 2026'
  },
  {
    id: 'gal-c4',
    url: '/gallery/at-petal-civic-center.jpg',
    caption: 'A memorable gathering at the Petal Civic Center — community, worship, and the kind of fellowship that strengthens the spirit and restores hope.',
    album: 'conferences',
    tag: 'Civic Center Event',
    dateStr: 'Petal, MS'
  },
  // ── TRAVEL & CULTURE ─────────────────────────────────────────────────────
  {
    id: 'gal-t1',
    url: '/gallery/Touring The Grammy Museum, Los Angeles!.jpg',
    caption: 'Touring the Grammy Museum in Los Angeles — Ella Ruth brought her signature curiosity and joy to one of music\'s most iconic institutions.',
    album: 'travel',
    tag: 'Grammy Museum',
    dateStr: 'Los Angeles, CA'
  },
  {
    id: 'gal-t2',
    url: '/gallery/We toured the Martin Luther King National Park. Atlanta. Very educational and very interesting..jpg',
    caption: '"We toured the Martin Luther King Jr. National Park in Atlanta — very educational and very interesting." Walking the legacy of a great man with reverence and gratitude.',
    album: 'travel',
    tag: 'MLK National Park',
    dateStr: 'Atlanta, GA'
  },
  // ── DINING & SOCIAL ───────────────────────────────────────────────────────
  {
    id: 'gal-d1',
    url: '/gallery/I enjoyed having Breakfast at the Cracker Barrel Restaurant in Hattiesburg celebrating my friend Lorenza\'s birthday .. Never too late to celebrate— in Hattiesburg, MS, United States..jpg',
    caption: '"Never too late to celebrate!" Enjoying a delightful birthday breakfast at Cracker Barrel in Hattiesburg, MS — honoring her dear friend Lorenza with love and laughter.',
    album: 'social',
    tag: 'Friends & Dining',
    dateStr: 'Hattiesburg, MS'
  },
  // ── NUMERIC FACEBOOK IDs (unlabeled community moments) ───────────────────
  {
    id: 'gal-fb1',
    url: '/gallery/700124371_27788187230768048_8278905818232501846_n.jpg',
    caption: 'A candid community moment — life as it happens, people gathered in joy, the kind of authentic connection that defines Ella Ruth\'s world.',
    album: 'family',
    tag: 'Community',
    dateStr: 'Community Moment'
  },
  {
    id: 'gal-fb2',
    url: '/gallery/722859751_28194746096778824_454259432063154988_n.jpg',
    caption: 'Another treasured memory captured in real time — evidence that Ella Ruth\'s life is filled with genuine love, vibrant relationships, and meaningful purpose.',
    album: 'family',
    tag: 'Community',
    dateStr: 'Special Moment'
  },
  {
    id: 'gal-fb3',
    url: '/gallery/765929398_28879759261610834_7571131321084503590_n.jpg',
    caption: 'Preserving yet another God-given moment — each photograph a testimony that a life of faith, family, and service is a life beautifully lived.',
    album: 'family',
    tag: 'Moment Captured',
    dateStr: 'Life in Pictures'
  }
];

export const DONATION_FUNDS: DonationFund[] = [
  {
    id: 'fund-general',
    name: 'Safe Haven Ministry & Outreach General Fund',
    icon: 'Sparkles',
    description: 'Supports where the need is greatest — across street outreach, emergency food hampers, and facility upkeep in Columbia, MS.',
    impactQuote: 'Your gift keeps the lights on, emergency pantry shelves stocked, and outreach vans fueled.',
    suggestedAmounts: [25, 50, 100, 250, 500],
    defaultAmount: 100
  },
  {
    id: 'fund-reentry',
    name: 'Prison Ministry & Re-Entry Transition Fund',
    icon: 'KeyRound',
    description: 'Provides transitional clothing, emergency lodging stipends, bus fare, and mentoring workbooks for returning citizens.',
    impactQuote: '$50 provides a re-entry dignity kit; $150 sponsors two weeks of transitional support.',
    suggestedAmounts: [35, 75, 150, 300, 600],
    defaultAmount: 75
  },
  {
    id: 'fund-meals',
    name: 'Community Dinners & Sacred Thanksgiving Feasts',
    icon: 'Utensils',
    description: 'Funds the purchase of fresh groceries, turkeys, hams, greens, and dignified table settings for hungry families and seniors.',
    impactQuote: '$25 feeds 8 neighbors a hot, nutritious feast at our community tables.',
    suggestedAmounts: [25, 50, 100, 200, 400],
    defaultAmount: 50
  },
  {
    id: 'fund-mombasa',
    name: 'Mombasa, Kenya Children’s Centre Fund',
    icon: 'Globe2',
    description: 'Direct overseas support providing daily hot school meals, textbooks, school uniforms, and clean drinking water filtration.',
    impactQuote: '$30 feeds a child daily school lunches for an entire month in Mombasa.',
    suggestedAmounts: [30, 60, 120, 250, 500],
    defaultAmount: 60
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: 'pr-1',
    authorName: 'Sister Patricia M.',
    cityState: 'Columbia, MS',
    requestText: 'Praying for my son Marcus as he prepares to transition home from facility next month. Asking God for employment favor and steady faith.',
    date: 'Yesterday',
    isPrivate: false,
    prayedCount: 24
  },
  {
    id: 'pr-2',
    authorName: 'Deacon Charles R.',
    cityState: 'Hattiesburg, MS',
    requestText: 'Praying for divine health and strength in my spine and knees so I can keep serving our church food ministry faithfully.',
    date: '3 days ago',
    isPrivate: false,
    prayedCount: 31
  },
  {
    id: 'pr-3',
    authorName: 'Minister Angela D.',
    cityState: 'Jackson, MS',
    requestText: 'Lifting up the Mombasa Children’s Centre teachers and students as their new academic term commences. May God supply every need.',
    date: '5 days ago',
    isPrivate: false,
    prayedCount: 42
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Brenda Washington',
    role: 'Wellness Coaching Client (Age 67)',
    location: 'McComb, MS',
    quote: 'Ella Ruth looked at me and said, “Brenda, you’re not slowing down, you’re just starting your second wind!” Her 85-year-old energy is contagious. I lost 18 pounds, stopped relying on afternoon pills for fatigue, and started walking two miles every morning.',
    category: 'wellness'
  },
  {
    id: 'test-2',
    name: 'Jerome K.',
    role: 'Reentry Graduate & Safe Haven Volunteer',
    location: 'Marion County, MS',
    quote: 'When I stepped out of prison after 7 years, most folks wouldn’t look me in the eye. Pastor Ella Ruth met me with open arms, a hot plate, clean clothes, and a Bible. Safe Haven didn’t just give me help; they gave me back my dignity as a man of God.',
    category: 'reentry'
  },
  {
    id: 'test-3',
    name: 'Pastor Thomas L. Evans',
    role: 'Senior Pastor, Partner Ministry',
    location: 'Laurel, MS',
    quote: 'At the Divine Transformation Conference, Ella Ruth’s teaching on healing dismantled decades of religious passivity in our congregation. When she preaches, the atmosphere shifts. She is truly a general in the faith and a treasure to Mississippi.',
    category: 'conference'
  },
  {
    id: 'test-4',
    name: 'Sister Mary Jane Vance',
    role: 'Community Senior & Banquet Guest',
    location: 'Columbia, MS',
    quote: 'The way Safe Haven dresses those banquet tables in royal blue and gold makes you feel like royalty. For seniors who live alone, that Thanksgiving feast and the love Ella Ruth pours out is the highlight of our entire year.',
    category: 'ministry'
  }
];

export const COACHING_PILLARS = [
  {
    number: '01',
    title: 'Spirit-Led Vitality & Morning Gratitude',
    desc: 'Longevity begins in your spiritual posture. Before feet touch the floor, Ella Ruth coaches women to consecrate their thoughts, speak life over their limbs, and cast off spirit-dampening worries.'
  },
  {
    number: '02',
    title: 'Temple Stewardship & Energizing Fuel',
    desc: 'Simple, unpretentious Southern vitality: hydrating with living water, reducing heavy refined sugars, loading up on colorful greens, and nourishing your cells as God\'s sacred earthly temple.'
  },
  {
    number: '03',
    title: 'Joyful Continuous Movement',
    desc: 'No intimidating gym contraptions needed. Coach Ella Ruth advocates daily purposeful locomotion: brisk walks, gentle mobility stretching, posture alignment, and stairs that keep hips and knees fluid.'
  },
  {
    number: '04',
    title: 'Laughter, Fellowship & Service',
    desc: 'Isolation accelerates aging; generous service reverses it. An active calendar of uplifting fellowship, laughter with friends, and helping those in need keeps your blood flowing and heart youthful.'
  }
];

export const LIFE_TIMELINE = [
  {
    year: '2001',
    title: 'Fellowship & Devoted Service with Safe Haven Ministries',
    badge: 'Faithful Service',
    desc: 'Guided by a deep love for God in Columbia, MS, Ella Ruth began her active journey of worshipping and serving alongside Safe Haven Ministries, dedicating herself to intercessory prayer, community meals, and encouragement.'
  },
  {
    year: '2012',
    title: 'Ordination & Public Teaching Ministry',
    badge: 'Spiritual Calling',
    desc: 'Deepening her calling to teach scripture and inspire others, Ella Ruth was ordained, preaching biblical encouragement, ministering to families, and mentoring emerging faith leaders.'
  },
  {
    year: '2018',
    title: 'Mombasa, Kenya Mission Heart',
    badge: 'Global Compassion',
    desc: 'Championing support for orphaned and vulnerable school children in Mombasa, Kenya with daily hot lunches, clean drinking water filtration, and educational supplies.'
  },
  {
    year: '2020',
    title: 'Divine Transformation Conferences & Speaking',
    badge: 'Author & Speaker',
    desc: 'Convening and speaking to women and community leaders on holistic spiritual renewal, scripture study, and emotional healing.'
  },
  {
    year: '2022',
    title: 'The "85 Years Young" Vitality Movement',
    badge: 'Certified Coach',
    desc: 'Challenging men and women to reject premature frailty, Ella Ruth stepped into active health and vitality coaching — sharing biblical body stewardship, hydration, and daily movement.'
  },
  {
    year: 'Present',
    title: '“Wisdom in Motion” — Purpose Without Retirement',
    badge: 'Living Dynamo',
    desc: 'Coaching clients nationwide, writing devotionals, speaking at conferences, and remaining a faithful, joyful worshipper and servant at Safe Haven Ministries.'
  }
];
