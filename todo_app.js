let todoItemsContainer = document.getElementById("todoItemsContainer");
let addTodoButton = document.getElementById("addTodoButton");
let saveTodoButton = document.getElementById("saveTodoButton");
let spinner = document.getElementById("spinner");
let renameButton = document.getElementById("rename_save");
let renameInputEl = document.getElementById("rename_text");

function getTodoListFromLocalStorage() {
    let stringifiedTodoList = localStorage.getItem("todoList");
    let parsedTodoList = JSON.parse(stringifiedTodoList);
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getTodoListFromLocalStorage();
let todosCount = todoList.length;

let renameId = null;

saveTodoButton.onclick = function() {
    saveTodoButton.style.backgroundColor = "green";
    localStorage.setItem("todoList", JSON.stringify(todoList));
    spinner.classList.remove("spinner");
    setTimeout(function() {
        spinner.classList.add("spinner");
        saveTodoButton.style.backgroundColor = "#4c63b6";
    }, 1000);

};

renameButton.addEventListener("click", function() {
    let userEnteredNewName = renameInputEl.value;
    console.log(userEnteredNewName);
    console.log(renameId);
    let colapseBottonEl = document.getElementById("colapseBotton" + renameId);
    let subjectNameEl = document.getElementById("subjectName" + renameId);

    colapseBottonEl.textContent = userEnteredNewName;
    subjectNameEl.textContent = userEnteredNewName;
    renameInputEl.value = "";
});

function liveChanges(id) {
    for (let object of todoList) {
        if (object.uniqueNo === id) {
            let currentAttendedValue = parseInt(document.getElementById("attendedCount" + id).textContent);
            let currentMissedValue = parseInt(document.getElementById("missedCount" + id).textContent);
            let currentTotalValue = parseInt(document.getElementById("totalCount" + id).textContent);
            let currentPercentageValue = parseFloat(document.getElementById("percentageIndicator" + id).textContent);
            let currentPercentageContainerEl = document.getElementById("percentageContainer" + id).style.backgroundColor;
            let conclusionElementValue = document.getElementById("conclusionElement" + id).textContent;
            let conclusionValue = parseInt(document.getElementById("conclusionValue" + id).textContent);
            let colapseBotton = document.getElementById("colapseBotton" + id);
            object.attended = currentAttendedValue;
            object.missed = currentMissedValue;
            object.total = currentTotalValue;
            object.percentage = currentPercentageValue;
            object.conclusionText = conclusionElementValue;
            object.conclusionValue = conclusionValue;
            object.percentageContainerColor = currentPercentageContainerEl;
            object.colapseColor = colapseBotton.style.backgroundColor;

            console.log(object);
            break;
        }
    }
}

function onDeleteTodo(id) {
    let clickedMainContainerId = "colapseMainContainer" + id;
    let clickedSubContainerId = "colapseSubContainer" + id;
    let colapseMainContainer = document.getElementById(clickedMainContainerId);
    let colapseSubContainer = document.getElementById(clickedSubContainerId);
    todoItemsContainer.removeChild(colapseMainContainer);
    todoItemsContainer.removeChild(colapseSubContainer);

    let deleteElementIndex = todoList.findIndex(function(eachTodo) {
        let eachTodoId = "colapseMainContainer" + eachTodo.uniqueNo;
        if (eachTodoId === clickedMainContainerId) {
            return true;
        } else {
            return false;
        }
    });

    todoList.splice(deleteElementIndex, 1);
}

function conclusionPrediction(id) {
    let currentPercentageValue = parseFloat(document.getElementById("percentageIndicator" + id).textContent);
    let conclusionElement = document.getElementById("conclusionElement" + id);
    let conclusionValue = document.getElementById("conclusionValue" + id);
    let currentAttendedValue = parseInt(document.getElementById("attendedCount" + id).textContent);
    let currentTotalValue = parseInt(document.getElementById("totalCount" + id).textContent);
    if (currentPercentageValue < 75) {
        let ans = (3 * currentTotalValue) - (4 * currentAttendedValue);
        conclusionElement.textContent = "Must GO :";
        conclusionValue.textContent = ans;
        console.log(ans);
    } else if (currentPercentageValue > 75) {
        let ans = (4 * currentAttendedValue) - (3 * currentTotalValue);
        ans = Math.floor(ans / 3);
        conclusionElement.textContent = "Can Skip :";
        conclusionValue.textContent = ans;
        console.log(ans);
    } else {
        conclusionElement.textContent = "";
        conclusionValue.textContent = "";
    }

}

function percentageCalculator(id) {
    let valueTotal = parseInt(document.getElementById("totalCount" + id).textContent);
    let valueAttended = parseInt(document.getElementById("attendedCount" + id).textContent);
    let percentageEl = document.getElementById("percentageIndicator" + id);
    let percentageContainerEl = document.getElementById("percentageContainer" + id);
    let colapseBotton = document.getElementById("colapseBotton" + id);
    // console.log(valueAttended + valueTotal);
    if (valueTotal === 0) {
        percentageEl.textContent = 0 + "%";
    } else {
        let fraction = valueAttended / valueTotal;
        let newPercentage = fraction * 100;
        let reducedNumber = newPercentage.toFixed(1);
        percentageEl.textContent = reducedNumber + "%";
        if (reducedNumber > 75) {
            percentageContainerEl.style.backgroundColor = "#b8f590";
            colapseBotton.style.backgroundColor = "#b8f590";
        } else if (reducedNumber < 75) {
            percentageContainerEl.style.backgroundColor = "#f58c8c";
            colapseBotton.style.backgroundColor = "#f58c8c";
        } else {
            percentageContainerEl.style.backgroundColor = "#eef7ad";
            colapseBotton.style.backgroundColor = "#eef7ad";
        }
        // console.log(reducedNumber);
    }
    conclusionPrediction(id);
    liveChanges(id);
}

function onIncrement(id, nameId) {
    // let clickedTodoId = "todo" + id;
    let totalCountElement = document.getElementById("totalCount" + id);
    let totalCountElementExisitingValue = parseInt(totalCountElement.textContent);
    if (nameId === "attendedIncrement" + id) {
        let attendedExistingValueId = "attendedCount" + id;
        let attendedExistingValue = parseInt(document.getElementById(attendedExistingValueId).textContent);
        // console.log(attendedExistingValue);
        let AttendedNewValue = attendedExistingValue + 1;
        let totalCountElementUpdatedValue = totalCountElementExisitingValue + 1;
        document.getElementById(attendedExistingValueId).textContent = AttendedNewValue;
        totalCountElement.textContent = totalCountElementUpdatedValue;
    } else if (nameId === "missedIncrement" + id) {
        let MissedExistingValueId = "missedCount" + id;
        let MissedExistingValue = parseInt(document.getElementById(MissedExistingValueId).textContent);
        // console.log(typeof(MissedExistingValue));
        let MissedNewValue = MissedExistingValue + 1;
        let totalCountElementUpdatedValue = totalCountElementExisitingValue + 1;
        totalCountElement.textContent = totalCountElementUpdatedValue;
        document.getElementById(MissedExistingValueId).textContent = MissedNewValue;
    }
    percentageCalculator(id);
    // totalValueUpdate(id);




}

function onDecrement(id, nameId) {
    let totalCountElement = document.getElementById("totalCount" + id);
    let totalCountElementExisitingValue = parseInt(totalCountElement.textContent);
    if (nameId === "attendedDecrement" + id) {
        let existingValueId = "attendedCount" + id;
        let existingValue = parseInt(document.getElementById(existingValueId).textContent);
        // console.log(existingValue);
        if (existingValue > 0) {
            let newValue = existingValue - 1;
            document.getElementById(existingValueId).textContent = newValue;
            let totalCountElementUpdatedValue = totalCountElementExisitingValue - 1;
            totalCountElement.textContent = totalCountElementUpdatedValue;
        } else if (existingValue <= 0) {
            let newValue = 0;
            document.getElementById(existingValueId).textContent = newValue;
        }
    } else if (nameId === "missedDecrement" + id) {
        let existingValueId = "missedCount" + id;
        let existingValue = parseInt(document.getElementById(existingValueId).textContent);
        // console.log(typeof(existingValue));
        if (existingValue > 0) {
            let newValue = existingValue - 1;
            document.getElementById(existingValueId).textContent = newValue;
            let totalCountElementUpdatedValue = totalCountElementExisitingValue - 1;
            totalCountElement.textContent = totalCountElementUpdatedValue;
        } else {
            document.getElementById(existingValueId).textContent = "0";
        }

    }
    // let presentAttendedValue=parseInt(document.getElementById("attendedCount"+id));
    // let presentMissedValue=parseInt(document.getElementById("missedCount"+id));
    // totalValueUpdate(presentAttendedValue,presentMissedValue,id);
    percentageCalculator(id);
}

function createAndAppendTodo(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let thisUniqueNo = todo.uniqueNo;

    let subjectNameId = "subjectName" + todo.uniqueNo;

    let attendedCount = "attendedCount" + todo.uniqueNo;
    let attendedIncrement = "attendedIncrement" + todo.uniqueNo;
    let attendedDecrement = "attendedDecrement" + todo.uniqueNo;

    let missedCount = "missedCount" + todo.uniqueNo;
    let missedIncrement = "missedIncrement" + todo.uniqueNo;
    let missedDecrement = "missedDecrement" + todo.uniqueNo;

    let totalCount = "totalCount" + todo.uniqueNo;
    let percentageIndicator = "percentageIndicator" + todo.uniqueNo;
    let percentageContainerElement = "percentageContainer" + todo.uniqueNo;

    let conclusionElementId = "conclusionElement" + todo.uniqueNo;
    let conclusionValueId = "conclusionValue" + todo.uniqueNo;

    let colapseMainContainerId = "colapseMainContainer" + todo.uniqueNo;
    let colapseBottonId = "colapseBotton" + todo.uniqueNo;
    let colapseSubContainerId = "colapseSubContainer" + todo.uniqueNo;

    let dropdownContainerId = "dropdownContainer" + todo.uniqueNo;
    let dropdownBottonId = "dropdownBottonId" + todo.uniqueNo;
    let dropdownUlId = "dropdownUl" + todo.uniqueNo;
    let dropdownEditId = "dropdownEdit" + todo.uniqueNo;
    let dropdownResetId = "dropdownReset" + todo.uniqueNo;
    let dropdownDeleteId = "dropdownDelete" + todo.uniqueNo;
    // =======================================================================================================================================

    let colapseMainContainer = document.createElement("div");
    colapseMainContainer.id = colapseMainContainerId;
    colapseMainContainer.classList.add("row", "colapse-btn-container", "ml-1", "mt-4");
    todoItemsContainer.appendChild(colapseMainContainer);

    let colapseBotton = document.createElement("button");
    colapseBotton.classList.add("btn", "colapse-button", "text-left");
    colapseBotton.setAttribute("data-toggle", "collapse");
    colapseBotton.id = colapseBottonId;
    let hashedId = ("#" + colapseSubContainerId)
    // console.log(hashedId);
    colapseBotton.setAttribute("data-target", hashedId);
    colapseBotton.setAttribute("aria-expanded", "false");
    colapseBotton.setAttribute("aria-controls", colapseSubContainerId);
    colapseBotton.textContent = todo.text;
    colapseBotton.style.backgroundColor = todo.colapseColor;
    colapseMainContainer.appendChild(colapseBotton);

    let dropdownContainer = document.createElement("div");
    dropdownContainer.classList.add("dropstart", "ml-1");
    colapseMainContainer.appendChild(dropdownContainer);

    let dropdownBotton = document.createElement("button");
    dropdownBotton.classList.add("btn", "dropdown-toggle");
    dropdownBotton.type = "button";
    dropdownBotton.setAttribute("data-toggle", "dropdown");
    dropdownBotton.setAttribute("aria-expanded", "false");
    dropdownContainer.appendChild(dropdownBotton);

    let dropdownUl = document.createElement("ul");
    dropdownUl.classList.add("dropdown-menu");
    dropdownContainer.appendChild(dropdownUl);

    let editListEl = document.createElement("li");
    dropdownUl.appendChild(editListEl);

    let dropdownEdit = document.createElement("button");
    dropdownEdit.classList.add("dropdown-item");
    dropdownEdit.href = "#";
    dropdownEdit.textContent = "Rename";
    dropdownEdit.id = dropdownEditId;
    dropdownEdit.type = "button";
    dropdownEdit.setAttribute("data-toggle", "modal");
    dropdownEdit.setAttribute("data-target", "#exampleModal");
    editListEl.appendChild(dropdownEdit);

    dropdownEdit.onclick = function() {
        renameId = todo.uniqueNo;
        // console.log(renameId);        
    };

    let resetListEl = document.createElement("li");
    dropdownUl.appendChild(resetListEl);

    let dropdownReset = document.createElement("button");
    dropdownReset.classList.add("dropdown-item");
    dropdownReset.href = "#";
    dropdownReset.textContent = "Reset";
    dropdownReset.id = dropdownResetId;
    dropdownReset.type = "button";
    dropdownReset.setAttribute("data-toggle", "modal");
    dropdownReset.setAttribute("data-target", "#exampleModal");
    resetListEl.appendChild(dropdownReset);

    let deleteListEl = document.createElement("li");
    dropdownUl.appendChild(deleteListEl);

    let dropdownDelete = document.createElement("button");
    dropdownDelete.classList.add("dropdown-item");
    dropdownDelete.href = "#";
    dropdownDelete.textContent = "Delete";
    dropdownDelete.id = dropdownDeleteId;
    deleteListEl.appendChild(dropdownDelete);

    let colapseSubContainer = document.createElement("div");
    colapseSubContainer.classList.add("collapse");
    colapseSubContainer.id = colapseSubContainerId;
    todoItemsContainer.appendChild(colapseSubContainer);

    // _________________________________________________________________________________________________________________________________________
    // li classList.add("todo-item-container", "d-flex flex-column")
    let todoElement = document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-column");
    todoElement.id = todoId;
    colapseSubContainer.appendChild(todoElement);

    // main Div classList.add("d-flex","flex-row") and append to listElemnt
    let mainDivContainer = document.createElement("div");
    mainDivContainer.classList.add("d-flex", "flex-row", "main-container");
    todoElement.appendChild(mainDivContainer);

    // delete icon div classList.add("delete-icon-container", "d-flex flex-column", "justify-content-center") and append to mainDivContainer
    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container", "d-flex", "flex-column", "justify-content-center");
    mainDivContainer.appendChild(deleteIconContainer);

    // delete Icon 
    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteIconContainer.appendChild(deleteIcon);

    // labelContainer div 
    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-column", "pt-3", "pb-3");
    mainDivContainer.appendChild(labelContainer);

    // h5 Element classList.add("checkbox-label", "pl-3", "pr-4", "pb-2", "pt-2") and append to labelContainer
    let subjectName = document.createElement("h5");
    subjectName.classList.add("checkbox-label", "pl-3", "pr-4", "pb-2", "pt-2");
    subjectName.textContent = todo.text;
    subjectName.id = subjectNameId;
    labelContainer.appendChild(subjectName);

    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------

    // attended div classList.add("d-flex", "flex-row", "info","pl-4") and append to labelContainer
    let attendedContainer = document.createElement("div");
    attendedContainer.classList.add("d-flex", "flex-row", "info", "pl-4");
    labelContainer.appendChild(attendedContainer);

    // attendedValue classList.add("number", "pr-1") and append to attendedContainer
    let attendedValue = document.createElement("p");
    attendedValue.id = attendedCount;
    attendedValue.textContent = todo.attended;
    attendedValue.classList.add("number", "pr-1");
    attendedContainer.appendChild(attendedValue);

    // attendedText classList.add("info-tag", d-flex", "flex-column", "justify-content-center") and append to attendedContainer
    let attendedText = document.createElement("p");
    attendedText.classList.add("info-tag", "d-flex", "flex-column", "justify-content-center", "mr-0");
    attendedText.textContent = "Attended";
    attendedContainer.appendChild(attendedText);

    // attendedPlusIcon classList.add("fa-solid", "fa-square-plus", "d-flex flex-column", "justify-content-center", "ml-4", "pl-4") append to attendedContainer
    let attendedPlusIcon = document.createElement("i");
    attendedPlusIcon.id = attendedIncrement;
    attendedPlusIcon.classList.add("fa-solid", "fa-square-plus", "d-flex", "flex-column", "justify-content-center", "ml-4", "pl-3");
    attendedContainer.appendChild(attendedPlusIcon);

    attendedPlusIcon.onclick = function() {
        onIncrement(thisUniqueNo, attendedIncrement);
    };

    // attendedMinusIcon classList.add("fa-solid", "fa-square-minus", "d-flex flex-column", "justify-content-center", "ml-4", "pl-4") append to attendedContainer
    let attendedMinusIcon = document.createElement("i");
    attendedMinusIcon.id = attendedDecrement;
    attendedMinusIcon.classList.add("fa-solid", "fa-square-minus", "d-flex", "flex-column", "justify-content-center", "ml-2", "pl-4");
    attendedContainer.appendChild(attendedMinusIcon);

    attendedMinusIcon.onclick = function() {
        onDecrement(thisUniqueNo, attendedDecrement);
    };


    // ....................................................................................................................................

    // missed div classList.add("d-flex", "flex-row", "info","pl-4") and append to labelContainer
    let missedContainer = document.createElement("div");
    missedContainer.classList.add("d-flex", "flex-row", "info", "pl-4");
    labelContainer.appendChild(missedContainer);

    // missedValue classList.add("number", "pr-1") and append to missedContainer
    let missedValue = document.createElement("p");
    missedValue.id = missedCount;
    missedValue.textContent = todo.missed;
    missedValue.classList.add("number", "pr-1");
    missedContainer.appendChild(missedValue);

    // missedText classList.add("info-tag", d-flex", "flex-column", "justify-content-center") and append to missedContainer
    let missedText = document.createElement("p");
    missedText.classList.add("info-tag", "d-flex", "flex-column", "justify-content-center");
    missedText.textContent = "Missed";
    missedContainer.appendChild(missedText);

    // missedPlusIcon classList.add("fa-solid", "fa-square-plus", "d-flex flex-column", "justify-content-center", "ml-4", "pl-4") append to missedContainer
    let missedPlusIcon = document.createElement("i");
    missedPlusIcon.id = missedIncrement;
    missedPlusIcon.classList.add("fa-solid", "fa-square-plus", "d-flex", "flex-column", "justify-content-center", "ml-4", "pl-3");
    missedContainer.appendChild(missedPlusIcon);

    missedPlusIcon.onclick = function() {
        onIncrement(thisUniqueNo, missedIncrement);
    };

    // missedMinusIcon classList.add("fa-solid", "fa-square-minus", "d-flex flex-column", "justify-content-center", "ml-4", "pl-4") append to missedContainer
    let missedMinusIcon = document.createElement("i");
    missedMinusIcon.id = missedDecrement;
    missedMinusIcon.classList.add("fa-solid", "fa-square-minus", "d-flex", "flex-column", "justify-content-center", "ml-2", "pl-4");
    missedContainer.appendChild(missedMinusIcon);

    missedMinusIcon.onclick = function() {
        onDecrement(thisUniqueNo, missedDecrement);
    };

    // ...............................................................................................................................................................

    // total div classList.add("d-flex", "flex-row", "info","pl-4") and append to labelContainer
    let totalContainer = document.createElement("div");
    totalContainer.classList.add("d-flex", "flex-row", "info", "pl-4");
    labelContainer.appendChild(totalContainer);

    // totalValue classList.add("number", "pr-1") and append to totalContainer
    let totalValue = document.createElement("p");
    totalValue.id = totalCount;
    totalValue.textContent = todo.total;
    totalValue.classList.add("number", "pr-1");
    totalContainer.appendChild(totalValue);

    // totalText classList.add("info-tag", d-flex", "flex-column", "justify-content-center") and append to totalContainer
    let totalText = document.createElement("p");
    totalText.classList.add("info-tag", "d-flex", "flex-column", "justify-content-center");
    totalText.textContent = "Total";
    totalContainer.appendChild(totalText);

    // conclusionElement classList.add("ml-4", "pl-4 conclusion", "d-flex flex-column", "justify-content-center") and appemd to totalContainer
    let conclusionElement = document.createElement("p");
    conclusionElement.id = conclusionElementId;
    conclusionElement.textContent = todo.conclusionText;
    conclusionElement.classList.add("ml-4", "pl-4", "conclusion", "d-flex", "flex-column", "justify-content-center");
    totalContainer.appendChild(conclusionElement);

    // conclusionValue classList.add("ml-1", "value", "d-flex", "flex-column", "justify-content-center") and appemd to totalContainer
    let conclusionValue = document.createElement("p");
    conclusionValue.id = conclusionValueId;
    conclusionValue.textContent = todo.conclusionValue;
    conclusionValue.classList.add("ml-1", "value", "d-flex", "flex-column", "justify-content-center");
    totalContainer.appendChild(conclusionValue);


    // ----------------------------------------------------------------------------------------------------------------------------------------------------------------

    // percentageContainer div classList.add("d-flex", "flex-column", "justify-content-center", "percentage-container") and appen to mainDivContainer
    let percentageContainer = document.createElement("div");
    percentageContainer.id = percentageContainerElement;
    percentageContainer.style.backgroundColor = todo.percentageContainerColor;
    percentageContainer.classList.add("d-flex", "flex-column", "justify-content-center", "percentage-container");
    mainDivContainer.appendChild(percentageContainer);

    // percentageValue p classList.add("percentage-value") and append to percentageContainer 
    let percentageValue = document.createElement("p");
    percentageValue.id = percentageIndicator;
    percentageValue.textContent = todo.percentage + "%";
    percentageValue.classList.add("percentage-value");
    percentageContainer.appendChild(percentageValue);

    deleteIcon.onclick = function() {
        onDeleteTodo(todo.uniqueNo);
    };

    deleteIconContainer.appendChild(deleteIcon);
}

function onAddTodo() {
    let userInputElement = document.getElementById("todoUserInput");
    let userInputValue = userInputElement.value;

    if (userInputValue === "") {
        alert("Enter Valid Text");
        return;
    }

    todosCount = todosCount + 1;

    let newTodo = {
        text: userInputValue,
        uniqueNo: todosCount,
        isChecked: false,
        uniqueTodoName: userInputElement + todosCount,
        attended: 0,
        missed: 0,
        total: 0,
        percentage: 0,
        conclusionText: "",
        conclusionValue: 0,
        percentageContainerColor: "#f7cdcd",
        colapseColor: "#b6f8fa"
    };
    todoList.push(newTodo);
    createAndAppendTodo(newTodo);
    userInputElement.value = "";
}

addTodoButton.onclick = function() {
    addTodoButton.style.backgroundColor = "green";
    setTimeout(function() {
        addTodoButton.style.backgroundColor = "#4c63b6";
    }, 150);
    onAddTodo();
};

for (let todo of todoList) {
    createAndAppendTodo(todo);
}