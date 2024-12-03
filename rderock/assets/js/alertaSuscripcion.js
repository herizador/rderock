document.addEventListener('DOMContentLoaded', () => {
    // Selecciona el formulario de suscripción
    const subscribeForm = document.getElementById('subscribe');

    // Escucha el evento 'submit' del formulario
    subscribeForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Evita que la página se recargue

      // Captura los datos del formulario
      const formData = new FormData(subscribeForm);
      const data = Object.fromEntries(formData);

      try {
        // Envía los datos al servidor
        const response = await fetch('/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          alert(result.message); // Muestra el mensaje de éxito en una alerta
          subscribeForm.reset(); // Limpia el formulario
        } else {
          alert('Hubo un error al procesar tu suscripción. Inténtalo nuevamente.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('No se pudo procesar tu suscripción. Por favor, intenta más tarde.');
      }
    });
  });