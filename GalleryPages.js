cfg.MUI;
app.LoadPlugin( "Utils" );
app.LoadPlugin( "UIExtras" );
//app.LoadPlu/gin('DroidScriptUIKit');
app.LoadPlugin( "Picasso" );
app.LoadPlugin( "Jimp" );
//Load external scripts.
app.Script( "Home.js" );
app.Script( "About.js" );
app.Script( "Settings.js" );
app.Script( "File.js" );
app.Script( "Utils.js" );
//app.ClearCookies(  );
//app.Script( "Tools.js" );

//Init some global variables.
var appPath = "/storage/emulated/0/GalleryPagesNew";
var appPathImg = "/storage/emulated/0/GalleryPagesImages";
var curMenu = "Home";
var curPage = null;
var continueRunning = 0;

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
//Called when application is started.
function OnStart()
{
//da = new Date();
//alert(da.toUTCString());
//alert(document.cookie);
//alert(getCookie("myImages"));
//app.SetClipboardText(document.cookie);
uutils = app.CreateUtils();
app.MakeFolder( appPath );
app.MakeFolder( appPathImg );
//alert(app.ListFolder( appPath,"",0,"FullPath" ));
    //Lock screen orientation to Portrait.
    app.SetOrientation( "Portrait" );
    
    //Create and set a 'material style' theme.
    CreateTheme();
    
    //Create a local storage folder.
    app.MakeFolder( appPath );
    
	//Create the main app layout with objects vertically centered.
	layMain = app.CreateLayout( "Linear", "FillXY" );
	layMain.SetBackColor( "#ffffff" );

    //Create main controls and menus.
	CreateActionBar();
	CreatePageContainer();
	CreateDrawer();
	
	//Create page/dialog objects.
    home = curPage = new Home( appPath, layContent );
    about = new About();
	  file = new File( appPath, layContent );
    settings = new Settings( appPath, layContent );

	//Add main layout and drawer to app.	
	app.AddLayout( layMain );

	app.AddDrawer( drawerScroll, "Left", drawerWidth );
	
	//List files on menu and show home page.
	ShowFiles();
	home.Show( true, "Home" );
	
	//Detect keyboard showing.
    app.SetOnShowKeyboard( app_OnShowKeyBoard );
    
    //Prevent back key closing the app.
    app.EnableBackKey( false );
}

/*function web_OnProgress(progress)
{
	if(progress == 100) web.Execute( app.ReadFile( "OnWebNew.js" ) );
}*/

function IntervalChange(a, b)
{
console.log(continueRunning);
var c = a.split(",");
var d = c.length;
var aa = a;
var bb = b;
var f = uutils.RandomIntegerRange(0, d);
var format = app.LoadText( "format", "HTML", "format.txt" );
if(format != "HTML" && continueRunning == 1) {
	file.ChangePicture( c[f] );
console.log(c[f] + "\n");
setTimeout("IntervalChange('" + aa + "'," + parseInt(bb) +")",  parseInt(bb));
}
}

//Create area for showing page content.
function CreatePageContainer()
{
    layContent = app.CreateLayout( "Frame", "VCenter,FillXY" );
    layContent.SetSize( 1, 0.95 );
    layMain.AddChild( layContent );
}
   
//Swap the page content.
function ChangePage( page, title, force )
{ 
continueRunning = 0;
    //Check for changes.
    if( !force && curPage.IsChanged() )
    {
        var yesNoSave = app.CreateYesNoDialog( "Discard Changes?" );
	    yesNoSave.SetOnTouch( function(ret){if(ret=="Yes") ChangePage(page,title,true)} );
	    yesNoSave.Show();
        return;
    }
    
    //Fade out current content.
    if( home.IsVisible() ) home.Show( false );
    if( file.IsVisible() ) file.Show( false );
     if( settings.IsVisible() ) settings.Show( false );
    //Fade in new content.
    page.Show( true, title );
//app.ShowPopup("New content");
    
    //Highlight the chosen menu item in the appropriate list.
    if( curMenuList==lstMenuMain ) lstMenuFiles.SelectItemByIndex(-1);
    else lstMenuMain.SelectItemByIndex(-1);
    curMenuList.SelectItem( title );
    
    //Set title and store current page.
    txtBarTitle.SetText( title );
    curMenu = title;
    curPage = page;
}

//Called when back button is pressed.
function OnBack()
{
    if( file.IsVisible() || settings.IsVisible() ) {
        curMenu = "Home";
        ChangePage( home, curMenu );
    }
    else {
        var yesNo = app.CreateYesNoDialog( "Exit the app?" );
    	yesNo.SetOnTouch( function(result){ if(result=="Yes") app.Exit()} );
    	yesNo.Show();
    }
}

//Called when harware menu key pressed.
function OnMenu( name )
{  
   app.OpenDrawer();
}

//Handle soft-keyboard show and hide.
//(Re-size/adjust controls here if required)
function app_OnShowKeyBoard( shown )
{
}

//Create a theme for all controls and dialogs.
function CreateTheme()
{
    theme = app.CreateTheme( "Light" );
    theme.AdjustColor( 35, 0, -10 );
    theme.SetBackColor( "#ffffffff" );
    theme.SetBtnTextColor( "#000000" );
    theme.SetButtonOptions( "custom" );
    theme.SetButtonStyle( "#fafafa","#fafafa",5,"#999999",0,1,"#ff9000" );
    theme.SetCheckBoxOptions( "dark" );
    theme.SetTextEditOptions( "underline" );
    theme.SetDialogColor( "#ffffffff" );
    theme.SetDialogBtnColor( "#ffeeeeee" );
    theme.SetDialogBtnTxtColor( "#ff666666" );
    theme.SetTitleHeight( 42 );
    theme.SetTitleColor( "#ff888888" ); 
    theme.SetTitleDividerColor( "#ff0099CC" );
    theme.SetTextColor( "#000000" );
    app.SetTheme( theme );
}

//Create an action bar at the top.
function CreateActionBar()
{
colorNew = eval("MUI.colors.blue.blue");
	
color = MUI.colors.blue;
		 //Create horizontal layout for top bar.
    layHoriz = app.CreateLayout( "Linear", "Horizontal,FillX,Left" );
    layHoriz.SetBackGradient(color.lighten3, colorNew, color.darken3,"top-bottom");     //        4)

    layMain.AddChild( layHoriz );
    
    //Create menu (hamburger) icon .
    txtMenu = app.CreateText( "[fa-bars]", -1,-1, "FontAwesome" );
    txtMenu.SetPadding( 12,10,12,10, "dip" );
    txtMenu.SetTextSize( 28 );
    txtMenu.SetTextColor( "#ffffff" );
		txtMenu.SetTextShadow( 5, 0, 0, "#000000" );
    txtMenu.SetOnTouchUp( function(){app.OpenDrawer()} );
    layHoriz.AddChild( txtMenu );
    
    //Create layout for title box.
    layBarTitle = app.CreateLayout( "Linear", "Horizontal" );
    layBarTitle.SetSize( 0.73 );
    layHoriz.AddChild( layBarTitle );
    
    //Create title.
    txtBarTitle = app.CreateText( "Home", -1,-1, "Left" );
		txtBarTitle.SetFontFile( "Fonts/Regular.ttf" );
    txtBarTitle.SetMargins(0,10,0,0,"dip");
    txtBarTitle.SetTextSize( 22 );
    txtBarTitle.SetTextColor( "#ffffff" );
		txtBarTitle.SetTextShadow( 5, 0, 0, "#000000" );
    layBarTitle.AddChild( txtBarTitle );
    
        
    //Create search icon.
    txtSearch = app.CreateText( "[fa-power-off]", -1,-1, "FontAwesome" );
    txtSearch.SetPadding( 12,10,12,10, "dip" );
    txtSearch.SetTextSize( 28 );
    txtSearch.SetTextColor( "#ffffff" );
		txtSearch.SetTextShadow( 5, 0, 0, "#000000" );
//    txtSearch.SetOnTouchUp( function(){app.ShowPopup("Todo!")} );
txtSearch.SetOnTouchUp( OnBack );

    layHoriz.AddChild( txtSearch );

layHoriz.Animate( "FlipFromHorizontalSwing", null, 4000 );
    
}

//Called when a drawer is opened or closed.
function OnDrawer( side, state )
{
    console.log( side + " : " + state );
}

//Create the drawer contents.
function CreateDrawer()
{
colorNew = eval("MUI.colors.blue.blue");
	
color = MUI.colors.blue;
    //Create a layout for the drawer.
	//(Here we also put it inside a scroller to allow for long menus)
	drawerWidth = 0.90;
    drawerScroll = app.CreateScroller( drawerWidth, 1 );
    drawerScroll.SetBackColor( "White" );
	layDrawer = app.CreateLayout( "Linear", "Left" );
	drawerScroll.AddChild( layDrawer );
	
	//Create layout for top of drawer.
	layDrawerTop = app.CreateLayout( "Linear", "Left" );
	layDrawerTop.SetBackGradient(color.lighten3, colorNew, color.darken3,"tl-br");     //        4)
//.SetBackColor( "#4285F4" );
	layDrawerTop.SetSize( drawerWidth );
	layDrawer.AddChild( layDrawerTop );
	
	//Add an icon to top layout.
	var img = app.CreateImage( "Img/Hello.png", 0.15 );
	img.SetMargins( 0.02,0.02,0.02,0.01 );
	layDrawerTop.AddChild( img );
	
	//Add app name to top layout.
	var txtName = app.CreateText( "Gallery Pages",-1,-1,"Bold");
	txtName.SetFontFile( "Fonts/Regular.ttf" );
	txtName.SetMargins( 0.04,0.01,0.02,0.02 );
	txtName.SetTextColor( "White" );
	txtName.SetTextShadow( 5, 0, 0, "#000000" );
	txtName.SetTextSize( 20 );
	layDrawerTop.AddChild( txtName );
	
	//Create menu layout.
	var layMenu = app.CreateLayout( "Linear", "Left" );
	layDrawer.AddChild( layMenu );
	
    //Add a list to menu layout (with the menu style option).
    var listItems = "Home::[fa-home],Settings::[fa-gear],About::[fa-question-circle],New File::[fa-plus]";
    lstMenuMain = app.CreateList( listItems, drawerWidth, -1, "Menu,Expand" );
		lstMenuMain.SetFontFile( "Fonts/Regular.ttf" );
		lstMenuMain.SetTextShadow( 5, 0, 0, "#dcdcdc" );
    lstMenuMain.SetColumnWidths( -1, 0.35, 0.18 );
    lstMenuMain.SelectItemByIndex( 0, true );
    lstMenuMain.SetItemByIndex( 0, "Home" );
    lstMenuMain.SetOnTouch( lstMenu_OnTouch );
    layMenu.AddChild( lstMenuMain );
    curMenuList = lstMenuMain;
    
    //Add seperator to menu layout.
    var sep = app.CreateImage( null, drawerWidth,0.001,"fix", 2,2 );
    sep.SetSize( -1, 1, "px" );
    sep.SetColor( "#4285F4" );
    layMenu.AddChild( sep );
    
    //Add title between menus.
	txtTitle = app.CreateText( "Galleries:",-1,-1,"Left");
	txtTitle.SetFontFile( "Fonts/Regular.ttf" );
	txtTitle.SetTextColor( "#4285F4" );
	txtTitle.SetMargins( 16,12,0,0, "dip" );
	txtTitle.SetTextSize( 14, "dip" );
	layMenu.AddChild( txtTitle );
	
    //Add a second list to menu layout.
    lstMenuFiles = app.CreateList( "", drawerWidth,-1, "Menu,Expand" );
		lstMenuFiles.SetFontFile( "Fonts/Regular.ttf" );
    lstMenuFiles.SetColumnWidths( -1, 0.35, 0.18 );
    lstMenuFiles.SetIconSize( 64, "px" );
    lstMenuFiles.SetOnTouch( lstMenu_OnTouch );
    lstMenuFiles.SetOnLongTouch( lstMenu_OnLongTouch );
    layMenu.AddChild( lstMenuFiles );
}

//Handle menu item selection.
function lstMenu_OnTouch( title, body, type, index )
{
    curMenuList = this;
    
    //Handle new file creation.
    if( title=="New File" ) { 
        app.ShowTextDialog( "File Name", "", OnAdd );
        return;
    }
    if( title=="Settings" ) {
				settings.Show(true);
				app.CloseDrawer( "Left" );
				ChangePage( settings, title );
        return;
    }
    else if( title=="About" ) {
        about.Show();
        app.CloseDrawer( "Left" );
        return;
    }
    
    //Handle page changes.
    curMenu = title;
    if( title=="Home" ) {
settings.Show(false);
home.Show();
			ChangePage( home, title );
}else if(title == "Settings"){
//ChangePage( settings, title );
}else {settings.Show(false);ChangePage( file, title );}
    
    //Close the drawer.
    app.CloseDrawer( "Left" );
}

//Handle menu long press.
function lstMenu_OnLongTouch( title, body, type, index )
{
    curMenuList = this;
    curMenu = title;
    
    //Show options dialog.
    var sOps = "Rename,Delete" 
    lstOps = app.CreateListDialog( "Actions", sOps, "AutoCancel" );
    lstOps.SetOnTouch( lstOps_Select ); 
    lstOps.Show();
}

//Handle menu item selection.
function lstOps_Select( item )
{
    if( item=="Delete" ) 
    {
        var msg = "Are you sure you want to delete '" + curMenu + "' ?"
        yesNo = app.CreateYesNoDialog( msg );
        yesNo.SetOnTouch( yesNoDelete_OnTouch );
        yesNo.Show();
    }
    else if( item=="Rename" ) {
        app.ShowTextDialog( "Rename Program", curMenu, OnRename );
    }
}

//Handle delete 'are you sure' dialog.
function yesNoDelete_OnTouch( result )
{
    if( result=="Yes" ) 
    {
        //Delete the file and refresh list.
        app.DeleteFolder( appPath+"/" + curMenu );
        ShowFiles();
        ChangePage( home, "Home" );
    }
}

//Called after user enters renamed program.
function OnRename( name )
{
    //Check up name.
	if( !isValidFileName(name) ) {
		alert( "Name contains invalid characters!" );
		app.ShowTextDialog( "Rename Program", curMenu, "OnRename" );
		return;
	}
	
    //Check if already exists.
    var fldr = appPath+"/"+name;
    if( app.FolderExists( fldr ) ) {
        app.Alert( "App already exists!" );
    }
    else {
        //Rename the .json data file.
        var oldfile = appPath+"/"+curMenu+"/"+curMenu+".json";
        var newfile = appPath+"/"+curMenu +"/"+name+".json";
        if( app.FileExists( oldfile ) ) app.RenameFile( oldfile, newfile );
        
        //Rename folder and refresh list.
        app.RenameFile( appPath+"/"+curMenu, appPath+"/"+name );
        ShowFiles();
        ChangePage( file, name );
    }
}

//Called after user enters new file name.
function OnAdd( name, type )
{
	//Check up name.
	if( !isValidFileName(name) ) {
		alert( "Name contains invalid characters!" );
		app.ShowTextDialog( "File Name", "", OnAdd );
		return;
	}
    var fldr = appPath+"/"+name;
    if( app.FolderExists( fldr ) ) {
        app.Alert( "App already exists!" );
    }
    else {
				var luisra;
        app.MakeFolder( fldr );
        app.MakeFolder( fldr +"/Img" );
				//app.HttpRequest( "GET", SearchUrl(name), null, null, handleReply );
        //Start new file and refresh list.
        curMenuList = lstMenuFiles;
        ChangePage( file, name );
        file.Save();
        ShowFiles();
    }
    app.CloseDrawer( "Left" );
}

//Get user files list.
function GetFileList()
{    
    var fileList = "";
    var list = app.ListFolder( appPath,"",0,"alphasort");
    for( var i=0; i<list.length; i++ )
    {
        if( app.FileExists( appPath+"/"+list[i]+"/"+list[i]+".json" ) ) 
		{
            if( fileList.length>0 ) fileList += ",";
            fileList += list[i];
        }
    }
    return fileList;
}

//Update menus to show list of file.
function ShowFiles()
{
		app.ShowProgress();
    //Get list of user's file.
    var fileList = GetFileList().split(",");
    
    //Create a menu item for each app.
    var  list = "";
    for( var i=0; i<fileList.length && fileList[0]!=""; i++ )
    {
        if( list.length>0 ) list += ",";
        //list += fileList[i] + "::[fa-file]";
        list += fileList[i] + GetOnePic(fileList[i]);
    }
		app.Wait(2);
		app.HideProgress();
    lstMenuFiles.SetList( list );
		app.WriteFile( "ShowFiles.json", JSON.stringify(list), "Write" );
}

function GetOnePic(name)
{
if(!app.FileExists( appPathImg + "/" + name + ".png" )){
aa = app.ReadFile( appPath+"/"+name+"/"+name+".json" );
webserver1 = app.CreateWebServer( JSON.parse(aa).port, "ListDir" );
webserver1.SetFolder( "/storage/emulated/0/" + name );
webserver1.Start();
	f = "" + app.ListFolder( "/storage/emulated/0/" + name, ".jpg", 1 );
  Picasso.get()
 	.fit()
   .load( "http://" + app.GetIPAddress() + ":" + JSON.parse(aa).port + "/" + f.replace(" ", "%20").replace(" ", "%20"))
	 .transform( "circle" )
   .save( appPathImg + "/" + name + ".png", img_Saved );
}
	return "::" + appPathImg + "/" + name + ".png";
}

function img_Saved(result, error)
{
	//alert(result);
	//alert(error);
}