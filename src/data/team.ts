/**
 * Team members shown on /about. Edit here.
 * Photos: put files in public/team/ (e.g. member-1.jpg, 4:5 portrait) and set
 * `photo: '/team/member-1.jpg'`. Leave `photo: ''` to show the placeholder.
 */
export type TeamMember = {
  photo: string
  nameEn: string
  nameZh: string
  titleEn: string
  titleZh: string
}

export const team: TeamMember[] = [1, 2, 3, 4, 5].map(() => ({
  photo: '',
  nameEn: 'Name TBD',
  nameZh: '姓名待定',
  titleEn: 'Title TBD',
  titleZh: '职位待定',
}))
