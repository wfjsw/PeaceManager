# Peace Manager 开发笔记

~~我以人格担保这个项目和PeaceMaker没有半毛钱关系！~~

## Overview

项目性质：Telegram 群组管理助手  
项目语言：Node.js  
项目组成：

1. Controller:  利用 Bot API 写成，用来接收控制消息、发起投票等。
2. Executor: 使用 Telegram-CLI 后端，用于创建群组、管理成员、执行命令。

由于 Telegram-CLI 天生的设计~~劣根性~~，Executor的运行**需要一个电话号码**。

项目应达成的主要目标：

1. Executor 应当可以创建群组，并取得管理该群组所需的权限 【可实现√】
2. Executor 应当可以监听用户回复命令，依据命令执行相应数据库 & 群组操作  【可实现√】
3. Controller 应当有一套完整的管理命令、管理界面、管理员管理方案，并与 Executor 无缝对接  【可实现√】
4. Executor 可监听用户加入事件，实时查询ban list并作出适当操作  【可实现√】
5. 锁定 Group Name、Group Profile Photo  【尝试实现Photo】
6. 生成、吊销邀请链接  【可实现√】【Currently Cause Broke on CLI】
7. Extra Bonus: Resolve Username
    
依赖需求： 
 
1. 需要一个数据库: 正在考虑中  
2. Telegram-CLI 客户端  
3. 必须的 Node.js  