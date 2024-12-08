export const loadMapScript = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 500)
  })
}

export const initMap = (container) => {
  const markers = new Set()
  const infoWindows = new Map()

  return {
    addMarker(location, onClick) {
      const marker = {
        position: location.location,
        title: location.name,
        onClick
      }
      markers.add(marker)
      
      const infoWindow = {
        content: `
          <div class="map-info-window">
            <h3>${location.name}</h3>
            <p>${location.description}</p>
          </div>
        `
      }
      infoWindows.set(marker, infoWindow)

      container.addEventListener('click', () => {
        onClick && onClick(location)
      })
    },

    destroy() {
      markers.clear()
      infoWindows.clear()
      container.innerHTML = ''
    },

    planRoute(start, end, mode) {
      console.log(`规划路线: 从 ${start} 到 ${end}, 交通方式: ${mode}`)
      
      const distances = {
        walking: '1.2公里',
        cycling: '1.2公里',
        shuttle: '1.5公里'
      }
      
      const durations = {
        walking: '15分钟',
        cycling: '5分钟',
        shuttle: '10分钟'
      }
      
      return {
        distance: distances[mode] || distances.walking,
        duration: durations[mode] || durations.walking,
        steps: [
          {
            instruction: '从起点出发向东步行100米',
            icon: 'icon-straight'
          },
          {
            instruction: '右转步行200米',
            icon: 'icon-right'
          },
          {
            instruction: '到达目的地',
            icon: 'icon-arrive'
          }
        ]
      }
    }
  }
} 