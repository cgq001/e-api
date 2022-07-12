'use strict';

const fs = require('fs')
const path = require('path')

module.exports = app => {
 class WebController extends app.Controller {
    async web () {
        const { ctx } = this
        ctx.response.type = 'html'
        ctx.body = fs.readFileSync(path.resolve(__dirname, '../../app/public/web/index.html'))
    }
    async www () {
        const { ctx } = this
        ctx.response.type = 'html'
        ctx.body = fs.readFileSync(path.resolve(__dirname, '../../app/public/www/index.html'))
    }
 }
 return WebController;
};
