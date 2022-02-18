import { ElForm } from 'element-plus'
import { RuleItem } from 'async-validator/dist-types/interface'
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

export type FormRuleCallBack = (error?: Error) => void

export type ElFormRules = NonNullable<(InstanceType<typeof ElForm>)["rules"]>

export type ElFormRuleValidator = RuleItem["validator"]

export interface TableColumnScope<T> {
    row: T,
    column: TableColumnCtx<T>,
    $index: number
}

export type KeyArray<T> = (keyof T)[]