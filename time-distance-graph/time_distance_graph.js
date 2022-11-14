const initial_run = setTimeout(run_initial, 300);
//initialise desmos stuff
let elt = document.getElementById('calculator');
let calculator = Desmos.GraphingCalculator(elt);
//set variables (these will come from user inputs later)
let linespeed = 80 //km/h
let decel = -0.71
let start_chainage = 7000;
let end_chainage = 10760;
let total_time = 450; //this should be estimated by the program but for now its ok for user input.
let stop_chainages = [8000, 9720,10760] //m 
let accel_rate = 0.69 //m/s/s
// let train_type = [];
let starting_phase = 'accel' //this was originally set to decel but is now at accel, i think it should always be at accel.

//this data will keep a log of every second of the journey, it will then be able to help with headways and output journey to a csv file!
let journey_data = {
    time: [],
    distance: [],
    accel_rate: []
}



let input_vars = {
    grad: [],
    grad_chainages: [],
    station_names: [],
    station_chainages: [],
    speed_restrictions: [],
    speed_restriction_chainages: [],
    signal_names: [],
    signal_chainages: [],
    overlap_names: [],
    overlap_chainages: [],
    start_chainage: 7000,
    end_chainage: 10760,
    // train_type: EMU,
    starting_phase: "accel",
    linespeed: 80
}

calculator.setMathBounds({
    left: start_chainage-10,
    right: end_chainage+100,
    bottom: -total_time,
    top: 20
});


//initialise all coutners
let phase_count = 0;
let decel_count = 0;
let accel_count = 0;
let dwell_count = 0;
let constant_count = 0;

//lists accumulated time for each phase
let time_accumulated = [0]
let distance_accumulated = [start_chainage]

//initialise more counters for adding HTML input elements
let call_count = 0;

let grad_input_count = 0; //initialises counting the input gradient values
let signal_overlap_count = 0;
let station_count = 0;
let speed_restriction_count = 0; //initialise the number of restrictions

//set up constants for all train types!
EMU = {
    accel: 0.69,
    decel: -0.71,
    emerg_decel: -0.81,
    length: 150
}



// train_type = EMU;

const input_values_accel =  {
    initial_vel: 0,
    final_vel:  linespeed/3.6,//80km/h
    time:  "",
    distance: "",
    accel: EMU['accel'],
    grad: "",
    };

const input_values_decel =  {
    initial_vel: linespeed/3.6,
    final_vel:  0,
    time:  "",
    distance: "",
    accel: EMU['decel'],
    grad: "",
    };

const input_values_constant =  {
    initial_vel: linespeed/3.6,
    final_vel:  linespeed/3.6,
    time:  "",
    distance: "",
    accel: "",
    grad: 0,
    };

    const dwell_phase =  {
        initial_vel: 0,
        final_vel:  0,
        time:  15,
        distance: "",
        accel: "",
        grad: "",
        };
        

        //THIS FUNCTION SHOULD BE IDENDICAL TO THE ONE INS TRAINSTOP_CALC HOWEVER IS ROUNDED.
        function calculate_vals(input_values){
            //accel_adjust adjusts the acceleration value by a factor to compensate for a gradient.
            function accel_adjust(accel,grad){
                if (!isNaN(parseFloat(grad))){
                    accel = parseFloat(accel) - (9.81*parseFloat(grad)/100);
                    return accel;
                }
                else {
                    return parseFloat(accel);
                }
            }
            
                let initial_vel = input_values['initial_vel'];
                let final_vel = input_values['final_vel'];
                let time = input_values['time'];
                let distance = input_values['distance'];
                let accel = input_values['accel'];
                let grad = input_values['grad'];
                //console.log(input_values);
                accel = accel_adjust(accel,grad);
                console.log("accel: " + accel);
                console.log(input_values);
            console.log(accel)
            console.log(time)
                if (accel === '' || isNaN(accel)) {
                    console.log("no accel calc")
                    if (distance === '' || isNaN(distance)){
                        distance = (time*(initial_vel + final_vel))/2; //f3
                        accel = (final_vel-initial_vel)/time; //f1
                        accel = accel_adjust(accel);
                    }
                    else if(time === '' || isNaN(time)){
                        time = (2*distance)/(initial_vel+final_vel);
                        accel = (final_vel**2-initial_vel**2)/(2*distance);
                        accel = accel_adjust(accel);
            
                    }
                    else if(initial_vel === '' || isNaN(initial_vel)){
                        initial_vel = ((distance*2)/time)-final_vel;
                        accel = (final_vel-initial_vel)/time; 
                        accel = accel_adjust(accel);
                    }
                    else if(final_vel === '' || isNaN(final_vel)){
                        final_vel = ((distance*2)/time)-initial_vel;
                        accel = (final_vel-initial_vel)/time;
                        accel = accel_adjust(accel); 
                    }  
                }
                if (distance === ''|| isNaN(distance)){
                    console.log("no distance cal");
                    if (!time){
                        time = (final_vel-initial_vel)/(accel);
                        distance = (final_vel**2 - initial_vel**2)/(2*accel);
                    }
                    if (initial_vel === ''|| isNaN(initial_vel)){
                        initial_vel = final_vel-(accel*time);
                        distance = time*(initial_vel + final_vel)/2;
                        console.log("no initial vel, no distance calc");
                    }
                    if (final_vel === ''|| isNaN(final_vel)){
                        final_vel = initial_vel + (accel*time);
                        distance = (time*(initial_vel + final_vel))/2;
                        console.log("No distance, no final vel"+ time +"*"+initial_vel+"+"+final_vel+"/2"+"="+ distance);
                    }
                }
            
                if (time === ''|| isNaN(time)){
                    console.log("no tiem calc");
                    console.log(initial_vel)
                    if (initial_vel===''){
                        console.log(initial_vel)
                        initial_vel = Math.sqrt(final_vel**2 - (2*accel*distance));
                        time = (final_vel-initial_vel)/accel;
                    }
                    if (final_vel==='' || isNaN(time)){
                        console.log("no tiem calc, no final vel")
                        final_vel = Math.sqrt(initial_vel**2 + 2*accel*distance);
                        console.log(initial_vel)
                        time = (final_vel-initial_vel)/accel;
                        //vals_array = [initial_vel, final_vel, time, distance, accel, grad];
                    }
                }
                if ((initial_vel === ''|| isNaN(initial_vel)) && (final_vel === ''|| isNaN(final_vel))){
                    initial_vel = (distance - (0.5*accel*time**2))/time;
                }
            let vals_array = [initial_vel, final_vel, Math.round(time*100)/100, Math.round(distance*100)/100, accel, grad];
            console.log(vals_array);
            return vals_array;
            
            }
  
    //start_chainage = document.getElementById("start_chaianage").value;

    //sets up domain and range of default graph
// calculator.setMathBounds({
//     left: start_chainage-10,
//     right: end_chainage+100,
//     bottom: -total_time,
//     top: 20
//   });



  function update_time_distance(input_values){

    //go back to vals array to check this
    time_accumulated.push(calculate_vals(input_values)[2] + time_accumulated[time_accumulated.length-1])
    //verify that this does not go ever end_chainage.
    console.log(calculate_vals(input_values)[3] + distance_accumulated[distance_accumulated.length-1])
    if (calculate_vals(input_values)[3] + distance_accumulated[distance_accumulated.length-1] < end_chainage){
        distance_accumulated.push(calculate_vals(input_values)[3] + distance_accumulated[distance_accumulated.length-1]);
        console.log("DISTANCE_ACCUMULATED")
    }
    // else {
    //     distance_accumulated.push(distance_accumulated[distance_accumulated.length-1])
    // }
    console.log("DISTANCE TIME UPDATED")
    phase_count++;
  }


// function map_station_stops(stop_chainages){
//     for (const stop of stop_chainages){
//         calculator.setExpression({id:`Station${stop_chainages.indexOf(stop)}`, latex: `x = ${stop}\\left \\{${0}>=y>=-${total_time} \\right \\}`, lineStyle: Desmos.Styles.DASHED, color: '#000000'}); //color black
//     }
//     return;
// }


function run_decel_phase(){
    decel_count++; //this counts decel curves

    update_time_distance(input_values_decel);

    //local vars for formula
    let start_phase_time = time_accumulated[phase_count-1];
    let end_phase_time = time_accumulated[phase_count];
    let start_phase_distance = Math.round(distance_accumulated[phase_count-1]);


    calculator.setExpression({ color: Desmos.Colors.RED, id: `${phase_count-1}decel${decel_count-1}`, latex: `x = -(${linespeed}/3.6)y + 0.5(${decel})(y+${start_phase_time})^2 + ${start_phase_distance}-((${linespeed}/3.6)*${start_phase_time})\\left \\{-${start_phase_time}>=y>=-${end_phase_time} \\right \\}` });

    for (i=Math.round(start_phase_time); i<Math.round(end_phase_time); i++){
        journey_data["distance"].push((-(linespeed/3.6)*(-i) + 0.5*decel*((-i)+start_phase_time)**2 + start_phase_distance)-((linespeed/3.6)*start_phase_time)) //x=-(${linespeed}/3.6)y + 0.5*(0.69)*(y+0)^{2}+7000
        journey_data["time"].push(i);
        journey_data["accel_rate"].push(decel);
    }
    console.log(`decel phase ran for ${i-start_phase_time} seconds`)


}

function run_constant_phase(){
    //Must run this pre-check of deceleration phase for constant distant requirement
    let temp_decel_distance_value = calculate_vals(input_values_decel)[3];//[3] ->gives back distance from vals_array
    if (stop_chainages[dwell_count]){
        let const_distance = stop_chainages[dwell_count] - temp_decel_distance_value - distance_accumulated[distance_accumulated.length-1];
        input_values_constant['distance'] = const_distance;
    }
    else{
        console.log("no station stops!")
        if (distance_accumulated[distance_accumulated.length]){
            input_values_constant['distance'] =  end_chainage - start_chainage - distance_accumulated[distance_accumulated.length]
            console.log( input_values_constant['distance'])
        }
        else{
            input_values_constant['distance'] =  end_chainage - start_chainage;
            console.log( input_values_constant['distance'])
        }

    } 

    constant_count++; //this counts decel curves
    update_time_distance(input_values_constant);

    //local vars for formula
    let start_phase_time = time_accumulated[phase_count-1];
    let end_phase_time = time_accumulated[phase_count];
    let start_phase_distance = Math.round(distance_accumulated[phase_count-1]);

    calculator.setExpression({ color: Desmos.Colors.PURPLE, id: `${phase_count-1}const${constant_count-1}`, latex: `x = (-${linespeed}/3.6)*y + ${distance_accumulated[phase_count-1]} - (${linespeed/3.6}*${time_accumulated[phase_count-1]})\\left \\{-${start_phase_time}>=y>=-${end_phase_time} \\right \\}` });

    for (i=Math.round(start_phase_time); i< Math.round(end_phase_time); i++){
        journey_data["distance"].push((-linespeed/3.6)*(-i) + start_phase_distance - (linespeed/3.6*start_phase_time)); //x=0.5*(0.69)*(y+0)^{2}+7000
        journey_data["time"].push(i);
        journey_data["accel_rate"].push(0);
    }
    console.log(start_phase_time)
    console.log(end_phase_time)
    console.log(`const phase ran for ${i-Math.round(start_phase_time)} seconds`)

}

function run_accel_phase(){
    accel_count++; //this counts decel curves
    update_time_distance(input_values_accel);

    //local vars for formula
    let start_phase_time = Math.round(time_accumulated[phase_count-1]);
    let end_phase_time = Math.round(time_accumulated[phase_count]);
    let start_phase_distance = Math.round(distance_accumulated[phase_count-1]);

    calculator.setExpression({ color: Desmos.Colors.GREEN, id: `${phase_count-1}accel${accel_count-1}`, latex: `x = 0.5*(${accel_rate})*(y+${start_phase_time})^2 + ${distance_accumulated[phase_count-1]} \\left \\{-${start_phase_time}>=y>=-${end_phase_time} \\right \\}` });
    //add this phase to journey_data
    for (i=start_phase_time; i<end_phase_time; i++){
        journey_data["distance"].push(0.5*accel_rate*((-i)+start_phase_time)**2 + start_phase_distance) //x=0.5*(0.69)*(y+0)^{2}+7000
        journey_data["time"].push(i);
        journey_data["accel_rate"].push(accel_rate);
    }
    console.log(`accel phase ran for ${i-start_phase_time} seconds`)
}
function run_dwell_phase(){
    dwell_count++; //this counts decel curves
    update_time_distance(dwell_phase)

    //local vars for formula
    let start_phase_time = Math.round(time_accumulated[phase_count-1]);
    let end_phase_time = Math.round(time_accumulated[phase_count]);
    let start_phase_distance = Math.round(distance_accumulated[phase_count-1]);

    calculator.setExpression({ color: Desmos.Colors.BLUE, id: `${phase_count-1}dwell${dwell_count-1}`, latex: `x = ${start_phase_distance}\\left \\{-${start_phase_time}>=y>=-${end_phase_time} \\right \\}` });

    for (i=start_phase_time; i<end_phase_time; i++){
        journey_data["distance"].push(0.5*accel_rate*((-i)+start_phase_time)**2 + start_phase_distance) //x=0.5*(0.69)*(y+0)^{2}+7000
        journey_data["time"].push(i);
        journey_data["accel_rate"].push(accel_rate);
    }

}

// run_decel_phase();
// run_dwell_phase();
// run_accel_phase();
// run_constant_phase();
// run_decel_phase();
// run_dwell_phase();
// run_accel_phase();
// run_constant_phase();
// run_decel_phase();
// run_dwell_phase();

function determine_phases(){
    if (stop_chainages.length === 0){
        if (starting_phase === 'accel'){
            run_accel_phase();
            run_constant_phase();
        }
        // if (starting_phase === 'constant'){
        //     run_constant_phase();
        // }
    }
    //1 station stop
    if (stop_chainages.length === 1){
        if (starting_phase === 'accel'){
            run_accel_phase();
            run_constant_phase();
            run_decel_phase();
        }
        // if (starting_phase === 'constant'){
        //     run_constant_phase();
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        // }
        // if (starting_phase === 'decel'){
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        // }
    }
    if (stop_chainages.length === 2){
        if (starting_phase === 'accel'){
            run_accel_phase();
            run_constant_phase();
            run_decel_phase();
            run_dwell_phase();
            run_accel_phase();
            run_constant_phase();
            run_decel_phase();
        }
        // if (starting_phase === 'constant'){
        //     run_constant_phase();
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        // }
        // if (starting_phase === 'decel'){
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        // }
    }
    if (stop_chainages.length === 3){
        if (starting_phase === 'accel'){
            run_accel_phase();
            run_constant_phase();
            run_decel_phase();
            run_dwell_phase();
            run_accel_phase();
            run_constant_phase();
            run_decel_phase();
            run_dwell_phase();
            run_accel_phase();
            run_constant_phase();
            run_decel_phase();
        }
    
        // if (starting_phase === 'constant'){
        //     run_constant_phase();
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        //     run_constant_phase();
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        // }
        // if (starting_phase === 'decel'){
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        //     run_decel_phase();
        //     run_dwell_phase();
        //     run_accel_phase();
        //     run_constant_phase();
        // }
    }
    if (stop_chainages.length === 4){
        if (starting_phase === 'accel'){
            run_accel_phase();
            run_constant_phase();
            run_decel_phase();
            run_dwell_phase();
            run_accel_phase();
            run_constant_phase();
            run_decel_phase();
            run_dwell_phase();
            run_accel_phase();
            run_constant_phase();
            run_decel_phase();
            run_dwell_phase();
            run_accel_phase();
            run_constant_phase();
            run_decel_phase();
        }
    }

    // if (distance_to_first_station < decel){
    //     decel from appropriate distance
    // }
    // if (distance_to_first_station > decel){
    //     constant + decel phase
    // }
    // if (distance is > accel + decel){
    //     accel_constant_decel
    // }
    // if (user input speed < decel distance){
    //     //error - the train cannot stop at this station from this speed
    // }
}




// //this makes home button restore to this view.
// var newDefaultState = calculator.getState();
// calculator.setDefaultState(newDefaultState);
// Desmos.LabelOrientations.RIGHT;
// Desmos.LabelOrientations.BELOW;

//we have an object that needs updating in order to graph in desmos and save data!
function update_input_vars(){
    let i =0; 
    //update station arrays in object!
    for (i=0; i<station_count; i++){
        console.log("function ruinning")
        input_vars["station_chainages"][i] = parseFloat(document.getElementById(`station_chainage${i}`).value);
        console.log(input_vars[`station_chainages`][i]);
        input_vars["station_names"][i] = document.getElementById(`station_name${i}`).value;
    }
    for (i=0; i<signal_overlap_count; i++){
        input_vars["signal_chainages"][i] = parseFloat(document.getElementById(`signal_chainage${i}`).value);
        input_vars["overlap_chainages"][i] = parseFloat(document.getElementById(`overlap_chainage${i}`).value);
        input_vars["signal_names"][i] = document.getElementById(`signal_name${i}`).value;
    }
    for (i=0; i<grad_input_count; i++){
        input_vars["grad"][i] = parseFloat(document.getElementById(`grad${i}`).value);
        input_vars["grad_chainages"][i] = parseFloat(document.getElementById(`grad_chainage${i}`).value);
    }
    for (i=0; i<speed_restriction_count; i++){
        input_vars["speed_restrictions"][i] = parseFloat(document.getElementById(`speed${i}`).value);
        input_vars["speed_restriction_chainages"][i] = parseFloat(document.getElementById(`speed_chainage${i}`).value);
    }
    if(document.getElementById("linespeed").value != ""){
        input_vars["linespeed"] = parseFloat(document.getElementById("linespeed").value);
    }
    if(document.getElementById("start_chainage").value != ""){
        input_vars["start_chainage"] = parseFloat(document.getElementById("start_chainage").value);
    }
    if(document.getElementById("end_chainage").value != ""){
        input_vars["end_chainage"] = parseFloat(document.getElementById("end_chainage").value);
    }
    console.log(input_vars);
}


//INPUT TABLE UI

function add_station_stop(){
    let table_div = document.createElement("tr");
    table_div.classList.add('container');
    i=station_count;
    for (j=0;j<2;j++){
        table_div.innerHTML =  `<td id="tinr${i}c${j}" class="spec">
            <input type="text" id="station_name${i}" class="inputs form-control" placeholder="Station Name"><br><br>
            </td>
            <td id="tinr${i}c${j}" >
            <input type="number" id="station_chainage${i}" class="inputs form-control" placeholder="Station Chainage (front of train stops here)(m)"><br><br>
            </td>`
            document.getElementById("t0stations").appendChild(table_div);
    }
    station_count++;
}

// let signal_overlap_count = 0;
function add_signal_overlap(){
    let table_div = document.createElement("tr");
    table_div.classList.add('container');
    i=signal_overlap_count;
    for (j=0;j<2;j++){
        table_div.innerHTML =  `<td id="inr${i}c${j}" class="spec">
            <input type="text" id="signal_name${i}" class="inputs form-control" placeholder="Name" onChange="graph_signal(); update_input_vars()"><br><br>
            </td>
            <td id="inr${i}c${j}" >
            <input type="number" id="signal_chainage${i}" class="inputs form-control" onChange="graph_signal(); update_input_vars()" placeholder="(m)" ><br><br>
            </td>
            <td>
            <input type="number" id="overlap_chainage${i}" class="inputs form-control" onChange="graph_signal(); update_input_vars()" placeholder="(m)" ><br><br>
            </td>
            <td>
            <input type="radio" id="plt_start_y${i}" name="plt_start${i}" value="plt_start" >
            <label for="plt_start">Yes</label><br>
            <input type="radio" id="plt_start${i}" name="plt_start${i}" value="plt_start onChange="graph_signal(); update_input_vars()" checked >
            <label for="plt_start_n${i}">No</label><br>
            </td>`
            document.getElementById("t0signal/overlap").appendChild(table_div);
    }
    signal_overlap_count++;
}


function add_gradient(){
    let table_div = document.createElement("tr");
    table_div.classList.add('container');
    i=grad_input_count;
    for (j=0;j<2;j++){
        table_div.innerHTML =  `
            <td id="t_gradinr${i}c${j}" >
                <input type="number" id="grad_chainage${i}" class="inputs form-control" placeholder="Gradient Chainage (m)"><br><br>
            </td>
            <td id="t_gradinr${i}c${j}" class="spec">
                <input type="number" id="grad${i}" class="inputs form-control" placeholder="gradient"><br><br>
            </td>
            <td id="t_grad_unitsinr${i}c${j}" class="spec">
                <input type="radio" id="grad_ratio${i}" name="grad_in${i}" value="grad_rat">
                <label for="grad_rat${i}">ratio</label><br>
                <input type="radio" id="grad_%${i}" name="grad_in${i}" value="grad_%" checked>
                <label for="grad${i}">%</label><br>
            </td>`
            document.getElementById("t0_grad_inputs").appendChild(table_div);
    }
    grad_input_count++;
}


function add_speed_restriction(){
    let table_div = document.createElement("tr");
    table_div.classList.add('container');
    i=speed_restriction_count;
    for (j=0;j<2;j++){
        table_div.innerHTML =  `
            <td id="t_speedinr${i}c${j}" >
                <input type="number" id="speed_chainage${i}" class="inputs form-control" placeholder="Chainage (m)"><br><br>
            </td>
            <td id="t_speed${i}c${j}" class="spec">
                <input type="number" id="speed${i}" class="inputs form-control" placeholder="speed"><br><br>
            </td>`
            document.getElementById("t0speed_restrictions").appendChild(table_div);
    }
    speed_restriction_count++;
}

//this function resets stop chainages to new values
// function get_stop_chainages(){
//     stop_chainages = []
//     for (let i=0; i<station_count; i++){
//         stop_chainages.push(document.getElementById(`station_chainage${i}`).value);
//         // signals_object[current_station_name] = `station_chainage${i}`
//         console.log(stop_chainages)

//     }
// }


function graph_stations(){
    for (let i=0; i<station_count; i++){
        let current_station_name = document.getElementById(`station_name${i}`).value;
        let current_station_chainage = document.getElementById(`station_chainage${i}`).value;
        // signals_object[current_station_name] = `station_chainage${i}`
        
        console.log(`signal name = ${current_station_name}`)
        console.log(`signal name = ${current_station_chainage}`)
        calculator.setExpression({id:`Station${current_station_name}`, latex: `x = ${current_station_chainage}\\left \\{${0}>=y>=-${total_time} \\right \\}`, lineStyle: Desmos.Styles.DASHED, color: '#000000'}); //color black
        calculator.setExpression({ color: Desmos.Colors.BLACK, id: `${current_station_name}`, latex: `(${current_station_chainage},10)`, showLabel:true, label: `${current_station_name}` });
    }
    return;
}





function graph_signal(){
// let signals_object = [];
for (let i=0; i<signal_overlap_count; i++){
    let current_signal_name = document.getElementById(`signal_name${i}`).value;
    let current_signal_chainage = document.getElementById(`signal_chainage${i}`).value;
    // signals_object[current_signal_name] = `signal_chainage${i}`
    calculator.setExpression({ color: Desmos.Colors.BLACK, id: `${current_signal_name}`, latex: `(${current_signal_chainage},-10)`, showLabel:true, label: `|--0 ${current_signal_name}` });
    console.log(`signal name = ${current_signal_name}`)
    console.log(`signal name = ${current_signal_chainage}`)
}
return;
}





// /* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
// function responsive_navbar() {
//     var x = document.getElementById("myTopnav");
//     if (x.className === "topnav") {
//       x.className += " responsive";
//     } else {
//       x.className = "topnav";
//     }
//   }


  //this is the train select menu.
  function train_select(){
    let EMU = document.getElementById("EMU_train_type").checked;
    let Vlocity = document.getElementById("Vlocity_train_type").checked;
    if (EMU.checked){
        train_type = EMU
    }
    if (Vlocity.checked){
        train_type = Vlocity
    }
}




function run_initial(){
    // sets up domain and range of default graph
    calculator.setMathBounds({
        left: start_chainage-10,
        right: end_chainage+100,
        bottom: -total_time,
        top: 20
        });
        //the following two lines set the zoom to the current state!
        let newDefaultState = calculator.getState();
        calculator.setDefaultState(newDefaultState);
    determine_phases();
    call_count++;
}

function journey_data_to_csv(){
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "TIME" + "\r\n";
    journey_data["time"].forEach(function(item) {
        let row = item;
        csvContent += row + "\r\n";
    });
    csvContent += "DISTANCE" + "\r\n";
    csvContent += "\r\n";//put blank line
    journey_data["distance"].forEach(function(item) {
        let row = item;
        csvContent += row + "\r\n";
    });
    csvContent += "ACCEL_RATE" + "\r\n";
    csvContent += "\r\n";//put blank line
    journey_data["accel_rate"].forEach(function(item) {
        let row = item;
        csvContent += row + "\r\n";
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "my_data.csv".
}






function main(){
    //this runs the initial example
    if (call_count === 0){
        calculator.setMathBounds({
        left: start_chainage-10,
        right: end_chainage+100,
        bottom: -total_time,
        top: 20
        });
        run_initial()
    }
    //this runs the actual calculations
    else{
        update_input_vars();
        linespeed = 80 //km/h
        decel = -0.71
        start_chainage = input_vars["start_chainage"];
        end_chainage = input_vars["end_chainage"];
        stop_chainages = input_vars["station_chainages"]; //m 

        //this data will keep a log of every second of the journey, it will then be able to help with headways and output journey to a csv file!
        journey_data = {
        time: [],
        distance: [],
        accel_rate: []
        }

        ////THESE SHOULD ONLY BE INITIALISED ONCE!
        //initialise more counters for adding HTML input elements
        // grad_input_count = 0; //initialises counting the input gradient values
        // signal_overlap_count = 0;
        // station_count = 0;
        // speed_restriction_count = 0; //initialise the number of restrictions


        // train_type = [];
        calculator.setBlank();
        //need to reininitialise all variables!
        // total_time = (end_chainage-start_chainage)*linespeed/3.6/3; //this should be estimated by the program but for now its ok for user input.
        accel_rate = 0.69 //m/s/s
        starting_phase = 'accel' //this was originally set to decel but is now at accel, i think it should always be at accel.
        phase_count = 0;
        decel_count = 0;
        accel_count = 0;
        dwell_count = 0;
        constant_count = 0;
        train_type = [];
          //lists accumulated time for each phase
        time_accumulated = [0]
        distance_accumulated = [start_chainage]
    
        calculator.setMathBounds({
            left: start_chainage-10,
            right: end_chainage+100,
            bottom: -total_time,
            top: 20
          });      
    
        // get_stop_chainages();
        // map_station_stops(stop_chainages); 
        determine_phases();
        let newDefaultState = calculator.getState();
        calculator.setDefaultState(newDefaultState);
    }
}
