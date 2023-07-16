export const api = {

    // 笔记操作
    // 用户全部笔记  get
    note_list: '/api/note/list',
    // 根据id查询笔记 get  /api/note/info?id=
    note_info: '/api/note/info',
    // 保存笔记  post   note对象
    note_save: '/api/note/save',
    // 删除笔记  get '/api/note/delete?id=' 
    note_delete: '/api/note/delete',
    // es查询笔记 get  '/api/note/search?q='
    note_search: '/api/note/search',

    // 图片操作
    // 图片上传接口  post formdata对象
    img_upload: '/api/img/upload',

    // 账户操作
    // 登录 post user对象
    passport_login: "/api/passport/login",
    // 是否已登录
    passport_isLogin: '/api/passport/isLogin',
    // 注册账户 post user对象
    passport_register: '/api/passport/register',
    // 退出登录 get
    passport_logOut: '/api/passport/logOut',
    // 注销账户 get
    user_logOff: '/api/user/logOff'
}