<%@ page language="java" contentType="text/html" pageEncoding="UTF-8"%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Permission Management</title>
<!-- JavaScript -->
<script type="text/javascript" src="javascript/prototype.js"></script>
<script type="text/javascript" src="javascript/RBAC/rbacUtil.js"></script>
<script type="text/javascript">

function showResourceData(){
    $('role_id').innerHTML = "&nbsp;";
	$('permissionData').innerHTML = "&nbsp;";
	new Ajax.Request('getResourceList.do',
 	{
 		//取得resource list並且顯示
		onSuccess: function(transport){
			var resourceList = transport.responseXML.documentElement.getElementsByTagName("project");
			var content = "";
     		var t = document.getElementById('project_id');
      		t.innerHTML ="";
			var opt = "";
			var opt_txt = "";
			for(var i = 0; i< resourceList.length ; i++ ){
      			var resources = resourceList[i];
      			var id = resources.getAttribute('name');
				//add option
				opt = document.createElement("option");
				opt_txt = document.createTextNode(id);
				opt.appendChild(opt_txt);
				opt.setAttribute("value", id);
				t.appendChild(opt);
      		}	
		},
		onFailure: function(){
			window.alert("與Server連線發生問題, 請重新再試.");
		}
  	});	
}

function showRoleData(){
	$('permissionData').innerHTML = "&nbsp;";
	var t = document.getElementById('role_id');
    t.innerHTML ="";
	var opt = "";
	var opt_txt = "";
	//add option
	//product owner
	opt = document.createElement("option");
	opt_txt = document.createTextNode("Product Owner");
	opt.appendChild(opt_txt);
	opt.setAttribute("value", "ProductOwner");
	t.appendChild(opt);
	//scrum master	
	opt = document.createElement("option");
	opt_txt = document.createTextNode("Scrum Master");
	opt.appendChild(opt_txt);
	opt.setAttribute("value", "ScrumMaster");
	t.appendChild(opt);
	//scrum team
	opt = document.createElement("option");
	opt_txt = document.createTextNode("Scrum Team");
	opt.appendChild(opt_txt);
	opt.setAttribute("value", "ScrumTeam");
	t.appendChild(opt);
	//stakeholder
	opt = document.createElement("option");
	opt_txt = document.createTextNode("Stakeholder");
	opt.appendChild(opt_txt);
	opt.setAttribute("value", "Stakeholder");
	t.appendChild(opt);
	//guest
	opt = document.createElement("option");
	opt_txt = document.createTextNode("Guest");
	opt.appendChild(opt_txt);
	opt.setAttribute("value", "Guest");
	t.appendChild(opt);
}

function showPermisssionData(){
	//get the info of project and role
	var cresource = $('project_id').value;
	var crole = $('role_id').value;
	
	new Ajax.Request('getScrumRolePermission.do',
 	{
 		parameters: { resource: cresource,
 		              role: crole},
 		//取得permission list並且顯示
		onSuccess: function(transport){
			var permissionList = transport.responseXML.documentElement.getElementsByTagName("Permission");
			var content = "";
		
			for(var i = 0; i< permissionList.length ; i++ ){
      			var permission = permissionList[i];
      			var id = permission.getAttribute('id');
				var value = permission.getAttribute('value');
				if(value=="true"){
					content += "<input checked='checked' name=\"permissionCheckBox\" id=\"permissionCheckBox\" type=\"checkbox\" value=\"" + id + "\">&nbsp;" + id + "<br>";
				}
				else{
					content += "<input name=\"permissionCheckBox\" id=\"permissionCheckBox\" type=\"checkbox\" value=\"" + id + "\">&nbsp;" + id + "<br>";
				}
      		}	
      		$('permissionData').innerHTML = content;
		},
		onFailure: function(){
			window.alert("與Server連線發生問題, 請重新再試.");
		}
  	});	
}

function updateData(){
	//先判斷是否有選擇資料
	var cresource = $('project_id').value;
	var crole = $('role_id').value;
	if(cresource==""){
		window.alert("Please select a resource.");
		return;
	}else if(crole==""){
		window.alert("Please select a role.");
		return;
	}
	//利用ajax進行update
	var cpermissions = getPermissionString();
	new Ajax.Request('updateScrumRole.do',
 	{
 		parameters: { resource: cresource,
 		              role: crole,
 		              permissions: cpermissions},
 		//取得permission list並且顯示
		onSuccess: function(transport){
			var response = transport.responseText;
			if(response == "true")
				window.alert("Update permission successed.");
			else
				window.alert("與Server連線發生問題, 請重新再試.");
			init();
		},
		onFailure: function(){
			window.alert("與Server連線發生問題, 請重新再試.");
		}
  	});	
}

function init(){
	showResourceData();
}

</script>

</head>
<body onload="init();">

<table width="100%" height="80%" border="0" cellpadding="5"
	cellspacing="0">

	<tr>
		<td valign="top">				
		<table width="95%" border="0" align="center" cellpadding="0"
			cellspacing="0">
			<tr>
				<td class="SummaryTableCaption">Scrum Role Management</td>
			</tr>
			<tr>
				<td class="SummaryTableCaptionBorder"><img height="4"
					src="images/SummaryCaptionBar.gif" width="276"></td>
			</tr>
		</table>
		<br>
		
		<div id='permissionDiv'>
		<table width="95%" align="center" cellpadding="2" cellspacing="0"
			 id="permissionTable" border="0">	
			<tr valign="top">
				<td></td>
				<td></td>
				<td></td>
				<td></td>
				<td align="right">
				<input onclick="updateData();"  type="button" value="Update Permission"/>
				</td>
				<td></td>
			</tr>
			<tr valign="top">
			<tr valign="top">
				<td width="15%">
					<table width="100%">
						<tr>
							<td align="center" class="ReportHead">Project</td>
						</tr>
						<tr>
							<td width="100%">
								<select id="project_id" multiple="multiple" size="10" onchange="showRoleData()" style="width:100%">
								</select>
							</td>
						</tr>
					</table>
				</td>
				<td align="center" valign="middle" width="10%">&raquo;</td>
				<td width="15%">
					<table width="100%">
						<tr>
							<td align="center" class="ReportHead">Role</td>
						</tr>
						<tr>
							<td>
								<select id="role_id" multiple="multiple" size="10" onchange="showPermisssionData()" style="width:100%">
								</select>
							</td>
						</tr>
					</table>
				</td>
				<td align="center" valign="middle" width="10%">&raquo;</td>
				<td width="20%"> 
					<table width="100%">
						<tr>
							<td align="center" class="ReportHead">Permission</td>
						</tr>
						<tr>
							<td align="left" id="permissionData" style="border:1px solid black" height="150px">&nbsp;</td>
						</tr>
					</table>
				</td>
				<td/>
			</tr> 
		</table>		
		</div>
		
		</td>
	</tr>
</table>
</body>
</html>