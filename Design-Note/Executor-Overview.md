# Executor

Executor 是一个利用 Telegram-CLI 作为后端的规则执行者。

## 基本行为地图

### 创建群组

1. 使用CLI指令：`create_group_chat <name> <user>+`
2. 通知数据库模块添加SQL记录；`managed_group` 包含群ID、群所隶属的管理群ID、预留rules位置
3. 结束返回

### 添加用户

1. 检查Ban List
2. 使用CLI指令：`chat_add_user <chat> <user> [msgs-to-forward]`
3. 结束返回

### 移除用户

1. 使用CLI指令：`chat_del_user <chat> <user>`
2. 结束返回

### 请求用户名与ID对应

1. 使用CLI指令：`resolve_username username`
2. 结束返回

## 高级行为地图

### 封禁用户

1. 使用CLI指令：`chat_del_user <chat> <user>`
2. 向 Controller 提交投票请求，并提供执行下述操作的 callback
3. 通知数据库追加SQL记录：`banned_user_individal` 或 `banned_user_all` 包含用户ID、（被ban群ID）、发起管理群ID

### 锁定标题

TODO

### 锁定图片

TODO

## 事件行为地图

### 加入事件

TODO