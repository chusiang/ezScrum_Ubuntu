Ext.ns('ezScrum');

// Story Burndown Chart Data
var StoryPointsStore = new Ext.data.JsonStore({
	autoDestroy: true,
	root:'Points',
	fields: ['Date', 'IdealPoint', 'RealPoint']
});

// Task Burndown Chart Data
var TaskPointsStore = new Ext.data.JsonStore({
	autoDestroy: true,
	root:'Points',
	fields: ['Date', 'IdealPoint', 'RealPoint']
});

// StoryBurndowChart
var StoryBurndownChart =  new Ext.Panel({
	title: 'Story Burndown Chart',
    width:500,
    height:300,
    layout:'fit',
    items: {
        xtype: 'linechart',
        store: StoryPointsStore,
        xField: 'Date',
        yField: 'IdealPoint',
        
        series: [{
		        type: 'line',
		        displayName: 'Ideal Point',
		        yField: 'IdealPoint',
		        style: {
		            color:0x99bbe8
		        }
		    },{
		        type:'line',
		        displayName: 'Real Point',
		        yField: 'RealPoint',
		        style: {
		            color: '#FF0000'
	            
	        	}
	    }]
	}
});

// TaskBurndowChart
var TaskBurndownChart =  new Ext.Panel({
	title: 'Task Burndown Chart',
    width:500,
    height:300,
    layout:'fit',
    items: {
        xtype: 'linechart',
        store: TaskPointsStore,
        xField: 'Date',
        yField: 'IdealPoint',
        
        series: [{
		        type: 'line',
		        displayName: 'Ideal Point',
		        yField: 'IdealPoint',
		        style: {
		            color:0x99bbe8
		        }
		    },{
		        type:'line',
		        displayName: 'Real Point',
		        yField: 'RealPoint',
		        style: {
		            color: '#FF0000'
	        	}
	    }]
	}
});

// Burndown Char Form
var TaskBoardReportForm = new Ext.Panel({
	id			: 'TaskBoard_BurndownChart',
	frame		: true,
	border		: true,
	layout		: 'column',
	region		: 'center',
   	monitorValid: true,
	items	: [
		StoryBurndownChart,
		TaskBurndownChart
	]
});