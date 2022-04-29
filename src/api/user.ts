import request from '@/utils/request'
import { AxiosPromise } from 'axios'

/**
 * login dto
 */
export interface LoginDto {
  /**
   * 用户名
   */
  username: string,
  /**
   * 密码
   */
  password: string
}

/**
 * 登陆 vo
 */
export interface LoginVo {
  /**
   * token
   */
  token: string
}

/**
 * 登陆
 * @param data {LoginDto}
 * @returns 
 */
export function loginApi(data: LoginDto): AxiosPromise<LoginVo> {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

/**
 * 用户信息Vo
 */
export interface UserVo {
  /**
   * 角色
   */
  roles: string[],
  /**
   * 描述信息
   */
  introduction: string,
  /**
   * 头像
   */
  avatar: string,
  /**
   * 名字
   */
  name: string
}

/**
 * 获取用户信息
 * @param token 
 * @returns 
 */
export function getInfoApi(token: string): AxiosPromise<UserVo> {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

/**
 * 用户注销
 * @returns 
 */
export function logoutApi(): AxiosPromise<string> {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
