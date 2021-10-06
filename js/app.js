//hidden the texbox area default
document.getElementById("displaytextbox").style.visibility = "hidden";

// create the elements
const clear = document.querySelector(".clear");
const DateElemet = document.getElementById("date");
const list = document.getElementById("list");
const UserWork = document.getElementById("input_text");

//get the css classes names and assign variables to later use
const CheckClass = "fa-check-circle";
const UncheckClass = "fa-circle-thin";
const LineThrough = "lineThrough";

//set the date format options
const options = {weekday : "long", month : "short", day : "numeric"};
const Today = new Date();

DateElemet.innerHTML = Today.toLocaleDateString("en-us", options);

//display add-to-do textbox when user click add-to-do button
function DisplayAddToDo()
{
    document.getElementById("displaytextbox").style.visibility = "visible";
}

//relod the page and cancle add-to-do
//when user click cancle button
function cleartextbox()
{
    location.reload();
}

//create add-to-do function
function addToDo(toDo,id,done,trash)
{
    //check the trash is true then return and not execute the below code
    if(trash){ return; }

    const WorkDone = done ? CheckClass:UncheckClass;
    const LINE_THROUGH = done ? LineThrough:"";

    const item = `
            <li class="item">
                <i class="fa ${WorkDone} co" job="complete" id=${id}></i>
                <p class="text ${LINE_THROUGH}">${toDo}</p>
                <i class="fa fa-trash-o de" job="delete" id=${id}><font size=4 style="margin-left: 5px;">Delete</font></i>
            </li>
    `;

    const position = "beforeend";

    list.insertAdjacentHTML(position, item);
}

//create list variable
let LIST;
let id = 0;

// clear the list when user click clear list button
clear.addEventListener("click", function(event){
    localStorage.clear();
    location.reload();
})

//get the past inserted data from localstorage
let data = localStorage.getItem("TODO");

//check if data exist in the variable
if(data)
{
    LIST = JSON.parse(data);
    id = LIST.length; // this set id value to last element index in the LIST

    loadList(LIST);
}
else
{
    //otherwise list have to empty and id have to equal 0
    LIST = [];
    id = 0;
}

//create method for display LIST elements in the LIST when user open the web page
function loadList(array)
{
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

//get the user input from the textbox
function GetTheUserInput()
{
    const UserToDo = UserWork.value;

    if(UserToDo)
    {
        addToDo(UserToDo,id,false,false);

        //insert get elements details into LIST
        LIST.push({
            name : UserToDo,
            id : id,
            done : false,
            trash : false
        });
        
        //this set inserted LIST into localstorage this will store our data everytime and data does'n lose
        localStorage.setItem("TODO",JSON.stringify(LIST));

        id++;

        UserWork.value = "";
    }
}

//when user click enter key todo work must add the LIST
document.addEventListener("keyup", function(event){
    if(event.keyCode == 13)             //13 is KeyCode of "enter key"
    {
        GetTheUserInput();
    }
})

//when user click complete button
function CompleteToDoWork(element)
{
    //i use toggle class for check the CheckClass is exist in the element and then execute UncheckClass and vise versa
    element.classList.toggle(CheckClass);
    element.classList.toggle(UncheckClass);

    element.parentNode.querySelector(".text").classList.toggle(LineThrough);

    //in the element index we have to update "done" value
    LIST[element.id].done = LIST[element.id].done ? false: true;
}

//remove UserWork From the todo_list
function RemoveToDoWorkFromtheList(element)
{
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
}

//get the user click work dinamically
list.addEventListener("click", function(event){
    const GetElement = event.target; // this return clicked item in the list
    const GetElementJob = GetElement.attributes.job.value; // this return element complete or delete

    if(GetElementJob == "complete")
    {
        CompleteToDoWork(GetElement);
    }
    else if(GetElementJob == "delete")
    {
        RemoveToDoWorkFromtheList(GetElement);
    }

    //insert into localstorage updated LIST
    localStorage.setItem("TODO",JSON.stringify(LIST));
})