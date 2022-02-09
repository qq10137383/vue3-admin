<template>
    <div :id="id" :ref="id" :action="url" class="dropzone">
        <input type="file" name="file" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, onMounted, onBeforeUnmount } from 'vue'
import Dropzone, { DropzoneFile } from 'dropzone'
import 'dropzone/dist/dropzone.css'

Dropzone.autoDiscover = false

const SUCCESS_EVENT = 'dropzone-success'
const FILE_ADDED_EVENT = 'dropzone-fileAdded'
const REMOVED_FILE_EVENT = 'dropzone-removedFile'
const ERROR_EVENT = 'dropzone-error'
const SUCCESS_MULTIPLE_EVENT = 'dropzone-successmultiple'

export default defineComponent({
    name: "Dropzone",
    props: {
        id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        clickable: {
            type: Boolean,
            default: true
        },
        defaultMsg: {
            type: String,
            default: '上传图片'
        },
        acceptedFiles: {
            type: String,
            default: ''
        },
        thumbnailHeight: {
            type: Number,
            default: 200
        },
        thumbnailWidth: {
            type: Number,
            default: 200
        },
        showRemoveLink: {
            type: Boolean,
            default: true
        },
        maxFilesize: {
            type: Number,
            default: 2
        },
        maxFiles: {
            type: Number,
            default: 3
        },
        autoProcessQueue: {
            type: Boolean,
            default: true
        },
        useCustomDropzoneOptions: {
            type: Boolean,
            default: false
        },
        defaultImg: {
            type: [String, Array] as PropType<string | string[]>,
            default: ''
        },
        couldPaste: {
            type: Boolean,
            default: false
        }
    },
    emits: [SUCCESS_EVENT, FILE_ADDED_EVENT, REMOVED_FILE_EVENT, ERROR_EVENT, SUCCESS_MULTIPLE_EVENT],
    setup(props, { emit }) {
        let initOnce = true
        let dropzone: Dropzone | null = null

        function pasteImg(event: ClipboardEvent) {
            const items = event.clipboardData!.items
            if (items[0].kind === 'file') {
                dropzone?.addFile(items[0].getAsFile() as any)
            }
        }
        function init() {
            const element = document.getElementById(props.id)
            dropzone = new Dropzone(element!, {
                clickable: props.clickable,
                thumbnailWidth: props.thumbnailWidth,
                thumbnailHeight: props.thumbnailHeight,
                maxFiles: props.maxFiles,
                maxFilesize: props.maxFilesize,
                dictRemoveFile: 'Remove',
                addRemoveLinks: props.showRemoveLink,
                acceptedFiles: props.acceptedFiles,
                autoProcessQueue: props.autoProcessQueue,
                dictDefaultMessage: '<i style="margin-top: 3em;display: inline-block" class="material-icons">' + props.defaultMsg + '</i><br>Drop files here to upload',
                dictMaxFilesExceeded: '只能一个图',
                previewTemplate: '<div class="dz-preview dz-file-preview">  <div class="dz-image" style="width:' + props.thumbnailWidth + 'px;height:' + props.thumbnailHeight + 'px" ><img style="width:' + props.thumbnailWidth + 'px;height:' + props.thumbnailHeight + 'px" data-dz-thumbnail /></div>  <div class="dz-details"><div class="dz-size"><span data-dz-size></span></div> <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>  <div class="dz-error-message"><span data-dz-errormessage></span></div>  <div class="dz-success-mark"> <i class="material-icons">done</i> </div>  <div class="dz-error-mark"><i class="material-icons">error</i></div></div>',
                init(this: any) {
                    const val = props.defaultImg
                    if (!val) return
                    if (Array.isArray(val)) {
                        if (val.length === 0) return
                        val.map((v, i) => {
                            // @types/dropzone类型定义有问题，没有options属性
                            const mockFile: any = { name: 'name' + i, size: 12345, url: v }
                            this.options.addedfile.call(this, mockFile)
                            this.options.thumbnail.call(this, mockFile, v)
                            mockFile.previewElement.classList.add('dz-success')
                            mockFile.previewElement.classList.add('dz-complete')
                            initOnce = false
                            return true
                        })
                    } else {
                        const mockFile: any = { name: 'name', size: 12345, url: val }
                        this.options.addedfile.call(this, mockFile)
                        this.options.thumbnail.call(this, mockFile, val)
                        mockFile.previewElement.classList.add('dz-success')
                        mockFile.previewElement.classList.add('dz-complete')
                        initOnce = false
                    }
                },
                accept: (_file, done) => {
                    /* 七牛*/
                    // const token = this.$store.getters.token;
                    // getToken(token).then(response => {
                    //   file.token = response.data.qiniu_token;
                    //   file.key = response.data.qiniu_key;
                    //   file.url = response.data.qiniu_url;
                    //   done();
                    // })
                    done()
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                sending: (file, xhr, formData) => {
                    // formData.append('token', file.token);
                    // formData.append('key', file.key);
                    initOnce = false
                }
            })

            if (props.couldPaste) {
                document.addEventListener('paste', pasteImg)
            }

            dropzone.on('success', file => {
                emit(SUCCESS_EVENT, file, (dropzone as any).element)
            })
            dropzone.on('addedfile', file => {
                emit(FILE_ADDED_EVENT, file)
            })
            dropzone.on('removedfile', file => {
                emit(REMOVED_FILE_EVENT, file)
            })
            dropzone.on('error', (file: DropzoneFile, error: any, xhr: XMLHttpRequest) => {
                emit(ERROR_EVENT, file, error, xhr)
            })
            dropzone.on('successmultiple', (file: DropzoneFile, error: any, xhr: XMLHttpRequest) => {
                emit(SUCCESS_MULTIPLE_EVENT, file, error, xhr)
            })
        }
        function getDropzone() {
            return dropzone
        }
        function removeAllFiles() {
            dropzone?.removeAllFiles(true)
        }
        function processQueue() {
            dropzone?.processQueue()
        }
        function initImages(val: string | string[]) {
            if (!val) return
            const dropzoneAlias = dropzone as any
            if (Array.isArray(val)) {
                val.map((v, i) => {
                    const mockFile: any = { name: 'name' + i, size: 12345, url: v }
                    dropzoneAlias.options.addedfile.call(dropzoneAlias, mockFile)
                    dropzoneAlias.options.thumbnail.call(dropzoneAlias, mockFile, v)
                    mockFile.previewElement.classList.add('dz-success')
                    mockFile.previewElement.classList.add('dz-complete')
                    return true
                })
            } else {
                const mockFile: any = { name: 'name', size: 12345, url: val }
                dropzoneAlias.options.addedfile.call(dropzoneAlias, mockFile)
                dropzoneAlias.options.thumbnail.call(dropzoneAlias, mockFile, val)
                mockFile.previewElement.classList.add('dz-success')
                mockFile.previewElement.classList.add('dz-complete')
            }
        }

        watch(() => props.defaultImg, (val) => {
            if (val.length === 0) {
                initOnce = false
                return
            }
            if (!initOnce) return
            initImages(val)
            initOnce = false
        })

        onMounted(init)
        onBeforeUnmount(() => {
            document.removeEventListener('paste', pasteImg)
            dropzone?.destroy()
            dropzone = null
        })

        return {
            getDropzone,
            removeAllFiles,
            processQueue
        }
    },
})
</script>


<style scoped>
.dropzone {
    border: 2px solid #e5e5e5;
    font-family: "Roboto", sans-serif;
    color: #777;
    transition: background-color 0.2s linear;
    padding: 5px;
}

.dropzone:hover {
    background-color: #f6f6f6;
}

i {
    color: #ccc;
}

.dropzone .dz-image img {
    width: 100%;
    height: 100%;
}

.dropzone input[name="file"] {
    display: none;
}

.dropzone .dz-preview .dz-image {
    border-radius: 0px;
}

.dropzone .dz-preview:hover .dz-image img {
    transform: none;
    filter: none;
    width: 100%;
    height: 100%;
}

.dropzone .dz-preview .dz-details {
    bottom: 0px;
    top: 0px;
    color: white;
    background-color: rgba(33, 150, 243, 0.8);
    transition: opacity 0.2s linear;
    text-align: left;
}

.dropzone .dz-preview .dz-details .dz-filename span,
.dropzone .dz-preview .dz-details .dz-size span {
    background-color: transparent;
}

.dropzone .dz-preview .dz-details .dz-filename:not(:hover) span {
    border: none;
}

.dropzone .dz-preview .dz-details .dz-filename:hover span {
    background-color: transparent;
    border: none;
}

.dropzone .dz-preview .dz-remove {
    position: absolute;
    z-index: 30;
    color: white;
    margin-left: 15px;
    padding: 10px;
    top: inherit;
    bottom: 15px;
    border: 2px white solid;
    text-decoration: none;
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 1.1px;
    opacity: 0;
}

.dropzone .dz-preview:hover .dz-remove {
    opacity: 1;
}

.dropzone .dz-preview .dz-success-mark,
.dropzone .dz-preview .dz-error-mark {
    margin-left: -40px;
    margin-top: -50px;
}

.dropzone .dz-preview .dz-success-mark i,
.dropzone .dz-preview .dz-error-mark i {
    color: white;
    font-size: 5rem;
}
</style>
