# 前端攻击技术
## XSS 攻击
1. 攻击形式
   主要是通过html标签注入，篡改网页，插入恶意的脚本，前端可能没有经过严格的校验直接就进到数据库，数据库又通过前端程序又回显到浏览器

```js
主要是通过html标签注入，篡改网页，插入恶意的脚本，前端可能没有经过严格的校验直接就进到数据库，数据库又通过前端程序又回显到浏览器
```
2. 攻击的目的
    攻击者可通过这种方式拿到用户的一些信息，例如cookie 获取敏感信息，甚至自己建网站，做一些非法的操作等；或者，拿到数据后以用户的身份进行勒索，发一下不好的信息等。

3. 如何防御
方法1：cookie中设置 HttpOnly 属性

方法2：首先前端要对用户输入的信息进行过滤，可以用正则，通过替换标签的方式进行转码或解码，例如<> 空格 & '' ""等替换成html编码

```js
htmlEncodeByRegExp:function (str){  
  var s = "";
  if(str.length == 0) return "";
  s = str.replace(/&/g,"&amp;");
  s = s.replace(/</g,"&lt;");
  s = s.replace(/>/g,"&gt;");
  s = s.replace(/ /g,"&nbsp;");
  s = s.replace(/\'/g,"&#39;");
  s = s.replace(/\"/g,"&quot;");
  return s;  
  }
```

## CSRF攻击(跨站请求伪造)
1. CSRF攻击形式：

CSRF也是一种网络攻击方式，比起xss攻击，是另外一种更具危险性的攻击方式，xss是站点用户进行攻击，而csrf是通过伪装成站点用户进行攻击，而且防范的资源也少，难以防范

2. csrf攻击形式：攻击者盗用用户的身份信息，并以用户的名义进行发送恶意的请求等，例如发邮件，盗取账号等非法手段

例如：你登录网站，并在本地种下了cookie
如果在没退出该网站的时候 不小心访问了恶意网站，而且这个网站需要你发一些请求等
此时，你是携带cookie进行访问的，那么你的种在cookie里的信息就会被恶意网站捕捉到，那么你的信息就被盗用，导致一些不法分子做一些事情

3. 攻击防御：

验证HTTP Referer字段

在HTTP头中有Referer字段，他记录该HTTP请求的来源地址，如果跳转的网站与来源地址相符，那就是合法的，如果不符则可能是csrf攻击，拒绝该请求

在请求地址中添加token并验证

这种的话在请求的时候加一个token，值可以是随机产生的一段数字，
token是存入数据库之后，后台返给客户端的，如果客户端再次登录的时候，
后台发现token没有，或者通过查询数据库不正确，那么就拒绝该请求

如果想防止一个账号避免在不同的机器上登录，那么我们就可以通过token来判断，
如果a机器登录后，我们就将用户的token从数据库清除，从新生成，
那么另外一台b机器在执行操作的时候，token就失效了，只能重新登录，这样就可以防止两台机器登同一账号

在HTTP头中自定义属性并验证

如果说通过每次请求的时候都得加token那么各个接口都得加很麻烦，
那么我们通过http的请求头来设置token
例如：
 在axios 封装的实例中，添加：
 ```js
 const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  timeout: 10000,
  withCredentials: false
})

 instance.interceptors.request.use(
  config => {
    const token = cookie.get('access-token')
    if (token) {
      config.headers.token = token
    }
    return config
  },
  error => Promise.error(error)
)
 ```