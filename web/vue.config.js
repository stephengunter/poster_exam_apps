module.exports = {
   devServer: {
		disableHostCheck: true
	},
	chainWebpack: config => {
		config.plugin('VuetifyLoaderPlugin').tap(args => [{
			match (originalTag, { kebabTag, camelTag, path, component }) {
				if (kebabTag.startsWith('core-')) {
					return [camelTag, `import ${camelTag} from '@/components/core/${camelTag.substring(4)}.vue'`]
				}
			}
		}]);
		config.plugin('VuetifyLoaderPlugin').tap(args => [{
			progressiveImages: true
		}]);
		config.module.rules.delete('eslint');
	},
  "transpileDependencies": [
    "vuetify"
  ]
}