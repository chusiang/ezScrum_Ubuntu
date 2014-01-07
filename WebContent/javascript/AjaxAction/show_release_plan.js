function showMes(element, r_id) {
	if (TableDisplay(element,r_id)) {
		AjaxRequestShowSprint("./AjaxShowSprintfromRelease.do", showSprint, r_id);
	}
}

function AjaxRequestShowSprint(url, successFunc, ReleaseID) {	
		Ext.Ajax.request(
	{
		url : url,
		success : successFunc,
		params : {Rid:ReleaseID} 
	});
}

// remove Children
function initial(R_id) {
	var TbodyTag = document.getElementById("sprintList" + R_id);
	while (TbodyTag.hasChildNodes()) {
		TbodyTag.removeChild(TbodyTag.childNodes[0]);		
	}
}

function TableDisplay(element, R_id) {
	var Table = document.getElementById("sprintInfo" + R_id);
	var Img = getImgElm(element);
	
	if (Table.style.display=="none"){
		initial(R_id);
		Table.style.display="";
		Img.src="images/open.gif";
		return true;
	} else{
		Table.style.display="none";
		Img.src="images/close.gif"; 
	}
}

function getImgElm(element) { 
	var returnElm = element.childNodes[0]; 
	while (returnElm.nodeName != "IMG") {
		returnElm = returnElm.nextSibling; 
	}
	return returnElm; 
}

function showSprint(response) {
	// get respoense information
	var root = response.responseXML;
	var Rid = root.documentElement.getAttribute("id");
	var sprints = root.getElementsByTagName("sprint");
	// get sprintList tag 
	var TbodyTag = Ext.get("sprintList" + Rid);
	
	// sprint information display template 
	var sprintTemplate ="";
	if(access=="true")
		sprintTemplate = new Ext.Template('<tr onmouseout="OMOut(this)" onmouseover="OMOver(this)"><td class="ReportBody" align="center" width="5%"><span onmousedown="showStoryMes(this,{Sid})"><img src="images/close.gif"></span><a href="./showSprintBacklog.do?sprintID={Sid}">{Sid}</a></td><td class="ReportBody" align="left" width="40%">{goal}</td><td class="ReportBody" align="center" width="15%">{startdate}</td><td class="ReportBody" align="center" width="5%">{interval}</td><td class="ReportBody" align="center" width="5%">{mem}</td><td class="ReportBody" align="center" width="5%">{manday}</td><td class="ReportBody" align="center" width="5%">{demodate}</td><td class="ReportBody" align="center" width="10%"><a title="Delete Sprint Plan" href="javascript:deleteSprintPlan('+Rid+', {Sid})"><img class="LinkBorder" src="images/drop2.png"></a></td></tr><tr style="display:none" id="storyInfo{Sid}"><td class="ReportBodyWithoutRight"></td><td class="ReportBody" colspan="10"><table class="ReportBorder" align="left" cellpadding="2" cellspacing="0" width="80%"><tbody><tr><td class="BlueReportHead" align="center" width="5%">ID</td><td class="BlueReportHead" align="center" width="20%">Story Name</td><td class="BlueReportHead" align="center" width="6%">Importance</td><td class="BlueReportHead" align="center" width="6%">Estimation</td></tr></tbody><tbody id="storyList{Sid}"></tbody></tr>');
	else
		sprintTemplate = new Ext.Template('<tr onmouseout="OMOut(this)" onmouseover="OMOver(this)"><td class="ReportBody" align="center" width="5%"><span onmousedown="showStoryMes(this,{Sid})"><img src="images/close.gif"></span><a href="./showSprintBacklog.do?sprintID={Sid}">{Sid}</a></td><td class="ReportBody" align="left" width="40%">{goal}</td><td class="ReportBody" align="center" width="15%">{startdate}</td><td class="ReportBody" align="center" width="5%">{interval}</td><td class="ReportBody" align="center" width="5%">{mem}</td><td class="ReportBody" align="center" width="5%">{manday}</td><td class="ReportBody" align="center" width="5%">{demodate}</td><td class="ReportBody" align="center" width="10%">&nbsp;</td></tr><tr style="display:none" id="storyInfo{Sid}"><td class="ReportBodyWithoutRight"></td><td class="ReportBody" colspan="10"><table class="ReportBorder" align="left" cellpadding="2" cellspacing="0" width="80%"><tbody><tr><td class="BlueReportHead" align="center" width="5%">ID</td><td class="BlueReportHead" align="center" width="20%">Story Name</td><td class="BlueReportHead" align="center" width="6%">Importance</td><td class="BlueReportHead" align="center" width="6%">Estimation</td></tr></tbody><tbody id="storyList{Sid}"></tbody></tr>');
	// show information
	for (var i=0 ; i<sprints.length ; i++) {
		// get text
		var sp = sprints[i];
		var Sid = sp.getAttribute('id');
		var goal = sp.getElementsByTagName("goal")[0].firstChild.nodeValue;
		var startdate = sp.getElementsByTagName("startdate")[0].firstChild.nodeValue;
		var interval = sp.getElementsByTagName("interval")[0].firstChild.nodeValue;
		var demodate = sp.getElementsByTagName("demodate")[0].firstChild.nodeValue;
		var mem = sp.getElementsByTagName("members")[0].firstChild.nodeValue;
		var manday = sp.getElementsByTagName("avaible")[0].firstChild.nodeValue;
		var backlogURL = sp.getElementsByTagName("backlogURL")[0].firstChild.nodeValue;
		
		// append sprint information by applying template
		sprintTemplate.append("sprintList" + Rid, {Sid:Sid, goal:goal, startdate:startdate, interval:interval, mem:mem, manday:manday, demodate:demodate});
		//Ext.DomHelper.append("sprintList" + Rid, {tag:'a', href:backlogURL, html:'dd'});
	}
}



// Sprint Show Story
function showStoryMes(element, s_id) {
	if (StoryTableDisplay(element,s_id)) {
		AjaxRequestShowStory("./AjaxShowStoryfromSprint.do?Sid=" + s_id, showStory);
	}
}

function AjaxRequestShowStory(url, successFunc) {
	Ext.Ajax.on('beforerequest', showMask);
	Ext.Ajax.on('requestcomplete', hideMask);
	Ext.Ajax.on('requestexception', hideMask);
	Ext.Ajax.request(
	{
		url : url,
		success: successFunc
	});
}

function showMask()
{
	var mask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
	mask.show();
}

function hideMask()
{
	var mask = new Ext.LoadMask(Ext.getBody());
	mask.hide();
}

function initialStory(S_id) {
	var TbodyTag = document.getElementById("storyList" + S_id);
	while (TbodyTag.hasChildNodes()) {
		TbodyTag.removeChild(TbodyTag.childNodes[0]);		
	}
}


function StoryTableDisplay(element, S_id) {
	var Table = document.getElementById("storyInfo" + S_id);
	var Img = getImgElm(element);
	
	if (Table.style.display=="none"){
		initialStory(S_id);
		Img.src="images/open.gif";
		return true;
	} else{
		Table.style.display="none";
		Img.src="images/close.gif"; 
	}
}

function showStory(response) {
	// get response information
	var root = response.responseXML;
	var S_id = root.documentElement.getAttribute("id");
	var stories = root.getElementsByTagName("Story");
	
	// get storyList tag
	var TbodyTag = Ext.get("storyList" + S_id);
	
	// show table after response 
	var Table = Ext.get("storyInfo" + S_id);
	Table.setStyle("display", "");
	
	
	
	// story information display template
	var storyTemplate = new Ext.Template('<tr onmouseout="OMOut(this)" onmouseover="OMOver(this)"><td class="ReportBody" align="center" width="5%"><a href="{ITSurl}">{id}</a></td><td class="ReportBody" align="left" width="20%">{name}</td><td class="ReportBody" align="center" width="6%">{im}</td><td class="ReportBody" align="center" width="6%">{es}</td></tr>');
	
	// show information
	for (var i=0 ; i<stories.length ; i++) {
		// get text
		var story = stories[i];
		var id = story.getElementsByTagName("Id")[0].firstChild.nodeValue;
		var name = story.getElementsByTagName("Name")[0].firstChild.nodeValue;
		var im = story.getElementsByTagName("Importance")[0].firstChild.nodeValue;
		var es = story.getElementsByTagName("Estimation")[0].firstChild.nodeValue;
		var ITSurl = story.getElementsByTagName("Link")[0].firstChild.nodeValue;
		
	
		// append story information by applying template
		storyTemplate.append("storyList" + S_id, {id:id, name:name, im:im, es:es, ITSurl:ITSurl});		
	}
}
