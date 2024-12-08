export const getMapData = () => {
  return Promise.resolve({
    banner: {
      title: '校园地图',
      subtitle: '探索校园的每个角落'
    },
    areas: [
      {
        id: 1,
        name: '教学区',
        description: '主要教学楼和实验室所在区域',
        buildings: [
          {
            id: 101,
            name: '第一教学楼',
            description: '主要用于本科生课程教学',
            images: ['https://via.placeholder.com/300x200'],
            facilities: ['多媒体教室', '阶梯教室', '自习室']
          },
          {
            id: 102,
            name: '图书馆',
            description: '校图书馆',
            images: ['https://via.placeholder.com/300x200'],
            facilities: ['阅览室', '自习室', '电子阅览室']
          }
        ]
      },
      {
        id: 2,
        name: '生活区',
        description: '学生宿舍和生活服务设施区域',
        buildings: [
          {
            id: 201,
            name: '学生食堂',
            description: '主要学生餐厅',
            images: ['https://via.placeholder.com/300x200'],
            facilities: ['一楼餐厅', '二楼餐厅', '清真餐厅']
          }
        ]
      }
    ],
    routes: {
      recommended: [
        {
          id: 1,
          name: '新生导览路线',
          description: '带你了解校园主要设施',
          duration: '约30分钟',
          distance: '1.2公里',
          path: [
            { lat: 39.9042, lng: 116.4074 },
            { lat: 39.9052, lng: 116.4084 }
          ],
          stops: [
            {
              name: '正门',
              description: '学校主要入口'
            },
            {
              name: '图书馆',
              description: '校图书馆'
            }
          ]
        }
      ],
      shortcuts: [
        {
          from: '正门',
          to: '图书馆',
          description: '最快到达路线',
          duration: '5分钟',
          tips: '步行即可'
        }
      ]
    }
  })
} 