// 模拟异步响应
export const mockResponse = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 500)
  })
} 