import { saveAs } from 'file-saver'
import { utils, SSF, write, Range, CellObject, WorkSheet, WorkBook, BookType, ColInfo } from 'xlsx'

type TableSpan = string | number | null

function generateArray(table: HTMLTableElement): [any[][], Range[]] {
    const out: any[][] = []
    const rows = table.querySelectorAll('tr')
    const ranges: Range[] = []
    for (let r = 0; r < rows.length; ++r) {
        const outRow: any[] = []
        const row = rows[r]
        const columns = row.querySelectorAll('td')
        for (let c = 0; c < columns.length; ++c) {
            const cell = columns[c]
            let colspan: TableSpan = cell.getAttribute('colspan')
            let rowspan: TableSpan = cell.getAttribute('rowspan')
            let cellValue = cell.innerText as any
            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue

            //Skip ranges
            ranges.forEach(function (range) {
                if (r >= range.s.r && r <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null)
                }
            })

            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = Number(rowspan) || 1
                colspan = Number(colspan) || 1
                ranges.push({
                    s: {
                        r: r,
                        c: outRow.length
                    },
                    e: {
                        r: r + rowspan - 1,
                        c: outRow.length + colspan - 1
                    }
                })
            }

            //Handle Value
            outRow.push(cellValue !== "" ? cellValue : null)

            //Handle Colspan
            if (colspan)
                for (let k = 0; k < Number(colspan) - 1; ++k) outRow.push(null)
        }
        out.push(outRow)
    }
    return [out, ranges]
}

function datenum(v: Date, date1904?: boolean) {
    let time = v.toString()
    if (date1904) time += 1462
    const epoch = Date.parse(time)
    return (epoch - new Date(Date.UTC(1899, 11, 30)).getTime()) / (24 * 60 * 60 * 1000)
}

function sheet_from_array_of_arrays(data: any[][]) {
    const ws: WorkSheet = {}
    const range: Range = {
        s: {
            c: 10000000,
            r: 10000000
        },
        e: {
            c: 0,
            r: 0
        }
    }
    for (let r = 0; r != data.length; ++r) {
        for (let c = 0; c != data[r].length; ++c) {
            if (range.s.r > r) range.s.r = r
            if (range.s.c > c) range.s.c = c
            if (range.e.r < r) range.e.r = r
            if (range.e.c < c) range.e.c = c
            const cell: CellObject = {
                v: data[r][c],
                t: 's'
            }
            if (cell.v == null) continue;
            const cell_ref = utils.encode_cell({
                c: c,
                r: r
            })

            if (typeof cell.v === 'number') cell.t = 'n'
            else if (typeof cell.v === 'boolean') cell.t = 'b'
            else if (cell.v instanceof Date) {
                cell.t = 'n'
                cell.z = SSF._table[14]
                cell.v = datenum(cell.v)
            } else cell.t = 's'

            ws[cell_ref] = cell
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = utils.encode_range(range)
    return ws
}

class WorkBookImpl implements WorkBook {
    Sheets = {}
    SheetNames = []
}

function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

export function export_table_to_excel(id: string): void {
    const theTable = document.getElementById(id) as HTMLTableElement;
    const oo = generateArray(theTable);
    const ranges = oo[1];

    /* original data */
    const data = oo[0];
    const ws_name = "SheetJS";

    const wb: WorkBook = new WorkBookImpl(),
        ws = sheet_from_array_of_arrays(data);

    /* add ranges to worksheet */
    // ws['!cols'] = ['apple', 'banan'];
    ws['!merges'] = ranges;

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    const wbout = write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    });

    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), "test.xlsx")
}


export interface ExportOptions {
    multiHeader?: string[][]
    header?: string[]
    data?: any[][]
    filename?: string
    merges?: string[]
    autoWidth?: boolean
    bookType?: BookType
}

export function export_json_to_excel({
    multiHeader = [],
    header = [],
    data = [],
    filename,
    merges = [],
    autoWidth = true,
    bookType = 'xlsx'
}: ExportOptions = {}): void {
    /* original data */
    filename = filename || 'excel-list'
    data = [...data]
    data.unshift(header);

    for (let i = multiHeader.length - 1; i > -1; i--) {
        data.unshift(multiHeader[i])
    }

    const ws_name = "SheetJS";
    const wb: WorkBook = new WorkBookImpl(),
        ws = sheet_from_array_of_arrays(data);

    if (merges.length > 0) {
        if (!ws['!merges']) ws['!merges'] = [];
        merges.forEach(item => {
            ws['!merges']!.push(utils.decode_range(item))
        })
    }

    if (autoWidth) {
        /*设置worksheet每列的最大宽度*/
        const colWidth = data.map(row => row.map((val: any): ColInfo => {
            /*先判断是否为null/undefined*/
            if (val == null) {
                return {
                    'wch': 10
                };
            }
            /*再判断是否为中文*/
            else if (val.toString().charCodeAt(0) > 255) {
                return {
                    'wch': val.toString().length * 2
                };
            } else {
                return {
                    'wch': val.toString().length
                };
            }
        }))
        /*以第一行为初始值*/
        const result = colWidth[0];
        for (let i = 1; i < colWidth.length; i++) {
            for (let j = 0; j < colWidth[i].length; j++) {
                if (result[j]['wch']! < colWidth[i][j]['wch']!) {
                    result[j]['wch'] = colWidth[i][j]['wch'];
                }
            }
        }
        ws['!cols'] = result;
    }

    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;

    const wbout = write(wb, {
        bookType: bookType,
        bookSST: false,
        type: 'binary'
    });
    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), `${filename}.${bookType}`);
}
