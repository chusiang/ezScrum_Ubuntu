<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=BIG5">
<link rel="stylesheet" type="text/css" href="css/ext/css/ext-all.css" />
<script type="text/javascript" src="javascript/ext-base.js"></script>
<script type="text/javascript" src="javascript/ext-all.js"></script>
<script type="text/javascript" src="javascript/ux/treegrid/TreeGridSorter.js"></script> 
<script type="text/javascript" src="javascript/ux/treegrid/TreeGridColumnResizer.js"></script> 
<script type="text/javascript" src="javascript/ux/treegrid/TreeGridNodeUI.js"></script> 
<script type="text/javascript" src="javascript/ux/treegrid/TreeGridLoader.js"></script> 
<script type="text/javascript" src="javascript/ux/treegrid/TreeGridColumns.js"></script> 
<script type="text/javascript" src="javascript/ux/treegrid/TreeGrid.js"></script> 
<script type="text/javascript" src="javascript/Integration/NewQueryPanel.js"></script>
<script type="text/javascript" src="javascript/Integration/CommitLogPanel.js"></script>
<script type="text/javascript" src="javascript/Integration/LoginForm.js"></script>
<script type="text/javascript" src="javascript/Integration/SelectProjectWidget.js"></script>
<script type="text/javascript" src="javascript/Integration/StoryWidget.js"></script>
<script type="text/javascript" src="javascript/Integration/TaskWidget.js"></script>
<script type="text/javascript" src="javascript/Integration/IntegrationUI.js"></script>
<script type="text/javascript" src="javascript/Integration/Integration.js"></script>
<script type="text/javascript" src="javascript/Integration/LinkSVNWidget.js"></script>
<script type="text/javascript" src="javascript/Integration/SvnConfigPanel.js"></script>
<script type="text/javascript" src="javascript/Integration/BuildResultListPanel.js"></script>
<style type="text/css">
.x-tree-node div.forum-ct{
    background:#eee url(css/ext/images/default/panel/white-top-bottom.gif) repeat-x;
    margin-top:1px;
    border-top:1px solid #ddd;
    border-bottom:1px solid #ccc;
    padding-top:2px;
    padding-bottom:1px;
}
.forum-ct .x-tree-node-icon {
    display:none;
}
.forum-ct a span {
    font-weight:bold;
    color:#222;
}
.forum {
    border:1px solid #fff;
}
.forum .x-tree-ec-icon {
    display:none;
}
.icon-forum {
    background-image:url(css/ext/images/default/forum.gif) !important;
}

.components {
    background-image:url(images/components.png) !important;
}

.component {
    background-image:url(images/component_green.png) !important;
}

.component_add {
    background-image:url(images/component_add.png) !important;
}

.component_view {
    background-image:url(images/component_view.png) !important;
}

.buildSuccess {
    background-image:url(images/green.png) !important;
}

.buildFailed {
    background-image:url(images/error.png) !important;
}

.testFailed {
    background-image:url(images/warning.png) !important;
}

</style>
<title>ezScrum Integration</title>

<script type="text/javascript">
	Ext.onReady(function(){
		
		var projectId = "";
		var issueId = "";
		var url = new String(window.location);
		var index=url.indexOf('?');  
        if(index!=-1){  
            url=url.substring(index+1);
            var urlJSON=Ext.urlDecode(url);
            projectId=urlJSON.projectId;
            issueId=urlJSON.issueId;
        }
        
		new Integration({projectId:projectId, issueId:issueId});
	});
</script>

</head>
<body>
<div id="SideShowItem" style="display:none;">showIssueDetail</div>
</body>
</html>