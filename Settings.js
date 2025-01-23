"use strict"

function Settings( path, layContent )
{
  	var self = this;
    //Get page states.
    this.IsVisible = function() { return lay1.IsVisible(); }
    this.IsChanged = function() { return false; }
    
    //Show or hide this page.
    this.Show = function( show )
    {
        if( show ) lay1.Animate("FadeIn");
        else lay1.Animate( "FadeOut" );
    }

		this.spn_OnChange = function( item )
		{
			//app.ShowPopup( item );
			ChangePage( file, item );
		}
    
this.OnChange = function( item, index )
{
 //app.ShowPopup( item + " : " + index );
app.SaveText( "format", item, "format.txt" );
}

this.OnChange1 = function( item, index )
{
 //app.ShowPopup( item + " : " + index );
app.SaveText( "interval", item, "interval.txt" );
}

this.ShowState = function( isChecked )
{
app.SaveBoolean( "showNames", isChecked, "showNames.txt" );
    app.ShowPopup( "Checked = " + isChecked, "Short" );
}

    //Create layout for app controls.
    var lay1 = app.CreateLayout( "Linear", "FillXY,VCenter" );
lay1.SetBackColor( "#ffffff" );
    lay1.Hide();
    layContent.AddChild( lay1 );
    
    //Add a logo.
	//var img = app.CreateImage( "Img/Hello.png", 0.25 );
	//lay.AddChild( img );
	
	//Create a text with formatting.
/*
    var text = "<p><font color=#4285F4><big>Welcome</big></font></p>" + 
    "Todo: Put your home page controls here! </p>" + 
    "<p>You can add links too - <a href='https://play.google.com/store'>Play Store</a></p>" +
    "<br><br><p><font color=#4285F4><big><big><b>&larr;</b></big></big> Try swiping from the " + 
    "left and choosing the <b>'<a href='app.ShowTextDialog( \"File Name\", \"\", OnAdd );'>New File</a>'</b> option</font></p>";
    var txt = app.CreateText( text, 1, -1, "Html,Link" );
    txt.SetPadding( 0.03, 0.03, 0.03, 0.03 );
    txt.SetTextSize( 18 );
    txt.SetTextColor( "#444444" );
    lay.AddChild( txt );
*/

 var txt = app.CreateText( "Choose format:", 1, -1, "Html,Link" );
    txt.SetPadding( 0.03, 0.03, 0.03, 0.03 );
    txt.SetTextSize( 24 );
    txt.SetTextColor( "#4285F4" );
txt.SetTextShadow( 5, 0, 0, "#69000000" );
    lay1.AddChild( txt );



var uix = app.CreateUIExtras();
 
 var picker = uix.CreatePicker( "HTML,ImageGrid,ImageGallery", 0.85, -1 );
 picker.SetOnChange( self.OnChange );
picker.SetTextColor("#4285F4");
var format = app.LoadText( "format", "HTML", "format.txt" );
picker.SelectItem(format);
 lay1.AddChild( picker );

var txt1 = app.CreateText( "Interval (milliseconds):", 1, -1, "Html,Link" );
    txt1.SetPadding( 0.03, 0.03, 0.03, 0.03 );
    txt1.SetTextSize( 24 );
    txt1.SetTextColor( "#4285F4" );
txt1.SetTextShadow( 5, 0, 0, "#69000000" );
    lay1.AddChild( txt1 );
var inter = "";
for(var c=1;c<=5000;c++)
{
	if(inter==""){
		inter += c;
	}else{
		inter += "," + c;
	}
}
var picker1 = uix.CreatePicker( inter, 0.85, -1 );
 picker1.SetOnChange( self.OnChange1 );
picker1.SetTextColor("#4285F4");
var interval = app.LoadText( "interval", "50", "interval.txt" );
picker1.SelectItem(interval);
 lay1.AddChild( picker1 );

		var spn = app.CreateSpinner( GetFileList(), 0.75, -1, "Bold" );
		spn.SetBackColor( "#4285F4");
	  spn.SetTextColor( "#FFFFFF" );
		spn.SetOnChange( self.spn_OnChange );
		lay1.AddChild( spn );

  var chk = app.CreateCheckBox( "Display Image Name: " );
    chk.SetOnTouch( self.ShowState );
chk.SetTextColor( "#4285F4" );
chk.SetTextSize( 24 );
    lay1.AddChild( chk );
var showNames = app.LoadBoolean( "showNames", true, "showNames.txt" );
chk.SetChecked( showNames );
}
