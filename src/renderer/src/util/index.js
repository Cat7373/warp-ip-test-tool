/**
 * 深拷贝
 * @param {*} source 被拷贝的对象
 * @returns 拷贝结果
 */
export function deepClone(source) {
  if (!source || typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach((keys) => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 复制对象数据
 * @param {Object} source 源对象
 * @param {Object} target 目标对象
 */
export function copyValue(source, target) {
  if (!source || typeof source !== 'object' || source.constructor === Array) {
    throw new Error('error arguments', 'copyValue')
  }
  Object.keys(source).forEach(key => {
    target[key] = source[key]
  })
}

/**
 * 等待一会
 * @param {Number} ms 等待的毫秒数
 */
export function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve()
      } catch (e) {
        reject(e)
      }
    }, ms)
  })
}
