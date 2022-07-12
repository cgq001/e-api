```json
{	
    // 插件版本
	"manifest_version": 2, 
    // 插件名字
	"name": "云上API",
    // 版本号
	"version": "1.0.0",
    // 描述
	"description": "一个API接口请求工具",
    // 图标
	"icons":
        {
            "16": "img/icon.png",
            "48": "img/icon.png",
            "128": "img/icon.png"
        },
    // 后台页
	"background":
	{
		"page": "background.html"
	},
    // title页面
	"browser_action": 
	{
		"default_icon": "img/icon.png", // 图表
		"default_title": "这是一个示例Chrome插件", // 鼠标放上去后的提示文字
		"default_popup": "options.html" // 打开网页
	},
    // 权限
	"permissions":
	[
		"contextMenus",  // 右键菜单
		"tabs",  // 标签
		"notifications",
		"webRequest", 
		"webRequestBlocking",
		"storage",
        "*://*/*", // 跨域
		"http://*/*",
		"https://*/*",
	],
    // 注入页面的JS代码
    "content_scripts": [
        {
            "matches": ["<all_urls>"], // 匹配URL
            "js": ["js/index.js"],  // 加载文件
            "run_at": "document_start"//  运行时机
        }
    ],
	"web_accessible_resources": ["js/inject.js"],
	"homepage_url": "https://www.baidu.com",
	// 固定标签页
	"chrome_url_overrides":
	{
		"newtab": "options.html" // 可以重定向网页
	},
	"options_page": "options.html",
	"options_ui":
	{
		"page": "options.html",
		"chrome_style": true
	},
	"omnibox": { "keyword" : "go" },
	"devtools_page": "devtools.html"
}
```


```js
$("openback").click(e => {
    window.option(chrome.extension.getURL("background.html"))
})
```