/**
 * Team members shown on /about. Edit here.
 * Photos: public/team/member-N.jpg (4:5 portrait, ~800×1000) → photo: '/team/member-N.jpg'.
 * Current images are generated abstract silhouettes (placeholders).
 */
export type TeamMember = {
  photo: string
  nameEn: string
  nameZh: string
  titleEn: string
  titleZh: string
  bioEn: string
  bioZh: string
}

export const team: TeamMember[] = [1, 2, 3, 4, 5].map((n) => ({
  photo: `/team/member-${n}.jpg`,
  nameEn: 'Name TBD',
  nameZh: '姓名待定',
  titleEn: 'Title TBD',
  titleZh: '职位待定',
  bioEn: 'Short bio TBD — background, focus area, and what they build at SITAS.',
  bioZh: '简介待定——背景、专注方向，以及在 SITAS 负责的工作。',
}))
