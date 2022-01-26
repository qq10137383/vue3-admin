import { InjectionKey, ComputedRef } from 'vue'
import { LangDef } from './language'
import { UseStep } from '@/hooks/use-step'

export const stepKey: InjectionKey<UseStep> = Symbol('step')

export const langKey: InjectionKey<ComputedRef<LangDef>> = Symbol('lang')

export const mimeKey: InjectionKey<ComputedRef<string>> = Symbol('mime')

export const closeKey: InjectionKey<() => void> = Symbol('close')