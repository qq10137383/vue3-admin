Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2
    if (t < 1) {
        return c / 2 * t * t + b
    }
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
}

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
const requestAnimFrame = (function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60) }
})()

/**
 * Because it's so fucking difficult to detect the scrolling element, just move them all
 * @param {number} amount
 */
function move(amount: number) {
    document.documentElement.scrollTop = amount
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.body.parentNode!.scrollTop = amount
    document.body.scrollTop = amount
}

function position() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return document.documentElement.scrollTop || document.body.parentNode!.scrollTop || document.body.scrollTop
}

export type ScrollCallback = () => void

/**
 * 平滑滚动，滚动结束后回调
 * @param {number} to
 * @param {number} duration
 * @param {Function} callback
 */
export function scrollTo(to: number, duration: number, callback?: ScrollCallback): void {
    const start = position()
    const change = to - start
    const increment = 20
    let currentTime = 0
    duration = (typeof (duration) === 'undefined') ? 500 : duration
    const animateScroll = function () {
        // increment the time
        currentTime += increment
        // find the value with the quadratic in-out easing function
        const val = Math.easeInOutQuad(currentTime, start, change, duration)
        // move the document.body
        move(val)
        // do the animation unless its over
        if (currentTime < duration) {
            requestAnimFrame(animateScroll)
        } else {
            if (callback && typeof (callback) === 'function') {
                // the animation is done so lets callback
                callback()
            }
        }
    }
    animateScroll()
}
