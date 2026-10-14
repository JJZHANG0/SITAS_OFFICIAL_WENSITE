export type Lang = 'en' | 'zh'

export type Copy = {
  nav: [string, string, string, string, string]
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
  introLead: string
  introBody: string
  introProblemTitle: string
  introProblemBody: string
  introSolutionTitle: string
  introSolutionBody: string
  introPillarsTitle: string
  introPillars: [[string, string, string], [string, string, string], [string, string, string]]
  introPoints: [string, string, string]
  productKicker: string
  productTitle: string
  productLead: string
  productFlowTitle: string
  productFlow: [[string, string], [string, string], [string, string]]
  productHwTitle: string
  productHwBody: string
  productSwTitle: string
  productSwBody: string
  productAlcoaTitle: string
  productAlcoaBody: string
  productSecureTitle: string
  productSecureBody: string
  features: [[string, string], [string, string], [string, string]]
  caseKicker: string
  caseTitle: string
  caseLead: string
  original: string
  altered: string
  result: string
  continuity: string
  caseMetricLabel: string
  caseMetricValue: string
  caseLocalizeTitle: string
  caseLocalizeBody: string
  caseVerifyTitle: string
  caseVerifySteps: [string, string, string]
  caseStudiesLabel: string
  partnerKicker: string
  partnerTitle: string
  partnerLead: string
  partners: [[string, string, string], [string, string, string], [string, string, string]]
  contact: string
  contactHint: string
  planKicker: string
  planTitle: string
  planLead: string
  plans: [
    [string, string, string, string, string],
    [string, string, string, string, string],
    [string, string, string, string, string],
  ]
  companyKicker: string
  companyLine: string
  companyLead: string
  companyBody: string
  aboutKicker: string
  aboutTitle: string
  aboutBody: string
  aboutTeamTitle: string
  aboutTeamBody: string
  aboutFocus: [[string, string], [string, string], [string, string]]
  promise: string
  promiseBody: string
  footer: string
  scroll: string
  principles: [string, string, string]
  footerTag: string
  copyright: string
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
    introLead:
      'SITAS is Verisci’s integrity stack for biomedical imaging — hardware at the eyepiece, software for attestation and offline verify.',
    introBody:
      'At the moment of capture, SITAS seals a detached cryptographic manifest. The original file is never rewritten. Later, anyone with the image and the manifest can prove who signed, when, and whether every byte still matches.',
    introProblemTitle: 'The problem',
    introProblemBody:
      'Image integrity failures — duplication, splicing, selective enhancement — undermine trust from bench to publication. Screenshots and metadata alone cannot prove that a file is the capture-time original.',
    introSolutionTitle: 'The solution',
    introSolutionBody:
      'Detached attestation: SHA-256 content hashing, ECDSA P-256 signatures, optional RFC 3161 trusted timestamps, and 32×32 block fingerprints for tamper localization — all outside the pixel payload.',
    introPillarsTitle: 'Three pillars',
    introPillars: [
      [
        'Integrity',
        'SHA-256',
        'Bit-for-bit content digest bound at acquisition. Any edit flips the hash; the original stays untouched.',
      ],
      [
        'Authenticity',
        'ECDSA P-256',
        'Device- or lab-scoped signatures over the manifest. Verify signer identity without trusting the file itself.',
      ],
      [
        'Provenance',
        'TSA · blocks',
        'RFC 3161 timestamps plus block fingerprints localize forgeries when the global hash fails.',
      ],
    ],
    introPoints: [
      'Capture-time attestation',
      'Detached cryptographic proof',
      'Tamper localization when hashes fail',
    ],

    productKicker: 'Product system',
    productTitle: 'Integrity starts at the instrument.',
    productLead:
      'SITAS pairs an encrypted eyepiece path with software that attests, verifies, and supports ALCOA+ Original workflows — without embedding watermarks in science.',
    productFlowTitle: 'Capture → Attest → Verify',
    productFlow: [
      [
        'Capture',
        'Optical acquisition through the SITAS path. Pixels remain the scientific record; no overlay is baked into the image.',
      ],
      [
        'Attest',
        'A detached manifest binds SHA-256, signer identity, capture context, and optional TSA time — stored beside the file.',
      ],
      [
        'Verify',
        'Offline or networked verify: recompute hash, check ECDSA, inspect block fingerprints, and export an audit trail.',
      ],
    ],
    productHwTitle: 'Hardware path',
    productHwBody:
      'Eyepiece-class capture hardware designed for microscope partners. Secure element roadmap for hardware-bound keys (PKCS#11 / secure element) so signing keys never leave the device.',
    productSwTitle: 'Software path',
    productSwBody:
      'Manifest writer, offline verifier, and forensics viewer. Works with image + .sitas manifest pairs — no cloud dependency required for core verify.',
    productAlcoaTitle: 'ALCOA+ Original',
    productAlcoaBody:
      'Aligned with Attributable, Legible, Contemporaneous, Original, Accurate — and Complete, Consistent, Enduring, Available. Capture-time attestation supports “Original” without mutating pixels.',
    productSecureTitle: 'Secure element path',
    productSecureBody:
      'Today: software-hosted P-256 keys with lab policy. Next: hardware-bound signing so provenance is inseparable from the instrument that saw the sample.',
    features: [
      [
        'Attest',
        'At acquisition, SITAS binds SHA-256 integrity and an ECDSA P-256 signature into a detached manifest — the original image stays untouched.',
      ],
      [
        'Localize',
        '32×32 block fingerprints reveal whether a change is a global linear adjust or a local forgery — and where it sits.',
      ],
      [
        'Verify',
        'Offline verify with image + manifest: trusted time via RFC 3161 TSA, hash-linked audit trail, path to hardware-bound keys.',
      ],
    ],

    caseKicker: 'Evidence, examined',
    caseTitle: 'Every edit leaves a trace.',
    caseLead:
      'When a global hash fails, SITAS does not stop at “invalid.” Block fingerprints surface continuity loss and localize suspect regions for human review.',
    original: 'ORIGINAL / HASH MATCH',
    altered: 'ALTERED / INTEGRITY FLAGGED',
    result: 'Local tampering localized',
    continuity: 'Block fingerprint · suspect regions marked',
    caseMetricLabel: 'Continuity score',
    caseMetricValue: '62%',
    caseLocalizeTitle: 'Localization, not just rejection',
    caseLocalizeBody:
      'Global SHA-256 tells you something changed. 32×32 statistical fingerprints estimate which blocks diverge — distinguishing a uniform brightness shift from a pasted colony or erased feature.',
    caseVerifyTitle: 'Verify UX',
    caseVerifySteps: [
      'Load image + detached manifest',
      'Recompute hash · verify ECDSA · check TSA if present',
      'If mismatch: render continuity map and export findings',
    ],
    caseStudiesLabel: 'Case Studies',

    partnerKicker: 'Stronger science, together',
    partnerTitle: 'Built to connect the research ecosystem.',
    partnerLead:
      'SITAS is most powerful when labs, publishers, and instrument makers share one provenance language — from eyepiece to peer review.',
    partners: [
      [
        'Research Institutions',
        'Establish trustworthy provenance from the laboratory bench.',
        'Policy-ready audit trails, ALCOA+ Original support, and offline verify for regulated and academic labs.',
      ],
      [
        'Academic Publishers',
        'Add a verifiable integrity layer to image review.',
        'Machine-checkable manifests alongside submissions — fewer false positives than visual inspection alone.',
      ],
      [
        'Microscope Partners',
        'Integrate attestation into existing imaging systems.',
        'Eyepiece and OEM paths that add capture-time signing without rewriting acquisition software stacks.',
      ],
    ],
    contact: 'Start a conversation',
    contactHint: 'partnerships@sitas.bio',

    planKicker: 'A clearer future for research',
    planTitle: 'From one lens to a trusted standard.',
    planLead:
      'We ship in horizons — harden the core, prove it with institutions, then bind trust to hardware and interoperability.',
    plans: [
      [
        'NOW',
        'Prototype Validation',
        'Harden detached-manifest attestation, forensics accuracy, and offline verify.',
        'SHA-256 · ECDSA P-256 · block fingerprints',
        'Desktop verifier · eyepiece prototype · continuity maps',
      ],
      [
        'NEXT',
        'Institutional Pilots',
        'Test SITAS with laboratories and academic journals under real ALCOA+ workflows.',
        'Lab policy · publisher review hooks',
        'Pilot kits · training · integrity reports',
      ],
      [
        'FUTURE',
        'Integrity Network',
        'Hardware-bound signing and an interoperable provenance standard across vendors.',
        'Secure element · PKCS#11 · open manifest schema',
        'Cross-lab verify · OEM integrations',
      ],
    ],

    companyKicker: 'Our company',
    companyLine: 'Scientific integrity, built with technology.',
    companyLead: 'We build trust for the evidence that moves science forward.',
    companyBody:
      'From acquisition to publication, Verisci protects biomedical image provenance with capture-time attestation and detached cryptographic proof — originals remain bit-for-bit intact.',
    aboutKicker: 'Driven by belief. United by purpose.',
    aboutTitle: 'Scientific images should carry their own proof.',
    aboutBody:
      'Verisci builds SITAS at the intersection of biomedical imaging, cryptographic provenance, and research integrity — a product company, not a slide deck.',
    aboutTeamTitle: 'The team',
    aboutTeamBody:
      'Engineers, imaging scientists, and integrity advocates. We ship hardware-aware software, speak ALCOA+ fluently, and treat every pixel as potential evidence.',
    aboutFocus: [
      ['Imaging', 'Microscope workflows, eyepiece optics, capture context'],
      ['Cryptography', 'SHA-256, ECDSA P-256, RFC 3161 TSA, key custody'],
      ['Integrity', 'ALCOA+, publisher review, tamper localization'],
    ],
    promise: 'Our promise',
    promiseBody:
      'We will never rewrite your science to prove it. Proof lives beside the file — detached, auditable, and ready for offline verify.',
    footer: 'Proof Behind Every Pixel.',
    scroll: 'Scroll to explore',
    principles: ['Integrity', 'Precision', 'Transparency'],
    footerTag: 'Integrity / Precision / A better tomorrow',
    copyright: '© 2026 Verisci. All rights reserved.',
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
    introLead:
      'SITAS 是 Verisci 面向生物医学成像的完整性方案——目镜端硬件，存证与离线核验软件。',
    introBody:
      '采集瞬间，SITAS 生成分离的加密存证清单。原始文件一个字节都不改动。之后任何人只需图像与清单，即可证明谁签发、何时签发，以及是否仍逐字节一致。',
    introProblemTitle: '问题',
    introProblemBody:
      '图像完整性问题——重复、拼接、选择性增强——从实验台到发表不断侵蚀信任。截图与元数据 alone 都无法证明文件仍是采集时的原件。',
    introSolutionTitle: '方案',
    introSolutionBody:
      '分离式存证：SHA-256 内容哈希、ECDSA P-256 签名、可选 RFC 3161 可信时间戳，以及用于篡改定位的 32×32 分块指纹——全部独立于像素载荷。',
    introPillarsTitle: '三大支柱',
    introPillars: [
      [
        '完整性',
        'SHA-256',
        '采集时绑定的逐字节内容摘要。任何改动都会改变哈希；原图保持不变。',
      ],
      [
        '真实性',
        'ECDSA P-256',
        '设备或实验室范围的清单签名。无需信任文件本身即可核验签发者。',
      ],
      [
        '溯源',
        'TSA · 分块',
        'RFC 3161 时间戳与分块指纹，在全局哈希失配时定位伪造区域。',
      ],
    ],
    introPoints: ['采集瞬间完成存证', '分离式密码学证明', '哈希失配时定位篡改区域'],

    productKicker: '产品体系',
    productTitle: '可信证据，从仪器端开始。',
    productLead:
      'SITAS 将加密目镜路径与存证、核验、ALCOA+ Original 软件结合——不为“证明”而改写科学像素。',
    productFlowTitle: '采集 → 存证 → 核验',
    productFlow: [
      ['采集', '经 SITAS 光路采集。像素仍是科学记录；不向图像内嵌水印。'],
      ['存证', '分离清单绑定 SHA-256、签发者、采集上下文与可选 TSA 时间——与文件并列存放。'],
      ['核验', '离线或联网核验：重算哈希、检查 ECDSA、查看分块指纹，并导出审计轨迹。'],
    ],
    productHwTitle: '硬件路径',
    productHwBody:
      '面向显微镜伙伴的目镜级采集硬件。安全元件路线图支持硬件绑定密钥（PKCS#11 / 安全元件），签名密钥不离设备。',
    productSwTitle: '软件路径',
    productSwBody:
      '清单写入、离线核验与取证视图。图像 + .sitas 清单即可工作——核心核验不依赖云端。',
    productAlcoaTitle: 'ALCOA+ Original',
    productAlcoaBody:
      '对齐可归属、可读、同步、原始、准确，以及完整、一致、持久、可用。采集时存证支持“Original”，且不改动像素。',
    productSecureTitle: '安全元件路径',
    productSecureBody:
      '当前：实验室策略下的软件托管 P-256 密钥。下一步：硬件绑定签名，使溯源与“看见样本”的仪器不可分割。',
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
    caseLead:
      '当全局哈希失败，SITAS 不止于“无效”。分块指纹呈现连续性损失，并标出供人工复核的嫌疑区域。',
    original: '原始图像 / 哈希一致',
    altered: '疑似修改 / 完整性预警',
    result: '已定位局部篡改',
    continuity: '分块指纹 · 嫌疑区域已标记',
    caseMetricLabel: '连续性得分',
    caseMetricValue: '62%',
    caseLocalizeTitle: '定位，而不只是拒绝',
    caseLocalizeBody:
      '全局 SHA-256 只说明“有变化”。32×32 统计指纹估计哪些分块偏离——区分均匀亮度调整与粘贴菌落或抹除特征。',
    caseVerifyTitle: '核验体验',
    caseVerifySteps: [
      '加载图像与分离清单',
      '重算哈希 · 核验 ECDSA · 如有则检查 TSA',
      '若失配：渲染连续性图并导出结论',
    ],
    caseStudiesLabel: '案例研究',

    partnerKicker: '携手守护科研可信',
    partnerTitle: '连接更完整的科研生态。',
    partnerLead:
      '当实验室、出版方与仪器厂商共享同一套溯源语言，SITAS 的价值从目镜延伸到同行评议。',
    partners: [
      [
        '科研机构',
        '从实验室采集源头建立可信的图像档案。',
        '面向政策的审计轨迹、ALCOA+ Original 支持，以及监管与学术场景的离线核验。',
      ],
      [
        '学术出版机构',
        '为图像审查增加可验证的完整性层。',
        '投稿附带可机检清单——比纯目视审查更少误报。',
      ],
      [
        '成像设备伙伴',
        '将存证能力融入现有显微成像系统。',
        '目镜与 OEM 路径：在不重写采集软件栈的前提下加入采集时签名。',
      ],
    ],
    contact: '洽谈合作',
    contactHint: 'partnerships@sitas.bio',

    planKicker: '更清晰可信的科研未来',
    planTitle: '从一枚目镜，到一项可信标准。',
    planLead: '分阶段推进——夯实核心、与机构验证，再将信任绑定到硬件与互操作标准。',
    plans: [
      [
        '现在',
        '原型验证',
        '强化分离清单存证、取证精度与离线核验。',
        'SHA-256 · ECDSA P-256 · 分块指纹',
        '桌面核验器 · 目镜原型 · 连续性图',
      ],
      [
        '下一步',
        '机构试点',
        '与实验室及学术期刊在真实 ALCOA+ 流程中试点。',
        '实验室策略 · 出版审查接口',
        '试点套件 · 培训 · 完整性报告',
      ],
      [
        '未来',
        '完整性网络',
        '硬件绑定签名与跨厂商可互操作的溯源标准。',
        '安全元件 · PKCS#11 · 开放清单模式',
        '跨实验室核验 · OEM 集成',
      ],
    ],

    companyKicker: '关于 Verisci',
    companyLine: '以技术守护科研诚信。',
    companyLead: '让推动科学向前的每一份图像证据，都值得信赖。',
    companyBody:
      '从采集到发表，Verisci 以采集时存证与分离式密码学证明，守护生物医学图像来源——原始文件始终保持逐字节完整。',
    aboutKicker: '因信念而行动，因使命而同行',
    aboutTitle: '科研图像，应当自带可信证明。',
    aboutBody:
      'Verisci 在生物医学成像、密码学溯源与科研诚信的交汇处打造 SITAS——是产品公司，不是演示文稿。',
    aboutTeamTitle: '团队',
    aboutTeamBody:
      '工程师、成像科学家与诚信倡导者。我们交付感知硬件的软件，熟悉 ALCOA+，并把每个像素当作潜在证据。',
    aboutFocus: [
      ['成像', '显微镜流程、目镜光学、采集上下文'],
      ['密码学', 'SHA-256、ECDSA P-256、RFC 3161 TSA、密钥托管'],
      ['诚信', 'ALCOA+、出版审查、篡改定位'],
    ],
    promise: '我们的承诺',
    promiseBody:
      '我们不会为了“证明”而改写你的科学。证明与文件并列——分离、可审计，并可离线核验。',
    footer: '每一个像素，皆有证据。',
    scroll: '滑动探索',
    principles: ['诚信', '精准', '透明'],
    footerTag: '诚信 / 精准 / 更可信的明天',
    copyright: '© 2026 Verisci. 保留所有权利。',
  },
}
