<template>
  <div id="contenedor">
    <div id="contenedorcentrado">
      <div id="login" class="animated fadeIn">
        <form @submit.prevent="login">
          <h3 class="titulo">Iniciar sesión</h3>
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input v-model="form.email" type="email" id="email" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              class="form-control"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary btn-block">Iniciar sesión</button>
          <div v-if="error" class="alert alert-danger mt-3 animated fadeIn">
            {{ error }}
          </div>
          <!-- <div class="pie-form">
            <a href="#" class="pie-link">¿Perdiste tu contraseña?</a>
            <a href="#" class="pie-link">¿No tienes cuenta? Regístrate</a>
            <a href="#" class="pie-link">« Volver</a>
          </div> -->
        </form>
      </div>
      <div id="derecho" class="animated fadeIn">
        <div class="logo-empresa">
          <img src="@/assets/logo.png" alt="Logo de la empresa" class="logo-animation" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      error: null
    }
  },

  methods: {
    login() {
      axios
        .post('https://pedidos.test/api/login', {
          email: this.form.email,
          password: this.form.password
        })
        .then((response) => {
          // Manejar la respuesta del backend, por ejemplo, almacenar el token de acceso en localStorage
          localStorage.setItem('token', response.data.token)
          // Redirigir a otra página o realizar otras acciones
          this.$router.push('/')
        })
        .catch((error) => {
          // Manejar el error de autenticación
          if (error.response && error.response.data && error.response.data.message) {
            this.showError(error.response.data.message)
          } else {
            this.showError('Error de autenticación. Por favor, inténtalo de nuevo.')
          }
        })
    },
    showError(message) {
      this.error = message
      setTimeout(() => {
        this.error = null
      }, 5000) // Desaparecerá después de 5 segundos
    }
  }
}
</script>

<style scoped>
/* Estilos generales */
body {
  font-family: 'Overpass', sans-serif;
  font-weight: normal;
  font-size: 100%;
  color: #1b262c;
  margin: 0;
  background-color: #5f6769;
}

/* Estilos para el contenedor de pantalla completa */
#contenedor {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  min-width: 100vw;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}

/* Estilos para el contenedor centrado */
#contenedorcentrado {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  min-width: 320px;
  max-width: 900px;
  width: 90%;
  background-color: #000000ed;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.15);
  padding: 30px;
  box-sizing: border-box;
}

/* Estilos para el formulario de login */
#login {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: rgb(28, 26, 26);
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.15);
  border-radius: 3px;
  box-sizing: border-box;
  opacity: 1;
}

#login label {
  display: block;
  font-size: 120%;
  color: #ffffff;
  margin-top: 15px;
}

#login input {
  font-size: 110%;
  color: #1b262c;
  display: block;
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 5px 10px;
  box-sizing: border-box;
  border: none;
  border-radius: 3px;
}

#login input::placeholder {
  color: #e4e4e4;
}

#login button {
  font-size: 110%;
  color: #1b262c;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 3px;
  background-color: #dfcdc3;
  margin-top: 10px;
}

#login button:hover {
  background-color: #3c4245;
  color: #dfcdc3;
}

/* Estilos para la sección de la derecha */
#derecho {
  text-align: center;
  width: 100%;
  opacity: 0.7;
  padding: 20px;
  box-sizing: border-box;
}

.titulo {
  font-size: 200%;
  color: #dfcdc3;
}

.logo-empresa img {
  max-width: 100%;
  height: auto;
  border-radius: 50%;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

hr {
  border-top: 1px solid #8c8b8b;
  border-bottom: 1px solid #dfcdc3;
}

.pie-form {
  font-size: 90%;
  text-align: center;
  margin-top: 15px;
}

.pie-form a {
  display: block;
  text-decoration: none;
  color: #dfcdc3;
  margin-bottom: 3px;
}

.pie-form a:hover {
  color: #719192;
}

@media all and (max-width: 775px) {
  /* Estilos responsivos */
  #contenedorcentrado {
    flex-direction: column;
    align-items: center;
  }

  #login {
    margin-bottom: 20px;
  }

  .logo-empresa img {
    width: 200px;
  }
}
</style>
