Ext.ns('ezScrum');

/************************************************************
 *
 *   儲存資料的結構
 *
 *************************************************************/
var canMoveSprint;
var canMoveRelease;
var currentReleaseId;
var currentSprintId;
var currentIssueId;
var notYetEndReleaseStore = new Ext.data.JsonStore({
    url: 'notYetEndReleaseForMoveStory.do',
    fields: ['ID'],//專給sprint的combobox用
    autoDestroy: true
});

notYetEndReleaseStore.on('load',function(store,records,options)
{
		canMoveRelease = new Array();
        notYetEndReleaseStore.each(function (record) {
            releaseID = record.get('ID');
            if (releaseID != currentReleaseId && releaseID !="") {
            	canMoveRelease.push([releaseID ^ 0]);
			}
        });
}
);

var notYetStartSprintStore = new Ext.data.JsonStore({
    url: 'notYetEndSprintForMoveStory.do',
    fields: ['ID'],//專給sprint的combobox用
    autoDestroy: true
});

notYetStartSprintStore.on('load',function(store,records,options){
	canMoveSprint = new Array();
	notYetStartSprintStore.each(function (record) {
           	sprintID = record.get('ID');//加入每個符合規則的sprint
            if (sprintID !=currentSprintId && sprintID != "" ) {//因為組字串演算法的關係JSon結構最後會有一個{}
            	canMoveSprint.push([sprintID ^ 0 ]);
			}

        });
	 //預設是顯示Sprint
     moveSprintStore.loadData(canMoveSprint);
});

//只是單純用來顯示要移動到Release或Sprint的資料
var ROSstore = new Ext.data.SimpleStore({
    fields: ['Id', 'Text'],
    data: [
        ["release", "Release"],
        ["sprint", "Sprint"]
    ]
});


var moveSprintStore = new Ext.data.ArrayStore({
    fields: ['Id', 'Goal']
});

/************************************************************
 *
 *   ComboBox宣告區域
 *
 *************************************************************/
//讓使用者選擇移動至Release或者是Sprint
var releaseORsprintComboBox = new Ext.form.ComboBox({
    store: ROSstore,
    typeAhead: true,
    valueField: 'Id',
    displayField: 'Text',
    mode: 'local',
    value: 'sprint',
    triggerAction: 'all',
    selectOnFocus: true,
    emptyText: 'Select Release or Sprint...',
    editable: false,
    anchor: '100% 50%'
});

//註冊Sprint或Release的選擇事件
releaseORsprintComboBox.on('select', function (comboBox) {
    var selectedValue = comboBox.getValue();
    if (selectedValue == 'release') {
        moveSprintStore.loadData(canMoveRelease);
    }
    else {
        moveSprintStore.loadData(canMoveSprint);
    }
    SprintComboBox.reset();
});
//顯示可以移動的Sprint列表
var SprintComboBox = new Ext.form.ComboBox({
    tpl: '<tpl for="."><div ext:qtip="{Goal}" class="x-combo-list-item">{Id}</div></tpl>',
    displayField: 'Id',
    typeAhead: true,
    store: moveSprintStore,
    mode: 'local',
    allowBlank : false,
    triggerAction: 'all',
    emptyText: 'Select Release or Sprint...',
    selectOnFocus: true,
    editable: false,
    anchor: '100% 50%'
});
/************************************************************
 *
 *   顯示Dialog的Widget
 *
 *************************************************************/
/* Move Sprint Widget */
ezScrum.MoveStoreWidget = Ext.extend(Ext.Window, {
    title: 'Move Story',
    layout: 'anchor',
    modal: true,
    constrain  : true,
    closeAction: 'hide',
    width         : 300,
    initComponent: function () {
    	var config = {
			items : [{
				xtype : 'MoveStoreDetail'
			}]
		}
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		ezScrum.MoveStoreWidget.superclass.initComponent.apply(this, arguments);
		var formItem = this.items.get(0);//Window中formPanel的物件
		var winObj = this;//Window本身
		// 註冊處理FormPanel會丟出來的事件
		// Success事件
		formItem.on('MoveSuccess', function( response ) {
			winObj.fireEvent('MoveSuccess', response);
		});
		// SubmitFailure事件
		formItem.on('MoveFailure', function( response ) {
			winObj.fireEvent('MoveFailure', response );
		});
		this.addEvents('MoveSuccess', 'MoveFailure');
},
    /*-----------------------------------------------------------
     *  外部Function要呼叫Move Sprint這個動作的話就是從這邊開始的啦
     *-------------------------------------------------------------*/
    moveStory: function (id, sprintID, releaseID) {
        currentIssueId = id;
        currentSprintId = sprintID;
        currentReleaseId = releaseID;
        notYetEndReleaseStore.load();
        notYetStartSprintStore.load();
        releaseORsprintComboBox.setValue('sprint');
        SprintComboBox.reset();
        this.show();
    }    
});

ezScrum.MoveStoreDetail = Ext.extend(Ext.FormPanel, {
	monitorValid:true,
	layout: 'anchor',
	initComponent: function () {
        var config = {
            // Move Sprint action url
            url: 'moveStorySprint.do',
            items: [releaseORsprintComboBox, SprintComboBox],
            buttons: [{
                text: 'Move',
                formBind:true,
                scope: this,
                handler: this.onMove
            },
            {
                text: 'Cancel',
                scope: this,
                handler: this.onCancel
            }]
        }

        Ext.apply(this, Ext.apply(this.initialConfig, config));
        ezScrum.MoveStoreDetail.superclass.initComponent.apply(this, arguments);
        this.addEvents('MoveSuccess', 'MoveFailure');
    },
    onMove: function () {
        // 顯示 Mask
        var myMask = new Ext.LoadMask(this.getEl(), {
            msg: "Please wait..."
        });
        myMask.show();
        // Ajax request
        var obj = this;
        Ext.Ajax.request({
            url: this.url,
            success: function (response) {
                obj.onSuccess( currentIssueId );
            },
            failure: function (response) {
                obj.onFailure( currentIssueId );
            },
            params: {
                issueID: currentIssueId,
                moveID: SprintComboBox.getValue(),
                type: releaseORsprintComboBox.getValue()
            }
        });
    },
    // 按下取消按鈕 
    onCancel: function ( response ) {
        this.fireEvent('MoveFailure', response);
    },
    // Ajax request 成功
    onSuccess: function (response) {
        // 隱藏 Mask
        var myMask = new Ext.LoadMask(this.getEl(), {
            msg: "Please wait..."
        });
        myMask.hide();
        SprintComboBox.reset();
        this.fireEvent('MoveSuccess', response);
    },
    onFailure: function (response) {
        // 隱藏 Mask
        var myMask = new Ext.LoadMask(this.getEl(), {
            msg: "Please wait..."
        });
        myMask.hide();
        SprintComboBox.reset();
        this.fireEvent('MoveFailure', response);
    }
});
Ext.reg('MoveStoreDetail', ezScrum.MoveStoreDetail);