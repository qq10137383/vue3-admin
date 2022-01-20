import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

export type FormRuleCallBack = (error?: Error) => void

export interface TableColumnScope<T> {
    row: T,
    column: TableColumnCtx<T>,
    $index: number
}