
function registerListenSessionInSprintBacklog(){//將sprintBacklog中所有的widget註冊監聽session
	//task action
	registerCheckSession( EditTaskWindow );
	registerCheckSession( SprintBacklog_DropTaskWidget );
	registerCheckSession( SprintBacklog_DeleteTaskWidget );
	registerCheckSession( IssueHistory_Window );
	
	//sprint backlog action
	registerCheckSession( Story_Window );//function of the story window is add and edit story
	registerCheckSession( AddExistedStory_Window );
	registerCheckSession( SprintPlan_Window );
	/*p.s. 
	 * 1.printable stories 
	 * 2.print information
	 * 以上兩者都是使用window.open開新分頁的方式
	*/
	//story action
	registerCheckSession( SprintBacklog_ExistedTaskWidget );
	registerCheckSession( SprintBacklog_CreateTaskWidget );
	registerCheckSession( SprintBacklog_DropStoryWidget );
	registerCheckSession( MoveStory_Window );
	/*p.s. 
	 * 1.edit story已經在Story_Window做過註冊了
	 * 2.story history 在sprintBacklog 中的IssueHistory_Window已經註冊過了
	 */
	//sprint backlog combo
	registerCheckSession(  Ext.getCmp('SprintBacklog_Page_Event').SprintBacklog_SprintCombo );
	
	
}

function registerListenSessionInSprintPlan(){
	registerCheckSession( SprintPlan_DeleteWindow );
	registerCheckSession( SprintPlan_MoveWindow );
	/*p.s.
	 * 1.new sprint
	 * 2.edit sprint
	 * 以上兩者都在sprintBacklog中的SprintPlan_Window註冊過了
	 * */
}

function registerListenSessionInProductBacklog(){
	registerCheckSession( importStoriesWidget );
	registerCheckSession( deleteStoryWidget );
	/*p.s.
	 * 1.add story
	 * 2.edit story
	 * 3.show history 在 sprintBacklog 中的IssueHistory_Window註冊過了
	 * */
	registerCheckSession( Manage_Tag_Window );
	registerCheckSession( AttachFile_Window );
	registerCheckSession( ProductBacklogStore );
	/*
	 * ProductBacklogStore註冊監聽session
	 * backlog status filter--> detailed backlogged done
	 * Reload
	 * search field
	 * */
	
	//ui component which generated by plugin will not support session expired solution, it must search another solution in the future
	//registerCheckSession( Ext.getCmp('ProductBacklog_tagMenu').menu ); 

}

function registerListenSessionInReleasePlan(){
	//release action
	registerCheckSession( ModifyReleasePlanWindow );
	registerCheckSession( DeleteReleasePlanWindow );
	registerCheckSession( ShowReleaseBacklog_Window );
	
	/*sprint action 已在別的地方註冊過了*/
	
	//story action
	/*add existed story 和 move story在別的地方註冊過監聽session過期事件*/
	registerCheckSession( ReleasePlan_DropStoryWindow );//drop release plan下的story
	registerCheckSession( dropStoryFromReleaseWidget );//drop sprint下的story
	registerCheckSessionForTreeWidget( Ext.getCmp('ReleasePlan_ReleaseTree') );
}

function registerListenSessionInRetrospective(){
	registerCheckSession( AddNewRetrospectiveWidget );
	registerCheckSession( EditRetrospectiveWidget );
	registerCheckSession( DeleteRetrospectiveWidget );
	registerCheckSession( Ext.getCmp('SprintCombo_RetrospectiveToolBar') );
}

function registerListenSessionInUnplanned(){
	registerCheckSession( CreateUnplannedWidget );
	registerCheckSession( EditUnplannedWidget );
	registerCheckSession( DeleteUnplannedWidget );
	registerCheckSession( Ext.getCmp('SprintCombo_UnplannedToolBar') );
}

function registerListenSessionInTaskBoard(){
//	registerCheckSession( Ext.getCmp('TaskBoardSprintDesc').TaskBoard_SprintIDCombo );
//	registerCheckSession( Ext.getCmp('TaskBoardSprintDesc').TaskBoard_HandlerCombo );
	
//	registerCheckSession( DoneIssueWindow );		// task check out -> done , story not check out -> done
//	registerCheckSession( CheckOutTaskWindow ); 	// not check out -> check out
//	registerCheckSession( RE_CheckOutTaskWindow ); 	// check out -> not check out 
//	registerCheckSession( RE_OpenIssueWindow );  	// Done -> check out
//	registerCheckSession( EditTaskWindow );
}

function registerListenSessionInScrumReport(){
	registerCheckSession( ezScrumReportPage.items.get(0) );//監聽tabchange事件
}

function registerListenSessionInITSConfiguration(){
	registerCheckSession( Ext.getCmp('ITSConfig_Form').buttons[0] );
}

function registerListenSessionInProjectConfiguration(){
	registerCheckSession( AddMember_Widget );
	registerCheckSession( Ext.getCmp('ProjectDescModify').buttons[0] );
}

function listenSessionForLeftTreeAllWidget(){////頁面中ProjectList的部份
	//project configuration
	registerListenSessionInProjectConfiguration();
	//project management
	registerListenSessionInSprintBacklog();
	registerListenSessionInSprintPlan();
	registerListenSessionInProductBacklog();
	registerListenSessionInReleasePlan();
	registerListenSessionInRetrospective();
	registerListenSessionInUnplanned();
	registerListenSessionInScrumReport();
	registerListenSessionInTaskBoard();
	//ITS configuration
	registerListenSessionInITSConfiguration();
}


function registerUserInformation(){
	registerCheckSession( Ext.getCmp('User_Management_left_panel') );
	registerCheckSession( Ext.getCmp('userEditInformationTab').buttons[0] );
	registerCheckSession( Ext.getCmp('userChangePasswordTab').buttons[0] );
}

function listenSessionForUserInformationManagement(){//頁面中Management的部份
	//management
	registerUserInformation();
}

function registerAccountOperation(){
	registerCheckSession( Account_Modify_Window );
	registerCheckSession( Ext.getCmp('AccountManagement_deleteAccountBtn') );
	registerCheckSession( Ext.getCmp('AccountManagement_assignRoleBtn') );
}

function listenSessionForAccountManagement(){//頁面中Account Management的部份
	//account management
	registerAccountOperation();
}

function registerListenSessionInProjectList(){
	registerCheckSession( Ext.getCmp('Projects_GirdPanel') );
}

function listenSessionForProjectList(){
	registerListenSessionInProjectList();
}

function registerCheckSession( obj ){
	if( obj != undefined ){//if obj is undefined IE will alert a wrong answer 
		obj.on('beforeshow',function(){//表單跳出時檢查一次
			checkUserSession();
		});
		
		obj.on('beforehide',function(){//表單隱藏時再檢查一次
			checkUserSession();
		});
		
		obj.on('selectIndex',function(){//為了combo監聽這個事件
			checkUserSession();
		});
		
		obj.on('select',function(){//為了combo監聽這個事件
			checkUserSession();
		});
		
		obj.on('load',function(){//為了store監聽這個事件
			checkUserSession();
		});
		
		obj.on('itemClick',function(){//為了menu監聽這個事件
			checkUserSession();
		});
		
		obj.on('tabchange',function(){//為了tabpanel監聽這個事件
			checkUserSession();
		});
		
		obj.on('click',function(){//為了button監聽這個事件
			checkUserSession();
		});
		
		obj.on('cellclick',function(){//為了gridPanel cell監聽這個事件
			checkUserSession();
		});
	 }
}

function registerCheckSessionForTreeWidget( obj ){//因為treeWidget監聽selectionchange必須要得到getSelectionModel
	obj.getSelectionModel().on('selectionchange',function(){
		checkUserSession();
	});
}

/**
 * 檢查session是否過期，如果沒有過期開一個該指定的新分頁
 * @param url
 */
function openURLWithCheckSession( url ){
	Ext.Ajax.request({
		url: 'validateUserEvent.do',
		success : function(response) {
			var jsonObject = JSON.parse(response.responseText);
			var isUserSessionExisted = jsonObject.IsUserSessionExisted;
			var isProjectAccess = jsonObject.IsProjectAccess;
			if( isUserSessionExisted == false ){
				alertSessionWarningWindow();
				location.replace("./logon.do");
			}else{
				if( (isProjectAccess == false) ){
					alertPermissionWarningWindow();
					location.replace("./logon.do");
				}else{
					window.open( url );
				}
			}
			
//			if( response.responseText == "session out of time" ){
//				alertSessionWarningWindow();
//				location.replace("./logon.do");
//			}else{
//				window.open( url );
//			}
		},
		failure : function() {
			alert("Server Failure!");
		}
	});
}

/**
 * 檢查session是否過期或使用者權限，如果沒有直接將網頁轉頁到該指定的頁面
 * @param url
 */
function replaceURL( url ){
	Ext.Ajax.request({
		url: 'validateUserEvent.do',
		success : function(response) {
			var isTopPanelTriggered = checkEventURLIsTopPanel(url);
			var jsonObject = JSON.parse(response.responseText);
			var isUserSessionExisted = jsonObject.IsUserSessionExisted;
			var isProjectAccess = jsonObject.IsProjectAccess;
			if( isUserSessionExisted == false ){
				alertSessionWarningWindow();
				location.replace("./logon.do");
			}else {
				if( isTopPanelTriggered == true ){	//	true:代表不需經過任何驗證下即可轉頁
					document.location.href = url;
				}else{
					if( (isProjectAccess == false) ){
						alertPermissionWarningWindow();
						location.replace("./logon.do");
					}else{
						document.location.href = url;
					}
				}
			}
			
//			if( response.responseText == "session out of time" ){
//				alertSessionWarningWindow();
//				location.replace("./logon.do");
//			}else{
//				document.location.href = url;
//			}
		},
		failure : function() {
//			alert("test session exists fail !!!");
			alert("Server Failure!");
		}
	});
}

/**
 * 檢查session 是否存在
 */
function checkUserSession(){
	Ext.Ajax.request({
		url: 'validateUserEvent.do',
		success : function(response) {
			var jsonObject = JSON.parse(response.responseText);
			var isUserSessionExisted = jsonObject.IsUserSessionExisted;
			var isProjectAccess = jsonObject.IsProjectAccess;
			if( isUserSessionExisted == false ){
				alertSessionWarningWindow();
				location.replace("./logon.do");
			}else{
				if( (isProjectAccess == false) ){
					alertPermissionWarningWindow();
					location.replace("./logon.do");
				}
			}
			
//			if( response.responseText == "session out of time" ){
//				alertSessionWarningWindow();
//				location.replace("./logon.do");
//			}
		},
		failure : function(response) {
			if(response.statusText == 'communication failure'){
				 //do nothing, 防止 only Firefox 3.x~7.x都有的錯誤訊息 . 
				 //彈出視窗按 esc 取消, 都會alert "Server Failure" 的錯誤訊息
			}else{
				alert("Server Failure!");
			}
		}
	});
}

function alertSessionWarningWindow(){
	alert("Session Expired.");
}

function alertPermissionWarningWindow(){
	alert("Permission Denied.");
}

/**
 * 驗證事件是否由ProjectList, Management, Logon所觸發的。
 * @param url
 * @returns {Boolean}
 */
function checkEventURLIsTopPanel( url ){
	if( url == "./viewList.do" ){
		return true;
	}else if( url == "./viewManagement.do" ){
		return true;
	}else if( url == "./logout.do" ){
		return true
	}else{
		return false;
	}
}
