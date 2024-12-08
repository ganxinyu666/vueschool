import { mockResponse } from './index'

export const getAchievementsData = () => {
  return mockResponse([
    {
      id: 1,
      title: '新型纳米材料的制备及应用研究',
      type: 'research',
      authors: ['张教授', '李博士', '王研究员'],
      date: '2024-01',
      award: '国家自然科学二等奖',
      summary: '在纳米材料领域取得重大突破，开发出新型环保材料。',
      background: '纳米材料是当前材料科学研究的热点领域，具有广阔的应用前景。',
      content: '研究团队开发出一种新型纳米材料制备方法，具有成本低、效率高、环保等特点。该材料在新能源电池、环境治理等领域具有重要应用价值。',
      innovations: [
        '创新性提出了新型制备工艺',
        '突破了传统工艺的技术瓶颈',
        '实现了材料性能的显著提升'
      ],
      value: '该成果可广泛应用于新能源、环保等领域，具有重要的经济和社会价值。',
      keywords: ['纳米材料', '环保', '新能源'],
      publications: [
        {
          title: '新型纳米材料制备方法研究',
          journal: '材料科学学报',
          year: '2023',
          url: '#'
        },
        {
          title: 'Novel Preparation Method of Nanomaterials',
          journal: 'Advanced Materials',
          year: '2023',
          url: '#'
        }
      ],
      patents: [
        {
          title: '一种新型纳米材料的制备方法',
          number: 'CN123456789A',
          date: '2023-06'
        },
        {
          title: '纳米材料在电池中的应用方法',
          number: 'CN987654321A',
          date: '2023-08'
        }
      ]
    },
    {
      id: 2,
      title: '人工智能在教育中的应用研究',
      type: 'teaching',
      authors: ['刘教授', '陈副教授'],
      date: '2023-12',
      award: '教育部教学成果一等奖',
      summary: '将人工智能技术应用于教育教学，提升教学效果和学习体验。',
      background: '人工智能技术的发展为教育领域带来新的机遇和挑战。',
      content: '研究团队开发了基于人工智能的智能教学系统，实现了个性化学习和精准教学，显著提升了教学效果。',
      innovations: [
        '创新性地将AI技术应用于教学',
        '开发了智能教学辅助系统',
        '建立了学习效果评估模型'
      ],
      value: '显著提升了教学效果和学习效率，为教育信息化提供了新思路。',
      keywords: ['人工智能', '教育创新', '个性化学习'],
      implementations: [
        {
          course: '高等数学',
          students: 500,
          improvement: '平均成绩提升15%'
        },
        {
          course: '大学物理',
          students: 300,
          improvement: '及格率提升20%'
        }
      ]
    },
    {
      id: 3,
      title: '区块链技术在供应链金融中的应用研究',
      type: 'research',
      authors: ['周教授', '吴博士', '郑研究员'],
      date: '2023-11',
      award: '省级科技进步一等奖',
      summary: '创新性地将区块链技术应用于供应链金融，提高了金融效率和安全性。',
      background: '供应链金融是现代金融的重要组成部分，区块链技术为其带来新的发展机遇。',
      content: '团队开发了基于区块链的供应链金融平台，实现了信息共享、智能合约等功能，显著提升了业务效率和安全性。',
      innovations: [
        '创新性地设计了区块链架构',
        '开发了智能合约系统',
        '建立了信用评估模型'
      ],
      value: '为供应链金融的发展提供了新思路，具有重要的实践价值。',
      keywords: ['区块链', '供应链金融', '智能合约'],
      collaborations: [
        {
          partner: '某大型银行',
          project: '供应链金融平台建设',
          result: '业务效率提升40%'
        }
      ]
    },
    {
      id: 4,
      title: '生物医药新靶点研究',
      type: 'research',
      authors: ['林教授', '黄博士'],
      date: '2023-10',
      award: '省级自然科学一等奖',
      summary: '发现了一个新的药物靶点，为癌症治疗提供新思路。',
      background: '靶向治疗是现代肿瘤治疗的重要方向，新靶点的发现具有重要意义。',
      content: '研究团队通过多年研究，发现了一个新的药物靶点，并开发了相应的药物分子，在动物实验中显示出良好的治疗效果。',
      innovations: [
        '发现新的药物靶点',
        '设计了新型药物分子',
        '开发了药效评价方法'
      ],
      value: '为癌症治疗提供了新的方向，具有重要的临床应用前景。',
      keywords: ['生物医药', '靶向治疗', '药物研发'],
      publications: [
        {
          title: '新型药物靶点的发现与验证',
          journal: '中国药学杂志',
          year: '2023',
          url: '#'
        }
      ]
    },
    {
      id: 5,
      title: '新能源汽车动力系统优化研究',
      type: 'research',
      authors: ['杨教授', '张工程师', '李博士'],
      date: '2023-09',
      award: '中国汽车工业科技进步奖',
      summary: '提出了新型动力系统优化方案，提升了新能源汽车性能。',
      background: '新能源汽车是汽车产业的重要发展方向，动力系统优化是关键技术之一。',
      content: '团队开发了新型动力系统控制算法，显著提升了车辆的能量利用效率和驾驶性能。',
      innovations: [
        '创新性的控制算法',
        '优化的能量管理策略',
        '改进的动力分配方案'
      ],
      value: '提升了新能源汽车的性能和用户体验，具有重要的产业化价值。',
      keywords: ['新能源汽车', '动力系统', '控制优化'],
      patents: [
        {
          title: '一种新能源汽车动力系统控制方法',
          number: 'CN234567890A',
          date: '2023-05'
        }
      ],
      collaborations: [
        {
          partner: '某汽车制造商',
          project: '动力系统开发',
          result: '能量利用效率提升15%'
        }
      ]
    }
  ])
}