<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>

<script type="text/javascript" src="javascript/CommonUtility.js"></script>

<link rel="stylesheet" type="text/css" href="javascript/ux/treegrid/treegrid.css" rel="stylesheet" />
 
<script type="text/javascript" src="javascript/ux/treegrid/TreeGridSorter.js"></script>
<script type="text/javascript" src="javascript/ux/treegrid/TreeGridColumnResizer.js"></script>
<script type="text/javascript" src="javascript/ux/treegrid/TreeGridNodeUI.js"></script>
<script type="text/javascript" src="javascript/ux/treegrid/TreeGridLoader.js"></script>
<script type="text/javascript" src="javascript/ux/treegrid/TreeGridColumns.js"></script>
<script type="text/javascript" src="javascript/ux/treegrid/TreeGrid.js"></script>

<script type="text/javascript" src="javascript/AjaxWidget/Common.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/CreateReleaseWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/DeleteReleaseWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/DropSprintFromReleaseWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/DropStoryWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/DropStoryFromReleaseWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/CreateSprintWidget.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/ReleaseGrouping.js"></script>
<script type="text/javascript" src="javascript/AjaxWidget/MoveStoryWidget.js"></script>

<script type="text/javascript" src="javascript/AjaxWidget/Message.js"></script>
<link rel="stylesheet" type="text/css" href="css/Message.css"/>

<div id="Release-Plan"></div>
<% session.setAttribute("currentSideItem","showReleasePlan");%>
<div id="SideShowItem" style="display:none;"><%=session.getAttribute("currentSideItem") %></div>