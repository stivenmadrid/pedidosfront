<template>
  <div class="home">
    <div class="content">
      <h1 class="title">¡Bienvenido al Sistema de Pedidos!</h1>
      <p>
        Aquí podrás administrar las mesas, realizar pedidos y gestionar tu restaurante de manera
        eficiente.
      </p>
    </div>
    <div class="image-container">
      <div class="overlay"></div>
      <img src="https://i.ytimg.com/vi/jUkW0_4SDw8/maxresdefault.jpg" alt="Restaurant Image" />
    </div>
  </div>
</template>

<script>
export default {
  // Puedes agregar lógica adicional si es necesario
}
</script>
<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
.navbar {
  padding: 10px; /* Reduce el padding para pantallas pequeñas */
}
.navbar-brand {
  font-size: 24px;
}
.navbar-nav .nav-link {
  font-size: 16px; /* Reduce el tamaño de fuente para pantallas pequeñas */
}
/* Estilos para el contenido */
.container {
  max-width: 1200px; /* Ajusta el ancho del contenido para pantallas grandes */
  margin: 0 auto; /* Centra el contenido */
}
/* Ajustes para pantallas pequeñas */
@media (max-width: 767px) {
  .navbar-brand {
    font-size: 20px;
  }

  .navbar-nav .nav-link {
    font-size: 14px;
  }
}
.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Asegura que ocupe al menos el 100% del viewport */
  background: linear-gradient(to bottom right, #ffdd00, #ff3366);
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden; /* Evita el desplazamiento causado por elementos que exceden el contenido */
}

.content {
  text-align: center;
  max-width: 600px;
  margin-bottom: 40px;
}

.title {
  font-size: 56px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 20px;
  animation: slideInUp 1s ease;
}

.content p {
  font-size: 24px;
  color: #fff;
  margin-bottom: 30px;
  animation: slideInUp 1s ease;
}

.btn {
  display: inline-block;
  padding: 16px 32px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  color: #fff;
  background-color: #ff3366;
  border-radius: 50px;
  transition: background-color 0.3s ease;
  animation: pulse 1s infinite;
}

.btn:hover {
  background-color: #ff6699;
}

.image-container {
  position: relative;
  max-width: 800px;
  width: 100%;
  height: auto;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  margin-bottom: 20px;
  animation: fadeIn 1s ease;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, rgba(22, 152, 24, 0.6), rgba(200, 94, 126, 0.9));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-container:hover .overlay {
  opacity: 1;
}

.image-container img {
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center;
}

@keyframes slideInUp {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
