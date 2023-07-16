// 跳转到redirect，redirect不存在则跳转note
export async function gotoNext(that) {
    //用户已登录，跳转
    let redirect = "/note"
    const routeRedirect = that.$route.query.redirect
    if (routeRedirect != null && routeRedirect != "" && routeRedirect != '/passport/register') {
        redirect = routeRedirect
    }
    // 跳转页面到首页
    that.$router.push(redirect)
}