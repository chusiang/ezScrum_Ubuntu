Ext.ns('ezScrum');

/* Drop Task Widget */
ezScrum.DropTaskWidget = Ext.extend(Ext.Window, {
	title:'Drop Task',
	height:140,
	width:450,
	modal:true,
	constrain : true,
	issueId:'-1',
	sprintId:'-1',
	parentId:'-1',
	closeAction:'hide',
	initComponent:function() {
		var config = {
			// Drop Task action url
			url : 'ajaxRemoveSprintTask.do',
			items:{
				xtype:'label',
				html:'Make sure you want to drop the task!<br/>'
			},
			buttons:[
				{text:'Drop',scope:this, handler:this.onDrop},
				{text:'Cancel',scope:this, handler:this.onCancel}
			]
        }
        
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ezScrum.DropTaskWidget.superclass.initComponent.apply(this, arguments);
		
		this.addEvents('DropSuccess', 'DropFailure');
	},
	dropTask:function(issueId, sprintId, parentId){
		this.issueId = issueId;
		this.sprintId = sprintId;
		this.parentId = parentId;
		this.show();
	},
	// Drop action
	onDrop : function(){
		// 顯示 Mask
		var myMask = new Ext.LoadMask(this.getEl(), {msg:"Please wait..."});
		myMask.show();

		// Ajax request
		var obj = this;
		Ext.Ajax.request({
			url:this.url,
			success:function(response){obj.onSuccess(response);},
			failure:function(response){obj.onFailure(response);},
			params:{issueID : this.issueId, sprintID : this.sprintId, parentID : this.parentId}
		});
	},
	// 按下取消按鈕 關閉刪除Retrospective視窗
	onCancel : function(){
		this.hide();
	},
	// Ajax request 成功
	onSuccess : function(response){
		// 隱藏 Mask
		var myMask = new Ext.LoadMask(this.getEl(), {msg:"Please wait..."});
		myMask.hide();

		// check action permission
		ConfirmWidget.loadData(response);
		if (ConfirmWidget.confirmAction()) {
			// 讀取回應資料
			var rs = taskReader.readRecords(response.responseXML);
			
			// 顯示回應資料
			var record = rs.records[0];
			if(record)
			{
				this.fireEvent('DropSuccess', this, response, record.data['Id']);
			}
			else
				this.fireEvent('DropFailure', this, response, this.issueId);
		}

	},
	onFailure : function(response){
		// 隱藏 Mask
		var myMask = new Ext.LoadMask(this.getEl(), {msg:"Please wait..."});
		myMask.hide();
		
		this.fireEvent('DropFailure', this, response, this.issueId);
	}
});