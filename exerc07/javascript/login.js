
async function login (){
    const loginUrl = "http://localhost:8080/auth/login";
    const username = document.getElementById("inputEmail").value;
    const password = document.getElementById("inputSenha").value;
    try {
        const response = await fetch(`${loginUrl}`,{
            method: "POST",
            headers: {
                "Content-type" : "application/json"
            },
            body:JSON.stringify({
                username: username, 
                password: password})
        });

        // Verificar se a resposta é OK antes de fazer .json()
        if (!response.ok) {
            throw new Error(`Erro no login: ${response.status}`);
        }

        const data = await response.json();

        //pegando o token
        localStorage.setItem("token", data.token);

        //redirecionando
        window.location.href = "index.html";
        
    } catch (error) {
        console.error("Erro no login:", error);
        
    }
}