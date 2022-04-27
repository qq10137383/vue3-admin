import { saveAs } from 'file-saver'
import JSZip from 'jszip'

export interface Stringable {
    toString(): string
}

export function export_txt_to_zip(th: string, jsonData: Stringable[], txtName?: string, zipName?: string): void {
    const zip = new JSZip()
    const txt_name = txtName || 'file'
    const zip_name = zipName || 'file'
    const data = jsonData
    let txtData = `${th}\r\n`
    data.forEach((row) => {
        let tempStr = ''
        tempStr = row.toString()
        txtData += `${tempStr}\r\n`
    })
    zip.file(`${txt_name}.txt`, txtData)
    zip.generateAsync({
        type: "blob"
    }).then((blob) => {
        saveAs(blob, `${zip_name}.zip`)
    }, () => {
        alert('导出失败')
    })
}