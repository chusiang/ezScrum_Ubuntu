# ezScrum_Ubuntu

ezScrum v1.7.1 fork form [ezScrum](http://sourceforge.net/projects/ezscrum/files/Release/v1.7.1/).


## setting

modify the ``localhost`` string to real host (like 192.168.56.2), and it can\`t work with ``localhost``.

    $ vim JettyServer.xml
    ...
    <SystemProperty name="jetty.host" default="localhost"/>

## Makefile

Run the ezScrum.

	$ make

Stop the ezScrum.

	$ make stop

Update the ezScrum_Ubuntu from my github.

    $ make update

## Documents

[ezScrum v1.7.1/doc | SourceForge.net](http://sourceforge.net/projects/ezscrum/files/Release/v1.7.1/doc/)

 1. User Guide: [[Chinese]](http://sourceforge.net/projects/ezscrum/files/Release/v1.7.1/doc/ezScrum_User_Guide.pdf/download), [[English]](http://sourceforge.net/projects/ezscrum/files/Release/v1.7.1/doc/ezScrum_User_Guide-eng.pdf/download)
 2. System Install: [[Chinese]](http://sourceforge.net/projects/ezscrum/files/Release/v1.7.1/doc/ezScrum_System_Install.pdf/download), [[English]](http://sourceforge.net/projects/ezscrum/files/Release/v1.7.1/doc/ezScrum_System_Install-eng.pdf/download)
 3. System Install Q&A: [[Chinese]](http://sourceforge.net/projects/ezscrum/files/Release/v1.7.1/doc/ezScrum_System_Install_QA-cht.pdf/download), [English](http://sourceforge.net/projects/ezscrum/files/Release/v1.7.1/doc/ezScrum_System_Install_QA-eng.pdf/download)
 4. Plugin Thesis: [2012-ezscrum-plugin-thesis.pdf](http://sourceforge.net/projects/ezscrum/files/Release/v1.7.1/doc/2012-ezscrum-plugin-thesis.pdf/download)

## Change Logs

### v1.7.1 (2013-03-29 updated)

#### Bug fixed

1. Multiple users from different projects can now use ezScrum concurrently without causing an error. 
2. Historical information has been removed in the "Add Account" form.

### Changed

1. The required fields are now marked with a red star.
2. In the "Account Management" page

 - Admin's default mail is "your_name@your_domain.com".
 - The "Edit Information" and the "Change Password" buttons are added.
 - The "Edit Account" button is removed.
 
### Known bugs

None

### 修正

1. 修正後，多個使用者同時操作不同專案時，不會有錯誤訊息產生。
2. 修正後， Add Account 表單時不會顯示歷史資訊。 

### 變更

1. 在各表單必填欄位前方加上紅色星號以提示使用者。
2. 在 Account Management 頁面

 - Admin 的預設電子郵件地址改為 example@ezScrum.tw。
 - 新增 Edit Information 和 Change Password 功能按鈕。
 - 移除 Edit Account 功能按鈕。
 
### 已知議題
 
無

