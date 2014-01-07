<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<html>
<head>
	<title>ezScrum, Code Review System</title>
	<link rel="shortcut icon" href="images/scrum_16.png"/>
</head>

<!-- =================
extjs import start -->

	<script type="text/javascript" src="javascript/ext-base.js"></script>
	<script type="text/javascript" src="javascript/ext-all.js"></script>
	<link rel="stylesheet" type="text/css" href="css/ext/css/ext-all.css" />
	
<!-- extjs import end
================= -->


<!-- ==================
other support start -->

	<script type="text/javascript" src="javascript/AjaxWidget/Message.js"></script>
	<link rel="stylesheet" type="text/css" href="css/Message.css"/>
	
	<script type="text/javascript" src="javascript/CodePress/Ext.ux.codepress.js"></script>
<!-- other support end
================== -->

<script type="text/javascript">
	// namespace setting
	Ext.ns('ezScrum.review');
</script>


<!-- ===============================
ezScrum code review import start -->

	<script type="text/javascript" src="javascript/Integration/LinkSVNWidget.js"></script>
	<script type="text/javascript" src="javascript/ezScrumCodeReview/CodeReviewSourceCodePanel.js"></script>
	<script type="text/javascript" src="javascript/ezScrumCodeReview/CodeReviewFilesTreePanel.js"></script>

	<script type="text/javascript" src="javascript/ezScrumPanel/Footer_Panel.js"></script>
	<script type="text/javascript" src="javascript/ezScrumCodeReview/CodeReviewMainPage.js"></script>
	
<!-- ezScrum code review import end
=============================== -->


<script type="text/javascript">
	Ext.onReady(function() {
		Ext.QuickTips.init();
		
		var ezScrumCodeReviewMainPage = new ezScrum.review.MainUI();
		ezScrumCodeReviewMainPage.render("content");
	});
</script>

<div id="content"></div>
</html>