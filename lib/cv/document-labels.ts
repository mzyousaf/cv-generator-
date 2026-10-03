import type { Locale } from "@/lib/i18n/preferences";

/**
 * Words printed inside the CV document itself (preview and PDF). These follow
 * the CV's document language, which can differ from the app's UI language.
 */
export type CvDocumentLabels = {
  summary: string;
  profile: string;
  objective: string;
  workExperience: string;
  professionalExperience: string;
  education: string;
  educationTraining: string;
  skills: string;
  projects: string;
  certifications: string;
  languages: string;
  personalDetails: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedin: string;
  dateOfBirth: string;
  nationality: string;
  present: string;
  yourName: string;
  professionalTitle: string;
  jobTitle: string;
  degree: string;
  project: string;
  certification: string;
  language: string;
  customSection: string;
  emptyHint: string;
  placeDate: string;
  signature: string;
  referencesOnRequest: string;
  curriculumVitae: string;
};

export const CV_DOCUMENT_LABELS: Record<Locale, CvDocumentLabels> = {
  en: {
    summary: "Professional Summary",
    profile: "Personal Profile",
    objective: "Career Objective",
    workExperience: "Work Experience",
    professionalExperience: "Professional Experience",
    education: "Education",
    educationTraining: "Education and Training",
    skills: "Skills",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
    personalDetails: "Personal Details",
    contact: "Contact",
    email: "Email",
    phone: "Phone",
    address: "Address",
    website: "Website",
    linkedin: "LinkedIn",
    dateOfBirth: "Date of birth",
    nationality: "Nationality",
    present: "Present",
    yourName: "Your Name",
    professionalTitle: "Professional Title",
    jobTitle: "Job Title",
    degree: "Degree",
    project: "Project",
    certification: "Certification",
    language: "Language",
    customSection: "Custom Section",
    emptyHint: "Start filling in the editor to see your CV preview here.",
    placeDate: "Place, date",
    signature: "Signature",
    referencesOnRequest: "References available upon request.",
    curriculumVitae: "Curriculum Vitae",
  },
  es: {
    summary: "Resumen profesional",
    profile: "Perfil personal",
    objective: "Objetivo profesional",
    workExperience: "Experiencia laboral",
    professionalExperience: "Experiencia profesional",
    education: "Formación",
    educationTraining: "Educación y formación",
    skills: "Habilidades",
    projects: "Proyectos",
    certifications: "Certificaciones",
    languages: "Idiomas",
    personalDetails: "Datos personales",
    contact: "Contacto",
    email: "Correo electrónico",
    phone: "Teléfono",
    address: "Dirección",
    website: "Sitio web",
    linkedin: "LinkedIn",
    dateOfBirth: "Fecha de nacimiento",
    nationality: "Nacionalidad",
    present: "Actualidad",
    yourName: "Tu nombre",
    professionalTitle: "Título profesional",
    jobTitle: "Puesto",
    degree: "Título",
    project: "Proyecto",
    certification: "Certificación",
    language: "Idioma",
    customSection: "Sección personalizada",
    emptyHint: "Empieza a rellenar el editor para ver aquí la vista previa de tu CV.",
    placeDate: "Lugar y fecha",
    signature: "Firma",
    referencesOnRequest: "Referencias disponibles a petición.",
    curriculumVitae: "Currículum vítae",
  },
  fr: {
    summary: "Profil professionnel",
    profile: "Profil",
    objective: "Objectif professionnel",
    workExperience: "Expérience professionnelle",
    professionalExperience: "Parcours professionnel",
    education: "Formation",
    educationTraining: "Éducation et formation",
    skills: "Compétences",
    projects: "Projets",
    certifications: "Certifications",
    languages: "Langues",
    personalDetails: "Informations personnelles",
    contact: "Contact",
    email: "E-mail",
    phone: "Téléphone",
    address: "Adresse",
    website: "Site web",
    linkedin: "LinkedIn",
    dateOfBirth: "Date de naissance",
    nationality: "Nationalité",
    present: "Aujourd'hui",
    yourName: "Votre nom",
    professionalTitle: "Titre professionnel",
    jobTitle: "Intitulé du poste",
    degree: "Diplôme",
    project: "Projet",
    certification: "Certification",
    language: "Langue",
    customSection: "Section personnalisée",
    emptyHint: "Commencez à remplir l'éditeur pour voir l'aperçu de votre CV ici.",
    placeDate: "Lieu, date",
    signature: "Signature",
    referencesOnRequest: "Références disponibles sur demande.",
    curriculumVitae: "Curriculum vitae",
  },
  de: {
    summary: "Berufliches Profil",
    profile: "Profil",
    objective: "Berufliches Ziel",
    workExperience: "Berufserfahrung",
    professionalExperience: "Beruflicher Werdegang",
    education: "Ausbildung",
    educationTraining: "Schul- und Berufsausbildung",
    skills: "Kenntnisse und Fähigkeiten",
    projects: "Projekte",
    certifications: "Zertifikate",
    languages: "Sprachkenntnisse",
    personalDetails: "Persönliche Daten",
    contact: "Kontakt",
    email: "E-Mail",
    phone: "Telefon",
    address: "Anschrift",
    website: "Website",
    linkedin: "LinkedIn",
    dateOfBirth: "Geburtsdatum",
    nationality: "Staatsangehörigkeit",
    present: "heute",
    yourName: "Ihr Name",
    professionalTitle: "Berufsbezeichnung",
    jobTitle: "Position",
    degree: "Abschluss",
    project: "Projekt",
    certification: "Zertifikat",
    language: "Sprache",
    customSection: "Weiterer Abschnitt",
    emptyHint: "Füllen Sie den Editor aus, um hier die Vorschau Ihres Lebenslaufs zu sehen.",
    placeDate: "Ort, Datum",
    signature: "Unterschrift",
    referencesOnRequest: "Referenzen auf Anfrage.",
    curriculumVitae: "Lebenslauf",
  },
  ar: {
    summary: "الملخص المهني",
    profile: "نبذة شخصية",
    objective: "الهدف المهني",
    workExperience: "الخبرة العملية",
    professionalExperience: "الخبرة المهنية",
    education: "التعليم",
    educationTraining: "التعليم والتدريب",
    skills: "المهارات",
    projects: "المشاريع",
    certifications: "الشهادات",
    languages: "اللغات",
    personalDetails: "البيانات الشخصية",
    contact: "معلومات التواصل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    address: "العنوان",
    website: "الموقع الإلكتروني",
    linkedin: "LinkedIn",
    dateOfBirth: "تاريخ الميلاد",
    nationality: "الجنسية",
    present: "حتى الآن",
    yourName: "اسمك",
    professionalTitle: "المسمى المهني",
    jobTitle: "المسمى الوظيفي",
    degree: "الدرجة العلمية",
    project: "مشروع",
    certification: "شهادة",
    language: "اللغة",
    customSection: "قسم مخصص",
    emptyHint: "ابدأ بملء المحرر لترى معاينة سيرتك الذاتية هنا.",
    placeDate: "المكان والتاريخ",
    signature: "التوقيع",
    referencesOnRequest: "المراجع متاحة عند الطلب.",
    curriculumVitae: "السيرة الذاتية",
  },
  zh: {
    summary: "个人简介",
    profile: "自我评价",
    objective: "求职意向",
    workExperience: "工作经历",
    professionalExperience: "职业经历",
    education: "教育背景",
    educationTraining: "教育与培训",
    skills: "专业技能",
    projects: "项目经历",
    certifications: "证书资质",
    languages: "语言能力",
    personalDetails: "基本信息",
    contact: "联系方式",
    email: "邮箱",
    phone: "电话",
    address: "所在地",
    website: "个人网站",
    linkedin: "LinkedIn",
    dateOfBirth: "出生日期",
    nationality: "国籍",
    present: "至今",
    yourName: "你的姓名",
    professionalTitle: "职位头衔",
    jobTitle: "职位",
    degree: "学位",
    project: "项目",
    certification: "证书",
    language: "语言",
    customSection: "自定义板块",
    emptyHint: "开始在编辑器中填写，即可在此预览简历。",
    placeDate: "地点、日期",
    signature: "签名",
    referencesOnRequest: "如需推荐人信息，可应要求提供。",
    curriculumVitae: "个人简历",
  },
};

/** BCP 47 tag used for date formatting in the CV document. */
export const CV_DATE_LOCALE: Record<Locale, string> = {
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ar: "ar-u-nu-latn",
  zh: "zh-CN",
};
