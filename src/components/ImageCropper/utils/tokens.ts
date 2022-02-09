import { InjectionKey, UnwrapNestedRefs, ComputedRef } from 'vue'
import { LangDef } from './language'
import { UseStep } from '@/hooks/use-step'

export interface CropperWizard {
    // 步骤导航
    step: UseStep,
    // 关闭窗口
    close: () => void
}

export interface CropperState {
    // 当前状态，-1：初始状态，0：选择图片完成，1：裁剪图片完成，2：开始上传，3：上传成功，4：上传失败
    currentState: number
    // 选择图片原图(base64字符串)
    sourceImgUrl?: string
    // 选择图片原文件(File)
    file?: File
    // 裁剪后的图片(base64字符串)
    createImgUrl?: string
    // 上传结果
    uploadResult?: any
}

export interface CropperShared {
    // 语言包
    lang: ComputedRef<LangDef>,
    // 上传媒体类型
    mime: ComputedRef<string>
}

export const wizardKey: InjectionKey<CropperWizard> = Symbol('cropperWizard')

export const stateKey: InjectionKey<UnwrapNestedRefs<CropperState>> = Symbol('cropperState')

export const sharedKey: InjectionKey<CropperShared> = Symbol('cropperShared')
