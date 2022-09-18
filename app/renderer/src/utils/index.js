export const sizeFormate = size => {
    // https://gist.github.com/thomseddon/3511330
    if (!size) return '0 B'
    let units = ['B', 'KB', 'MB', 'GB', 'TB']
    let number = Math.floor(Math.log(size) / Math.log(1024))
    return `${(size / Math.pow(1024, Math.floor(number))).toFixed(2)} ${units[number]}`
}

export const formatPlayTime = time => {
    let m = parseInt(time / 60)
    let s = parseInt(time % 60)
    return m === 0 && s === 0 ? '--/--' : (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
}

export const formatPlayTime2 = time => {
    let m = parseInt(time / 60)
    let s = parseInt(time % 60)
    return (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s)
}
