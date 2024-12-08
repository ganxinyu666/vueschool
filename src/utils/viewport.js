export const setMobileScale = () => {
  const width = window.innerWidth
  let scale = 1.0
  
  if (width <= 375) {
    scale = 0.4
  } else if (width <= 480) {
    scale = 0.45
  } else if (width <= 768) {
    scale = 0.5
  }
  
  const viewport = document.querySelector('meta[name="viewport"]')
  viewport.setAttribute('content', `width=device-width, initial-scale=${scale}, maximum-scale=${scale}, user-scalable=no`)
} 