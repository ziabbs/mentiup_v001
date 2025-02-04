import { FlowSteps } from "./types"

export const flowSteps: FlowSteps = {
  'mentorship-type': {
    id: 'mentorship-type',
    message: 'Merhaba! Ben Lola 👋 Sana nasıl yardımcı olabilirim?',
    subMessage: 'Hangi konuda mentorluk almak istediğini seçebilir misin?',
    options: [
      { id: 'career-development', title: 'Kariyer Gelişim Mentoru', description: 'Kariyer hedeflerine ulaşmak için yol gösterecek bir mentor' },
      { id: 'senior-career', title: 'Üst Düzey Kariyer Mentoru', description: 'Yönetici pozisyonuna geçiş veya C-Level olma yolunda destek olacak bir mentor' },
      { id: 'startup', title: 'Startup Mentoru', description: 'Girişimini büyütmek veya yeni bir girişim başlatmak için rehberlik edecek bir mentor' },
      { id: 'senior-startup', title: 'Usta StartUP Mentoru', description: 'Deneyimli bir startup mentoru ile çalışmak istiyorum' }
    ],
    nextStep: (optionId) => {
      switch (optionId) {
        case 'career-development':
          return 'career-development_fields'
        case 'senior-career':
          return 'senior-career_fields'
        case 'startup':
          return 'startup_fields'
        case 'senior-startup':
          return 'senior-startup_fields'
        default:
          return undefined
      }
    }
  },

  // Career Development Flow
  'career-development_fields': {
    id: 'career-development_fields',
    message: 'Öncelikle hangi alanlarda kariyer yapmak istediğini öğrenebilir miyim?',
    subMessage: 'En fazla 3 alan seçebilirsin. İstediğin alanı yazarak da arayabilirsin.',
    options: [
      { id: 'career_development_field_marketing', title: 'Pazarlama', description: 'Satış, Marka, Dış Ticaret' },
      { id: 'career_development_field_finance', title: 'Finans', description: 'İşletme Finansı, Mali İşler, Muhasebe, Denetim' },
      { id: 'career_development_field_finance_markets', title: 'Finans ve Piyasalar', description: 'Yatırım, Sermaye Piyasaları, Bankacılık, Sigortacılık' },
      { id: 'career_development_field_production', title: 'Üretim', description: 'Kurulum, İşletme, Bakım, Planlama, Kalite Kontrol' },
      { id: 'career_development_field_rd_bd', title: 'AR-GE, ÜR-GE ve İş Geliştirme', description: '' },
      { id: 'career_development_field_logistics', title: 'Lojistik', description: 'Satınalma, Tedarik, Depo, Servis, Bakım' },
      { id: 'career_development_field_communication', title: 'İletişim', description: 'Tanıtım, Halkla İlişkiler, Sosyal Medya, Reklam' }
    ],
    nextStep: () => 'career-development_industries'
  },
  'career-development_industries': {
    id: 'career-development_industries',
    message: 'Hangi sektörlerde çalışmak istiyorsun?',
    subMessage: 'Birden fazla sektör seçebilirsin',
    options: [
      { id: 'career_development_industry_energy', title: 'Enerji', description: 'Elektrik Üretimi, Yenilenebilir Enerji, Enerji Dağıtımı' },
      { id: 'career_development_industry_electronics', title: 'Elektrik ve Elektronik', description: 'Elektronik Cihazlar, Endüstriyel Elektronik, Güç Sistemleri' },
      { id: 'career_development_industry_telecom', title: 'Telekomünikasyon', description: 'Mobil İletişim, Network Altyapısı, Veri İletişimi' },
      { id: 'career_development_industry_metal_machinery', title: 'Metal ve Makine', description: 'Metal İşleme, Makine İmalatı, Madeni Eşya Üretimi' },
      { id: 'career_development_industry_home_appliances', title: 'Beyaz ve Ev Eşyası', description: 'Beyaz Eşya, Küçük Ev Aletleri, Ev Tekstili' },
      { id: 'career_development_industry_automotive', title: 'Otomotiv', description: 'Araç Üretimi, Yedek Parça, Otomotiv Elektroniği' },
      { id: 'career_development_industry_construction', title: 'Yapı ve İnşaat', description: 'Konut İnşaatı, Altyapı Projeleri, Mimari Tasarım' },
      { id: 'career_development_industry_environment', title: 'Çevre', description: 'Atık Yönetimi, Geri Dönüşüm, Çevre Danışmanlığı' },
      { id: 'career_development_industry_textile', title: 'Tekstil ve Hazır Giyim', description: 'Kumaş Üretimi, Hazır Giyim, Deri Ürünleri' },
      { id: 'career_development_industry_transportation', title: 'Ulaşım', description: 'Hava Taşımacılığı, Kara Taşımacılığı, Deniz Taşımacılığı' },
      { id: 'career_development_industry_chemistry', title: 'Kimya', description: 'Endüstriyel Kimya, Kozmetik, Boya ve Kaplama' },
      { id: 'career_development_industry_rubber_plastic', title: 'Kauçuk ve Plastik', description: 'Plastik Ürünler, Kauçuk İmalatı, Ambalaj' },
      { id: 'career_development_industry_pharmaceutical', title: 'İlaç', description: 'İlaç Üretimi, Medikal Cihazlar, Biyoteknoloji' },
      { id: 'career_development_industry_food_beverage', title: 'Gıda ve İçecek', description: 'Gıda İşleme, İçecek Üretimi, Tarımsal Ürünler' },
      { id: 'career_development_industry_fmcg', title: 'Hızlı Tüketim', description: 'Kişisel Bakım, Ev Bakım, Paketli Gıda' },
      { id: 'career_development_industry_retail', title: 'Perakende ve Ticaret', description: 'Mağazacılık, E-ticaret, Toptan Ticaret' },
      { id: 'career_development_industry_research', title: 'Araştırma', description: 'Pazar Araştırması, Saha Araştırması, Veri Analizi' },
      { id: 'career_development_industry_tourism', title: 'Turizm ve Eğlence', description: 'Otelcilik, Seyahat, Yeme-İçme' },
      { id: 'career_development_industry_agriculture', title: 'Tarım ve Hayvancılık', description: 'Tarımsal Üretim, Hayvancılık, Balıkçılık' },
      { id: 'career_development_industry_natural_resources', title: 'Doğal Kaynaklar', description: 'Madencilik, Cam ve Seramik, Su Kaynakları' },
      { id: 'career_development_industry_wood_products', title: 'Ağaç ve Mobilya', description: 'Mobilya Üretimi, Kağıt Ürünleri, Ahşap İşleme' }
    ],
    nextStep: () => 'career-development_goals'
  },
  'career-development_goals': {
    id: 'career-development_goals',
    message: 'Kariyer hedefin ne olacak?',
    subMessage: 'Bu hedef doğrultusunda sana en uygun mentoru eşleştirebilirim',
    options: [
      { id: 'career_development_goal_career_roadmap', title: 'Hedef belirlemek ve bir kariyer yol haritası oluşturmak', description: 'Kariyerinizde ilerlemek için net hedefler belirlemek ve bu hedeflere ulaşmak için bir yol haritası oluşturmak' },
      { id: 'career_development_goal_personal_branding', title: 'Kendime uygun bir dar alanda markalaşmak', description: 'Uzmanlık alanınızda güçlü bir kişisel marka oluşturmak ve tanınırlığınızı artırmak' },
      { id: 'career_development_goal_maximize_income', title: 'Yeteneklerime uygun bir alanda maksimum geliri elde edebilmek', description: 'Becerilerinizi en iyi şekilde değerlendirerek potansiyel gelirinizi maksimize etmek' },
      { id: 'career_development_goal_job_support', title: 'İş bulabilmek için gerekli desteği almak', description: 'CV hazırlama, mülakat teknikleri ve iş arama stratejileri konusunda profesyonel destek almak' },
      { id: 'career_development_goal_other', title: 'Diğer', description: 'Yukarıdakilerden farklı bir hedef' }
    ],
    nextStep: () => 'expectation'
  },

  // Senior Career Flow
  'senior-career_fields': {
    id: 'senior-career_fields',
    message: 'Hangi alanda uzmanlaşmak istiyorsunuz?',
    options: [
      { id: 'senior_career_field_general_management', title: 'Genel Yönetim' },
      { id: 'senior_career_field_finance', title: 'Finans' },
      { id: 'senior_career_field_operations', title: 'Operasyon' }
    ],
    nextStep: () => 'senior-career_industries'
  },
  'senior-career_industries': {
    id: 'senior-career_industries',
    message: 'Hangi sektörde ilerlemek istiyorsunuz?',
    options: [
      { id: 'senior_career_industry_technology', title: 'Teknoloji' },
      { id: 'senior_career_industry_finance', title: 'Finans' },
      { id: 'senior_career_industry_manufacturing', title: 'Üretim' }
    ],
    nextStep: () => 'senior-career_goals'
  },
  'senior-career_goals': {
    id: 'senior-career_goals',
    message: 'Kariyer hedefiniz nedir?',
    options: [
      { id: 'senior_career_goal_cxo', title: 'C-Level pozisyona geçiş' },
      { id: 'senior_career_goal_board', title: 'Yönetim Kurulu Üyeliği' },
      { id: 'senior_career_goal_leadership', title: 'Liderlik becerilerini geliştirme' }
    ],
    nextStep: () => 'expectation'
  },

  // Startup Flow
  'startup_fields': {
    id: 'startup_fields',
    message: 'Girişiminiz hangi alanda faaliyet gösteriyor?',
    options: [
      { id: 'startup_field_saas', title: 'SaaS' },
      { id: 'startup_field_marketplace', title: 'Marketplace' },
      { id: 'startup_field_hardware', title: 'Donanım' }
    ],
    nextStep: () => 'startup_stages'
  },
  'startup_stages': {
    id: 'startup_stages',
    message: 'Girişiminiz hangi aşamada?',
    options: [
      { id: 'startup_stage_idea', title: 'Fikir Aşaması' },
      { id: 'startup_stage_mvp', title: 'MVP' },
      { id: 'startup_stage_market', title: 'Pazarda' }
    ],
    nextStep: () => 'startup_goals'
  },
  'startup_goals': {
    id: 'startup_goals',
    message: 'Öncelikli hedefiniz nedir?',
    options: [
      { id: 'startup_goal_funding', title: 'Yatırım almak' },
      { id: 'startup_goal_product', title: 'Ürün geliştirmek' },
      { id: 'startup_goal_growth', title: 'Büyüme stratejisi' }
    ],
    nextStep: () => 'expectation'
  },

  // Senior Startup Flow
  'senior-startup_fields': {
    id: 'senior-startup_fields',
    message: 'Girişiminiz hangi alanda faaliyet gösteriyor?',
    options: [
      { id: 'senior_startup_field_saas', title: 'SaaS' },
      { id: 'senior_startup_field_marketplace', title: 'Marketplace' },
      { id: 'senior_startup_field_hardware', title: 'Donanım' }
    ],
    nextStep: () => 'senior-startup_stages'
  },
  'senior-startup_stages': {
    id: 'senior-startup_stages',
    message: 'Girişiminiz hangi aşamada?',
    options: [
      { id: 'senior_startup_stage_seed', title: 'Seed' },
      { id: 'senior_startup_stage_series_a', title: 'Series A' },
      { id: 'senior_startup_stage_series_b', title: 'Series B+' }
    ],
    nextStep: () => 'senior-startup_goals'
  },
  'senior-startup_goals': {
    id: 'senior-startup_goals',
    message: 'Öncelikli hedefiniz nedir?',
    options: [
      { id: 'senior_startup_goal_scale', title: 'Girişimi Büyütmek', description: 'Mevcut girişimimi büyütmek ve ölçeklendirmek istiyorum' },
      { id: 'senior_startup_goal_investment', title: 'Yatırım Almak', description: 'Girişimim için yatırım almak istiyorum' },
      { id: 'senior_startup_goal_exit', title: 'Exit Stratejisi', description: 'Girişimim için exit stratejisi belirlemek istiyorum' }
    ],
    nextStep: () => 'expectation'
  },

  'expectation': {
    id: 'expectation',
    message: 'Mentorundan beklentilerin neler?',
    subMessage: 'Beklentilerini paylaşarak sana en uygun mentoru bulmamıza yardımcı olabilirsin.',
    options: [
      { id: 'expectation_career_path', title: 'Kariyer Yol Haritası', description: 'Kariyer hedeflerime ulaşmak için net bir yol haritası' },
      { id: 'expectation_skill_development', title: 'Yetkinlik Geliştirme', description: 'Teknik ve yönetsel becerilerimi geliştirmek' },
      { id: 'expectation_network', title: 'Network Geliştirme', description: 'Sektörde güçlü bir network oluşturmak' },
      { id: 'expectation_leadership', title: 'Liderlik Gelişimi', description: 'Liderlik becerilerimi geliştirmek' },
      { id: 'expectation_business_strategy', title: 'İş Stratejisi', description: 'Etkili iş stratejileri geliştirmek' }
    ],
    nextStep: () => 'completion'
  },

  'completion': {
    id: 'completion',
    message: 'Harika! Profiliniz oluşturuldu. Şimdi mentorunuzla sohbete başlayabilirsiniz.',
    nextStep: () => undefined
  }
}
