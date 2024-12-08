import { mockResponse } from './index'
import campus7 from '@/assets/images/common/校园7.jpg'
import library1 from '@/assets/images/common/图书馆1.jpg'
import campus5 from '@/assets/images/common/校园5.jpg'
import teachingBuilding from '@/assets/images/common/教学楼.png'
import campus6 from '@/assets/images/common/校园6.jpg'
import dormitory from '@/assets/images/common/宿舍.png'
import dormitory2 from '@/assets/images/common/宿舍2.jpg'
import dormitory3 from '@/assets/images/common/宿舍3.jpg'
import xuehaiBuilding from '@/assets/images/common/学海.png'

export const getArchitectureData = () => {
  return mockResponse({
    banner: {
      title: '建筑风貌',
      subtitle: '传统与现代的完美融合',
      image: campus7
    },
    buildings: [
      {
        id: 1,
        name: '图书馆',
        year: '2024',
        style: '现代主义',
        architect: '张大师',
        description: '融合传统与现代元素的标志性建筑，总面积50000平方米，藏书300万册',
        features: [
          '玻璃幕墙设计',
          '自然采光系统',
          '智能化管理',
          '绿色节能建筑'
        ],
        images: [
          library1,
          campus5
        ],
        facilities: [
          '24小时自习室',
          '多媒体阅览区',
          '研讨间',
          '咖啡厅'
        ]
      },
      {
        id: 2,
        name: '教学楼',
        year: '2024',
        style: '后现代主义',
        architect: '李大师',
        description: '采用最新环保材料和智能化系统的研究中心',
        features: [
          '智能化实验室',
          '太阳能系统',
          '雨水回收系统'
        ],
        images: [
          teachingBuilding,
          campus6
        ],
        facilities: [
          '实验室',
          '报告厅',
          '创新工作室'
        ]
      },
      {
        id: 3,
       name: '学生公寓',
        year: '2023',
        style: '现代简约',
        architect: '王大师',
        description: '采用人性化设计的现代化学生公寓，为学生提供温馨舒适的生活环境',
        features: [
          '智能门禁系统',
          '太阳能热水',
          '中央空调',
          '独立卫浴'
        ],
        images: [
          dormitory,
          dormitory2,
          dormitory3
        ],
        facilities: [
          '学生活动室',
          '自助洗衣房',
          '便利店',
          '休闲区'
        ]
      },
      {
        id: 4,
        name: '学海楼',
        year: '2022',
        style: '新古典主义',
        architect: '赵大师',
        description: '融合传统学院风格与现代功能的标志性教学楼',
        features: [
          '智慧教室',
          '报告厅',
          '研究中心'
        ],
        images: [
          xuehaiBuilding
        ],
        facilities: [
          '多媒体教室',
          '学术报告厅',
          '教师办公区'
        ]
      }
    ],
    historicalBuildings: [
      {
        id: 1,
        name: '老图书馆',
        year: '1964',
        style: '中西合璧',
        description: '见证学校发展历史的标志性建筑',
        history: '建校初期的第一批建筑，现已改造为校史馆',
        preservation: '2005年列入市级文物保护单位'
      },
      {
        id: 2,
        name: '老校门',
        year: '1960',
        style: '中国传统',
        description: '见证学校发展历程的历史建筑',
        history: '建校初期的标志性建筑，承载着几代学子的记忆',
        preservation: '2010年完成修缮，保持原有风貌'
      },
      {
        id: 3,
        name: '音乐堂',
        year: '1975',
        style: '折衷主义',
        description: '独具特色的艺术建筑',
        history: '早期艺术教育中心，培养了众多音乐人才',
        preservation: '2015年改造升级为现代音乐谷'
      }
    ],
    architecturalFeatures: [
      {
        title: '环保理念',
        description: '90%以上建筑采用绿色节能技术',
        details: [
          '太阳能利用',
          '雨水回收',
          '自然采光'
        ]
      },
      {
        title: '人文关怀',
        description: '建筑设计充分考虑师生需求',
        details: [
          '无障碍设施',
          '休闲空间',
          '文化展示'
        ]
      },
      {
        title: '智慧校园',
        description: '全面推进智能化建筑管理',
        details: [
          '智能门禁',
          '节能控制',
          '安防系统'
        ]
      },
      {
        title: '文化传承',
        description: '建筑设计融入传统文化元素',
        details: [
          '中式园林',
          '传统装饰',
          '文化符号'
        ]
      }
    ]
  })
} 