import type { CvBuilderFormState } from "@/lib/cv/builder-types";
import { DEFAULT_CV_TEMPLATE } from "@/lib/cv/constants";
import { createDefaultSectionSettings } from "@/lib/cv/section-settings";
import type { Locale } from "@/lib/i18n/preferences";
import { SAMPLE_PHOTO_DATA_URL } from "@/components/cv-templates/sample-photo";

export const TEMPLATE_PREVIEW_SAMPLE_STATE: CvBuilderFormState = {
  title: "Sample CV",
  template: DEFAULT_CV_TEMPLATE,
  personal: {
    fullName: "Alex Morgan",
    professionalTitle: "Product Manager",
    email: "alex@example.com",
    phone: "+1 555 0100",
    location: "London, UK",
    website: "alexmorgan.dev",
    linkedIn: "linkedin.com/in/alexmorgan",
    dateOfBirth: "12 April 1990",
    nationality: "British",
    photo: SAMPLE_PHOTO_DATA_URL,
  },
  summary:
    "Product leader with 8+ years shipping B2B platforms. Turns ambiguous problems into clear roadmaps and measurable outcomes.",
  workExperience: [
    {
      id: "sample-work",
      jobTitle: "Senior Product Manager",
      company: "Northwind",
      location: "London",
      startDate: "2021-03",
      endDate: "",
      current: true,
      description: "Led roadmap and cross-functional delivery for a payments platform used by 2M+ customers.",
    },
    {
      id: "sample-work-2",
      jobTitle: "Product Manager",
      company: "Contoso",
      location: "Manchester",
      startDate: "2018-07",
      endDate: "2021-02",
      current: false,
      description: "Launched self-serve onboarding, cutting activation time by 40%.",
    },
  ],
  education: [
    {
      id: "sample-edu",
      degree: "BSc Business",
      institution: "City University",
      location: "London",
      startDate: "2014-09",
      endDate: "2018-06",
      description: "",
    },
  ],
  skills: ["Strategy", "Roadmapping", "Stakeholder management", "SQL", "User research"],
  projects: [],
  certifications: [
    {
      id: "sample-cert",
      name: "Certified Scrum Product Owner",
      issuer: "Scrum Alliance",
      date: "2020-05",
      url: "",
    },
  ],
  languages: [
    { id: "sample-lang-1", language: "English", proficiency: "Native" },
    { id: "sample-lang-2", language: "Spanish", proficiency: "B2" },
  ],
  customSections: [],
  sectionSettings: createDefaultSectionSettings(),
  documentLocale: "en",
};

type SampleText = {
  personal: Pick<
    CvBuilderFormState["personal"],
    "fullName" | "professionalTitle" | "email" | "phone" | "location" | "website" | "linkedIn" | "dateOfBirth" | "nationality"
  >;
  summary: string;
  work: [string, string, string, string][];
  education: [string, string, string];
  skills: string[];
  certification: [string, string];
  languages: [string, string][];
};

const SAMPLE_TEXT: Record<Exclude<Locale, "en">, SampleText> = {
  pt: {
    personal: { fullName: "Mariana Costa", professionalTitle: "Gerente de Produto", email: "mariana@exemplo.com.br", phone: "+55 11 91234-5678", location: "São Paulo, Brasil", website: "marianacosta.com.br", linkedIn: "linkedin.com/in/marianacosta", dateOfBirth: "12/04/1990", nationality: "Brasileira" },
    summary: "Gerente de produto com mais de 8 anos lançando plataformas B2B. Transforma problemas complexos em roadmaps claros e resultados mensuráveis.",
    work: [["Gerente de Produto Sênior", "Nubank", "São Paulo", "Liderou o roadmap de uma plataforma de pagamentos com mais de 2 milhões de clientes."], ["Gerente de Produto", "iFood", "Campinas", "Lançou o cadastro self-service e reduziu o tempo de ativação em 40%."]],
    education: ["Bacharelado em Administração", "Universidade de São Paulo", "São Paulo"],
    skills: ["Estratégia", "Roadmap", "Gestão de stakeholders", "SQL", "Pesquisa com usuários"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["Português", "Nativo"], ["Inglês", "C1"]],
  },
  it: {
    personal: { fullName: "Giulia Romano", professionalTitle: "Product Manager", email: "giulia@esempio.it", phone: "+39 347 123 4567", location: "Milano, Italia", website: "giuliaromano.it", linkedIn: "linkedin.com/in/giuliaromano", dateOfBirth: "12/04/1990", nationality: "Italiana" },
    summary: "Product manager con oltre 8 anni di esperienza su piattaforme B2B. Trasforma problemi complessi in roadmap chiare e risultati misurabili.",
    work: [["Senior Product Manager", "Satispay", "Milano", "Ha guidato la roadmap di una piattaforma di pagamenti con oltre 2 milioni di clienti."], ["Product Manager", "Subito", "Torino", "Ha lanciato l'onboarding self-service riducendo del 40% i tempi di attivazione."]],
    education: ["Laurea in Economia e Management", "Università Bocconi", "Milano"],
    skills: ["Strategia", "Roadmap", "Gestione degli stakeholder", "SQL", "Ricerca utenti"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["Italiano", "Madrelingua"], ["Inglese", "C1"]],
  },
  nl: {
    personal: { fullName: "Sanne de Vries", professionalTitle: "Productmanager", email: "sanne@voorbeeld.nl", phone: "+31 6 1234 5678", location: "Amsterdam, Nederland", website: "sannedevries.nl", linkedIn: "linkedin.com/in/sannedevries", dateOfBirth: "12-04-1990", nationality: "Nederlandse" },
    summary: "Productmanager met ruim 8 jaar ervaring met B2B-platforms. Vertaalt complexe problemen naar heldere roadmaps en meetbare resultaten.",
    work: [["Senior productmanager", "Adyen", "Amsterdam", "Verantwoordelijk voor de roadmap van een betaalplatform met meer dan 2 miljoen klanten."], ["Productmanager", "Bol", "Utrecht", "Selfservice-onboarding gelanceerd; activatietijd met 40% verkort."]],
    education: ["Bachelor Bedrijfskunde", "Erasmus Universiteit Rotterdam", "Rotterdam"],
    skills: ["Strategie", "Roadmapping", "Stakeholdermanagement", "SQL", "Gebruikersonderzoek"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["Nederlands", "Moedertaal"], ["Engels", "C1"]],
  },
  pl: {
    personal: { fullName: "Anna Kowalska", professionalTitle: "Product Manager", email: "anna@przyklad.pl", phone: "+48 512 345 678", location: "Warszawa, Polska", website: "annakowalska.pl", linkedIn: "linkedin.com/in/annakowalska", dateOfBirth: "12.04.1990", nationality: "Polska" },
    summary: "Product manager z ponad 8-letnim doświadczeniem przy platformach B2B. Przekłada złożone problemy na jasne roadmapy i mierzalne wyniki.",
    work: [["Senior Product Manager", "Allegro", "Warszawa", "Odpowiadała za roadmapę platformy płatności z ponad 2 mln klientów."], ["Product Manager", "Booksy", "Kraków", "Wdrożyła samodzielny onboarding, skracając czas aktywacji o 40%."]],
    education: ["Licencjat z zarządzania", "Szkoła Główna Handlowa", "Warszawa"],
    skills: ["Strategia", "Roadmapy", "Zarządzanie interesariuszami", "SQL", "Badania z użytkownikami"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["Polski", "Ojczysty"], ["Angielski", "C1"]],
  },
  tr: {
    personal: { fullName: "Elif Yılmaz", professionalTitle: "Ürün Yöneticisi", email: "elif@ornek.com.tr", phone: "+90 532 123 45 67", location: "İstanbul, Türkiye", website: "elifyilmaz.com", linkedIn: "linkedin.com/in/elifyilmaz", dateOfBirth: "12.04.1990", nationality: "T.C." },
    summary: "B2B platformlarda 8 yılı aşkın deneyime sahip ürün yöneticisi. Karmaşık sorunları net yol haritalarına ve ölçülebilir sonuçlara dönüştürür.",
    work: [["Kıdemli Ürün Yöneticisi", "Trendyol", "İstanbul", "2 milyondan fazla müşteriye hizmet veren ödeme platformunun yol haritasını yönetti."], ["Ürün Yöneticisi", "Getir", "Ankara", "Self-servis kayıt akışını başlatarak aktivasyon süresini %40 kısalttı."]],
    education: ["İşletme Lisans", "Boğaziçi Üniversitesi", "İstanbul"],
    skills: ["Strateji", "Yol haritası", "Paydaş yönetimi", "SQL", "Kullanıcı araştırması"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["Türkçe", "Ana dil"], ["İngilizce", "C1"]],
  },
  ru: {
    personal: { fullName: "Анна Смирнова", professionalTitle: "Менеджер продукта", email: "anna@primer.ru", phone: "+7 912 345-67-89", location: "Москва, Россия", website: "annasmirnova.ru", linkedIn: "linkedin.com/in/annasmirnova", dateOfBirth: "12.04.1990", nationality: "Россия" },
    summary: "Менеджер продукта с опытом более 8 лет в B2B-платформах. Превращает сложные задачи в понятные дорожные карты и измеримые результаты.",
    work: [["Старший менеджер продукта", "Тинькофф", "Москва", "Руководила дорожной картой платёжной платформы с более чем 2 млн клиентов."], ["Менеджер продукта", "Авито", "Санкт-Петербург", "Запустила самостоятельное подключение и сократила время активации на 40%."]],
    education: ["Бакалавр менеджмента", "НИУ ВШЭ", "Москва"],
    skills: ["Стратегия", "Дорожные карты", "Работа со стейкхолдерами", "SQL", "Исследования пользователей"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["Русский", "Родной"], ["Английский", "C1"]],
  },
  es: {
    personal: { fullName: "Lucía Fernández", professionalTitle: "Product Manager", email: "lucia@ejemplo.com", phone: "+34 600 123 456", location: "Madrid, España", website: "luciafernandez.es", linkedIn: "linkedin.com/in/luciafernandez", dateOfBirth: "12/04/1990", nationality: "Española" },
    summary: "Responsable de producto con más de 8 años lanzando plataformas B2B. Convierte problemas complejos en hojas de ruta claras y resultados medibles.",
    work: [["Senior Product Manager", "Cabify", "Madrid", "Lideró la hoja de ruta de una plataforma de pagos con más de 2 millones de clientes."], ["Product Manager", "Glovo", "Barcelona", "Lanzó el alta autoservicio y redujo el tiempo de activación un 40 %."]],
    education: ["Grado en Administración de Empresas", "Universidad Complutense de Madrid", "Madrid"],
    skills: ["Estrategia", "Hoja de ruta", "Gestión de stakeholders", "SQL", "Investigación de usuarios"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["Español", "Nativo"], ["Inglés", "C1"]],
  },
  fr: {
    personal: { fullName: "Camille Laurent", professionalTitle: "Cheffe de produit", email: "camille@exemple.fr", phone: "+33 6 12 34 56 78", location: "Paris, France", website: "camillelaurent.fr", linkedIn: "linkedin.com/in/camillelaurent", dateOfBirth: "12/04/1990", nationality: "Française" },
    summary: "Cheffe de produit avec plus de 8 ans d'expérience sur des plateformes B2B. Transforme des problèmes complexes en feuilles de route claires et en résultats mesurables.",
    work: [["Cheffe de produit senior", "BlaBlaCar", "Paris", "Pilotage de la feuille de route d'une plateforme de paiement utilisée par plus de 2 millions de clients."], ["Cheffe de produit", "Doctolib", "Lyon", "Lancement de l'inscription en libre-service : temps d'activation réduit de 40 %."]],
    education: ["Master Management", "ESSEC Business School", "Cergy"],
    skills: ["Stratégie", "Feuille de route", "Gestion des parties prenantes", "SQL", "Recherche utilisateur"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["Français", "Langue maternelle"], ["Anglais", "C1"]],
  },
  de: {
    personal: { fullName: "Jonas Becker", professionalTitle: "Produktmanager", email: "jonas@beispiel.de", phone: "+49 151 2345 6789", location: "Berlin, Deutschland", website: "jonasbecker.de", linkedIn: "linkedin.com/in/jonasbecker", dateOfBirth: "12.04.1990", nationality: "Deutsch" },
    summary: "Produktmanager mit über 8 Jahren Erfahrung mit B2B-Plattformen. Übersetzt komplexe Probleme in klare Roadmaps und messbare Ergebnisse.",
    work: [["Senior Produktmanager", "N26", "Berlin", "Verantwortung für die Roadmap einer Zahlungsplattform mit über 2 Mio. Kundinnen und Kunden."], ["Produktmanager", "Zalando", "Hamburg", "Einführung eines Self-Service-Onboardings, Aktivierungszeit um 40 % gesenkt."]],
    education: ["B.Sc. Betriebswirtschaftslehre", "Universität zu Köln", "Köln"],
    skills: ["Strategie", "Roadmapping", "Stakeholder-Management", "SQL", "Nutzerforschung"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["Deutsch", "Muttersprache"], ["Englisch", "C1"]],
  },
  ar: {
    personal: { fullName: "ليلى حداد", professionalTitle: "مديرة منتجات", email: "layla@example.com", phone: "+971 50 123 4567", location: "دبي، الإمارات", website: "laylahaddad.com", linkedIn: "linkedin.com/in/laylahaddad", dateOfBirth: "12/04/1990", nationality: "أردنية" },
    summary: "مديرة منتجات بخبرة تزيد على 8 سنوات في إطلاق منصات الأعمال. تحوّل المشكلات المعقدة إلى خطط واضحة ونتائج قابلة للقياس.",
    work: [["مديرة منتجات أولى", "كريم", "دبي", "قادت خطة منصة مدفوعات تخدم أكثر من مليوني عميل في المنطقة."], ["مديرة منتجات", "طلبات", "الكويت", "أطلقت التسجيل الذاتي وخفّضت وقت التفعيل بنسبة 40٪."]],
    education: ["بكالوريوس إدارة الأعمال", "الجامعة الأمريكية في الشارقة", "الشارقة"],
    skills: ["الاستراتيجية", "تخطيط المنتجات", "إدارة أصحاب المصلحة", "SQL", "أبحاث المستخدمين"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["العربية", "اللغة الأم"], ["الإنجليزية", "C1"]],
  },
  zh: {
    personal: { fullName: "王晓明", professionalTitle: "产品经理", email: "xiaoming@example.cn", phone: "+86 138 0013 8000", location: "上海", website: "wangxiaoming.cn", linkedIn: "linkedin.com/in/wangxiaoming", dateOfBirth: "1990年4月12日", nationality: "中国" },
    summary: "拥有 8 年以上 B2B 平台产品经验，善于把复杂问题转化为清晰的路线图和可量化的成果。",
    work: [["高级产品经理", "蚂蚁集团", "上海", "负责服务 200 万以上用户的支付平台路线图。"], ["产品经理", "美团", "北京", "上线自助开通流程，激活时间缩短 40%。"]],
    education: ["工商管理学士", "复旦大学", "上海"],
    skills: ["产品战略", "路线图规划", "干系人管理", "SQL", "用户研究"],
    certification: ["Certified Scrum Product Owner", "Scrum Alliance"],
    languages: [["中文", "母语"], ["英语", "流利（C1）"]],
  },
};

/** Sample CV in the given document language, used for template thumbnails. */
export function templatePreviewSample(locale: Locale): CvBuilderFormState {
  if (locale === "en") {
    return TEMPLATE_PREVIEW_SAMPLE_STATE;
  }
  const text = SAMPLE_TEXT[locale];
  const base = TEMPLATE_PREVIEW_SAMPLE_STATE;
  return {
    ...base,
    documentLocale: locale,
    personal: { ...base.personal, ...text.personal },
    summary: text.summary,
    workExperience: base.workExperience.map((entry, index) => {
      const [jobTitle, company, location, description] = text.work[index] ?? text.work[0];
      return { ...entry, jobTitle, company, location, description };
    }),
    education: base.education.map((entry) => ({
      ...entry,
      degree: text.education[0],
      institution: text.education[1],
      location: text.education[2],
    })),
    skills: text.skills,
    certifications: base.certifications.map((entry) => ({
      ...entry,
      name: text.certification[0],
      issuer: text.certification[1],
    })),
    languages: text.languages.map(([language, proficiency], index) => ({
      id: `sample-lang-${index}`,
      language,
      proficiency,
    })),
  };
}
