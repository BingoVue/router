// 
let Vue;  // 保存use传入的Vue构造函数
class MyVueRouter {
  constructor(options){
    this.$options = options

    this.routeMap = {}  // {'/index': {component: Index, ...}}

    // 当前url需要是响应式的
    this.app = new Vue({
      data: {current: '/'}
    })
  }
  // 初始化
  init(){
    // 监听事件
    this.bindEvents()
    // 解析routes
    this.createRouteMap()
    // 声明组件
    this.initComponent()
  }

  bindEvents(){
    window.addEventListener('hashchange', this.onHashchange.bind(this))
  }
  onHashchange(){
    console.log(window.location.hash)
    // 截取#号后面
    this.app.current = window.location.hash.slice(1) || '/'
  }
  createRouteMap(){
    // 遍历用户配置的路由数组
    this.$options.routes.forEach(route=>{
      this.routeMap[route.path] = route
    })
  }
  initComponent(){
    // 转换目标：<a href="/">xxx</a>
    // <router-link to="/"/>
    Vue.component('router-link', {
      props: {
        to: String
      },
      render(){
        // 使用createElement, h(tag, data, children)
        /* return h('a', {
          attrs: {href: this.to}
        }, [this.$slots.default]) */

        // 使用JSX
        return <a href={'#'+this.to}>{this.$slots.default}</a>
      }
    })

    // 获取path对应得Component将它渲染出来
    /* Vue.component('router-view', {
      render: h=>{
        var component = this.routeMap[this.app.current].component; 
        return h(component)
      }
    }) */
    Vue.component('router-view', {
      functional: true,
      render(h, {parent}){
        const router = parent.$router
        console.log(parent, router)
        const component = router.routeMap[router.app.current].component; 
        return h(component)
      }
    })
  }
}

// 参数是Vue的构造函数
MyVueRouter.install = function(_Vue){
  Vue = _Vue
  // 实现一个混入
  Vue.mixin({
    beforeCreate(){
      // 获取MyVueRouter实例并挂载到Vue.prototype
      if(this.$options.router){
        // 根组件beforeCreate时执行一次
        Vue.prototype.$router = this.$options.router
        // 路由器初始化
        this.$options.router.init()
      }
    }
  })
}

export default MyVueRouter;