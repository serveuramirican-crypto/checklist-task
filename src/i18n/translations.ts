export type Language = 'en' | 'ar';

export const en = {
  // Common & Language
  'lang.switchLabel': 'Switch language',
  'lang.en': 'EN',
  'lang.ar': 'العربية',
  'common.close': 'Close',
  'common.cancel': 'Cancel',
  'common.spUnit': 'SP',

  // App Loading / Errors
  'app.loadingLink': 'LOADING SURVIVAL LINK...',
  'app.initializingCamp': 'INITIALIZING SURVIVAL CAMP...',
  'app.unableToLoad': 'UNABLE TO LOAD CAMP',
  'app.retry': 'RETRY',
  'app.signOut': 'Sign Out',
  'app.syncError': 'Failed to sync survival state',
  'app.addTaskError': 'Could not add task',
  'app.completeTaskError': 'Could not complete task',
  'app.resetRunError': 'Failed to reset survival run',

  // Auth Screen
  'auth.badge': 'DAILY SURVIVAL PROTOCOL',
  'auth.title': 'LAST NIGHTFALL',
  'auth.subtitle':
    'Your daily checklist is now a brutal 24-hour survival game. Finish every task before midnight—or lose your gear, points, and streak.',
  'auth.rule1Title': 'Hard-Mode Task Lock',
  'auth.rule1Desc':
    'Once you add a task to today’s mission, it locks in Postgres. No deleting or backing out.',
  'auth.rule2Title': 'Upgrade Your Survivor & Camp',
  'auth.rule2Desc':
    'Clear all tasks before 00:00 to level up and evolve your pixel-art character’s armor, weapons, shelter, and wolf companion.',
  'auth.rule3Title': 'Permadeath at Midnight (00:00)',
  'auth.rule3Desc':
    'Leave even one task unfinished—or skip a day—and you reset to Day 1 with 0 points and tattered rags.',
  'auth.midnightTimezone': 'Midnight Timezone:',
  'auth.backedBy': 'Backed by Supabase',
  'auth.signInTab': 'SIGN IN',
  'auth.signUpTab': 'NEW SURVIVOR',
  'auth.survivorNameLabel': 'Survivor Name',
  'auth.survivorNamePlaceholder': 'e.g. Nomad',
  'auth.emailLabel': 'Email',
  'auth.emailPlaceholder': 'you@example.com',
  'auth.passwordLabel': 'Password',
  'auth.passwordPlaceholder': 'At least 6 characters',
  'auth.connecting': 'CONNECTING...',
  'auth.startDay1': 'START DAY 1',
  'auth.enterCamp': 'ENTER CAMP',
  'auth.confirmCreated':
    'Account created! Check your email inbox to confirm your address, then sign in.',
  'auth.existingAccountHint':
    'An account with this email may already exist. Try signing in or check your inbox for a confirmation link.',
  'auth.rateLimitError':
    'Email confirmation rate limit reached on Supabase. Please wait a few minutes before creating another account, or sign in with an existing account.',
  'auth.invalidCredentials': 'Invalid email or password.',
  'auth.emailNotConfirmed': 'Please confirm your email address before signing in.',
  'auth.genericAuthError': 'Authentication failed',

  // Top HUD
  'hud.timezoneActive': 'Timezone: {tz} · Active Date: {date}',
  'hud.day': 'Day',
  'hud.level': 'Level',
  'hud.points': 'Points',
  'hud.best': 'Best',
  'hud.bestValue': 'D{day} · {points} SP',
  'hud.nextDayIn': 'Next Day In',
  'hud.deadline': '00:00 Deadline',
  'hud.codex': 'Codex',
  'hud.codexTooltip': 'View Gear & Evolution Roadmap',
  'hud.graveyard': 'Graveyard',
  'hud.graveyardTooltip': 'View Fallen Survival Runs',
  'hud.muteTooltip': 'Mute 8-bit Audio',
  'hud.unmuteTooltip': 'Unmute 8-bit Audio',
  'hud.muteAria': 'Mute sound effects',
  'hud.unmuteAria': 'Unmute sound effects',
  'hud.signOutTooltip': 'Sign Out',
  'hud.signOutAria': 'Sign out',

  // Canvas & Equipment Loadout
  'canvas.ariaLabel': 'Animated pixel-art survival camp scene',
  'canvas.dayLevelBadge': 'DAY {day} · LVL {level}',
  'canvas.pointsBadge': '{points} SP',
  'canvas.statusSecured': 'CAMP SECURED',
  'canvas.statusDanger': 'NIGHTFALL DANGER',
  'canvas.statusActive': 'SURVIVAL ACTIVE',
  'canvas.armorLabel': 'Armor:',
  'canvas.weaponLabel': 'Weapon:',
  'canvas.campLabel': 'Camp:',
  'canvas.nextLabel': 'Next:',
  'canvas.burstPerished': 'PERISHED!',
  'canvas.burstExpired': 'MIDNIGHT EXPIRED',
  'canvas.burstLevelUp': 'LVL {level}! +{points} SP',
  'canvas.burstReSecured': 'RE-SECURED! +{points} SP',
  'canvas.burstPoints': '+{points} SP!',

  // Equipment Summary Cards
  'equip.companionsTitle': 'Companions ({count}/3)',
  'equip.companionsEmpty':
    'Reach 150 SP to unlock your Iron Camp Kettle, 400 SP for Timber Wolf!',

  // Quest Board
  'quest.title': 'DAY {day} QUEST BOARD',
  'quest.subtitle':
    'Finish 100% of tasks before {time} to earn +{bonus} SP & upgrade your survivor.',
  'quest.clearedPct': '{pct}% Cleared',
  'quest.daySurvivedBanner':
    'Day {day} Survived! Camp is safe until midnight. Come back tomorrow for Day {nextDay}!',
  'quest.inputPlaceholder':
    'Add a mission for today (e.g., Study 2h, Workout, Ship feature)...',
  'quest.locking': 'LOCKING...',
  'quest.lockTask': 'LOCK TASK',
  'quest.lockedHint': 'Locked on add (no delete/edit)',
  'quest.reopenTitle': 'Day {day} is already secured!',
  'quest.reopenDesc':
    'Adding another task puts today’s survival back on the line until 00:00. If you fail to finish it, you reset to Day 1.',
  'quest.reopenConfirm': 'Confirm & Lock Task',
  'quest.emptyTitle': 'NO MISSIONS COMMITTED YET',
  'quest.emptyDay1':
    'Add your first tasks for Day 1 above. Once committed, finish all of them before 00:00 to level up!',
  'quest.emptyDayN':
    'You survived yesterday! Add today’s Day {day} tasks and clear them all before 00:00 to stay alive.',
  'quest.lockedBadge': 'Locked',
  'quest.claimedBadge': 'CLAIMED',
  'quest.completeAria': 'Complete task: {title}',
  'quest.completedAria': 'Completed: {title}',

  // Difficulties
  'diff.easy.label': 'Supply Run',
  'diff.easy.tag': 'EASY',
  'diff.medium.label': 'Camp Defense',
  'diff.medium.tag': 'MEDIUM',
  'diff.hard.label': 'Apex Hunt',
  'diff.hard.tag': 'HARD',

  // Hints & Progression
  'hint.reachLevel': 'Reach Level {level}',
  'hint.collectSp': 'Collect {points} SP',
  'hint.spRemaining': '{points} SP left',

  // Gear Names & Descriptions (Descriptions translated, Item names kept in English)
  'gear.armor.rags.desc':
    'Tattered cloth scraps from Day 1. Offers zero protection in the wild.',
  'gear.armor.scavenger.desc':
    'Stitched hide vest, field boots, and cloth headband.',
  'gear.armor.ranger.desc':
    'Forest hood, reinforced bracers, and utility survival belt.',
  'gear.armor.vanguard.desc':
    'Riveted steel chestplate, heavy pauldrons, and crimson cape.',
  'gear.armor.warden.desc':
    'Rune-etched tactical exo-plate with illuminated visor helm.',
  'gear.armor.apex.desc':
    'Mythic obsidian-gold battleplate radiating blazing survival embers.',

  'gear.weapon.stick.desc': 'A fragile branch picked off the forest floor.',
  'gear.weapon.spear.desc': 'Sharpened stone lash-mounted onto ash wood.',
  'gear.weapon.machete.desc':
    'Heavy tempered blade forged for bushcraft and defense.',
  'gear.weapon.bow.desc':
    'Laminated survival bow paired with a full fletched quiver.',
  'gear.weapon.greatsword.desc':
    'Ember-forged steel broadsword burning with camp heat.',
  'gear.weapon.halberd.desc':
    'Arc-charged survival polearm humming with golden energy.',

  'gear.camp.embers.desc':
    'Exposed dirt ground with a weak spark keeping the dark away.',
  'gear.camp.campfire.desc':
    'Ringed hearth fire with log seating and crackling flames.',
  'gear.camp.tent.desc':
    'Sturdy survival tarp shelter and strapped supply crate.',
  'gear.camp.outpost.desc':
    'Reinforced wooden watch cabin with hanging oil lantern.',
  'gear.camp.bunker.desc':
    'Armored stone-and-steel refuge flying your survival banner.',
  'gear.camp.citadel.desc':
    'Towering stronghold lit by an eternal golden signal beacon.',

  'gear.comp.cooking_pot.desc':
    'Steaming broth kettle hanging above the fire for stamina recovery.',
  'gear.comp.wolf.desc':
    'A loyal wild wolf guarding your perimeter at night.',
  'gear.comp.drone.desc':
    'Autonomous hovering sentinel scanning the dark horizon.',

  // Visual / Gameplay Benefits for Next Day Preview
  'benefit.armor': 'Upgrades survivor armor sprite & animated camp appearance',
  'benefit.weapon': 'Upgrades held weapon sprite & task celebration animation',
  'benefit.camp': 'Evolves camp shelter structure & nighttime scene lighting',
  'benefit.cooking_pot': 'Adds steaming iron tripod kettle above your campfire',
  'benefit.wolf': 'Adds animated Timber Wolf scout guarding beside your hero',
  'benefit.drone': 'Adds hovering Solar Recon Drone scanning above camp',

  // Camp & Environment Evolution Details
  'env.embers': 'Bare dirt ground with faint glowing coals and smoke wisps.',
  'env.campfire': 'Stone-ringed crackling campfire, log bench, and warm ground glow.',
  'env.tent': 'Canvas A-frame lean-to shelter, supply crate, and hanging camp light.',
  'env.outpost': 'Timber watch cabin with shingled roof, lit amber window, and swaying lantern.',
  'env.bunker': 'Armored concrete-and-steel bunker flying a waving crimson survival banner.',
  'env.citadel': 'Fortified stone watchtower projecting a golden signal beam into the stars.',

  // Next Day Preview Section
  'preview.title': "TOMORROW'S DISCOVERIES",
  'preview.subtitle': 'Survive today to discover what awaits you tomorrow.',
  'preview.upcomingBadge': 'UPCOMING: DAY {day}',
  'preview.syncHint': 'Today: Day {day} (Lvl {level} · {points} SP)',
  'preview.catEquipment': 'A. Equipment Upgrades',
  'preview.catCompanions': 'B. Companions (SP Milestones)',
  'preview.catCamp': 'C. Camp & Environment Evolution',
  'preview.catMilestones': 'D. Upcoming Milestones',
  'preview.slotArmor': 'Armor',
  'preview.slotWeapon': 'Weapon',
  'preview.slotCamp': 'Camp Shelter',
  'preview.slotCompanion': 'Companion',
  'preview.slotLevel': 'Survivor Level',
  'preview.statusAvailableNextDay': 'Available on Day {day}',
  'preview.statusUnlocked': 'Unlocked',
  'preview.statusRequiresLevel': 'Requires Level {level}',
  'preview.statusRequiresSp': 'Requires {points} SP',
  'preview.statusLocked': 'Locked',
  'preview.conditionLevel': 'Reach Level {level} (survive through Day {day})',
  'preview.conditionTodayClear': 'Survive Day {day} to unlock Level {level}',
  'preview.conditionSp': 'Collect {points} SP total (not automatic by day)',
  'preview.companionProgress': '{current} / {target} SP ({remaining} SP remaining)',
  'preview.companionUnlockedNote': 'Active at camp ({target} SP milestone reached)',
  'preview.companionRuleNote':
    'Companions unlock strictly by total Survival Points (SP), not simply by day count.',
  'preview.allMaxedSlot': 'Max Tier Reached',
  'preview.allMaxedDesc':
    'You have unlocked every evolution tier in this category!',
  'preview.todayBonusTitle': 'Surviving Day {day} Grants',
  'preview.todayBonusValue': 'Level {nextLevel} + +{bonus} SP Daily Bonus',
  'preview.tomorrowBonusNote':
    'Clearing Day {upcomingDay} tomorrow will award +{tomorrowBonus} SP.',
  'preview.currentStageLabel': 'Current Stage:',
  'preview.nextStageLabel': 'Next Camp Evolution:',
  'preview.dayRewardTag': 'Day {day} Survival Reward',
  'preview.milestoneTag': 'Progression Milestone',
  'preview.permadeathPaused':
    'Acknowledge midnight defeat first—new Day 2 discoveries await your fresh Day 1 run.',

  // Codex Modal
  'codex.ariaLabel': 'Survivor Gear Codex',
  'codex.title': 'EVOLUTION CODEX & GEAR UNLOCKS',
  'codex.subtitle':
    'Survive consecutive days to evolve your hero—miss 00:00 and all unlocked gear vanishes.',
  'codex.closeAria': 'Close codex',
  'codex.armorSection': 'Armor & Clothing Evolution',
  'codex.weaponSection': 'Weapon Arsenal',
  'codex.campSection': 'Camp & Shelter Upgrades',
  'codex.companionSection': 'Survival Companions (Points Milestones)',
  'codex.lvlBadge': 'LVL {level}',
  'codex.spBadge': '{points} SP',

  // Graveyard Modal
  'graveyard.ariaLabel': 'Fallen Runs Graveyard',
  'graveyard.title': 'SURVIVOR GRAVEYARD',
  'graveyard.subtitle':
    'Every past run lost to midnight failure. Let it remind you not to miss today.',
  'graveyard.closeAria': 'Close graveyard',
  'graveyard.empty':
    'No fallen runs yet. Stay disciplined before 00:00 to keep this graveyard empty!',
  'graveyard.survivedMeta': 'SURVIVED {days} {dayWord} · PEAK LVL {level}',
  'graveyard.daySingular': 'DAY',
  'graveyard.dayPlural': 'DAYS',
  'graveyard.pointsLost': '-{points} SP LOST',
  'graveyard.failedDate': 'Failed Date: {date}',

  // Death Modal
  'death.title': 'YOU PERISHED AT MIDNIGHT',
  'death.daysSurvived': 'Days Survived',
  'death.peakLevel': 'Peak Level',
  'death.pointsLost': 'Points Lost',
  'death.resetSummary':
    'All armor, weapons, shelter upgrades, and Survival Points have been wiped. Your new survival run starts from Day 1.',
  'death.respawning': 'RESPAWNING...',
  'death.respawn': 'RESPAWN ON DAY 1 (0 SP)',

  // Level Up Banner
  'levelup.title': 'DAY {day} SURVIVED · LEVEL {level} UNLOCKED!',
  'levelup.bonusEarned': 'Earned +{bonus} SP daily survival bonus!',
  'levelup.newPrefix': 'NEW:',
  'levelup.dismissAria': 'Dismiss upgrade banner',

  // Dynamic Failure Reasons
  'fail.zeroTasks':
    'Added 0 tasks on Day {day} ({date}) — failed to defend camp before midnight.',
  'fail.unfinishedTasks':
    'Left {unfinished} of {total} task(s) unfinished on Day {day} ({date}) before midnight.',
  'fail.abandonedCamp':
    'Abandoned camp on {missedDate} after surviving Day {day} — missed a full 24h cycle.',
} as const;

export type TranslationKey = keyof typeof en;

export const ar: Record<TranslationKey, string> = {
  // Common & Language
  'lang.switchLabel': 'تبديل اللغة',
  'lang.en': 'EN',
  'lang.ar': 'العربية',
  'common.close': 'إغلاق',
  'common.cancel': 'إلغاء',
  'common.spUnit': 'نقطة بقاء',

  // App Loading / Errors
  'app.loadingLink': 'جارٍ الاتصال بمعسكر البقاء...',
  'app.initializingCamp': 'جارٍ تهيئة معسكر البقاء...',
  'app.unableToLoad': 'تعذّر تحميل بيانات المعسكر',
  'app.retry': 'إعادة المحاولة',
  'app.signOut': 'تسجيل الخروج',
  'app.syncError': 'تعذّر مزامنة حالة البقاء',
  'app.addTaskError': 'تعذّرت إضافة المهمة',
  'app.completeTaskError': 'تعذّر إكمال المهمة',
  'app.resetRunError': 'تعذّر إعادة بدء الرحلة',

  // Auth Screen
  'auth.badge': 'بروتوكول البقاء اليومي',
  'auth.title': 'LAST NIGHTFALL',
  'auth.subtitle':
    'قائمة مهامك اليومية أصبحت الآن لعبة بقاء قاسية من 24 ساعة. أنجز كل مهمة قبل منتصف الليل—أو افقد عتادك ونقاطك وسلسلة أيامك.',
  'auth.rule1Title': 'تثبيت المهام بالوضع الصعب',
  'auth.rule1Desc':
    'بمجرد إضافة مهمة إلى قائمة اليوم، يتم تثبيتها في قاعدة البيانات ولا يمكن حذفها أو تعديلها.',
  'auth.rule2Title': 'طوّر بطلك ومعسكرك',
  'auth.rule2Desc':
    'أنهِ جميع المهام قبل 00:00 لترتقي بمستواك وتطوّر درع شخصيتك وأسلحتك ومأواك وذئبك المرافق.',
  'auth.rule3Title': 'الموت الدائم عند منتصف الليل (00:00)',
  'auth.rule3Desc':
    'ترك مهمة واحدة غير مكتملة—أو تفويت يوم كامل—يعيدك إلى اليوم الأول بـ 0 نقطة وملابس بالية.',
  'auth.midnightTimezone': 'المنطقة الزمنية لمنتصف الليل:',
  'auth.backedBy': 'محفوظ على Supabase',
  'auth.signInTab': 'تسجيل الدخول',
  'auth.signUpTab': 'ناجٍ جديد',
  'auth.survivorNameLabel': 'اسم الناجي',
  'auth.survivorNamePlaceholder': 'مثال: الرحّال',
  'auth.emailLabel': 'البريد الإلكتروني',
  'auth.emailPlaceholder': 'you@example.com',
  'auth.passwordLabel': 'كلمة المرور',
  'auth.passwordPlaceholder': '6 أحرف على الأقل',
  'auth.connecting': 'جارٍ الاتصال...',
  'auth.startDay1': 'ابدأ اليوم الأول',
  'auth.enterCamp': 'دخول المعسكر',
  'auth.confirmCreated':
    'تم إنشاء الحساب! تحقّق من بريدك الإلكتروني لتأكيد عنوانك ثم سجّل الدخول.',
  'auth.existingAccountHint':
    'قد يكون هذا البريد مسجلاً مسبقًا. جرّب تسجيل الدخول أو تحقّق من بريدك لرابط التأكيد.',
  'auth.rateLimitError':
    'تم بلوغ الحد الأقصى لرسائل التأكيد على Supabase. انتظر بضع دقائق قبل إنشاء حساب جديد، أو سجّل الدخول بحساب حالي.',
  'auth.invalidCredentials': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  'auth.emailNotConfirmed': 'يرجى تأكيد بريدك الإلكتروني قبل تسجيل الدخول.',
  'auth.genericAuthError': 'فشلت عملية المصادقة',

  // Top HUD
  'hud.timezoneActive': 'المنطقة: {tz} · التاريخ النشط: {date}',
  'hud.day': 'اليوم',
  'hud.level': 'المستوى',
  'hud.points': 'النقاط',
  'hud.best': 'الأفضل',
  'hud.bestValue': 'ي{day} · {points} SP',
  'hud.nextDayIn': 'اليوم التالي خلال',
  'hud.deadline': 'مهلة 00:00',
  'hud.codex': 'الموسوعة',
  'hud.codexTooltip': 'عرض موسوعة العتاد ومسار التطور',
  'hud.graveyard': 'المقبرة',
  'hud.graveyardTooltip': 'عرض المحاولات السابقة الفاشلة',
  'hud.muteTooltip': 'كتم المؤثرات الصوتية',
  'hud.unmuteTooltip': 'تشغيل المؤثرات الصوتية',
  'hud.muteAria': 'كتم المؤثرات الصوتية',
  'hud.unmuteAria': 'تشغيل المؤثرات الصوتية',
  'hud.signOutTooltip': 'تسجيل الخروج',
  'hud.signOutAria': 'تسجيل الخروج',

  // Canvas & Equipment Loadout
  'canvas.ariaLabel': 'مشهد معسكر البقاء المتحرك بفن البكسل',
  'canvas.dayLevelBadge': 'اليوم {day} · المستوى {level}',
  'canvas.pointsBadge': '{points} SP',
  'canvas.statusSecured': 'المعسكر آمن',
  'canvas.statusDanger': 'خطر حلول الليل',
  'canvas.statusActive': 'البقاء نشط',
  'canvas.armorLabel': 'الدرع:',
  'canvas.weaponLabel': 'السلاح:',
  'canvas.campLabel': 'المعسكر:',
  'canvas.nextLabel': 'التالي:',
  'canvas.burstPerished': 'سقطت!',
  'canvas.burstExpired': 'انتهى وقت منتصف الليل',
  'canvas.burstLevelUp': 'مستوى {level}! +{points} SP',
  'canvas.burstReSecured': 'تأمين مجدد! +{points} SP',
  'canvas.burstPoints': '+{points} SP!',

  // Equipment Summary Cards
  'equip.companionsTitle': 'المرافقون ({count}/3)',
  'equip.companionsEmpty':
    'اجمع 150 SP لفتح Iron Camp Kettle و400 SP لفتح Timber Wolf!',

  // Quest Board
  'quest.title': 'لوحة مهام اليوم {day}',
  'quest.subtitle':
    'أكمل 100% من المهام قبل {time} لتحصل على +{bonus} SP وتطوّر بطلك.',
  'quest.clearedPct': 'تم إنجاز {pct}%',
  'quest.daySurvivedBanner':
    'نجوت في اليوم {day}! المعسكر آمن حتى منتصف الليل. عد غدًا لمهام اليوم {nextDay}!',
  'quest.inputPlaceholder':
    'أضف مهمة لهذا اليوم (مثال: مذاكرة ساعتين، تمرين، إنجاز مشروع)...',
  'quest.locking': 'جارٍ التثبيت...',
  'quest.lockTask': 'تثبيت المهمة',
  'quest.lockedHint': 'تُثبّت فور الإضافة (بلا حذف أو تعديل)',
  'quest.reopenTitle': 'تم تأمين اليوم {day} بالفعل!',
  'quest.reopenDesc':
    'إضافة مهمة جديدة تُعيد وضع بقائك اليوم على المحك حتى 00:00. إذا لم تكملها فستعود إلى اليوم الأول.',
  'quest.reopenConfirm': 'تأكيد وتثبيت المهمة',
  'quest.emptyTitle': 'لم تُضف أي مهام بعد',
  'quest.emptyDay1':
    'أضف مهامك الأولى لليوم الأول بالأعلى. فور تثبيتها، أكملها جميعًا قبل 00:00 لترتقي بمستواك!',
  'quest.emptyDayN':
    'لقد نجوت بالأمس! أضف مهام اليوم {day} وأكملها قبل الساعة 00:00 لتبقى على قيد الحياة.',
  'quest.lockedBadge': 'مثبّتة',
  'quest.claimedBadge': 'تم التحصيل',
  'quest.completeAria': 'إكمال المهمة: {title}',
  'quest.completedAria': 'مكتملة: {title}',

  // Difficulties
  'diff.easy.label': 'جولة إمداد',
  'diff.easy.tag': 'سهل',
  'diff.medium.label': 'دفاع عن المعسكر',
  'diff.medium.tag': 'متوسط',
  'diff.hard.label': 'صيد النخبة',
  'diff.hard.tag': 'صعب',

  // Hints & Progression
  'hint.reachLevel': 'بلوغ المستوى {level}',
  'hint.collectSp': 'جمع {points} SP',
  'hint.spRemaining': 'متبقي {points} SP',

  // Gear Descriptions (Equipment names kept in English)
  'gear.armor.rags.desc':
    'أسمال قماشية ممزقة من اليوم الأول، لا توفّر أي حماية في البرية.',
  'gear.armor.scavenger.desc':
    'سترة جلدية مخيطة، وأحذية ميدانية، وعصابة رأس قماشية.',
  'gear.armor.ranger.desc':
    'عباءة غابة بقلنسوة، وواقيات ساعد معززة، وحزام نجاة عملي.',
  'gear.armor.vanguard.desc':
    'درع صدري فولاذي مبرشم، وأكتاف مدرعة ثقيلة، وعباءة قرمزية.',
  'gear.armor.warden.desc':
    'درع تكتيكي متطور منقوش بالرونات مع خوذة ذات قناع مضيء.',
  'gear.armor.apex.desc':
    'درع أسطوري من السبج والذهب يشع بجمر البقاء المتوهج.',

  'gear.weapon.stick.desc': 'غصن خشبي هش التُقط من أرض الغابة.',
  'gear.weapon.spear.desc': 'رأس حجر صوان حاد مثبّت بإحكام على رمح خشبي.',
  'gear.weapon.machete.desc':
    'ساطور فولاذي ثقيل مصقول لقطع الأدغال والدفاع.',
  'gear.weapon.bow.desc':
    'قوس صيد مقوّس مع جعبة سهام متكاملة.',
  'gear.weapon.greatsword.desc':
    'سيف عريض فولاذي مطروق بالجمر يشتعل بحرارة المعسكر.',
  'gear.weapon.halberd.desc':
    'رمح قتالي مشحون بالبلازما يطنّ بطاقة ذهبية متقدة.',

  'gear.camp.embers.desc':
    'أرض ترابية مكشوفة بها جمر خافت يبعد الظلام بالكاد.',
  'gear.camp.campfire.desc':
    'نار معسكر محاطة بالحجارة مع مقعد خشبي وألسنة لهب متوهجة.',
  'gear.camp.tent.desc':
    'خيمة مأوى متينة من القماش المشمّع وصندوق إمدادات مربوط.',
  'gear.camp.outpost.desc':
    'كوخ مراقبة خشبي محصّن مع فانوس زيت معلّق ونافذة مضيئة.',
  'gear.camp.bunker.desc':
    'ملجأ مدرّع من الحجر والفولاذ يرفرف فوقه علم البقاء.',
  'gear.camp.citadel.desc':
    'قلعة برجية شامخة تضيء السماء بمنارة إشارة ذهبية أبدية.',

  'gear.comp.cooking_pot.desc':
    'قدر حديدي يتصاعد منه البخار فوق النار لاستعادة القدرة.',
  'gear.comp.wolf.desc':
    'ذئب بري مخلص يحرس محيط معسكرك طوال الليل.',
  'gear.comp.drone.desc':
    'طائرة استطلاع آلية تحلّق فوق المعسكر لمسح الأفق المظلم.',

  // Visual / Gameplay Benefits for Next Day Preview
  'benefit.armor': 'يطوّر مظهر درع البطل وحركته داخل مشهد المعسكر',
  'benefit.weapon': 'يطوّر السلاح المحمول وحركة الاحتفال عند إنجاز المهام',
  'benefit.camp': 'يرقّي مبنى المأوى وإضاءة المشهد الليلي في المعسكر',
  'benefit.cooking_pot': 'يضيف قدرًا حديديًا بحامل ثلاثي وبخارًا فوق نار المعسكر',
  'benefit.wolf': 'يضيف ذئب استطلاع متحركًا يرافق بطلك ويحرس المعسكر',
  'benefit.drone': 'يضيف طائرة استطلاع شمسية تحوم فوق المعسكر بنبض مسح ضوئي',

  // Camp & Environment Evolution Details
  'env.embers': 'أرض ترابية قاحلة مع جمر ضعيف وخيط دخان خفيف.',
  'env.campfire': 'موقد حجري بنار مشتعلة ومقعد جذعي وتوهّج دافئ على الأرض.',
  'env.tent': 'مأوى خيمة مائلة من القماش، وصندوق مؤن، ومصباح مخيّم.',
  'env.outpost': 'كوخ مراقبة خشبي بسقف مائل ونافذة دافئة وفانوس متأرجح.',
  'env.bunker': 'حصن خرساني وفولاذي منيع مع راية قرمزية ترفرف في الريح.',
  'env.citadel': 'برج حصين يبث شعاع منارة ذهبية نحو النجوم.',

  // Next Day Preview Section
  'preview.title': 'اكتشافات الغد',
  'preview.subtitle': 'أكمل مهام اليوم واصمد حتى منتصف الليل لاكتشاف ما ينتظرك غدًا.',
  'preview.upcomingBadge': 'اليوم القادم: اليوم {day}',
  'preview.syncHint': 'اليوم الحالي: اليوم {day} (المستوى {level} · {points} SP)',
  'preview.catEquipment': 'أ. ترقيات العتاد والمأوى',
  'preview.catCompanions': 'ب. المرافقون (إنجازات النقاط)',
  'preview.catCamp': 'ج. تطوّر المعسكر والبيئة',
  'preview.catMilestones': 'د. الإنجازات القادمة',
  'preview.slotArmor': 'الدرع',
  'preview.slotWeapon': 'السلاح',
  'preview.slotCamp': 'المعسكر',
  'preview.slotCompanion': 'مرافق',
  'preview.slotLevel': 'مستوى الناجي',
  'preview.statusAvailableNextDay': 'متاح في اليوم {day}',
  'preview.statusUnlocked': 'مفتوح بالفعل',
  'preview.statusRequiresLevel': 'يتطلب المستوى {level}',
  'preview.statusRequiresSp': 'يتطلب {points} SP',
  'preview.statusLocked': 'مقفل',
  'preview.conditionLevel': 'بلوغ المستوى {level} (عبر النجاة إلى اليوم {day})',
  'preview.conditionTodayClear': 'أنجز مهام اليوم {day} للوصول إلى المستوى {level}',
  'preview.conditionSp': 'جمع {points} SP إجمالاً (لا يُفتح تلقائيًا باليوم)',
  'preview.companionProgress': '{current} / {target} SP (متبقي {remaining} SP)',
  'preview.companionUnlockedNote': 'نشط في المعسكر (تم بلوغ هدف {target} SP)',
  'preview.companionRuleNote':
    'يُفتح المرافقون حصريًا عبر مجموع نقاط البقاء (SP)، وليس بمجرد مرور الأيام.',
  'preview.allMaxedSlot': 'تم بلوغ الحد الأقصى',
  'preview.allMaxedDesc': 'لقد فتحت جميع ترقيات التطور في هذه الفئة!',
  'preview.todayBonusTitle': 'مكافأة الصمود في اليوم {day}',
  'preview.todayBonusValue': 'المستوى {nextLevel} + مكافأة +{bonus} SP',
  'preview.tomorrowBonusNote':
    'الصمود في اليوم {upcomingDay} غدًا سيمنحك +{tomorrowBonus} SP إضافية.',
  'preview.currentStageLabel': 'المرحلة الحالية:',
  'preview.nextStageLabel': 'تطوّر المعسكر القادم:',
  'preview.dayRewardTag': 'مكافأة نجاة اليوم {day}',
  'preview.milestoneTag': 'هدف تقدّم',
  'preview.permadeathPaused':
    'أكّد شاشة السقوط أولاً—ستظهر اكتشافات اليوم الثاني فور بدء رحلتك الجديدة في اليوم الأول.',

  // Codex Modal
  'codex.ariaLabel': 'موسوعة عتاد الناجي',
  'codex.title': 'موسوعة التطور وفتح العتاد',
  'codex.subtitle':
    'اصمد لأيام متتالية لتطوير بطلك—إن فاتتك مهلة 00:00 يضيع كل ما فتحته.',
  'codex.closeAria': 'إغلاق الموسوعة',
  'codex.armorSection': 'تطور الدروع والملابس',
  'codex.weaponSection': 'ترسانة الأسلحة',
  'codex.campSection': 'ترقيات المعسكر والمأوى',
  'codex.companionSection': 'مرافقو البقاء (أهداف النقاط)',
  'codex.lvlBadge': 'مستوى {level}',
  'codex.spBadge': '{points} SP',

  // Graveyard Modal
  'graveyard.ariaLabel': 'مقبرة المحاولات الفاشلة',
  'graveyard.title': 'مقبرة الناجين',
  'graveyard.subtitle':
    'كل محاولة سابقة سقطت عند منتصف الليل. اجعلها تذكيرًا لك بألا تفوّت اليوم.',
  'graveyard.closeAria': 'إغلاق المقبرة',
  'graveyard.empty':
    'لا توجد محاولات فاشلة بعد. التزم بمهامك قبل 00:00 لتبقى هذه المقبرة فارغة!',
  'graveyard.survivedMeta': 'صمد {days} {dayWord} · أعلى مستوى {level}',
  'graveyard.daySingular': 'يوم',
  'graveyard.dayPlural': 'أيام',
  'graveyard.pointsLost': 'خسارة -{points} SP',
  'graveyard.failedDate': 'تاريخ السقوط: {date}',

  // Death Modal
  'death.title': 'سقطت عند منتصف الليل',
  'death.daysSurvived': 'الأيام التي نجوتها',
  'death.peakLevel': 'أعلى مستوى',
  'death.pointsLost': 'النقاط المفقودة',
  'death.resetSummary':
    'تم مسح جميع الدروع والأسلحة وترقيات المأوى ونقاط البقاء. تبدأ رحلتك الجديدة من اليوم الأول.',
  'death.respawning': 'جارٍ إعادة البعث...',
  'death.respawn': 'العودة من اليوم الأول (0 SP)',

  // Level Up Banner
  'levelup.title': 'نجوت في اليوم {day} · تم فتح المستوى {level}!',
  'levelup.bonusEarned': 'حصلت على مكافأة البقاء اليومية +{bonus} SP!',
  'levelup.newPrefix': 'جديد:',
  'levelup.dismissAria': 'إخفاء إشعار الترقية',

  // Dynamic Failure Reasons
  'fail.zeroTasks':
    'أضفت 0 مهمة في اليوم {day} ({date}) — فشلت في الدفاع عن المعسكر قبل منتصف الليل.',
  'fail.unfinishedTasks':
    'تركت {unfinished} من أصل {total} مهمة غير مكتملة في اليوم {day} ({date}) قبل منتصف الليل.',
  'fail.abandonedCamp':
    'هجرت المعسكر في {missedDate} بعد النجاة من اليوم {day} — فوّتَّ دورة كاملة من 24 ساعة.',
};

export const translations: Record<Language, Record<TranslationKey, string>> = {
  en,
  ar,
};
