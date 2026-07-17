async function checkSession(){

    const response = await fetch("../api/auth_check.php");
    if(!response.ok){

        window.location.href = "login.php";

        return;

    }
    console.log("Session valide");
}
checkSession();



// Déconnexion

document.getElementById("logout")
document.addEventListener("click",()=>{

    window.location.href="logout.php";

});