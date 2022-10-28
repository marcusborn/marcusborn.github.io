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
let train_type = [];
let starting_phase = 'accel' //this was originally set to decel but is now at accel, i think it should always be at accel.

//initialise all coutners
let phase_count = 0;
let decel_count = 0;
let accel_count = 0;
let dwell_count = 0;
let constant_count = 0;


EMU = {
    accel: 0.69,
    decel: -0.71,
    emerg_decel: -0.81,
    length: 150
}

train_type = EMU;

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
calculator.setMathBounds({
    left: start_chainage-10,
    right: end_chainage+100,
    bottom: -total_time,
    top: 1
  });

  //lists accumulated time for each phase
  let time_accumulated = [0]
  let distance_accumulated = [start_chainage]

  function update_time_distance(input_values){
    time_accumulated.push(calculate_vals(input_values)[2] + time_accumulated[time_accumulated.length-1])
    //verify that this does not go ever end_chainage.
    if (calculate_vals(input_values)[3] + distance_accumulated[distance_accumulated.length-1] < end_chainage){
        distance_accumulated.push(calculate_vals(input_values)[3] + distance_accumulated[distance_accumulated.length-1]);
    }
    // else {
    //     distance_accumulated.push(distance_accumulated[distance_accumulated.length-1])
    // }
    phase_count++;
  }


function map_station_stops(stop_chainages){
    for (const stop of stop_chainages){
        calculator.setExpression({id:`Station${stop_chainages.indexOf(stop)}`, latex: `x = ${stop}\\left \\{${0}>=y>=-${total_time} \\right \\}`, lineStyle: Desmos.Styles.DASHED, color: '#000000'}); //color black
    }
    return;
}


function run_decel_phase(){
    decel_count++; //this counts decel curves
    update_time_distance(input_values_decel);
    calculator.setExpression({ color: Desmos.Colors.RED, id: `${phase_count-1}decel${decel_count-1}`, latex: `x = -(${linespeed}/3.6)y + 0.5(${decel})(y+${time_accumulated[phase_count-1]})^2 + ${distance_accumulated[phase_count-1]}-((${linespeed}/3.6)*${time_accumulated[phase_count-1]})\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });
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
    calculator.setExpression({ color: Desmos.Colors.PURPLE, id: `${phase_count-1}const${constant_count-1}`, latex: `x = (-${linespeed}/3.6)*y + ${distance_accumulated[phase_count-1]} - (${linespeed/3.6}*${time_accumulated[phase_count-1]})\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });
}
function run_accel_phase(){
    accel_count++; //this counts decel curves
    update_time_distance(input_values_accel);
    calculator.setExpression({ color: Desmos.Colors.GREEN, id: `${phase_count-1}accel${accel_count-1}`, latex: `x = 0.5*(${accel_rate})*(y+${time_accumulated[phase_count-1]})^2 + ${distance_accumulated[phase_count-1]} \\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });
}
function run_dwell_phase(){
    dwell_count++; //this counts decel curves
    update_time_distance(dwell_phase)
    calculator.setExpression({ color: Desmos.Colors.BLUE, id: `${phase_count-1}dwell${dwell_count-1}`, latex: `x = ${stop_chainages[dwell_count-1]}\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });
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
determine_phases();

// update_time_distance(input_values_decel)
// calculator.setExpression({ id: 'decel1', latex: `x = -(${linespeed}/3.6)y + 0.5(${decel})y^2 + ${start_chainage}\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });


// console.log(time_accumulated)
// console.log(distance_accumulated)
// update_time_distance(dwell_phase)
// calculator.setExpression({ id: 'stop1', latex: `x = ${stop_chainages[0]}\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });

// console.log(time_accumulated)
// console.log(distance_accumulated)
// update_time_distance(input_values_accel)
// calculator.setExpression({ id: 'accel1', latex: `x = 0.5*(${accel_rate})*(y+${time_accumulated[phase_count-1]})^2 + ${distance_accumulated[phase_count-1]} \\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });

// //fill constant back into table

//need to do a decel calc to get distance or time to put into constant calc. this is like an unnofficial pre calculation.
// let temp_decel_distance_value = calculate_vals(input_values_decel)[3];//[3] ->gives back distance from vals_array
// let const_distance = stop_chainages[dwell_count] - temp_decel_distance_value - distance_accumulated[distance_accumulated.length-1];
// input_values_constant['distance'] = const_distance;

// update_time_distance(input_values_constant)
// console.log(time_accumulated)
// console.log(distance_accumulated)
// calculator.setExpression({ id: 'const1', latex: `x = (-${linespeed}/3.6)*y + ${distance_accumulated[phase_count-1]} - (${linespeed/3.6}*${time_accumulated[phase_count-1]})\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });

// update_time_distance(input_values_decel)
// console.log(time_accumulated)
// console.log(distance_accumulated)
// calculator.setExpression({ id: 'decel2', latex: `x = -(${linespeed}/3.6)y + 0.5(${decel})(y+${time_accumulated[phase_count-1]})^2 + ${distance_accumulated[phase_count-1]}-((${linespeed}/3.6)*${time_accumulated[phase_count-1]})\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });

// update_time_distance(dwell_phase)
// calculator.setExpression({ id: 'stop2', latex: `x = ${stop_chainages[1]}\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });


// console.log(time_accumulated)
// console.log(distance_accumulated)
// update_time_distance(input_values_accel)
// calculator.setExpression({ id: 'accel2', latex: `x = 0.5*(${accel_rate})*(y+${time_accumulated[phase_count-1]})^2 + ${distance_accumulated[phase_count-1]} \\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });



//need to do a decel calc to get distance or time to put into constant calc. this is like an unnofficial pre calculation.
// temp_decel_distance_value = calculate_vals(input_values_decel)[3];
// const_distance = stop_chainages[2] - temp_decel_distance_value - distance_accumulated[distance_accumulated.length-1];
// input_values_constant['distance'] = const_distance;
// console.log(input_values_constant['distance'])

// update_time_distance(input_values_constant)
// console.log(time_accumulated)
// console.log(distance_accumulated)
// calculator.setExpression({ id: 'const2', latex: `x = (-${linespeed}/3.6)*y + ${distance_accumulated[phase_count-1]} - (${linespeed/3.6}*${time_accumulated[phase_count-1]})\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });

// update_time_distance(input_values_decel)
// console.log(time_accumulated)
// console.log(distance_accumulated)
// calculator.setExpression({ id: 'decel3', latex: `x = -(${linespeed}/3.6)y + 0.5(${decel})(y+${time_accumulated[phase_count-1]})^2 + ${distance_accumulated[phase_count-1]}-((${linespeed}/3.6)*${time_accumulated[phase_count-1]})\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });

// update_time_distance(dwell_phase)
// calculator.setExpression({ id: 'stop3', latex: `x = ${stop_chainages[2]}\\left \\{-${time_accumulated[phase_count-1]}>=y>=-${time_accumulated[phase_count]} \\right \\}` });



//this makes home button restore to this view.
var newDefaultState = calculator.getState();
calculator.setDefaultState(newDefaultState);





//INPUT TABLE UI
let station_count = 0;
function add_station_stop(){
    let table_div = document.createElement("tr");
    table_div.classList.add('container');
    i=station_count;
    for (j=0;j<2;j++){
        table_div.innerHTML =  `<td id="tinr${i}c${j}" class="spec">
            <input type="text" id="stop_name${i}" class="inputs form-control" placeholder="Station Name"><br><br>
            </td>
            <td id="tinr${i}c${j}" >
            <input type="number" id="stop_chainage${i}" class="inputs form-control" placeholder="Station Chainage (front of train stops here)(m)"><br><br>
            </td>`
            document.getElementById("t0stations").appendChild(table_div);
            station_count++;
    }
}

let signal_overlap_count = 0;
function add_signal_overlap(){
    let table_div = document.createElement("tr");
    table_div.classList.add('container');
    i=signal_overlap_count;
    for (j=0;j<2;j++){
        table_div.innerHTML =  `<td id="inr${i}c${j}" class="spec">
            <input type="text" id="signal_name${i}" class="inputs form-control" placeholder="Name"><br><br>
            </td>
            <td id="inr${i}c${j}" >
            <input type="number" id="signal_chainage${i}" class="inputs form-control" placeholder="(m)"><br><br>
            </td>
            <td>
            <input type="number" id="overlap_chainage${i}" class="inputs form-control" placeholder="(m)"><br><br>
            </td>
            <td>
            <input type="radio" id="plt_start_y${i}" name="plt_start${i}" value="plt_start">
            <label for="plt_start">Yes</label><br>
            <input type="radio" id="plt_start${i}" name="plt_start${i}" value="plt_start" checked>
            <label for="plt_start_n${i}">No</label><br>
            </td>`
            document.getElementById("t0signal/overlap").appendChild(table_div);
            signal_overlap_count++;
    }
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
