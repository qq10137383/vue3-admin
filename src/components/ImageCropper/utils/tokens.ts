import { InjectionKey, UnwrapNestedRefs, ComputedRef } from 'vue'
import { LangDef } from './language'
import { UseStep } from '@/hooks/use-step'

export interface CropperWizard {
    step: UseStep,
    off: () => void
}

export interface CropperState {
    currentState: number
    sourceImgUrl?: string
    file?: File
    createImgUrl?: string
}

export interface CropperShared {
    lang: ComputedRef<LangDef>,
    mime: ComputedRef<string>
}

export const wizardKey: InjectionKey<CropperWizard> = Symbol('cropperWizard')

export const stateKey: InjectionKey<UnwrapNestedRefs<CropperState>> = Symbol('cropperState')

export const sharedKey: InjectionKey<CropperShared> = Symbol('cropperShared')
