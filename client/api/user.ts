import { fetch } from '../utils/fetch';

export const authUser = async userData => {
  try {
    const { data } = (await fetch({
      method: 'post',
      url: '/user',
      data: userData,
    })) as any;

    return data.user;
  } catch (e: any) {
    alert(e.response.data.message);
    return {};
  }
};

export const fetchUser = async () => {
  try {
    const { data } = (await fetch({
      method: 'get',
      url: '/user',
      params: {
        token: localStorage.getItem('token'),
      },
    })) as any;

    return data.user;
  } catch (e: any) {
    localStorage.removeItem('token');
    alert(e.response.data.message);
    return {};
  }
};
