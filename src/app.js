const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors=require('koa2-cors')
const session = require('koa-generic-session')

const index = require('./routes/index')
const users = require('./routes/users')
const comment = require('./routes/comment')

// error handler
onerror(app)

//session中间件
app.keys = ['wertwe^&&*UUI123123'] 
app.use(session({
    // 配置 cookie
    cookie: {
        path: '/', 
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000 
    }
}))

//跨域
app.use(cors({
  origin:'http://localhost:8080',    
  // origin:'http://192.168.24.235:8080',    
  credentials:true       //允许跨域的时候带着cookie
}))

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(comment.routes(), comment.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
