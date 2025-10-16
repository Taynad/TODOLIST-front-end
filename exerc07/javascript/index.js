const nameTask = document.getElementById("inputTask");
const description = document.getElementById("inputDescription");
const ulTask = document.getElementById("ulTask");
const urlTask = "http://localhost:8080/task";

function renderItem (data){
    ulTask.innerHTML = "";

    data.forEach(item => {
        //criando o h3 e p da li
        const li = document.createElement("li");
        const h3 = document.createElement("h3");
        h3.textContent = `${item.nameTask}`
        h3.className = "titleList";
        const p = document.createElement("p");
        p.textContent = `${item.description}`;
        p.className = "description";

        //criando os botões
        const div = document.createElement("div");
        div.className = "buttons";

        const buttonUpdate = document.createElement("button");
        const imgUpdate = document.createElement("img");
        imgUpdate.src = 'assets/image/update.svg';
        buttonUpdate.className = "btnUpdate";

        const buttonDelete = document.createElement("button");
        const imgDelete = document.createElement("img");
        imgDelete.src = 'assets/image/delete.svg';
        buttonDelete.className = "btnDelete";

        //colocando dentro das estruturas
        buttonUpdate.appendChild(imgUpdate);
        buttonDelete.appendChild(imgDelete);
        div.appendChild(buttonDelete);
        div.appendChild(buttonUpdate);
        li.appendChild(h3);
        li.appendChild(p);
        li.appendChild(div);
        ulTask.appendChild(li);
    
        //adicionando o evento
        const btnEdit = li.querySelector(".btnUpdate");
        btnEdit.addEventListener("click", () => editTask(item, li));

        const btnDelete  = li.querySelector(".btnDelete");
        btnDelete.addEventListener("click", () => deleteTask(item.id, li));
    });

    
}

async function findAll(){
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }
    try {
        const response = await fetch(urlTask, {
            method:"GET",
            headers:{
                "Content-type" : "application/json",
                "Authorization" : "Bearer " + token
            }
        });

        if(response.status === 401 || response.status === 403){
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        if(!response.ok){
            showToast("Erro ao listar a tarefa", "error");
        }

        const data = await response.json();
        renderItem(data);
        
    } catch (error) {
        showToast(error.message, "error");
        console.error("Erro ao buscar tarefas:", error);
    }
}

async function save (){
    const token = localStorage.getItem("token");
    if(!nameTask.value.trim() || !description.value.trim()){
        showToast("Preencha todos os campos" + "error");
    }

    try {
        const response = await fetch(urlTask,{
            method: "POST",
            headers: {
                "Content-type" : "application/json",
                "Authorization" : "Bearer " + token
            },
            body: JSON.stringify({
                nameTask: nameTask.value, 
                description: description.value
            })
        })

        if(response.status === 401 || response.status === 403){
            window.location.href = "login.html";
            return;
        }

        if(response.ok){
            showToast("Tarefa salva com sucesso!");
        }

        nameTask.value = "";
        description.value = "";

        findAll();

    } catch (error) {
        console.error("Erro ao realizar a requisição POST: " + error.message);
    }
}

function editTask (item, li){
    const title = li.querySelector(".titleList");
    const description = li.querySelector(".description");

    const newInputTask = document.createElement("input");
    newInputTask.type = "text";
    newInputTask.value = item.nameTask

    const newInputDescription = document.createElement("input");
    newInputDescription.type = "text";
    newInputDescription.value = item.description;

    //trocando os inputs
    li.replaceChild(newInputTask, title);
    li.replaceChild(newInputDescription, description);
    newInputTask.focus();

    // array para adicionar evento tanto no input do nome quanto no da descrição
    [newInputTask, newInputDescription].forEach(input => {
        input.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                saveUpdate(newInputTask, newInputDescription, li, item.id);
            }
        });
});

}

async function saveUpdate (inputName, inputDescription, li, id){
    const newNametask = inputName.value;
    const newDescription = inputDescription.value;
    if (!inputName.value.trim()  || !inputDescription.value.trim()){
        showToast("Preencha todos os campos ", "error");
    } 
    try {
        const token = localStorage.getItem("token");
        const response = await fetch (`${urlTask}/${id}`,{
            method: "PUT",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + token
            },
            body: JSON.stringify({
                nameTask: newNametask,
                description: newDescription
            })
        });

        if(response.status === 401 || response.status === 403){
            window.location.href = "login.html";
            return;
        }

        
        const newH3 = document.createElement("h3");
        newH3.classList.add("titleList");
        newH3.textContent = newNametask;

        const p = document.createElement("p");
        p.classList.add("description");
        p.textContent = newDescription;

        li.replaceChild(newH3, inputName);
        li.replaceChild(p, inputDescription);

        if(response.ok){
            showToast("Tarefa atualizada com sucesso!");
        }

    } catch (error) {
        console.error("Erro no UPDATE: ", error);
    }
}
async function deleteTask (id, li){
    const token = localStorage.getItem("token");
    try {
        const response = await fetch (`${urlTask}/${id}`,{
            method: "DELETE",
            headers: {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + token
            }
        });

        if(response.status === 401 || response.status === 403){
            window.location.href = "login.html";
            return;
        }

        if(response.ok){
            showToast("Tarefa deletada com sucesso!")
        }

        li.remove();
        
    } catch (error) {
        console.error("Erro ao fazer a requisição DELETE: " + error.message);
    }
}

function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
  
    toast.textContent = message;
    toast.style.backgroundColor = type === "error" ? "#e74c3c" : "#2ecc71";
  
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

