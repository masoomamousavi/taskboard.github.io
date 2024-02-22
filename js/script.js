const addButtons = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addContainer = document.querySelectorAll(".add-container");
const addItem = document.querySelectorAll(".add-item");


// Item lists
const listColumns = document.querySelectorAll(".drag-items");
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById("complete-list");
const holdList = document.getElementById("hold-list");
let update = false;

// List of Arrays
let arrayList = [];
let backlogArray = [];
let progressArray = [];
let completeArray = [];
let holdArray = [];

// drag
let dragged;
let currentCloumn;
let dragItem = false;

function getInfo() {
    if (localStorage.getItem('backlogItems')) {
        backlogArray = JSON.parse(localStorage.backlogItems);
        progressArray = JSON.parse(localStorage.progressItems);
        completeArray = JSON.parse(localStorage.completeItems);
        holdArray = JSON.parse(localStorage.holdItems);
    } else {
        backlogArray = ['Get relax', 'sleep'];
        progressArray = ["go to course", 'study French'];
        completeArray = ['socialize with friends', 'stay cool'];
        holdArray = ['being uncool'];
    }
}

function updateInfo() {
    arrayList = [backlogArray, progressArray, completeArray, holdArray];
    const arrayNames = ['backlog', 'progress', 'complete', 'hold'];
    arrayNames.forEach((arrayName, index) => {
        localStorage.setItem(`${arrayName}Items`, JSON.stringify(arrayList[index]));
    });
}

// filtering array to remove empty boxes
function filterArray(array) {
    const filtered = array.filter(item => item !== null);
    return filtered;
}
// Creat DOM Elements 
function creatElements(columnElement, column, item, index) {
    // creat list item
    let listElement = document.createElement('li');
    listElement.textContent = item;
    listElement.id = index;
    listElement.classList.add("drag-item");
    listElement.draggable = true;
    columnElement.appendChild(listElement);
    listElement.setAttribute('onfocusout', `updateItem(${index},${column})`);
    listElement.setAttribute('ondragstart', 'drag(event)');
    listElement.contentEditable = true;
    // append
    columnElement.appendChild(listElement);
}

function updateDom() {
    if (!update) {
        getInfo();
    };
    // backlog items
    backlogList.textContent = '';
    backlogArray.forEach((BacklogItem, index) => {
        creatElements(backlogList, 0, BacklogItem, index);
    })
    backlogArray = filterArray(backlogArray);
    // progress items
    progressList.textContent = '';
    progressArray.forEach((progressItem, index) => {
        creatElements(progressList, 1, progressItem, index);
    })
    progressArray = filterArray(progressArray);
    // complete items
    completeList.textContent = '';
    completeArray.forEach((completeItem, index) => {
        creatElements(completeList, 2, completeItem, index);
    })
    completeArray = filterArray(completeArray);
    // hold items
    holdList.textContent = '';
    holdArray.forEach((holdItem, index) => {
        creatElements(holdList, 3, holdItem, index);
    })
    holdArray = filterArray(holdArray);
    // run once and update local storage
    update = true;
    updateInfo();
}

// update Item
function updateItem(id, column) {
    const selectedArray = arrayList[column];
    selecteColumn = listColumns[column].children;
    if (dragItem === false) {
        if (!selecteColumn[id].textContent) {
            delete selectedArray[id];
        } else {
            selectedArray[id] = selecteColumn[id].textContent
        }
        updateDom();
    }
}



// add item
function addToColumn(column) {
    const itemText = addItem[column].textContent;
    const selectedArray = arrayList[column];
    if (itemText !== '') {
        selectedArray.push(itemText);
    }
    addItem[column].textContent = '';
    updateDom(column);
}

// show Input
function showBox(column) {
    addButtons[column].style.visibility = "hidden";
    saveItemBtns[column].style.display = 'flex';
    addContainer[column].style.display = 'flex';
}

// // hide Input
function hideBox(column) {
    addButtons[column].style.visibility = "visible";
    saveItemBtns[column].style.display = 'none';
    addContainer[column].style.display = 'none';
    addToColumn(column);
}


// // rebuild arrays
function rebuild() {
    backlogArray = [];
    for (let i = 0; i < backlogList.children.length; i++) {
        backlogArray.push(backlogList.children[i].textContent);
    }
    progressArray = [];
    for (let i = 0; i < progressList.children.length; i++) {
        progressArray.push(progressList.children[i].textContent);
    }
    completeArray = [];
    for (let i = 0; i < completeList.children.length; i++) {
        completeArray.push(completeList.children[i].textContent);
    }
    holdArray = [];
    for (let i = 0; i < holdList.children.length; i++) {
        holdArray.push(holdList.children[i].textContent);
    }
    updateDom();
}

function dragEnter(column) {
    // console.log("my drag", listColumns[column]);
    listColumns[column].classList.add("over");
    currentCloumn = column;
}

// drag function
function drag(event) {
    dragged = event.target;
    dragItem = true;
}

// Allow ro drop 
function allowDrop(e) {
    e.preventDefault();
}



// dropping
function drop(e) {
    e.preventDefault();
    const parent = listColumns[currentCloumn];
    // remove background
    listColumns.forEach((column) => {
        column.classList.remove("over")
    })

    parent.appendChild(dragged);
    dragItem = false;
    rebuild()
}


updateDom();


