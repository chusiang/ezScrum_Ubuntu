<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>

<%@ taglib uri="http://struts.apache.org/tags-bean" prefix="bean" %>
<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>
<%@ taglib uri="http://struts.apache.org/tags-tiles" prefix="tiles" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<link rel="stylesheet" type="text/css" href="css/ext/css/ext-all.css" />
<script type="text/javascript" src="javascript/ext-base.js"></script>
<script type="text/javascript" src="javascript/ext-all.js"></script>
<script type="text/javascript" src="javascript/LoadMaskUtil.js"></script>

<%
	String isGuest = (String)request.getSession().getAttribute("isGuest");
	if (isGuest == null || isGuest.equals("false")) {
		// default;
		isGuest = "false";
	}
%>

<script type="text/javascript">
	Ext.onReady(function() {
		// 判斷SideBar點選項目並以粗體顯示
		//var item = "${SideShowItem}";
		var item = document.getElementById("SideShowItem").innerHTML;
		if (item != "")
		{
			document.getElementById(item).style.fontWeight = 'bolder';
			document.getElementById(item).style.background = '#D6C4B8';
		}
	
		/* Scrum Role 可存取權限 */
		var canAccess = ${FunctionAccess[Project.name]==true};
		var canEdit = ${ScrumRoles[Project.name].editProject};
		var isGuest = eval('<%=isGuest%>');
		
		/* Project Configuration 項目 */
		var configPanel = new Ext.Panel({
	    	frame:true,
	    	title: 'Project Configuration',
	    	collapsible:true,
	    	contentEl:'project-config',
	    	titleCollapse: true
	    });
	    /* Project Management 項目 */
	    var managePanel = new Ext.Panel({
	    	frame:true,
	    	title: 'Project Management',
	    	collapsible:true,
	    	contentEl:'project-manage',
	    	titleCollapse: true
	    });
	    
		/* ezTrack項目 */
	    var ezTrackPanel = new Ext.Panel({
	    	frame:true,
	    	title: 'ezTrack',
	    	collapsible:true,
	    	contentEl:'ezTrack-action',
	    	titleCollapse: true
	    });
	    
	    /* Kanban Management 項目 */
	    var kanbanPanel = new Ext.Panel({
	    	frame:true,
	    	title: 'Kanban Management',
	    	collapsible:true,
	    	contentEl:'kanban-manage',
	    	titleCollapse: true
	    });
	    
	    /* Issue Action 項目 */
	    var issuePanel = new Ext.Panel({
	    	frame:true,
	    	title: 'Issue Action',
	    	collapsible:true,
	    	contentEl:'issue-action',
	    	titleCollapse: true
	    });
	    /* Project Management(只能看報表) 項目 */
	    /*
	    var reportPanel = new Ext.Panel({
	    	frame:true,
	    	title: 'Project Management',
	    	collapsible:true,
	    	contentEl:'report-only',
	    	titleCollapse: true
	    });
	    */
    
		/* 側邊攔 Panel */
	    var contentWidget = new Ext.Panel({
	    	split:true,
	    	collapsible: true,
	    	collapseMode: 'mini',
	    	header: false,
	    	border: false,
			height: 800,
			renderTo: 'sidebar',
			items : [configPanel]
		});
		/* 如果 Scrum Role 有權限則 Panel 加入該項目用以顯示 */
		if (canAccess){
			contentWidget.items.add(managePanel);
			
			if ( ! isGuest) {
				contentWidget.items.add(ezTrackPanel);
			}
			//暫時不開放kanban功能
			//contentWidget.items.add(kanbanPanel);
		}
		/*
		else{
			contentWidget.items.add(reportPanel);
		}
		*/
			
		if (canEdit){
			contentWidget.items.add(issuePanel);
		}
		/* 將 HTML 項目 Display 打開顯示(此段用來解決閃爍問題) */
		Ext.DomHelper.applyStyles(Ext.getDom("project-config"), "line-height: 200%; display: block;");
		Ext.DomHelper.applyStyles(Ext.getDom("project-manage"), "line-height: 200%; display: block;");
		Ext.DomHelper.applyStyles(Ext.getDom("ezTrack-action"), "line-height: 200%; display: block;");
		Ext.DomHelper.applyStyles(Ext.getDom("issue-action"), "line-height: 200%; display: block;");
		//Ext.DomHelper.applyStyles(Ext.getDom("report-only"), "line-height: 200%; display: block;");
		//Kanban 使用
		//Ext.DomHelper.applyStyles(Ext.getDom("kanban-manage"), "line-height: 200%; display: block;");

		/* Panel 重新顯示 */
		contentWidget.doLayout();
	});

var msg = "Please wait...";
</script>

<div id="sidebar"></div>


<ul id="project-config" style="line-height: 200%; display: none;" >
	<li>
		<span id="viewProjectSummary"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/viewProjectSummary" styleClass="LeftMenuSelect" onclick="showLoadMask(msg);">Summary</html:link><br><br style="line-height: 5px;"></span>
	</li>
	<li>
		<c:if test="${FunctionAccess[Project.name]==true&&ScrumRoles[Project.name].editProject==true}">
     		<span id="showProjectInfoForm"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link onclick="showLoadMask(msg);" action="/showProjectInfoForm"  styleClass="LeftMenuSelect">Modify Config</html:link><br><br style="line-height: 5px;"></span>
     	</c:if>
	</li>
	<li>
		<c:if test="${sessionScope.isGuest != true}">
			<span id="viewProjectMembers"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/viewProjectMembers" styleClass="LeftMenuSelect" onclick="showLoadMask(msg);">Members</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
</ul>

<ul id="project-manage" style="line-height: 200%; display: none;">
	<li>
		<c:if test="${ScrumRoles[Project.name].accessProductBacklog==true}">
			<span id="showProductBacklog"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/showProductBacklog" styleClass="LeftMenuSelect" >Product Backlog</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
	
	<li>
		<c:if test="${ScrumRoles[Project.name].accessReleasePlan==true}">
			<span id="showReleasePlan"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/showReleasePlan" styleClass="LeftMenuSelect" >Release Plan</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
	
	<li>
		<c:if test="${ScrumRoles[Project.name].accessSprintPlan==true}">
			<span id="showSprintPlan"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/showSprintPlan" styleClass="LeftMenuSelect" >Sprint Plan</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
	
	<li>
		<c:if test="${ScrumRoles[Project.name].accessSprintBacklog==true}">
			<span id="showSprintBacklog"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/showSprintBacklog" styleClass="LeftMenuSelect" >Sprint Backlog</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
	
	<li>
		<c:if test="${ScrumRoles[Project.name].accessTaskBoard==true}">
			<span id="showTaskBoard"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/showTaskBoard" styleClass="LeftMenuSelect" >Task Board</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
	
	<li>
		<c:if test="${ScrumRoles[Project.name].accessRetrospective==true}">
			<span id="showRetrospective"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/showRetrospective" styleClass="LeftMenuSelect" >Retrospective</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
	
	<li>
		<c:if test="${ScrumRoles[Project.name].accessUnplannedItem==true}">
			<span id="showUnplannedItem"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/showUnplannedItem" styleClass="LeftMenuSelect" >Unplanned</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
	
	<li>
		<c:if test="${ScrumRoles[Project.name].readReport==true}">
       		<span id="showScrumReport"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/showScrumReport" styleClass="LeftMenuSelect" >Scrum Report</html:link><br><br style="line-height: 5px;"></span>
       	</c:if>
	</li>
	
	<li>
		<c:if test="false"><!-- 暫時不開放 -->
			<span id="showIssueDetail"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/showIssueDetail" styleClass="LeftMenuSelect" >DOD</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
</ul>

<ul id="issue-action" style="line-height: 200%; display: none;">
	<li>
		<c:if test="${ScrumRoles[Project.name].editProject}">
			<span id="showITSPreferenceForm"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link onclick="showLoadMask(msg);" action="/showITSPreferenceForm" styleClass="LeftMenuSelect" >ITS Config</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
</ul>

<ul id="ezTrack-action" style="line-height: 200%; display: none;">
	<li>
		<c:if test="${ScrumRoles[Project.name].editProject}">
			<span id="showezTrack"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link onclick="showLoadMask(msg);" action="/showezTrack" styleClass="LeftMenuSelect" >View Issues</html:link><br><br style="line-height: 5px;"></span>
			<span id="showManageIssueType"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link onclick="showLoadMask(msg);" action="/showManageIssueType" styleClass="LeftMenuSelect" >Manage Issue Type</html:link><br><br style="line-height: 5px;"></span>
			<span id="showezTrackReport"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link onclick="showLoadMask(msg);" action="/showezTrackReport" styleClass="LeftMenuSelect" >ezTrack Report</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
</ul>

<ul id="kanban-manage" style="line-height: 200%; display: none;">
	<li>
		<c:if test="${ScrumRoles[Project.name].editProject}">
			<span id="showKanbanBacklog"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link onclick="showLoadMask(msg);" action="/showKanbanBacklog" styleClass="LeftMenuSelect" >Kanban Backlog</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
	<li>
		<c:if test="${ScrumRoles[Project.name].editProject}">
			<span id="showWorkItemStatus"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link onclick="showLoadMask(msg);" action="/showWorkItemStatus" styleClass="LeftMenuSelect" >Manage Status</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
	<li>
		<c:if test="${ScrumRoles[Project.name].editProject}">
			<span id="showKanbanBoard"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link onclick="showLoadMask(msg);" action="/showKanbanBoard" styleClass="LeftMenuSelect" >Kanban Board</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
	<li>
		<c:if test="${ScrumRoles[Project.name].editProject}">
			<span id="showKanbanReport"><img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link onclick="showLoadMask(msg);" action="/showKanbanReport" styleClass="LeftMenuSelect" >Kanban Report</html:link><br><br style="line-height: 5px;"></span>
		</c:if>
	</li>
</ul>

<!-- 
<ul id="report-only" style="line-height: 200%; display: none;">
	<li>
		<img src="images/Bullet.gif" align="ABSMIDDLE" >&nbsp;<html:link action="/showScrumReport" styleClass="LeftMenuSelect" >Scrum Report</html:link><br><br style="line-height: 5px;">
	</li>
</ul>
-->