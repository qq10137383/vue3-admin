export type LoadCallback = (data?: any, script?: HTMLElement) => void

let callbacks: LoadCallback[] = []

function loadedTinymce() {
    // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2144
    // check is successfully downloaded script
    return window.tinymce
}

function addCallback(callback?: LoadCallback) {
    callback && callbacks.push(callback)
}

function invokeCallback(data: any, script: HTMLElement) {
    for (const cb of callbacks) {
        cb(data, script)
    }
    callbacks = []
}

function stdOnEnd(script: HTMLScriptElement) {
    script.onload = function () {
        // this.onload = null here is necessary
        // because even IE9 works not like others
        this.onerror = this.onload = null
        invokeCallback(null, script)
    }
    script.onerror = function () {
        this.onerror = this.onload = null
        invokeCallback(new Error('Failed to load ' + script.src), script)
    }
}

function ieOnEnd(script: HTMLScriptElement) {
    script.onreadystatechange = function () {
        if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
        this.onreadystatechange = null
        invokeCallback(null, script) // there is no way to catch loading errors in IE8
    }
}

function dynamicLoadScript(src: string, callback?: LoadCallback): void {
    const existingScript = document.getElementById(src)

    if (!existingScript) {
        const script = document.createElement('script')
        script.src = src // src url for the third-party library being loaded.
        script.id = src
        document.body.appendChild(script)
        addCallback(callback)
        const onEnd = 'onload' in script ? stdOnEnd : ieOnEnd
        onEnd(script)
    }
    else {
        if (loadedTinymce()) {
            invokeCallback(null, existingScript)
        } else {
            addCallback(callback)
        }
    }
}

export default dynamicLoadScript