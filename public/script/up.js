function increaseRow()
{
    
var t1=document.getElementById('t1')
var l=t1.rows.length
console.log(l)
var row=t1.insertRow(l)
var cell1 = row.insertCell(0);
var cell2 = row.insertCell(1);
var cell3 = row.insertCell(2);
var cell4 = row.insertCell(3);
cell1.innerHTML='<input type="text"  name="Medicine" style="float: right" >'
cell2.innerHTML='<input type="text"  name="Quantity" style="float: right" >'
cell3.innerHTML='<input type="text"  name="Rate" style="float: right" >'
cell4.innerHTML='<input type="text"  name="Amount" style="float: right" >'

}