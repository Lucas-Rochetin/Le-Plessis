document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.open-pdf').forEach(button => {
        button.addEventListener('click', () => {
            const pdfUrl = button.getAttribute('data-pdf');
            if (!pdfUrl) return;

            // ✅ création d’un vrai lien (anti blocage navigateur)
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
});