document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el formulario de historia
    const storyForm = document.getElementById('contact');

    // Escucha el evento 'submit' del formulario
    storyForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Evita que la página se recargue

      // Captura los datos del formulario
      const formData = new FormData(storyForm);
      const data = Object.fromEntries(formData);

      try {
        // Envía los datos al servidor
        const response = await fetch('/submit-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message); // Muestra el mensaje de éxito en una alerta
          storyForm.reset(); // Limpia el formulario
        } else {
          alert('Hubo un error al enviar tu historia. Inténtalo nuevamente.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('No se pudo enviar tu historia. Por favor, intenta más tarde.');
      }
    });
  });