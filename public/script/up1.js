function increaseRow()
{
    
var t1=document.getElementById('t1')
var l=t1.rows.length
console.log(l)
var row=t1.insertRow(l)
var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);

cell1.innerHTML='<input type="text"  name="tname" style="float: right" >'
cell2.innerHTML='<input type="text"  name="cost" style="float: right" >'

}