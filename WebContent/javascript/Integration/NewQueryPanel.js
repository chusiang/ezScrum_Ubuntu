QueryTreePanel = Ext.extend(Ext.tree.TreePanel, {
    initComponent: function() {
		var config = {
			id:'QeuryTreePanel',
			autoScroll:true,
	    	root: {
	            nodeType: 'node',
	            text: 'Query',
	            draggable: false,
	            filterType:'AndFilter'
	        },
	        //rootVisible: false,
	        tbar:[
	            {
	            	ref:'../AddAndFilterBtn',
	            	text:'Add And Filter'
	            },
	            {
	            	ref:'../AddOrFilterBtn',
	            	text:'Add Or Filter'
	            },
	            {
	            	ref:'../AddFilterBtn',
	            	text:'Add Filter'
	            },
	            {
	            	ref:'../DeleteFilterBtn',
	            	text:'Delete Filter',
	            	disabled:true
	            },
	            {
	            	ref:'../TestFilterBtn',
	            	text:'Test Filter'
	            },
	            {
	            	ref:'../SaveFilterBtn',
	            	text:'Save Filter'
	            }
	        ]
	    }
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
        QueryTreePanel.superclass.initComponent.call(this);

        this.AddAndFilterBtn.on('click',function(btn, evt){this.addAndFilter();}, this);
        this.AddOrFilterBtn.on('click',function(btn, evt){this.addOrFilter();}, this);
        this.AddFilterBtn.on('click',function(btn, evt){this.addBasicFilter();}, this);
        this.DeleteFilterBtn.on('click',function(btn, evt){this.deleteFilter();}, this);
        this.TestFilterBtn.on('click',function(btn, evt){this.testFilter();}, this);
        this.SaveFilterBtn.on('click',function(btn, evt){this.saveFilter();}, this);
        this.getSelectionModel().on('selectionchange',this.selectionChange, this);
        this.selectedNode = this.getRootNode();
        
        this.filterEditor = new QueryEditWidget();
        
        this.addEvents('CreateSuccess');
    },
    saveFilter:function(){
    	var widget = new QueryNameWidget();
    	widget.showWidget(this.requestSaveFilter, this);
    },
    
    requestSaveFilter:function(name){
    	
    	var profile = Ext.encode(this.createQuery(this.getRootNode()));
    	Ext.Ajax.request({
    		url:'insertData.do',
    		params:{name:name, profile:profile, isuser:false},
    		success:function(){this.fireEvent('CreateSuccess');},
    		failure:function(){alert('failure')},
    		method:'POST',
    		scope:this
    	});
    },
    
    addAndFilter:function(){
    	var filterNode = new Ext.tree.TreeNode({
    		text:'And Filter',
    		filterType:'AndFilter',
    		iconCls:'components'
    	});
    	this.addFilterNode(filterNode);
    },
    addOrFilter:function(){
    	var filterNode = new Ext.tree.TreeNode({
    		text:'Or Filter',
    		filterType:'OrFilter',
    		iconCls:'components'
    	});
    	this.addFilterNode(filterNode);
    },
    addBasicFilter:function(){
    	var filterNode = new Ext.tree.TreeNode({
    		text:'Filter',
    		filterType:'Filter',
    		iconCls:'component',
    		listeners:{dblclick:function(node, evt){this.filterEditor.edit(node);}, scope:this}
    	});
    	
    	this.addFilterNode(filterNode);
    	this.filterEditor.edit(filterNode);
    },
    addFilterNode:function(node)
    {
    	this.selectedNode.appendChild(node);
    	if(this.selectedNode.isExpandable() && !this.selectedNode.isExpanded())
    		this.selectedNode.expand();
    	node.select();
    },
    deleteFilter:function(){
    	this.selectedNode.remove(true);
    },
    selectionChange:function(model, node){
    	if(!node)
    	{
    		node = this.getRootNode();
    	}
    	var disabled = !(node == this.getRootNode() || node.attributes['filterType'] == 'OrFilter' || node.attributes['filterType'] == 'AndFilter');
    	this.AddAndFilterBtn.setDisabled(disabled);
		this.AddOrFilterBtn.setDisabled(disabled);
		this.AddFilterBtn.setDisabled(disabled);
		this.DeleteFilterBtn.setDisabled(node == this.getRootNode());
		this.selectedNode = node;
    },
    testFilter:function()
    {
    	var root = this.getRootNode();
    	root.attributes['filterType'] = 'AndFilter';
    	var obj = this.createQuery(root);
    	alert(Ext.encode(obj));
    },
    createQuery:function(node){
    	if(node.attributes['filterType'] == 'AndFilter' || node.attributes['filterType'] == 'OrFilter')
    	{
    		var obj = {type:node.attributes['filterType'], childs:[]};
    		var childs = node.childNodes;
    		for(var i = 0;i < childs.length; i++)
    		{
    			obj.childs.push(this.createQuery(childs[i]));
    		}
    		return obj;
    	}
    	else
    	{
    		var obj = {};
    		if(node.filterType == 'Integer')
    		{
    			obj.type = 'IntegerFilter';
    			obj.condition = node.filterCondition.value;
    		}
    		else if(node.filterType == 'String')
    		{
    			if(node.filterCondition.value == '=')
    			{
    				obj.type = 'StringFilter';
    			}
    			else if(node.filterCondition.value == 'in')
    			{
    				obj.type = 'ListFilter';
    			}
    		}
    		else if(node.filterType == 'Double')
    		{
    			obj.type = 'DoubleFilter';
    			obj.condition = node.filterCondition.value;
    		}
    		obj.field = node.filterField.value;
			obj.value = node.filterValue;
    		return obj;
    		
    	}		
    }
});

Ext.reg('QueryTreePanel', QueryTreePanel);

QueryEditForm = Ext.extend(Ext.form.FormPanel, {
	bodyStyle: 'padding:15px',
	defaultType: 'textfield',
	labelAlign : 'right',
	labelWidth : 100,
	defaults: {
        width: 200,
        msgTarget: 'side'
    },
    monitorValid:true,
    initComponent: function() {
    	
    	this.fieldDefine = [
    	    ['Type', 'Type', 'String'],
    	    ['Sprint', 'Sprint', 'Integer'],
    	    ['Name', 'Name', 'String'], 
    	    ['Status', 'Status', 'String'],
    	    ['Importance', 'Importance', 'Integer'],
    	    ['Owner', 'Owner', 'String'],
    	    ['Estimation', 'Estimation', 'Double']
    	];
    	
    	this.typeDefine = [
    	    {
    	    	type:'String',
    	    	condition:[['=', '='], ['in', 'In']]
    	    },
    	    {
    	    	type:'Integer',
    	    	condition:[['>', '>'], ['<', '<'], ['=', '='], ['<=', '<='], ['>=', '>=']]
    	    },
    	    {
    	    	type:'Double',
    	    	condition:[['>', '>'], ['<', '<'], ['=', '='], ['<=', '<='], ['>=', '>=']]
    	    }
    	];
    	
    	this.filterField = new Ext.form.ComboBox({
    	    typeAhead: true,
    	    triggerAction: 'all',
    	    lazyRender:true,
    	    mode: 'local',
    	    store: new Ext.data.ArrayStore({
    	        fields: [
    	            'fieldName',
    	            'displayText',
    	            'fieldType'
    	        ],
    	        data:this.fieldDefine
    	    }),
    	    valueField: 'fieldName',
    	    displayField: 'displayText',
    	    name:'filterField',
    	    editable:false,
    	    fieldLabel:'Filter Field',
    	    listeners:{select:function(combo, record, index){combo.selectedItem = record; if(combo.oldValue != combo.getValue()){this.changeField(record)};}, beforeselect:function(combo, record, index){combo.oldValue = combo.getValue();}, scope:this}
    	});

    	this.filterCondition = new Ext.form.ComboBox({
    	    typeAhead: true,
    	    triggerAction: 'all',
    	    lazyRender:true,
    	    mode: 'local',
    	    store: new Ext.data.ArrayStore({
    	        fields: [
    	            'filterCondition',
    	            'displayText'
    	        ]
    	    }),
    	    valueField: 'filterCondition',
    	    displayField: 'displayText',
    	    name:'filterCondition',
    	    fieldLabel:'Condition',
    	    editable:false,
    	    listeners:{select:function(combo, record, index){combo.selectedItem = record;}}
    	});
    	
    	this.filterValue = new Ext.form.TextField({
    		fieldLabel:'Value',
    		name:'filterValue',
    		scope:this,
    		validator:function(value){return this.initialConfig['scope'].validator(value);}
    	});
    	
        this.items = [this.filterField, this.filterCondition, this.filterValue];
        
        this.buttons = [
		    {
		    	formBind:true,
		    	text: 'Save',
		    	scope:this,
		    	handler:this.setNodeValue
		    }
		];
        
        //Ext.apply(this, Ext.apply(this.initialConfig, config));
        QueryEditForm.superclass.initComponent.call(this);
    },
    validator:function(value)
    {

    	var integerReg = /^\d+$/;
    	var doubleReg = /^((\d+(\.\d*)?)|((\d*\.)?\d+))$/;
    	var stringReg = /\S+/;
    	
    	if(this.validType == 'Integer')
    	{
    		if(integerReg.test(value))
    			return true;
    		return 'Error';
    	}
    	if(this.validType == 'Double')
    	{
    		if(doubleReg.test(value))
    			return true;
    		return 'Error';
    	}
    	if(this.validType == 'String')
    	{
    		if(stringReg.test(value))
    			return true;
    		return 'Error';
    	}
    	return true;
    },
    edit:function(treeNode)
    {
    	
    	this.editNode = treeNode;
    	this.filterCondition.getStore().loadData(this.typeDefine[0].condition);
    	this.editNode.filterField ? this.selectByValue(this.filterField, this.editNode.filterField.value) : this.selectByIndex(this.filterField, 0);
    	this.editNode.filterCondition ? this.selectByValue(this.filterCondition, this.editNode.filterCondition.value) : this.selectByIndex(this.filterCondition, 0);
    	this.editNode.filterValue ?  this.filterValue.setValue(this.editNode.filterValue) : this.filterValue.reset() ;
    },
    changeField:function(record)
    {
    	for(var i = 0; i < this.typeDefine.length; i++)
    	{
    		var type = this.typeDefine[i];
    		if(type.type == record.data['fieldType'])
    		{
    			this.validType = record.data['fieldType'];
    			this.filterCondition.getStore().loadData(type.condition);
    			this.selectByIndex(this.filterCondition, 0);
    			this.filterValue.setValue('');
    			this.filterValue.clearInvalid();
    		}
    	}
    },
    setNodeValue:function()
    {
    	var value = this.filterValue.getValue();
    	var condition = this.filterCondition.selectedItem;
    	var field = this.filterField.selectedItem;
    	this.editNode.filterType = this.validType;
    	this.editNode.filterValue = value;
    	this.editNode.filterCondition = {value:condition.data['filterCondition'], text:condition.data['displayText']};
    	this.editNode.filterField = {value:field.data['fieldName'], text:field.data['displayText']};
    	var title = 'Filter [' + this.editNode.filterField.text + ' ' + this.editNode.filterCondition.text + ' ' + value + ']';
    	this.editNode.setText(title);
    	this.ownerCt.hide();
    },
    selectByIndex:function(combo, index)
    {
    	var record = combo.getStore().getAt(index);
    	combo.onSelect(record, index);
    },
    selectByValue:function(combo, value)
    {
    	var store = combo.getStore();
    	store.each(function(record){
    		if(record.data[combo.valueField] == value)
    		{
    			combo.onSelect(record, store.indexOf(record));
    			return false;
    		}
    	}, this);
    },
    hide:function()
    {
    	if(!this.editNode.filterValue)
    		this.editNode.remove(true);
    }
});

Ext.reg('QueryEditForm', QueryEditForm);

QueryEditWidget = Ext.extend(Ext.Window, {
	title:'Edit Query',
	width:400,
	modal:true,
	closable:true,
	closeAction:'hide',
	initComponent: function() {
	    this.items = [
	        {
	        	xtype:'QueryEditForm',
	        	ref:'form'
	        }
	    ];
	    
	    QueryEditWidget.superclass.initComponent.call(this);
	    this.on('hide', this.form.hide, this.form);
	},
	edit:function(treeNode){
		this.form.edit(treeNode);
		this.show();
	}
});

QueryPanel = Ext.extend(Ext.Panel, {
    initComponent: function() {
		var config = {
			layout:'border',
			items:[
			    {
			    	xtype:'QueryTreePanel',
			    	region:'center',
			    }
			]
	    }
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		QueryPanel.superclass.initComponent.call(this);
		
    }
});

QueryPanel = Ext.extend(Ext.Panel, {
    initComponent: function() {
		var config = {
			layout:'border',
			items:[
			    {
			    	ref:'QueryTreePanel',
			    	xtype:'QueryTreePanel',
			    	region:'center',
			    }
			]
	    }
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		QueryPanel.superclass.initComponent.call(this);
		
		this.addEvents('CreateSuccess');
		
		this.QueryTreePanel.on('CreateSuccess', function(){this.fireEvent('CreateSuccess');}, this);
    }
});

QueryNameWidget = Ext.extend(Ext.Window, {
    initComponent: function() {
		var config = {
			title:'Save Filter',
			layout:'border',
			width:350,
			height:120,
	    }
		this.items = [
					    {
					    	ref:'queryNameForm',
					    	bodyStyle: 'padding:15px',
					    	labelAlign : 'right',
					    	labelWidth : 60,
					    	xtype:'form',
					    	region:'center',
					    	monitorValid:true,
					    	defaults: {
					            width: 200,
					            msgTarget: 'side'
					        },
					    	items:[
					    	    {
					    	    	xtype:'textfield',
					    	    	name:'Name',
					    	    	fieldLabel:'Name',
					    	    	allowBlank:false
					    	    }
					    	],
							buttons:[
							    {
							    	formBind:true,
							    	text:'Save',
							    	scope:this,
							    	handler:this.saveClick
							    }
							]
					    }
					];
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		QueryNameWidget.superclass.initComponent.call(this);
    },
    
    saveClick:function()
    {
    	var data = this.queryNameForm.getForm().findField('Name').getValue();
    	this.callback.apply(this.scope, [data]);
    	this.close();
    },
    
    showWidget:function(callback, scope)
    {
    	this.callback = callback;
    	this.scope = scope;
    	this.show();
    }
});

Ext.reg('QueryPanel', QueryPanel);