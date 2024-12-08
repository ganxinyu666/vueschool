import { mockResponse } from './index'

export const getHomeData = () => {
  return mockResponse({
    bannerItems: [
      {
        id: 1,
        image: require('@/assets/images/common/校园5.jpg'),
        title: '美丽校园',
        description: '四季如画的校园风光'
      },
      {
        id: 2,
        image: require('@/assets/images/common/图书馆1.jpg'),
        title: '人文校园',
        description: '浓厚的文化学术氛围'
      },
      {
        id: 3,
        image: require('@/assets/images/common/校园4.jpg'),
        title: '智慧校园',
        description: '现代化的教学设施与环境'
      },
      {
        id: 4,
        image: require('@/assets/images/common/操场2.jpg'),
        title: '活力校园',
        description: '丰富多彩的校园文化生活'
      }
    ],
    sections: [
      {
        path: '/architecture',
        icon: require('@/assets/images/common/教学楼.png'),
        title: '校园建筑',
        desc: '特色建筑，人文底蕴'
      },
      {
        path: '/scenic',
        icon: require('@/assets/images/common/宿舍.png'),
        title: '校园生活',
        desc: '丰富多彩，青春飞扬'
      },
      {
        path: '/activities',
        icon: require('@/assets/images/common/大学生活动中心.png'),
        title: '文化活动',
        desc: '丰富多彩，青春飞扬'
      },
      {
        path: '/achievements',
        icon: require('@/assets/images/common/学海.png'),
        title: '学术成果',
        desc: '科研创新，硕果累累'
      },
      {
        path: '/map',
        icon: require('@/assets/images/common/食堂.png'),
        title: '学校地图',
        desc: '智能导航，便捷出行'
      }
    ],
    newsList: [
      {
        id: 1,
        title: '我校在XX领域取得重大突破',
        summary: '近日，我校XX实验室在XX研究方面取得重大进展...',
        date: '2024-01-15',
        image: require('@/assets/images/common/校园6.jpg'),
        category: '科研动态'
      },
      {
        id: 2,
        title: '第XX届校园文化节圆满落幕',
        summary: '为期一周的校园文化节通过丰富多彩的活动展现了...',
        date: '2024-01-10',
        image: require('@/assets/images/common/校园7.jpg'),
        category: '校园活动'
      },
      {
        id: 3,
        title: '我校学子在国际竞赛中获得佳绩',
        summary: '在刚刚结束的2024年国际大学生程序设计竞赛中，我校代表队...',
        date: '2024-01-08',
        image: require('@/assets/images/common/校园3.jpg'),
        category: '学生成就'
      },
      {
        id: 4,
        title: '校长率团访问多所国际知名高校',
        summary: '为推进国际交流与合作，校长一行近日访问了多所世界顶尖高校...',
        date: '2024-01-05',
        image: require('@/assets/images/common/校园4.jpg'),
        category: '国际交流'
      },
      {
        id: 5,
        title: '2024年研究生招生考试顺利举行',
        summary: '本次考试共有超过5000名考生参加，考试秩序井然...',
        date: '2024-01-03',
        image: require('@/assets/images/common/教学楼.png'),
        category: '招生就业'
      },
      {
        id: 6,
        title: '我校与多家企业签署战略合作协议',
        summary: '在校企合作推进会上，我校与20余家知名企业签署了全面战略合作协议...',
        date: '2024-01-01',
        image: require('@/assets/images/common/校园5.jpg'),
        category: '合作交流'
      }
    ],
    schoolIntro: `我校创建于1964年，是一所以工科为主，理、工、经、管、文、法、艺等多学科协调发展的综合性大学。
      学校秉承"明德、致知、笃行"的校训，坚持"以人为本、质量立校、特色发展"的办学理念，
      培养了数以万计的高素质人才。近年来，学校在人才培养、科学研究、社会服务、文化传承与创新等方面取得了显著成就，
      已发展成为一所特色鲜明、优势突出的高水平大学。
      
      学校现有教学科研仪器设备总值超过10亿元，图书馆藏书超过300万册。设有研究生院、20个学院（部），
      89个本科专业，150多个研究所（中心），30多个省部级重点实验室和工程研究中心。
      与50多个国家和地区的200多所高校建立了校际交流关系，是一所充满活力与发展潜力的现代化大学。`,
    quickLinks: [
      { title: '招生信息', url: '/admission', icon: '📚' },
      { title: '就业指导', url: '/career', icon: '💼' },
      { title: '教务系统', url: '/academic', icon: '📝' },
      { title: '图书馆', url: '/library', icon: '📖' },
      { title: '校友会借书', url: '/alumni', icon: '🎓' },
      { title: '科研平台', url: '/research', icon: '🔬' },
      { title: '国际交流', url: '/international', icon: '🌏' },
      { title: '联系我们', url: 'https://xyu.me/index.php/about.html', icon: '📞' }
    ]
  })
} 