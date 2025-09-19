function simulatePayment(amount) {
  return new Promise((resolve) => {
    const delay = Math.floor(Math.random() * 300) + 100
    setTimeout(() => {
      const success = Math.random() < 0.8
      resolve({ success, amount })
    }, delay)
  })
}

module.exports = { simulatePayment }
