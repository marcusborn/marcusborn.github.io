// let this.rows.length-1 = 2; //this is initialising a value for the gradients calculated i.e rowslet
let tab_count = 0;
grads_list = [];
table_dict = {};
table_id_list = [];
table_outputs = [];
let current_tab_color = "table-light"; //this is the default
// for (let i=0; i<this.rows.length; i++){
//     for (let j=1; j<=2; j++) {
//         grads_list.push = document.getElementById(`t${tab_count}r${i}c${j}`);
//     }
// }

// // Difference between instance and class methods:::
// t = Table();
// // Instance method:
// t.hello();
// // Class (static) method:
// Table.goodbye();

class TableUi{
    constructor() {
        //assign rand number to table_id
        this.table_id = Math.floor(Math.random() * 100000000000000);
        // this.track_gradient_profile = new TrackGradientProfile;
        let row_zero = ["Grad ", "Start (m)", "End(m)", "Gradient (%)", "Distance (m)"]
        let row_one = new Array(5).fill(0); //creates array of 0s
        let row_two = new Array(5).fill(0);
        this.rows = [row_zero, row_one, row_two] //will be a list of row objects
        table_id_list.push(this.table_id); //need to keep track of table ids
        tab_count++;
        console.log(`Constructor run for rows in table - ${this.table_id}`);
    }

    //creates first two rows for initial table setup.
    init_html() {
        let table_div = document.createElement("div");
        table_div.classList.add('container');
        table_div.id = this.table_id;
        table_div.innerHTML = `
    <table id="t${this.table_id}" class="table ${current_tab_color} table-striped">
        <thead class="">
            <tr><input id="t${this.table_id}title" style="text-align:center" type="text" aria-label="Title" placeholder="Title" class="form-control"></tr>
            <tr>
                <th style="font-size:smaller" >Grad #</th>
                <th>Start (m) </th>
                <th>End (m)  </th>
                <th style="font-size:smaller">Gradient (%) </th>
                <th style="font-size:smaller" >Distance (m)</th>
            </tr>
        </thead>
        <tbody id="${this.table_id}grad_table_body">
            <tr>
                <td id="t${this.table_id}r1c0">G1</td>
                <td id="t${this.table_id}r1c1" >
                    <div class="input-group-sm">
                            <input id="t${this.table_id}inr1c1" step="100" type="number" aria-label="Start (m)" placeholder="Start (m)" class="form-control" onchange="main()">
                    </div>
                </td>
                <td id="t${this.table_id}r1c2">
                    <div class="input-group-sm">
                            <input id="t${this.table_id}inr1c2" step="100" type="number" aria-label="End (m)" placeholder="End (m)" class="form-control" onchange="main()";>
                    </div>
                </td>
                <td id="t${this.table_id}r1c3">
                    <div class="input-group-sm">
                            <input id="t${this.table_id}inr1c3" type="number" step="0.1" aria-label="G1" placeholder="G1" class="form-control" onchange="main()">
                    </div>
                </td>
                <td id="t${this.table_id}r1c4">
                    Enter Chainages
                </td>
            </tr>
            <tr>
                <td id="t${this.table_id}r2c0">G2</td> <!--Table data point-->
                <td id="t${this.table_id}r2c1">
                    input G1
                </td>
                <td id="t${this.table_id}r2c2">
                    <div class="input-group-sm">
                            <input id="t${this.table_id}inr2c2" step="100" type="number" aria-label="End (m)" placeholder="End (m)" class="form-control" onchange="main()">
                    </div>
                </td>
                <td id="t${this.table_id}r2c3">
                    <div class="input-group-sm">
                            <input id="t${this.table_id}inr2c3" type="number" step="0.1" aria-label="G2" placeholder="G2" class="form-control" onchange="main()">
                    </div>
                </td>
                <td id="t${this.table_id}r2c4">
                    Enter Chainages
                </td>
            </tr>

        </tbody>
        <tfoot style="border-bottom: 1px; border-top: 1px;">
            <tr id="t${this.table_id}foot_row">
                <th style="font-size: smaller"; >
                    Total Distance:
                </th>
                <td id="t${this.table_id}tot_dist">

                </td>
                <th>
                    Average Gradient:
                </th>
                <td id="t${this.table_id}av_grad">

                </td>
                <td id="t${this.table_id}fill" style="background-color: lightgrey;" ></td>
            </tr>
        </tfoot>
    </table>


    <div id="${this.table_id}add_row">
        <button type="button" class="btn btn-success" onclick="table_dict[${this.table_id}].add_table_row()">Add Row</button>
        <button type="button" class="btn btn-danger" onclick="table_dict[${this.table_id}].delete_table_row()">Delete Last Row</button>
        <button type="button" class="btn btn-danger" onclick="table_dict[${this.table_id}].download_csv()">Download CSV</button>
    </div>
`
        document.getElementById("content").appendChild(table_div);
        console.log(`new table init run created using a class for table id ${this.table_id}`);
    }

    add_table_row(){
        const new_row = new Array(5).fill(0);
        this.rows.push(new_row);

        let table = document.getElementById(`${this.table_id}grad_table_body`);
        let row = table.insertRow();
        row.id = `t${this.table_id}r${this.rows.length-1}`
        let cell0 = row.insertCell();
        cell0.id = `t${this.table_id}r${this.rows.length-1}c${0}`
        let cell1 = row.insertCell();
        cell1.id = `t${this.table_id}r${this.rows.length-1}c${1}`
        let cell2 = row.insertCell();
        cell2.id = `t${this.table_id}r${this.rows.length-1}c${2}`
        let cell3 = row.insertCell();
        cell3.id = `t${this.table_id}r${this.rows.length-1}c${3}`
        let cell4 = row.insertCell();
        cell4.id = `t${this.table_id}r${this.rows.length-1}c${4}`
        cell0.innerHTML = `G${this.rows.length-1}`;

        if (document.getElementById(`t${this.table_id}inr${this.rows.length-1-1}c2`).value !== "")
        {
            console.log(document.getElementById(`t${this.table_id}inr${this.rows.length-1-1}c2`).value)
            cell1.innerHTML = document.getElementById(`t${this.table_id}inr${this.rows.length-1-1}c2`).value;
        }
        else {
            cell1.innerHTML = `input G${this.rows.length-1 - 1}`
        }

        cell2.innerHTML = `<div class="input-group-sm">
                                <input id="t${this.table_id}inr${this.rows.length-1}c${2}" type="number" step="100" aria-label="End (m)" placeholder="End (m)" class="form-control" onchange="main()">
                            </div>`;

        cell3.innerHTML =  `<div class="input-group-sm">
                            <input id="t${this.table_id}inr${this.rows.length-1}c${3}" type="number" step="0.1" aria-label="GG${this.rows.length-1}" placeholder="G${this.rows.length-1}" class="form-control" onchange="main()">
                            </div>`;

        cell4.innerHTML =  "Enter Chainages";

        console.log(`add_table_row() ran within class has run to create table id : ${this.table_id}`);
    }

    calc_distance(){
        let distance_column = 4;
        document.getElementById(`t${this.table_id}r1c4`).innerHTML = Number(document.getElementById(`t${this.table_id}inr1c2`).value - Number(document.getElementById(`t${this.table_id}inr1c1`).value))
        for (let i =2; i<= this.rows.length-1; i++){
            let distance = Number(document.getElementById(`t${this.table_id}inr${i}c2`).value) - Number(document.getElementById(`t${this.table_id}r${i}c1`).innerHTML);
            document.getElementById(`t${this.table_id}r${i}c4`).innerHTML = distance
            this.rows[i-1][distance_column]; //appends distance to rows
        }
        console.log(`Distance calculated for rows in table - ${this.table_id}`);
    }

    update_col1(){ //updates the first column with last row's end chainage
        for (let i =2; i<= this.rows.length-1; i++){
            if(document.getElementById(`t${this.table_id}inr${i-1}c2`).value){
                document.getElementById(`t${this.table_id}r${i}c1`).innerHTML = document.getElementById(`t${this.table_id}inr${i-1}c2`).value;
                // console.log(`i=${i}, ${document.getElementById(`t${this.table_id}r${i}c1`).innerHTML} inner html = ${document.getElementById(`t${this.table_id}inr${i-1}c2`).value}`)
            }
        }
        console.log(`cols updated for rows in table - ${this.table_id}`);
    }

    delete_table_row(){
            if (this.rows.length-1 > 2 && document.getElementById(`t${this.table_id}r${this.rows.length-1}`).innerHTML !== ""){
                document.getElementById(`t${this.table_id}r${this.rows.length-1}`).remove();
                this.rows.pop();
                console.log(`row deleted within table class ${this.table_id}`)
        }
    }

    outputs(){
        let total_distance = 0;
        let sum_product_distance_gradient = 0;
        for (let i=1; i<= this.rows.length-1; i++){
            // console.log(i);
            total_distance += Number(document.getElementById(`t${this.table_id}r${i}c4`).innerHTML);
            sum_product_distance_gradient += Number(document.getElementById(`t${this.table_id}r${i}c4`).innerHTML) * Number(document.getElementById(`t${this.table_id}inr${i}c3`).value);
        }
        let av_gradient = Math.round((sum_product_distance_gradient/total_distance)*1000)/1000;
        total_distance = Math.round(total_distance*100)/100;
        document.getElementById(`t${this.table_id}tot_dist`).innerHTML = `${total_distance} m`;
        document.getElementById(`t${this.table_id}av_grad`).innerHTML = `${av_gradient} %`;

        console.log(`av_gradient=${av_gradient}`);
        // console.log(`total distance =${total_distance}`);
        // console.log(`outputs calculated for rows in table - ${this.table_id}`);
    }

    update_rows() {
        // Model a row without any data in it
        // TODO if a previous is filled out, put the start distance in here
        let num_columns = 5;
        for (let i=1; i< this.rows.length; i++){
            for (let j=0; j<num_columns; j++){
                console.log(`i = ${i}, J = ${j}`)
                if(document.getElementById(`t${this.table_id}inr${i}c${j}`) !== null){
                    this.rows[i][j] = document.getElementById(`t${this.table_id}inr${i}c${j}`).value
                    console.log(this.rows[i][j]);
                }
                else{
                    this.rows[i][j] = document.getElementById(`t${this.table_id}r${i}c${j}`).innerHTML
                    console.log(this.rows[i][j]);
                }
            }
        }
        console.log(this.rows)
    }

    get_average_gradient(){
        // Parse all the data from the actual DOM HTML and then calculate
    }

    as_csv() {
        let csv_string = "data:text/csv;charset=utf-8,";

        console.log(this.rows);

        //add title of table
        this.rows.forEach(function(row_array) {
            let row_string = row_array.join(",");
            csv_string += row_string + "\r\n";
        });

        //Add outputs of table
        let total_distance = document.getElementById(`t${this.table_id}tot_dist`).innerHTML;
        let average_gradient = document.getElementById(`t${this.table_id}av_grad`).innerHTML;
        csv_string += `TOTAL DISTANCE: ${total_distance},,,`
        csv_string += `AVERAGE GRADIENT: ${average_gradient},`

        return csv_string;
    }

    download_csv(){
        let csv_string = this.as_csv();
        let encoded_uri = encodeURI(csv_string);
        console.log(encoded_uri);
        console.log(csv_string);

        // This is a hack:
        let title = document.getElementById(`t${this.table_id}title`).value;
        let link = document.createElement("a");
        link.setAttribute("href", encoded_uri);
        link.setAttribute("download", `data_${title}.csv`);
        document.body.appendChild(link); // Required for FF
        link.click(); // This will download the data file named "my_data.csv".
    }
}

// function auto_update_col1(){
//     //document.getElementById(`t${tab_count}r2c1`).innerHTML = document.getElementById("t${tab_count}inr1c2").value;
//     console.log("changing")
//     for (let i =2; i<= this.rows.length-1; i++){
//         if(document.getElementById(`t${tab_count}inr${i-1}c2`).value){
//             document.getElementById(`t${tab_count}r${i}c1`).innerHTML = document.getElementById(`t${tab_count}inr${i-1}c2`).value;
//             console.log(`i=${i}, ${document.getElementById(`t${tab_count}r${i}c1`).innerHTML} inner html = ${document.getElementById(`t${tab_count}inr${i-1}c2`).value}`)
//         }
//     }
// }

//autoupdate distance col
// function calc_distance(){
//     document.getElementById(`t${tab_count}r1c4`).innerHTML = Number(document.getElementById(`t${tab_count}inr1c2`).value - Number(document.getElementById(`t${tab_count}inr1c1`).value))
//     for (let i =2; i<= this.rows.length-1; i++){
//         let distance = Number(document.getElementById(`t${tab_count}inr${i}c2`).value) - Number(document.getElementById(`t${tab_count}r${i}c1`).innerHTML);
//         document.getElementById(`t${tab_count}r${i}c4`).innerHTML = distance
//     }
// }

// function add_table_row() {
//     this.rows.length-1 += 1
//     let table = document.getElementById("grad_table_body");
//     let row = table.insertRow();
//     row.id = `t${tab_count}r${this.rows.length-1}`
//     let cell0 = row.insertCell();
//     cell0.id = `t${tab_count}r${this.rows.length-1}c${0}`
//     let cell1 = row.insertCell();
//     cell1.id = `t${tab_count}r${this.rows.length-1}c${1}`
//     let cell2 = row.insertCell();
//     cell2.id = `t${tab_count}r${this.rows.length-1}c${2}`
//     let cell3 = row.insertCell();
//     cell3.id = `t${tab_count}r${this.rows.length-1}c${3}`
//     let cell4 = row.insertCell();
//     cell4.id = `t${tab_count}r${this.rows.length-1}c${4}`
//     cell0.innerHTML = `G${this.rows.length-1}`;
//     if(document.getElementById(`t${tab_count}inr${this.rows.length-1-1}c2`).value !== ""){
//         console.log(document.getElementById(`t${tab_count}inr${this.rows.length-1-1}c2`).value)
//         cell1.innerHTML = document.getElementById(`t${tab_count}inr${this.rows.length-1-1}c2`).value;
//     }
//     else{cell1.innerHTML = `input G${this.rows.length-1-1}`}
//     cell2.innerHTML =   `<div class="input-group-sm">
//     <input id="t${tab_count}inr${this.rows.length-1}c${2}" type="number" step="100" aria-label="End (m)" placeholder="End (m)" class="form-control" onchange="main()">
// </div>`;
//     cell3.innerHTML =  `<div class="input-group-sm">
//                            <input id="t${tab_count}inr${this.rows.length-1}c${3}" type="number" step="0.1" aria-label="GG${this.rows.length-1}" placeholder="G${this.rows.length-1}" class="form-control" onchange="main()">
//                         </div>`;
//     cell4.innerHTML =  "Enter Chainages";
//   }


//   function delete_table_row(){
//     if (this.rows.length-1 > 2 && document.getElementById(`t${tab_count}r${this.rows.length-1}`).innerHTML !== ""){
//         document.getElementById(`t${tab_count}r${this.rows.length-1}`).remove();
//         this.rows.length-1--;
//         console.log('row deleted')
//     }
//   }

//   function outputs(){
//     let total_distance = 0;
//     let sum_product_distance_gradient = 0;
//     for (let i=1; i<= this.rows.length-1; i++){
//         console.log(i)
//         total_distance += Number(document.getElementById(`t${tab_count}r${i}c4`).innerHTML);
//         sum_product_distance_gradient += Number(document.getElementById(`t${tab_count}r${i}c4`).innerHTML) * Number(document.getElementById(`t${tab_count}inr${i}c3`).value);
//     }
//     av_gradient = Math.round((sum_product_distance_gradient/total_distance)*1000)/1000;
//     document.getElementById(`t${tab_count}tot_dist`).innerHTML = `${total_distance} m`;
//     document.getElementById(`t${tab_count}av_grad`).innerHTML = `${av_gradient} %`;

//     console.log(`av_gradient=${av_gradient}`);
//     console.log(`total distance =${total_distance}`);
//   }

  //this is going to fail with new naming conventions. //NEED TO FIX THIS! GET RID OF TAB COUNT AND USE TABLE IDS IN A FOR LOOP
  function settings(){
    let table_borders_checkbox = document.getElementById("borders");
    let stripes_off = document.getElementById("stripes");
    for (const key in table_dict){
            let grad_table = document.getElementById(`t${key}`);
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
            grad_table.className += " table-striped";
        }
        }


}


function selectColor(){

    let new_color = document.getElementById('colours').value;
    for (const key in table_dict){
        console.log("COLOR SET FOR :")
        console.log(key)
        let grad_table = document.getElementById(`t${key}`);

        grad_table.classList.remove(`${current_tab_color}`);
        grad_table.className += ` ${new_color}`;
    }
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


//this function will call the table UI class to create a new table!
function add_table(){ //Maybe I am naming multiple table objects with the same name?
    let new_table = new TableUi();
    table_dict[new_table.table_id] = new_table;
    new_table.init_html();   ////THIS LINE HERE IS CLEARNING INPUT ON TABLE CREATION!!!!!
    console.log("new table created");
    console.log(new_table);
    console.log(table_dict)
    return;
}


function main(){
    // new_table = new TableUi;
    if(Object.keys(table_dict).length == 0){
        new_table = new TableUi;
        table_dict[new_table.table_id] = new_table;
        new_table.init_html();
        console.log("1st table created");
    }
    for (const key in table_dict){
        table_dict[key].calc_distance();
        table_dict[key].update_col1();
        table_dict[key].outputs();
        table_dict[key].update_rows()
    }
}


//bug fixes & comments
//29.08 - fixing distance calculation of addition
//


// //8/09/22
// can now instantiate table class but cannot enter data
//Class does not actually return or fill rows in data only in html, I should change this.
