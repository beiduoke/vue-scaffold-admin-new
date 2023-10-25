import type { AxiosRequestConfig } from 'axios';
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { ResultEnum } from '/@/enums/httpEnum';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { RequestOptions } from '/#/axios';

const { createMessage, createErrorModal } = useMessage();

export class AxiosResponse {}

export const transform = {
  responseErrorCatch: (error: any, options: RequestOptions) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const err: string = error?.toString?.() ?? '';
    const { message, code } = response?.data;
    let errMessage = '';
    try {
      switch (code) {
        case ResultEnum.TIMEOUT:
          errMessage = t('sys.api.timeoutMessage');
          const userStore = useUserStoreWithOut();
          userStore.setToken(undefined);
          userStore.logout(true);
          break;
        default:
          if (message) {
            errMessage = message;
          }
      }
      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }
  },
};
