/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {
      // MongoDB数据库配置
        mongoose:{
            client: {
                url: 'mongodb://127.0.0.1:27017/cloudNew', // user是collection(数据库)名称
                options: {
                    useUnifiedTopology: true
                },  // 其他配置项
            }
        },
		assets:{
			publicPath: '/public/',
		}
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1576384476895_3620'
  config.middleware = ['verificationToken'];
  config.verificationToken = {
    pubText: '20220127Nodebook',
    match: ['/pc/v1/auth']  // 仅在此前缀下才有效
  }
  const userConfig = {
		view: {
				mapping: {
					'.html': 'nunjucks'
				}
			},
		security: {
			csrf: {
				enable: false,
				ignoreJSON: true
			},
			domainWhiteList: ['http://localhost:8080'], //配置白名单
		},
		cors: {
			allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
			credentials: true,
			origin: ctx => ctx.get('origin'), // 跨域配置
		},
		session:{
			key:'SESSION_ID',
			maxAge:864000,  //过期时间
			httpOnly: true, 
			encrypt: true ,
			renew: true //延长会话有效期 
		},
		// Token加密文字
		jwt: {
			secret: "20220127Nodebook",
			pubTime: 60*60*24*365 // 十年
		},
		// 邮箱配置
		email: {
			client: {
			host: 'smtp.qq.com',
			secureConnection: true,
			port: 465,
			auth: {
				user: '********@qq.com',
				pass: '***************' // QQ密钥
			}
			}
		}
  }

  return {
    ...config,
    ...userConfig
  }
}
