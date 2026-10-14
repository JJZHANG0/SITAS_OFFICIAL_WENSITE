export type Lang = 'en' | 'zh'

export type Copy = {
  nav: [string, string, string, string, string]
  language: string
  mode: string
  light: string
  dark: string
  product: string
  cases: string
  heroKicker: string
  heroA: string
  heroB: string
  discover: string
  introKicker: string
  introTitle: string
  introBody: string
  introPoints: [string, string, string]
  productKicker: string
  productTitle: string
  features: [[string, string], [string, string], [string, string]]
  caseKicker: string
  caseTitle: string
  original: string
  altered: string
  result: string
  continuity: string
  partnerKicker: string
  partnerTitle: string
  partners: [[string, string], [string, string], [string, string]]
  contact: string
  planKicker: string
  planTitle: string
  plans: [[string, string, string], [string, string, string], [string, string, string]]
  companyKicker: string
  companyLine: string
  companyLead: string
  companyBody: string
  aboutKicker: string
  aboutTitle: string
  aboutBody: string
  promise: string
  footer: string
  scroll: string
  principles: [string, string, string]
  footerTag: string
  copyright: string
  caseStudiesLabel: string
}

export const copy: Record<Lang, Copy> = {
  en: {
    nav: ['Introduce', 'Features', 'Partnership', 'Development Plan', 'About Us'],
    language: 'Language',
    mode: 'Mode',
    light: 'Light',
    dark: 'Dark',
    product: 'Product',
    cases: 'Case Studies',
    heroKicker: 'Scientific image integrity · secured at capture',
    heroA: 'Born in the lens.',
    heroB: 'Clear until the end.',
    discover: 'Discover SITAS',
    introKicker: 'What is SITAS',
    introTitle: 'Evidence that carries its own proof.',
    introBody:
      'SITAS is a hardware-and-software integrity system for biomedical images. It embeds an invisible digital watermark at the instant of microscope capture, then verifies that watermark through our mini program—revealing whether the visual evidence may have been altered.',
    introPoints: [
      'Capture-time watermarking',
      'Invisible evidence protection',
      'Post-capture integrity verification',
    ],
    productKicker: 'SITAS encrypted eyepiece',
    productTitle: 'Integrity starts at the instrument.',
    features: [
      ['Capture', 'The moment an image is acquired, SITAS binds it to a secure digital watermark.'],
      ['Protect', 'The watermark travels with the image without disrupting scientific content.'],
      ['Verify', 'Upload through our mini program to assess continuity and detect alteration.'],
    ],
    caseKicker: 'Evidence, examined',
    caseTitle: 'Every edit leaves a trace.',
    original: 'ORIGINAL / WATERMARK INTACT',
    altered: 'ALTERED / INTEGRITY FLAGGED',
    result: 'Possible alteration detected',
    continuity: 'Watermark continuity 84.2%',
    partnerKicker: 'Stronger science, together',
    partnerTitle: 'Built to connect the research ecosystem.',
    partners: [
      ['Research Institutions', 'Establish trustworthy provenance from the laboratory bench.'],
      ['Academic Publishers', 'Add a verifiable integrity layer to image review.'],
      ['Microscope Partners', 'Integrate protection into existing imaging systems.'],
    ],
    contact: 'Start a conversation',
    planKicker: 'A clearer future for research',
    planTitle: 'From one lens to a trusted standard.',
    plans: [
      ['NOW', 'Prototype Validation', 'Refine watermark resilience and verification accuracy.'],
      ['NEXT', 'Institutional Pilots', 'Test SITAS with laboratories and academic journals.'],
      ['FUTURE', 'Integrity Network', 'Build an interoperable standard for scientific image provenance.'],
    ],
    companyKicker: 'Our company',
    companyLine: 'Scientific integrity, built with technology.',
    companyLead: 'We build trust for the evidence that moves science forward.',
    companyBody:
      'From acquisition to publication, Verisci protects biomedical image provenance with a seamless hardware and software system.',
    aboutKicker: 'Driven by belief. United by purpose.',
    aboutTitle: 'Scientific images should carry their own proof.',
    aboutBody:
      'Verisci is a student-led team building SITAS at the intersection of biomedical imaging, digital watermarking, and research ethics.',
    promise: 'Our promise',
    footer: 'Proof Behind Every Pixel.',
    scroll: 'Scroll to explore',
    principles: ['Integrity', 'Precision', 'Transparency'],
    footerTag: 'Integrity / Precision / A better tomorrow',
    copyright: '© 2026 Verisci. All rights reserved.',
    caseStudiesLabel: 'Case Studies',
  },
  zh: {
    nav: ['产品介绍', '核心功能', '合作伙伴', '发展计划', '关于我们'],
    language: '语言',
    mode: '模式',
    light: '白天',
    dark: '夜晚',
    product: '产品',
    cases: '案例研究',
    heroKicker: '科研图像完整性 · 保护始于采集瞬间',
    heroA: '始于镜头。',
    heroB: '所见可信，直至终章。',
    discover: '走近 SITAS',
    introKicker: '认识 SITAS',
    introTitle: '让每一帧科研图像，都能自证可信。',
    introBody:
      'SITAS 是一套面向生物医学图像的软硬件完整性方案。系统在显微成像的瞬间写入不可见数字水印，并通过小程序核验水印连续性，为图像是否经历篡改提供清晰、可追溯的判断依据。',
    introPoints: ['采集瞬间完成水印写入', '无感保护原始图像证据', '随时核验图像完整性'],
    productKicker: 'SITAS 图像完整性终端',
    productTitle: '可信证据，从采集端开始。',
    features: [
      ['采集', '图像拍摄的瞬间，SITAS 将安全数字水印与图像绑定。'],
      ['保护', '水印随图像流转，不干扰科研内容与既有工作流程。'],
      ['验证', '上传至小程序，检测水印连续性并识别可能的篡改。'],
    ],
    caseKicker: '证据核验',
    caseTitle: '每一次改动，都会留下痕迹。',
    original: '原始图像 / 水印完整',
    altered: '疑似修改 / 完整性预警',
    result: '发现疑似图像改动',
    continuity: '水印连续性 84.2%',
    partnerKicker: '携手守护科研可信',
    partnerTitle: '连接更完整的科研生态。',
    partners: [
      ['科研机构', '从实验室采集源头建立可信的图像档案。'],
      ['学术出版机构', '为图像审查与论文发表增加可验证的完整性依据。'],
      ['成像设备伙伴', '将采集时保护能力融入现有显微成像系统。'],
    ],
    contact: '洽谈合作',
    planKicker: '更清晰可信的科研未来',
    planTitle: '从一枚目镜，到一项可信标准。',
    plans: [
      ['现在', '原型验证', '提升水印韧性与验证准确率。'],
      ['下一步', '机构试点', '与实验室及学术期刊开展真实环境测试。'],
      ['未来', '完整性网络', '建立可互操作的科研图像溯源标准。'],
    ],
    companyKicker: '关于 Verisci',
    companyLine: '以技术守护科研诚信。',
    companyLead: '让推动科学向前的每一份图像证据，都值得信赖。',
    companyBody:
      '从采集到发表，Verisci 以协同工作的硬件与软件，为生物医学图像建立贯穿全流程的可信来源。',
    aboutKicker: '因信念而行动，因使命而同行',
    aboutTitle: '科研图像，应当自带可信证明。',
    aboutBody:
      'Verisci 是一支学生团队，在生物医学成像、数字水印和科研伦理的交汇处研发 SITAS。',
    promise: '我们的承诺',
    footer: '每一个像素，皆有证据。',
    scroll: '滑动探索',
    principles: ['诚信', '精准', '透明'],
    footerTag: '诚信 / 精准 / 更可信的明天',
    copyright: '© 2026 Verisci. 保留所有权利。',
    caseStudiesLabel: '案例研究',
  },
}
