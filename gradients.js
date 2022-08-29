let grad_count = 2; //this is initialising a value for the gradients calculated i.e rows
let tab_count = 0;
grads_list = [];
// for (let i=0; i<grad_count; i++){ 
//     for (let j=1; j<=2; j++) {
//         grads_list.push = document.getElementById(`t${tab_count}r${i}c${j}`);
//     }
// }


function auto_update_col1(){
    //document.getElementById(`t${tab_count}r2c1`).innerHTML = document.getElementById("t${tab_count}inr1c2").value;
    console.log("changing")
    for (let i =2; i<= grad_count; i++){
        if(document.getElementById(`t${tab_count}inr${i-1}c2`).value){
            document.getElementById(`t${tab_count}r${i}c1`).innerHTML = document.getElementById(`t${tab_count}inr${i-1}c2`).value;
            console.log(`i=${i}, ${document.getElementById(`t${tab_count}r${i}c1`).innerHTML} inner html = ${document.getElementById(`t${tab_count}inr${i-1}c2`).value}`)
        }
    }
}

//autoupdate distance col
function calc_distance(){
    document.getElementById(`t${tab_count}r1c4`).innerHTML = Number(document.getElementById(`t${tab_count}inr1c2`).value - Number(document.getElementById(`t${tab_count}inr1c1`).value))
    for (let i =2; i<= grad_count; i++){
        let distance = Number(document.getElementById(`t${tab_count}inr${i}c2`).value) - Number(document.getElementById(`t${tab_count}r${i}c1`).innerHTML);
        document.getElementById(`t${tab_count}r${i}c4`).innerHTML = distance
    }
}

function add_table_row() {
    grad_count += 1
    let table = document.getElementById("grad_table_body");
    let row = table.insertRow();
    row.id = `t${tab_count}r${grad_count}`
    let cell0 = row.insertCell();
    cell0.id = `t${tab_count}r${grad_count}c${0}`
    let cell1 = row.insertCell();
    cell1.id = `t${tab_count}r${grad_count}c${1}`
    let cell2 = row.insertCell();
    cell2.id = `t${tab_count}r${grad_count}c${2}`
    let cell3 = row.insertCell();
    cell3.id = `t${tab_count}r${grad_count}c${3}`
    let cell4 = row.insertCell();
    cell4.id = `t${tab_count}r${grad_count}c${4}`
    cell0.innerHTML = `G${grad_count}`;
    if(document.getElementById(`t${tab_count}inr${grad_count-1}c2`).value !== ""){
        console.log(document.getElementById(`t${tab_count}inr${grad_count-1}c2`).value)
        cell1.innerHTML = document.getElementById(`t${tab_count}inr${grad_count-1}c2`).value; 
    }
    else{cell1.innerHTML = `input G${grad_count-1}`} 
    cell2.innerHTML =   `<div class="input-group-sm">
    <input id="t${tab_count}inr${grad_count}c${2}" type="number" step="100" aria-label="End (m)" placeholder="End (m)" class="form-control" onchange="main()">
</div>`;
    cell3.innerHTML =  `<div class="input-group-sm">
                           <input id="t${tab_count}inr${grad_count}c${3}" type="number" step="0.1" aria-label="GG${grad_count}" placeholder="G${grad_count}" class="form-control" onchange="main()">
                        </div>`;
    cell4.innerHTML =  "Enter Chainages";
  }


  function delete_table_row(){
    if (grad_count > 2 && document.getElementById(`t${tab_count}r${grad_count}`).innerHTML !== ""){
        document.getElementById(`t${tab_count}r${grad_count}`).remove();
        grad_count--;
        console.log('row deleted')
    }
  }

  function outputs(){
    let total_distance = 0;
    let sum_product_distance_gradient = 0;
    for (let i=1; i<= grad_count; i++){
        console.log(i)
        total_distance += Number(document.getElementById(`t${tab_count}r${i}c4`).innerHTML);
        sum_product_distance_gradient += Number(document.getElementById(`t${tab_count}r${i}c4`).innerHTML) * Number(document.getElementById(`t${tab_count}inr${i}c3`).value);
    }
    av_gradient = Math.round((sum_product_distance_gradient/total_distance)*1000)/1000;
    document.getElementById(`t${tab_count}tot_dist`).innerHTML = `${total_distance} m`;
    document.getElementById(`t${tab_count}av_grad`).innerHTML = `${av_gradient} %`;

    console.log(`av_gradient=${av_gradient}`);
    console.log(`total distance =${total_distance}`);
  }

  //this is going to fail with new naming conventions.
  function settings(){
    let table_borders_checkbox = document.getElementById("borders");
    let stripes_off = document.getElementById("stripes");
    let grad_table = document.getElementById(`t${tab_count}`);
    if (table_borders_checkbox.checked){
        grad_table.className += grad_table.className ? " table-bordered":"table-bordered";
        console.log(grad_table.className)
    }
    else{
        grad_table.classList.remove('table-bordered'); //removes this class from class list
    }
    if (stripes_off.checked){
        grad_table.classList.remove('table-striped')
    }
    else if (stripes_off.checked == false){
        console.log('hom')
        grad_table.className += " table-striped";
    }

}

let current_tab_color = "table-light"; //this is the default
function selectColor()
{ 
let grad_table = document.getElementById(`t${tab_count}`);
let new_color = document.getElementById('colours').value;

grad_table.classList.remove(`${current_tab_color}`)
grad_table.className += ` ${new_color}`;
current_tab_color = new_color;
}


/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function responsive_navbar() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
      x.className += " responsive";
    } else {
      x.className = "topnav";
    }
  }



function main(){
    auto_update_col1();
    calc_distance();
    outputs();
}


//bug fixes
//29.08 - fixing distance calculation of addition