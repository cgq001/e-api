'use strict'

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
	static: {
		enable: true
	},
	nunjucks: {
		enable: true,
		package: 'egg-view-nunjucks'
	},
	mongoose:{
		enable: true,
  		package: 'egg-mongoose',
	},
	email:{
		enable: true,
  		package: 'egg-email',
	},
	validate : {
		enable: true,
		package: 'egg-validate',
	},
	cors: {
		enable: true,
		package: 'egg-cors',
	}
}
