var IssueCommitLogRecord = Ext.data.Record.create([ 'Log', 'ChangeTime', 'Files', 'Author', 'Revision' ]);

var IssueCommitLogReader = new Ext.data.JsonReader({
	id: "Revision"
}, IssueCommitLogRecord);

var IssueCommitLogStore = new Ext.data.Store({
	fields:[
		{name : 'Log'},
	   	{name : 'ChangeTime'},	
		{name : 'Files'},
		{name : 'Author'},
		{name : 'Revision'}
	],
	reader : IssueCommitLogReader
});

var IssueCommitLogColumnModel = new Ext.grid.ColumnModel({
	columns: [ 
		{ dataIndex: 'Revision',header: 'Revision', width: 100 },
		{ dataIndex: 'Author',header: 'Author', width: 200 },		            
		{ dataIndex: 'Log',header: 'Log', width: 500 },
		{ dataIndex: 'ChangeTime',header: 'ChangeTime', width: 200 }		          
	]
});

var IssueCommitLogExpander = new Ext.ux.grid.RowExpander({
    tpl : new Ext.XTemplate(
        '<br>',
        '<b>Changed Files:</b><br>',
        '<tpl for="Files">&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;{FileName}<br></tpl>'
    )
});