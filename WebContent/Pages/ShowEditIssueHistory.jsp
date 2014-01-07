<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>

<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html" %>

<link rel="stylesheet" type="text/css" media="all" href="javascript/Calendar/calendar-win2k-cold-1.css" title="win2k-cold-1" />
<script type="text/javascript" src="javascript/Calendar/calendar.js"></script>
<script type="text/javascript" src="javascript/Calendar/calendar-en.js"></script>
<script type="text/javascript" src="javascript/Calendar/calendar-setup.js"></script>

<script type="text/javascript" src="javascript/CommonUtility.js"></script>
<script>
<!--
function trOnLoad(){
	var elements = document.getElementsByName("historyRow");
	for (var i=0; i<elements.length; i++){
		var desc = elements[i].getElementsByTagName("td")[0].innerHTML;
		if (desc.match("Importance"))
			elements[i].style.backgroundColor='#A1EEEF';
		else if (desc.match("Estimation"))
			elements[i].style.backgroundColor='#EFC9A1';
		else if (desc.match("Sprint"))
			elements[i].style.backgroundColor='#FFFF66';
		else if (desc.match("Status"))
			elements[i].style.backgroundColor='#A1EFA2';
		else if (desc.match("Add"))
			elements[i].style.backgroundColor='#A2A1EF';
		else if (desc.match("Drop"))
			elements[i].style.backgroundColor='#EFA2A1';
		else if (desc.match("Append"))
			elements[i].style.backgroundColor='#A2A1EF';
		else if (desc.match("Remove"))
			elements[i].style.backgroundColor='#EFA2A1';
	}
}
function edit(){
	if ("${backlogType}"=="product"){
		document.story.action = "./editIssueHistory.do?issueID=${Issue.issueID }&type=${backlogType}&historyID=${History.historyID}";
		document.story.submit();
	} else if ("${backlogType}"=="sprint"||"${backlogType}"=="taskBoard"){
		document.story.action = "./editIssueHistory.do?issueID=${Issue.issueID }&sprintID=${sprintID}&type=${backlogType}&historyID=${History.historyID}";
		document.story.submit();	
	} 
}
//-->
</script>
<body onload="trOnLoad()">
<form name="story" method="post"><html:errors />
<table width="45%" border="0" align="center" cellpadding="1"
	cellspacing="1" class="ReportFrame">
	<tr>
		<td colspan="2" class="subtitle">Edit History</td>
	</tr>
	<tr>
		<td width="25%" align="right" class="FieldHead">ID</td>
		<td width="75%">${History.historyID}</td>
	</tr>
	<tr>
		<td width="25%" align="right" class="FieldHead">Description</td>
		<td>${History.description }</td>
	</tr>
	<tr>
		<td width="25%" align="right" class="FieldHead">Modified Date</td>
		<td>
			<input type="text" id="modifyDate" name="ModifyDate" class="FixedInputText" value="<fmt:formatDate pattern="yyyy/MM/dd-HH:mm:ss" value="${History.modifyDateDate }" />" class="InputText" onFocus="select()">
			<img src="images/calendar.png" id="showCalendar" class="LinkBorder" title="Calendar" />
		</td>
	</tr>
	<tr align="center">
		<td colspan="2">
		<input type="button" value="Submit" onclick="edit()">
		<input type="button" value="Cancel" onclick="history.back()"></td>
	</tr>
</table>


<br />
<table width="65%" border="0" align="center" cellpadding="1"
	cellspacing="1" class="ReportBorder">
	<tr>	
		<td class="ReportHead" width="60%" align="center">Description</td>
		<td class="ReportHead" width="40%" align="center">Modified Date</td>
	</tr>
	<c:forEach var="element" items="${Issue.issueHistories }">
		<c:if test="${ element.description!=''}">
		<tr name="historyRow">
			<td class="ReportBody">${element.description }</td>
			<td class="ReportBody" align="center">
				<fmt:formatDate pattern="yyyy/MM/dd-HH:mm:ss" value="${element.modifyDateDate }" />
			</td>
		</tr>
		</c:if>
	</c:forEach>
</table>
</form>
</body>
<script type="text/javascript">
<!--
//the script must be under inputField and button
    Calendar.setup({
        inputField     :    "modifyDate",      // id of the input field
        ifFormat       :    "%Y/%m/%d-%H:%M:%S",       // format of the input field
        showsTime      :    true,            // will display a time selector
        button         :    "showCalendar",   // trigger for the calendar (button ID)
        singleClick    :    true,           // double-click mode
        step           :    1                // show all years in drop-down boxes (instead of every other year as default)
    });
-->
</script>