<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>

<%@ taglib uri="http://struts.apache.org/tags-html" prefix="html" %>
<%@ taglib uri="http://struts.apache.org/tags-logic" prefix="logic" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<script type="text/javascript" src="javascript/CommonUtility.js"></script>

<script type="text/javascript">
function dropFromRelease(issueID){
	if (confirm("Are you sure to delete this story?")) {
		document.location.href = "<html:rewrite action="/removeReleaseBacklog?issueID=" />" + issueID + "&releaseID=" + ${releaseID};
	}
}

function back() {
	document.location.href="<html:rewrite action="/showReleasePlan" />";
}
</script>
<div id="SideShowItem" style="display:none;"><%=session.getAttribute("currentSideItem") %></div>
<body>

<form name="releasePlanForm" method="post">
<table width="95%" border="0" cellpadding="0"
	cellspacing="0" align="center">
	<tr>
		<td><img src="images/Design1_r5_c2.gif" width="15" height="15" /></td>
		<td background="images/Design1_r5_c3.gif"><img
			src="images/spacer.gif" width="100%" height="15" /></td>
		<td>
		<div align="right"><img src="images/Design1_r5_c6.gif"
			width="15" height="15" /></div>
		</td>
	</tr>
	<tr valign="top">
		<td background="images/Design1_r6_c2.gif"><img
			src="images/spacer.gif" width="15" height="100%" /></td>
		<td class="innerTable" height="100%"><br />
			<div>
				<table width="95%" align="center" cellpadding="2" cellspacing="0"
					class="TaskBoardReportBorder">
					<tr>
						<td width="30%" class="TBReportSuccessHead">Release Plan ID</td>
						<td width="70%" class="TBReportHead">${ReleaseBoard.planID}</td>
					</tr>
					<tr>
						<td width="30%" class="TBReportSuccessHead">Release Plan Name</td>
						<td width="70%" class="TBReportHead">${ReleaseBoard.planName}</td>
					</tr>
					<tr>
						<td width="30%" class="TBReportSuccessHead">Current Undone / Total Story Count
						</td>
						<td width="70%" class="StoryReportHead">[Story] ${ReleaseBoard.undoneStoryCount} / ${ReleaseBoard.storyCount}
						</td>
					</tr>
					<tr align="center">
						<td colspan="3" class="TaskBoardReportBody"><br />
						<img src="${ReleaseBoard.storyChartLink}" class="LinkBorder" />
						</td>
					</tr>
				</table>
			</div>
		</td>
		<td background="images/Design1_r6_c6.gif" />
	</tr>
	<tr>
		<td><img src="images/Design1_r7_c2.gif" width="15" height="15" /></td>
		<td width="100%" background="images/Design1_r7_c3.gif" />
		<td><img src="images/Design1_r7_c6.gif" width="15" height="15" /></td>
	</tr>
</table>

<table width="95%" border="0" cellpadding="5" cellspacing="0">
<tr>
	<td valign="top">
	<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0">
		<tr>
			<td class="SummaryTableCaption">Release Backlog</td>
		</tr>
		<tr>
			<td class="SummaryTableCaptionBorder"><img height="4" src="images/SummaryCaptionBar.gif" width="276"></td>
		</tr>
		<tr>
			<td class="SummaryDataText">Release ${releaseID} - ${releaseName}</td>
		</tr>
	</table>
	<br/>
	<div class="ReportElementTitle">
	<table width="95%" align="center" cellpadding="2" cellspacing="0" class="ReportBorder">
		<tr>
			<td class="ReportHead" width="5%" align="center">Story ID</td>
			<td class="ReportHead" width="15%" align="center">Name</td>
			<td class="ReportHead" width="5%" align="center">Imp.</td>
			<td class="ReportHead" width="5%" align="center">Sprint ID</td>
			<td class="ReportHead" width="5%" align="center">Est.</td>
			<td class="ReportHead" width="10%" align="center">Status</td>
			<td class="ReportHead" width="25%" align="center">How To Demo</td>
			<td class="ReportHead" width="25%" align="center">Notes</td>		
			<td class="ReportHead" width="5%" align="center">Action</td>
		</tr>
		<logic:notEmpty name="Stories">
			<logic:iterate id="element" name="Stories" indexId="index">
			<tbody>
				<tr onmouseover="OMOver(this)" onmouseout="OMOut(this)">
					<td class="ReportBody" align="center"><a href="${element.issueLink }" target="_blank">${element.issueID }</a>&nbsp;</td>
					<td class="ReportBody" align="left">${element.summary}&nbsp;</td>
					<td class="ReportBody" align="center">${element.importance}&nbsp;</td>
					<c:if test="${element.sprintID > 0}">
						<td class="ReportBody" align="center"><a href="./showSprintBacklog.do?sprintID=${element.sprintID}">${element.sprintID}</a>&nbsp;</td>
					</c:if>
					<c:if test="${element.sprintID <= 0}">
						<td class="ReportBody" align="center">None&nbsp;</td>
					</c:if>
					<td class="ReportBody" align="center">${element.estimated}&nbsp;</td>
					<td class="ReportBody" align="center">${element.status}&nbsp;</td>
					<td class="ReportBody" align="left">${element.howToDemo}&nbsp;</td>
					<td class="ReportBody" align="left">${element.notes}&nbsp;</td>
					<td class="ReportBody" align="center"><img src="images/drop2.png" onclick="dropFromRelease(${element.issueID})" /></td>
				</tr>
			</tbody>
			</logic:iterate>
		</logic:notEmpty>			
	</table>
	</div>
	</td>
</tr>
<tr>
	<td align="center"><input type="button" onclick="back()" value="Back"></td>
</tr>
</table>
</form>
</body>