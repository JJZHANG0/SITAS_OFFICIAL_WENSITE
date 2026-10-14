export type Lang = 'en' | 'zh'

export type Copy = {
  nav: [string, string, string, string, string]
  /** Immersive home arc destinations (Introduce … About) */
  navHome: [string, string, string, string, string, string]
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
  enter: string
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
    navHome: ['Introduce', 'Product', 'Cases', 'Partnership', 'Development', 'About'],
    language: 'Language',
    mode: 'Mode',
    light: 'Light',
    dark: 'Dark',
    product: 'Product',
    cases: 'Case Studies',
    heroKicker: 'Scientific image integrity · attested at capture',
    heroA: 'Born in the lens.',
    heroB: 'Proven beyond the frame.',
    discover: 'Discover SITAS',
    enter: 'Enter',
    introKicker: 'What is SITAS',
    introTitle: 'Evidence that carries its own proof.',
    introBody:
      'SITAS is a hardware-and-software integrity system for biomedical images. At capture, it seals a detached cryptographic manifest—never rewriting a single pixel of the original. Offline verification proves who signed, when, and whether the file still matches bit-for-bit.',
    introPoints: [
      'Capture-time attestation',
      'Detached cryptographic proof',
      'Tamper localization when hashes fail',
    ],
    productKicker: 'SITAS encrypted eyepiece',
    productTitle: 'Integrity starts at the instrument.',
    features: [
      [
        'Attest',
        'At acquisition, SITAS binds SHA-256 integrity and an ECDSA P-256 signature into a detached manifest—the original image stays untouched.',
      ],
      [
        'Localize',
        '32×32 block fingerprints reveal whether a change is a global linear adjust or a local forgery—and where it sits.',
      ],
      [
        'Verify',
        'Offline verify with image + manifest: trusted time via RFC 3161 TSA, hash-linked audit trail, path to hardware-bound keys.',
      ],
    ],
    caseKicker: 'Evidence, examined',
    caseTitle: 'Every edit leaves a trace.',
    original: 'ORIGINAL / HASH MATCH',
    altered: 'ALTERED / INTEGRITY FLAGGED',
    result: 'Local tampering localized',
    continuity: 'Block fingerprint · suspect regions marked',
    partnerKicker: 'Stronger science, together',
    partnerTitle: 'Built to connect the research ecosystem.',
    partners: [
      ['Research Institutions', 'Establish trustworthy provenance from the laboratory bench.'],
      ['Academic Publishers', 'Add a verifiable integrity layer to image review.'],
      ['Microscope Partners', 'Integrate attestation into existing imaging systems.'],
    ],
    contact: 'Start a conversation',
    planKicker: 'A clearer future for research',
    planTitle: 'From one lens to a trusted standard.',
    plans: [
      [
        'NOW',
        'Prototype Validation',
        'Harden detached-manifest attestation, forensics accuracy, and offline verify.',
      ],
      [
        'NEXT',
        'Institutional Pilots',
        'Test SITAS with laboratories and academic journals under real ALCOA+ workflows.',
      ],
      [
        'FUTURE',
        'Integrity Network',
        'Hardware-bound signing (secure element / PKCS#11) and an interoperable provenance standard.',
      ],
    ],
    companyKicker: 'Our company',
    companyLine: 'Scientific integrity, built with technology.',
    companyLead: 'We build trust for the evidence that moves science forward.',
    companyBody:
      'From acquisition to publication, Verisci protects biomedical image provenance with capture-time attestation and detached cryptographic proof—originals remain bit-for-bit intact.',
    aboutKicker: 'Driven by belief. United by purpose.',
    aboutTitle: 'Scientific images should carry their own proof.',
    aboutBody:
      'Verisci is a student-led team building SITAS at the intersection of biomedical imaging, cryptographic provenance, and research ethics.',
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
    navHome: ['介绍', '产品', '案例', '合作', '发展', '关于'],
    language: '语言',
    mode: '模式',
    light: '白天',
    dark: '夜晚',
    product: '产品',
    cases: '案例研究',
    heroKicker: '科研图像完整性 · 存证始于采集瞬间',
    heroA: '始于镜头。',
    heroB: '证据在帧外成立。',
    discover: '走近 SITAS',
    enter: '进入',
    introKicker: '认识 SITAS',
    introTitle: '让每一帧科研图像，都能自证可信。',
    introBody:
      'SITAS 是一套面向生物医学图像的软硬件完整性方案。采集瞬间生成分离的加密存证清单——原始图像一个字节都不改动。离线核验即可证明谁签发、何时签发，以及文件是否仍逐字节一致。',
    introPoints: ['采集瞬间完成存证', '分离式密码学证明', '哈希失配时定位篡改区域'],
    productKicker: 'SITAS 图像完整性终端',
    productTitle: '可信证据，从采集端开始。',
    features: [
      [
        '存证',
        '采集瞬间，SITAS 将 SHA-256 完整性与 ECDSA P-256 签名写入分离清单——原图保持 bit-for-bit 不变。',
      ],
      [
        '定位',
        '32×32 分块统计指纹区分全局线性调整与局部涂改，并标出嫌疑区域。',
      ],
      [
        '核验',
        '仅需图像与清单即可离线验证：RFC 3161 可信时间、哈希链审计轨迹，并通向硬件绑定密钥。',
      ],
    ],
    caseKicker: '证据核验',
    caseTitle: '每一次改动，都会留下痕迹。',
    original: '原始图像 / 哈希一致',
    altered: '疑似修改 / 完整性预警',
    result: '已定位局部篡改',
    continuity: '分块指纹 · 嫌疑区域已标记',
    partnerKicker: '携手守护科研可信',
    partnerTitle: '连接更完整的科研生态。',
    partners: [
      ['科研机构', '从实验室采集源头建立可信的图像档案。'],
      ['学术出版机构', '为图像审查与论文发表增加可验证的完整性依据。'],
      ['成像设备伙伴', '将采集时存证能力融入现有显微成像系统。'],
    ],
    contact: '洽谈合作',
    planKicker: '更清晰可信的科研未来',
    planTitle: '从一枚目镜，到一项可信标准。',
    plans: [
      ['现在', '原型验证', '强化分离清单存证、取证精度与离线核验。'],
      ['下一步', '机构试点', '与实验室及学术期刊在真实 ALCOA+ 流程中试点。'],
      ['未来', '完整性网络', '硬件绑定签名（安全元件 / PKCS#11）与可互操作的溯源标准。'],
    ],
    companyKicker: '关于 Verisci',
    companyLine: '以技术守护科研诚信。',
    companyLead: '让推动科学向前的每一份图像证据，都值得信赖。',
    companyBody:
      '从采集到发表，Verisci 以采集时存证与分离式密码学证明，守护生物医学图像来源——原始文件始终保持逐字节完整。',
    aboutKicker: '因信念而行动，因使命而同行',
    aboutTitle: '科研图像，应当自带可信证明。',
    aboutBody:
      'Verisci 是一支学生团队，在生物医学成像、密码学溯源与科研伦理的交汇处研发 SITAS。',
    promise: '我们的承诺',
    footer: '每一个像素，皆有证据。',
    scroll: '滑动探索',
    principles: ['诚信', '精准', '透明'],
    footerTag: '诚信 / 精准 / 更可信的明天',
    copyright: '© 2026 Verisci. 保留所有权利。',
    caseStudiesLabel: '案例研究',
  },
}
