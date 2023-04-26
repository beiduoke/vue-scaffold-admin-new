import axios, { AxiosResponse } from 'axios';
import { ErrorResult, RequestOptions, Result } from '/#/axios';
import { ResultEnum } from '/@/enums/httpEnum';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { customHttp } from '/@/utils/http/core';
import { AxiosTransform } from '/@/utils/http/core/axiosTransform';
import { isEmpty, isNull, isUnDef } from '/@/utils/is';

const { createMessage, createErrorModal, createSuccessModal } = useMessage();

const transform: AxiosTransform = {
  transformResponseHook: (res: AxiosResponse, options: RequestOptions) => {
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    // 错误的时候返回

    const { data } = res;
    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error(t('sys.api.apiRequestFailed'));
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, message } = data as unknown as Result;

    // 如果消息不存在则判定该数据为其他格式
    if (!message) return data;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
    if (hasSuccess) {
      let successMsg = message;

      if (isNull(successMsg) || isUnDef(successMsg) || isEmpty(successMsg)) {
        successMsg = t(`sys.api.operationSuccess`);
      }

      if (options.successMessageMode === 'modal') {
        createSuccessModal({ title: t('sys.api.successTip'), content: successMsg });
      } else if (options.successMessageMode === 'message') {
        createMessage.success(successMsg);
      }
      return data;
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = '';
    if (message) {
      timeoutMsg = message;
    }

    // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMessageMode === 'modal') {
      createErrorModal({ title: t('sys.api.errorTip'), content: timeoutMsg });
    } else if (options.errorMessageMode === 'message') {
      createMessage.error(timeoutMsg);
    }

    throw new Error(timeoutMsg || t('sys.api.apiRequestFailed'));
  },

  requestCatchHook: (e: Error, options: RequestOptions) => {
    const { t } = useI18n();
    return new Promise((resolve, reject) => {
      if (axios.isAxiosError(e)) {
        const result = e.response?.data as unknown as ErrorResult;
        const { code, message } = result;
        let timeoutMsg = '';
        switch (code) {
          case ResultEnum.TIMEOUT:
            timeoutMsg = t('sys.api.timeoutMessage');
            const userStore = useUserStoreWithOut();
            userStore.setToken(undefined);
            userStore.logout(true);
            break;
          default:
            if (message) {
              timeoutMsg = message;
            }
        }
        if (options.errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: timeoutMsg });
        } else if (options.errorMessageMode === 'message') {
          createMessage.error(timeoutMsg);
        }
        resolve(timeoutMsg);
      }
      reject(e);
    });
  },
};

export const defHttp = customHttp({ transform, authenticationScheme: 'Bearer' });
