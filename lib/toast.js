importClass("android.graphics.drawable.NinePatchDrawable")

importClass("android.content.Context")

importClass("android.graphics.Bitmap")
importClass("android.graphics.BitmapFactory")
importClass("android.graphics.NinePatch")
importClass("android.os.Bundle")
importClass("android.graphics.Rect")
  importClass(android.widget.Toast);
  importClass(android.view.Gravity);
function setBackground(view, path) {
  bitmap = BitmapFactory.decodeFile(path)
  chunk = bitmap.getNinePatchChunk(); // byte[]
  npd = new NinePatchDrawable(context.getResources(), bitmap, chunk, new Rect(), null);
  view.setBackground(npd);
}
var Toast1 ={
Toast9:function(str,log) {
    switch (log) {
        case 'e':
            console.error(str)
            break;
        case 'i':
            console.info(str)
            break;
        case 'l':
            log(str);
            break;
    }

 // let imgPath = files.path("./res/d2k9.png")
  var _toast = Toast.makeText(context, "", Toast.LENGTH_SHORT);
  view = ui.inflate(
    <frame >
      <TextView
        w="auto" id='_text' 
        paddingTop="140px" paddingLeft="115px" paddingRight="80px" paddingBottom="35px"
        gravity="center" textColor="#ffffff"
      />
    </frame>)
  view._text.setText(str)
  setBackground(view._text, files.path("./res/d2k9.png"));
  _toast.setView(view);
  _toast.show();
  _toast.show()
  return
},
}
    module.exports = Toast1;