import { mockResponse } from './index'

// 导入图片
import activityCenter from '@/assets/images/common/大学生活动中心.png'
import musicValley from '@/assets/images/common/音乐谷.png'
import library from '@/assets/images/common/图书馆1.jpg'
import campus3 from '@/assets/images/common/校园3.jpg'
import playground from '@/assets/images/common/操场.jpg'
import playground2 from '@/assets/images/common/操场2.jpg'
import playground3 from '@/assets/images/common/操场3.jpg'
import campus4 from '@/assets/images/common/校园4.jpg'
import campus5 from '@/assets/images/common/校园5.jpg'

export const getActivitiesData = () => {
  return mockResponse({
    banner: {
      title: '文化活动',
      subtitle: '丰富多彩的校园文化生活',
      image: activityCenter
    },
    currentActivities: [
      {
        id: 1,
        title: '2024春季校园文化节',
        time: '2024-03-01 至 2024-03-15',
        location: '校园各处',
        type: '文艺演出',
        status: '正在进行',
        registration: {
          status: 'open',
          deadline: '2024-02-28',
          maxParticipants: 500,
          currentParticipants: 320,
          requirements: [
            '在校学生',
            '对艺术表演有浓厚兴趣',
            '能够参与全程活动'
          ],
          categories: [
            { id: 1, name: '音乐表演', quota: 100, registered: 80 },
            { id: 2, name: '舞蹈表演', quota: 100, registered: 75 },
            { id: 3, name: '戏剧表演', quota: 100, registered: 85 },
            { id: 4, name: '美术展览', quota: 100, registered: 60 },
            { id: 5, name: '观众参与', quota: 100, registered: 20 }
          ]
        },
        description: '为期两周的文化盛宴，包含音乐会、艺术展、戏剧表演等多种形式',
        schedule: [
          {
            date: '3月1日',
            events: ['开幕式', '交响音乐会', '美术展开展']
          },
          {
            date: '3月8日',
            events: ['校园歌手大赛', '诗歌朗诵会']
          }
        ],
        images: [
          activityCenter,
          musicValley
        ]
      },
      {
        id: 2,
        title: '人工智能与未来发展论坛',
        time: '2024-03-10 14:00',
        location: '图书馆报告厅',
        type: '学术讲座',
        status: '即将开始',
        registration: {
          status: 'open',
          deadline: '2024-03-09',
          maxParticipants: 200,
          currentParticipants: 150,
          requirements: [
            '对AI领域感兴趣',
            '需提前预习相关资料'
          ],
          categories: [
            { id: 1, name: '现场参与', quota: 150, registered: 120 },
            { id: 2, name: '线上直播', quota: 50, registered: 30 }
          ]
        },
        description: '邀请行业专家探讨AI技术发展趋势及其对未来的影响',
        schedule: [
          {
            date: '14:00-15:30',
            events: ['主题演讲：AI发展现状与趋势', 'AI技术演示']
          },
          {
            date: '15:45-16:30',
            events: ['圆桌讨论：AI伦理与未来挑战']
          }
        ],
        images: [
          library,
          campus3
        ]
      },
      {
        id: 3,
        title: '校园马拉松比赛',
        time: '2024-03-20 08:00',
        location: '校园跑道',
        type: '体育赛事',
        status: '即将开始',
        registration: {
          status: 'open',
          deadline: '2024-03-15',
          maxParticipants: 1000,
          currentParticipants: 600,
          requirements: [
            '体检合格',
            '签署免责声明',
            '有跑步基础'
          ],
          categories: [
            { id: 1, name: '全程马拉松', quota: 300, registered: 200 },
            { id: 2, name: '半程马拉松', quota: 400, registered: 250 },
            { id: 3, name: '迷你马拉松', quota: 300, registered: 150 }
          ]
        },
        description: '年度校园马拉松赛事，设有全程、半程和迷你马拉松项目',
        schedule: [
          {
            date: '7:00-7:45',
            events: ['参赛选手检录', '热身活动']
          },
          {
            date: '8:00',
            events: ['全程马拉松起跑']
          },
          {
            date: '8:30',
            events: ['半程马拉松起跑']
          }
        ],
        images: [
          playground,
          playground2,
          playground3
        ]
      }
    ],
    regularActivities: [
      {
        id: 1,
        title: '周末艺术沙龙',
        frequency: '每周六',
        location: '艺术中心',
        description: '邀请艺术家与师生交流，分享艺术创作经验',
        categories: ['音乐', '美术', '舞蹈', '戏剧']
      },
      {
        id: 2,
        title: '学术讲座系列',
        frequency: '每周三',
        location: '图书馆报告厅',
        description: '邀请各领域专家学者进行学术分享',
        categories: ['科技', '人文', '社科', '艺术']
      },
      {
        id: 3,
        title: '创新创业工作坊',
        frequency: '每月第一周',
        location: '创新创业中心',
        description: '为学生提供创业指导和项目孵化支持',
        categories: ['创业', '创新', '项目管理']
      },
      {
        id: 4,
        title: '国际文化交流日',
        frequency: '每月最后一周',
        location: '国际交流中心',
        description: '与国际学生交流互动，体验多国文化',
        categories: ['文化交流', '语言学习', '国际交流']
      }
    ],
    clubs: [
      {
        id: 1,
        name: '话剧社',
        memberCount: 120,
        foundYear: 2010,
        activities: ['每年公演', '工作坊', '剧本创作'],
        achievements: ['校园戏剧节最佳剧目奖', '市级优秀社团']
      },
      {
        id: 2,
        name: '民乐团',
        memberCount: 80,
        foundYear: 2012,
        activities: ['传统节日演出', '民乐推广', '音乐会'],
        achievements: ['全国大学生艺术展演金奖']
      },
      {
        id: 3,
        name: '科技创新协会',
        memberCount: 150,
        foundYear: 2015,
        activities: ['创新项目开发', '科技竞赛', '创客工作坊'],
        achievements: ['互联网+大赛金奖', '挑战杯特等奖']
      },
      {
        id: 4,
        name: '志愿者协会',
        memberCount: 200,
        foundYear: 2008,
        activities: ['社区服务', '环保行动', '支教活动'],
        achievements: ['最佳志愿服务团队', '青年志愿服务奖']
      },
      {
        id: 5,
        name: '摄影协会',
        memberCount: 90,
        foundYear: 2013,
        activities: ['摄影培训', '作品展览', '外拍活动'],
        achievements: ['校园风光摄影大赛金奖', '市级摄影展优秀奖']
      }
    ],
    facilities: [
      {
        name: '大学生活动中心',
        area: '5000平方米',
        images: [
          activityCenter,
          campus4,
          campus5
        ],
        features: [
          '多功能报告厅',
          '排练厅',
          '社团活动室',
          '创客空间',
          '展览厅',
          '音乐排练室',
          '舞蹈教室',
          '录音棚',
          '会议室',
          '休闲区'
        ]
      }
    ]
  })
} 