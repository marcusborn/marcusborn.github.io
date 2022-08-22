const new_calc = document.getElementById("new_calc")
new_calc.addEventListener("click",add_calc)



function add_calc(){
    let target = document.getElementById("button")
    target.innerHTML += `<iframe width="398" height="370" frameborder="0" scrolling="no" style="border: 3px solid black;" src="https://onedrive.live.com/embed?resid=D5924C979FE07DF3%21109&authkey=%21ACpxikMBixqIP28&em=2&wdAllowInteractivity=False&AllowTyping=True&ActiveCell='Sheet2'!B4&Item=Grad_cal&wdInConfigurator=True&wdInConfigurator=True&edesNext=false&ejss=false"></iframe>`
    console.log('clicked')
    return
}