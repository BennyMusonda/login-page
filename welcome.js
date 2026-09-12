document.addEventListener("DOMContentLoaded", () => {
    const usernameText = document.getElementById("username").innerText;
    document.getElementById("display-name").innerText = usernameText.charAt(0).toUpperCase() + usernameText.slice(1);

    setTimeout(() => {
        document.getElementById("preloader").classList.add("hide-preloader");
    }, 1000);
});
