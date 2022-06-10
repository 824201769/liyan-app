let timer;
import {
	BaseURL,
	toPath
} from './index.js'
// 此vm参数为页面的实例，可以通过它引用vuex中的变量
module.exports = (vm) => {
	// 初始化请求配置
	uni.$u.http.setConfig((config) => {
		/* config 为默认全局配置*/
		config.baseURL = BaseURL; /* 根域名 */
		return config
	})
	// 请求拦截
	uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
		// 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		config.data = config.data || {}
		// 根据custom参数中配置的是否需要token，添加对应的请求头
		config.header.Authorization = 'Bearer ' + uni.getStorageSync('token');
		config.header.Accept = 'application/json';
		if (!timer) {
			timer = setTimeout(() => {
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
			}, 500);
		}
		return config
	}, config => { // 可使用async await 做异步操作
		return Promise.reject(config)
	})
	// 响应拦截
	uni.$u.http.interceptors.response.use((response) => {
		// 请求返回后，隐藏loading(如果请求返回快的话，可能会没有loading)
		setTimeout(() => {
			uni.hideLoading();
		}, 100)
		// 清除定时器，如果请求回来了，就无需loading
		clearTimeout(timer);
		timer = null;
		/* 对响应成功做点什么 可使用async await 做异步操作*/
		if (response.statusCode == 401) {
			toPath('')
			return
		}
		if (response.statusCode == 500) {
			uni.$u.toast('服务器开小差了')
			return
		}
		if (response.statusCode == 400) {
			uni.$u.toast(response.data.message)
			return
		}
		const data = response.data
		return data
	}, (response) => {
		setTimeout(() => {
			uni.hideLoading();
		}, 100)
		// 清除定时器，如果请求回来了，就无需loading
		clearTimeout(timer);
		timer = null;
		if (response.statusCode == 401) {
			toPath('')
			return
		}
		if (response.statusCode == 500) {
			uni.$u.toast('服务器开小差了')
			console.log("错误代码：500=>", response.data)
			return Promise.reject(response)
		}
		if (response.statusCode == 400) {
			console.log("错误代码：400=>", response.data.message)
			uni.$u.toast(response.data.message)
			return Promise.reject(response)
		}
	})
}
