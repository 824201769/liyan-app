<template>
	<view class="p-20">
		<u--form labelWidth="80" labelPosition="left" :model="data" ref="form">
			<u-form-item label="小区名称" prop="name">
				<u--input
					fontSize="28rpx"
					customStyle="padding: 6rpx 10rpx;border-radius:20rpx;color: #333333;"
					v-model="data.name"
					border="bottom"
					placeholder="请填小区名称"
				></u--input>
			</u-form-item>
		</u--form>
		<view class="flex  p-r-30 col-top m-t-20">
			<view style="width: 80px;" class="font-28">小区图片</view>
			<view class=" flex-1">
				<u-upload
					:fileList="fileList"
					@afterRead="afterRead"
					@delete="deletePic"
					name="shopafterRead"
					multiple
					:maxCount="10"
					:previewFullImage="true"
				></u-upload>
			</view>
		</view>
		<view class="m-t-100"><u-button type="primary" text="保存" @click="save"></u-button></view>
	</view>
</template>

<script>
import { fileURL, BaseURL } from '@/common/index.js';
export default {
	data() {
		return {
			fileList: [],
			data: {
				name: '',
				imgUrl: []
			}
		};
	},
	onLoad(opt) {
		if (opt.id) {
			uni.$u.http.post('/api/product/query', { _id: opt.id }).then(res => {
				this.data = res;
				this.data.imgUrl = this.setPath(this.data.imgUrl);
				this.data.imgUrl.forEach(item => {
					this.fileList.push({
						status: 'success',
						message: '',
						path: item.url,
						url: fileURL + item.url,
						id: item.id
					});
				});
			});
		}
	},
	methods: {
		save() {
			this.data.imgUrl = [];
			this.fileList.forEach(item => {
				this.data.imgUrl.push({
					id: item.id,
					url: item.path
				});
			});

			if (this.data.imgUrl.length <= 0) {
				uni.$u.toast('至少上传一张图片');
				return;
			}
			if (this.data._id) {
				uni.$u.http.post('/api/product/updateProduct', this.data).then(res => {
					uni.$u.toast('操作成功');
				});
			} else {
				uni.$u.http.post('/api/product/createProduct', this.data).then(res => {
					uni.$u.toast('操作成功');
				});
			}
		},
		setPath(list = []) {
			for (var i = 0; i < list.length; i++) {
				if (list[i].url.indexOf('http://114.96.104.189:8088/') != -1) {
					list[i].url = list[i].url.substring(27, list[i].url.length);
				}
			}
			return list;
		},
		// 删除图片
		deletePic(event) {
			this[`fileList${event.name}`].splice(event.index, 1);
		},
		// 新增图片
		async afterRead(event) {
			// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
			let lists = [].concat(event.file);
			let fileListLen = this.fileList.length;
			lists.map(item => {
				this.fileList.push({
					...item,
					status: 'uploading',
					message: '上传中'
				});
			});
			for (let i = 0; i < lists.length; i++) {
				const result = await this.uploadFilePromise(lists[i].url);
				let item = this.fileList[fileListLen];
				this.fileList.splice(
					fileListLen,
					1,
					Object.assign(item, {
						status: 'success',
						message: '',
						path: result.url,
						url: fileURL + result.url,
						id: result.id
					})
				);
				fileListLen++;
			}
		},
		uploadFilePromise(url) {
			return new Promise((resolve, reject) => {
				let a = uni.uploadFile({
					url: BaseURL + 'api/upload/service', // 仅为示例，非真实的接口地址
					filePath: url,
					name: 'file',
					success: res => {
						setTimeout(() => {
							resolve(JSON.parse(res.data));
						}, 1000);
					}
				});
			});
		}
	}
};
</script>

<style></style>
