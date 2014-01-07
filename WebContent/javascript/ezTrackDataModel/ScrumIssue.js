var ScrumIssueExpander = new Ext.ux.grid.RowExpander({
	tpl : new Ext.XTemplate(
        '<br><p><b>Name:</b><br /> {Name:nl2br}</p>',
        '<tpl if="Notes"><p><b>Notes:</b><br /> {Notes:nl2br}</p></tpl>',
        '<tpl for="AttachFileList"><p><b>Attach Files:</b><br /><a href="{DownloadPath}" target="_blank">{FileName}</a> <tpl if="this.hasPermission()">[<a href="#" onclick="Ext.getCmp(\'scrumIssueMasterPanel\').deleteAttachFile({FileId}, {IssueId}); return false;">Delete</a>]</tpl><br /></tpl>',
        '<br />',{
        hasPermission:function()
        {
        	return Ext.getCmp('scrumIssueMasterPanel').editStoryPermission;
        }}
    ),
    enableCaching :false
});

var ScrumCreateColModel = function () {
    var columns = [ScrumIssueExpander,
	            {dataIndex: 'Id',header: 'Id', width: 50,filterable: true,renderer: function(value, metaData, record, rowIndex, colIndex, store){var link = "<a href=\"" + record.data['Link'] + "\" target=\"_blank\">" + value + "</a>"; return link;}},
	            {dataIndex: 'Name',header: 'Name', width: 300,renderer: function(value, metaData, record, rowIndex, colIndex, store){if(record.data['Attach'] == 'true') return "<image src = \"./images/paperclip.png\" />" + value; return value}},
	            {dataIndex: 'Category',header: 'Category', width: 70},
	            {dataIndex: 'Sprint',header: 'Sprint', width: 70},
	            {dataIndex: 'Status',header: 'Status', width: 70}
	        ];

    return new Ext.grid.ColumnModel({
        columns: columns,
        defaults: {
            sortable: true
        }
    });
};

//Data store
var ScrumStore = new Ext.data.Store({
	fields:[
		{name:'Id', type:'int'},
		{name:'Link'},
		{name:'Name'},
		{name : 'Importance', type:'int'},
		{name : 'Estimation', type:'float'},
		{name : 'Status'},
		{name : 'Release'},
		{name : 'Sprint'},
		{name : 'Notes'},
		{name : 'HowToDemo'},
		{name : 'Tag'},
		{name : 'Attach'},
		{name : 'Category'}
	],
	reader:jsonScrumIssueReader,
	url:'showScrumIssueAction.do',
	proxy: new Ext.ux.data.PagingMemoryProxy(null,IssueGridPanelFilter),
	remoteSort : true
 });

