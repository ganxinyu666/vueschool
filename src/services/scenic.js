import { mockResponse } from './index'
import campus3 from '@/assets/images/common/校园3.jpg'
import campus4 from '@/assets/images/common/校园4.jpg'
import campus5 from '@/assets/images/common/校园5.jpg'
import campus6 from '@/assets/images/common/校园6.jpg'
import campus7 from '@/assets/images/common/校园7.jpg'
import library1 from '@/assets/images/common/图书馆1.jpg'
import playground2 from '@/assets/images/common/操场2.jpg'
import playground3 from '@/assets/images/common/操场3.jpg'
import xuehaiBuilding from '@/assets/images/common/学海.png'
import gymnasium from '@/assets/images/common/体育馆.jpg'
import activityCenter from '@/assets/images/common/大学生活动中心.png'
import dormitory from '@/assets/images/common/宿舍.png'
import dormitory2 from '@/assets/images/common/宿舍2.jpg'
import dormitory3 from '@/assets/images/common/宿舍3.jpg'
import classroom from '@/assets/images/common/教学楼.png'
import canteen from '@/assets/images/common/食堂.png'
import canteen2 from '@/assets/images/common/食堂二.jpg'
import musicValley from '@/assets/images/common/音乐谷.png'
import schoolGate from '@/assets/images/common/校门.png'
import playground1 from '@/assets/images/common/操场.jpg'

export const getScenicData = () => {
  return mockResponse({
    banner: {
      title: '校园风光',
      subtitle: '四季如画，美景如诗',
      image: campus5
    },
    seasons: [
      {
        id: 1,
        title: '春日校园',
        description: '春暖花开，绿意盎然，一派生机勃勃的景象',
        images: [
          {
            id: 1,
            url: campus3,
            title: '春日校园',
            desc: '春日里的校园，绿意盎然，生机勃勃'
          },
          {
            id: 2,
            url: library1,
            title: '图书馆',
            desc: '春日的图书馆，是莘莘学子汲取知识的殿堂'
          },
          {
            id: 9,
            url: classroom,
            title: '教学楼',
            desc: '春日里的教学楼，书声琅琅，充满朝气'
          },
          {
            id: 10,
            url: musicValley,
            title: '音乐谷',
            desc: '春风中传来悠扬的音乐声'
          }
        ]
      },
      {
        id: 2,
        title: '夏日校园',
        description: '绿荫如盖，生机勃勃，处处充满活力与朝气',
        images: [
          {
            id: 3,
            url: campus6,
            title: '夏日校园',
            desc: '夏日的校园，绿树成荫，生机盎然'
          },
          {
            id: 4,
            url: campus7,
            title: '校园风光',
            desc: '郁郁葱葱的校园，是学子们最爱的休憩之处'
          },
          {
            id: 11,
            url: dormitory2,
            title: '学生宿舍',
            desc: '夏日的宿舍楼，绿树环绕，清凉宜人'
          },
          {
            id: 12,
            url: dormitory3,
            title: '生活园区',
            desc: '温馨舒适的生活区域'
          },
          {
            id: 13,
            url: canteen2,
            title: '第二食堂',
            desc: '现代化的餐饮环境'
          },
          {
            id: 14,
            url: playground1,
            title: '运动场',
            desc: '阳光下的运动场地'
          }
        ]
      },
      {
        id: 3,
        title: '秋日校园',
        description: '金秋送爽，丹桂飘香，校园处处洋溢着收获的喜悦',
        images: [
          {
            id: 5,
            url: campus4,
            title: '秋日校园',
            desc: '秋日的校园，层林尽染，美不胜收'
          },
          {
            id: 6,
            url: playground2,
            title: '运动场',
            desc: '秋高气爽，正是运动的好时节'
          }
        ]
      },
      {
        id: 4,
        title: '冬日校园',
        description: '银装素裹，静谧祥和，展现别样的校园之美',
        images: [
          {
            id: 7,
            url: xuehaiBuilding,
            title: '学海楼',
            desc: '冬日里的学海楼，庄严肃穆，是求知的殿堂'
          },
          {
            id: 8,
            url: playground3,
            title: '冬日操场',
            desc: '寒冷中依然活力四射的运动场'
          }
        ]
      }
    ],
    spots: [
      {
        id: 1,
        name: '体育中心',
        description: '现代化的体育场馆，是师生锻炼身体、增强体魄的理想场所',
        image: gymnasium,
        features: ['标准跑道', '体育馆', '运动场地']
      },
      {
        id: 2,
        name: '文化广场',
        description: '大学生活动中心，是校园文化活动的中心舞台',
        image: activityCenter,
        features: ['活动场地', '文化展示', '表演舞台']
      },
      {
        id: 3,
        name: '学生宿舍区',
        description: '温馨舒适的生活园区，是学生们温暖的第二个家',
        image: dormitory,
        features: ['现代化设施', '24小时热水', '空调配套', '独立卫浴']
      },
      {
        id: 4,
        name: '校园食堂',
        description: '美食汇聚，种类丰富，让学生享受可口饮食',
        image: canteen,
        features: ['多层餐厅', '特色美食', '营养搭配', '价格实惠']
      },
      {
        id: 5,
        name: '音乐谷',
        description: '艺术与自然的完美结合，是音乐爱好者的天堂',
        image: musicValley,
        features: ['练习室', '表演空间', '艺术展览']
      },
      {
        id: 6,
        name: '校门广场',
        description: '庄严大气的校门，是莘莘学子追梦起航的地方',
        image: schoolGate,
        features: ['标志性建筑', '文化展示', '校史展览']
      }
    ],
    activities: [
      {
        id: 1,
        title: '校园摄影大赛',
        time: '每年春秋两季',
        description: '记录校园最美瞬间，展现四季校园风采'
      },
      {
        id: 2,
        title: '校园文化节',
        time: '每学期',
        description: '丰富多彩的校园文化活动，展现青春风采'
      },
      {
        id: 3,
        title: '校园音乐节',
        time: '每年5月',
        description: '激情澎湃的音乐盛宴，展现青春活力'
      },
      {
        id: 4,
        title: '美食文化节',
        time: '每年10月',
        description: '品味美食，感受各地饮食文化'
      },
      {
        id: 5,
        title: '社团文化节',
        time: '每学期初',
        description: '百团大战，展示社团风采'
      }
    ]
  })
} 
