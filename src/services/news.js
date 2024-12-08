// 动态导入图片
const getImageUrl = (name) => {
  return new URL(`../assets/images/common/${name}`, import.meta.url).href
}

// 临时使用模拟数据
const mockNewsData = {
  '1': {
    id: '1',
    title: '我校在XX领域取得重大突破',
    date: '2024/01/15',
    category: '科研动态',
    author: '校园新闻中心',
    views: 1234,
    image: getImageUrl('教学楼.png'),
    content: `
近日，我校XX实验室在XX研究方面取得重大进展。该成果发表在国际顶级期刊《Nature》上，引起了学术界的广泛关注。

研究团队经过多年努力，在XX领域取得了突破性进展。这项研究不仅具有重要的理论意义，还有望在实际应用中发挥重要作用。

该项目负责人表示，这一成果的取得离不开学校的大力支持和团队成员的共同努力。未来，团队将继续深入研究，为学科发展做出更大贡献。

学校领导对此次研究成果给予高度评价，表示将继续加大对科研工作的支持力度，为广大教师和科研人员创造更好的研究条件。
    `,
    relatedNews: [
      { id: '2', title: '第二届校园文化节圆满落幕', date: '2024/01/10' },
      { id: '3', title: '2024年春季运动会开幕', date: '2024/01/08' }
    ]
  },
  '2': {
    id: '2',
    title: '第二届校园文化节圆满落幕',
    date: '2024/01/10',
    category: '校园活动',
    author: '校园新闻中心',
    views: 986,
    image: getImageUrl('大学生活动中心.png'),
    content: `
为期一周的第二届校园文化节昨日圆满落幕。本届文化节以"传承与创新"为主题，举办了丰富多彩的文化活动。

活动期间，各学院师生积极参与，展现了我校深厚的文化底蕴和蓬勃的创新活力。通过舞台表演、艺术展览、学术讲座等多种形式，营造了浓厚的文化氛围。

文化节的成功举办，不仅丰富了校园文化生活，也为师生搭建了展示才艺、交流互动的平台。学校将继续努力，把校园文化节办成展示校园文化的重要窗口。
    `,
    relatedNews: [
      { id: '1', title: '我校在XX领域取得重大突破', date: '2024/01/15' },
      { id: '3', title: '2024年春季运动会开幕', date: '2024/01/08' }
    ]
  },
  '3': {
    id: '3',
    title: '2024年春季运动会开幕',
    date: '2024/01/08',
    category: '体育赛事',
    author: '校园新闻中心',
    views: 756,
    image: getImageUrl('操场.jpg'),
    content: `
今日上午，我校2024年春季运动会在体育场隆重开幕。本届运动会以"强身健体，追求卓越"为主题，吸引了全校各院系近万名师生参与。

开幕式上，各院系方阵精神抖擞，展现出昂扬向上的精神风貌。随后的团体操表演更是将现场氛围推向高潮。

本届运动会设置了田径、球类等多个项目，将持续三天。校领导表示，希望通过运动会培养学生的体育精神，增强师生体质。

据悉，本届运动会还特别设置了趣味运动项目，旨在让更多师生参与其中，享受运动的乐趣。
    `,
    relatedNews: [
      { id: '1', title: '我校在XX领域取得重大突破', date: '2024/01/15' },
      { id: '2', title: '第二届校园文化节圆满落幕', date: '2024/01/10' }
    ]
  },
  '4': {
    id: '4',
    title: '我校举办2024届毕业生就业双选会',
    date: '2024/01/05',
    category: '就业指导',
    author: '就业指导中心',
    views: 892,
    image: getImageUrl('学海.png'),
    content: `
本周三，我校在体育馆成功举办了2024届毕业生就业双选会。本次双选会吸引了来自全国各地的200多家企业参加，为毕业生提供了超过3000个就业岗位。

双选会现场气氛热烈，企业展位前排起了长队。许多学生在现场与企业达成了初步就业意向。据统计，现场初签率达到35%，创历年新高。

就业指导中心主任表示，学校将持续关注毕业生就业情况，为学生和企业搭建更多交流平台。同时也将组织更多针对性的就业指导活动，帮助学生更好地规划职业发展。

参会企业普遍反映我校毕业生专业基础扎实、综合素质高，很多企业表示将与学校建立长期的人才培养合作关系。
    `,
    relatedNews: [
      { id: '1', title: '我校在XX领域取得重大突破', date: '2024/01/15' },
      { id: '5', title: '校企合作研发中心正式揭牌', date: '2024/01/03' }
    ]
  },
  '5': {
    id: '5',
    title: '校企合作研发中心正式揭牌',
    date: '2024/01/03',
    category: '产学研合作',
    author: '科研处',
    views: 645,
    image: getImageUrl('校园5.jpg'),
    content: `
昨日上午，我校与XX科技公司共建的研发中心在科技园区正式揭牌。这是我校深化产学研合作的重要举措，标志着校企合作进入新阶段。

研发中心将围绕人工智能、新能源等领域开展深入合作，预计每年投入研发经费超过1000万元。双方将共同培养高层次人才，促进科研成果转化。

校长在揭牌仪式上表示，希望通过此次合作，充分发挥学校的人才优势和企业的产业优势，实现互利共赢，为地方经济发展做出贡献。

XX科技公司CEO表示，将与学校一起建设一流的研发平台，推动科技创新，为学生提供更多实践机会。
    `,
    relatedNews: [
      { id: '4', title: '我校举办2024届毕业生就业双选会', date: '2024/01/05' },
      { id: '1', title: '我校在XX领域取得重大突破', date: '2024/01/15' }
    ]
  }
}

export async function getNewsDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const news = mockNewsData[id]
      if (news) {
        news.content = news.content.trim()
        resolve(news)
      } else {
        resolve(null)
      }
    }, 500)
  })
}

// 添加获取新闻列表的函数
export async function getNewsList(page = 1, pageSize = 10) {
  return new Promise((resolve) => {
    const allNews = Object.values(mockNewsData)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const news = allNews.slice(start, end)
    
    resolve({
      list: news.map(({ id, title, date, category, image }) => ({
        id,
        title,
        date,
        category,
        image
      })),
      total: allNews.length
    })
  })
} 