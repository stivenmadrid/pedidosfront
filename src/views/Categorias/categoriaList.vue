<template>
  <div class="container-fluid vh-100" style="overflow-y: auto; max-height: 100vh">
    <br />
    <button @click="abrirModal" class="btn btn-success">Agregar Categoría</button>

    <h3 class="title">Listado de categorías</h3>

    <div class="table-responsive">
      <table class="table table-striped" ref="dataTable">
        <thead class="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre de la Categoría</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody class="table-group-divider" id="contenidocategorias"></tbody>
      </table>
    </div>
  </div>

  <!-- Modal para agregar categoría -->
  <div class="modal" :class="{ 'is-active': mostrarModal }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h6 class="">Agregar Categoría</h6>
        <form @submit.prevent="crearCategoria">
          <div class="field">
            <label class="label">Nombre de la Categoría</label>
            <div class="control">
              <input
                v-model="nuevaCategoria.Nombre_Categoria"
                class="form-control"
                type="text"
                required
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <br />
              <button type="submit" class="btn btn-primary">Crear</button>
              <button type="button" class="btn btn-secondary" @click="cancelarCreacion">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal para editar categoría -->
  <div class="modal" :class="{ 'is-active': mostrarModalEdicion }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <h3 class="">Editar Categoría</h3>
        <form @submit.prevent="editarCategoria">
          <div class="field">
            <label class="label">Nombre de la Categoría</label>
            <div class="control">
              <input
                v-model="categoriaSeleccionada.Nombre_Categoria"
                class="form-control"
                type="text"
                required
              />
            </div>
          </div>
          <div class="field">
            <div class="control">
              <br />
              <button type="submit" class="btn btn-primary">Guardar</button>
              <button type="button" class="btn btn-secondary" @click="cancelarEdicion">
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-responsive-dt/css/responsive.dataTables.css'

export default {
  data() {
    return {
      categorias: [],
      mostrarModal: false,
      mostrarModalEdicion: false,
      nuevaCategoria: {
        Nombre_Categoria: ''
      },
      categoriaSeleccionada: {
        id: '',
        Nombre_Categoria: ''
      },
      dataTable: null
    }
  },
  mounted() {
    this.getCategorias()
  },
  methods: {
    getCategorias() {
      const token = localStorage.getItem('token')

      axios
        .get('http://127.0.0.1:8000/api/v1/categorias', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          this.categorias = response.data
          this.initializeDataTable()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    abrirModal() {
      this.mostrarModal = true
    },
    cancelarCreacion() {
      this.cerrarModal()
    },
    cerrarModal() {
      this.mostrarModal = false
      this.resetForm()
    },
    resetForm() {
      this.nuevaCategoria = {
        Nombre_Categoria: ''
      }
    },
    crearCategoria() {
      const token = localStorage.getItem('token')

      axios
        .post('http://127.0.0.1:8000/api/v1/categorias/store', this.nuevaCategoria, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          this.$swal({
            title: 'Éxito!',
            text: response.data.message,
            icon: 'success'
          })
          this.getCategorias()
          this.cerrarModal()
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al crear la categoría'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          this.$swal({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al crear la categoría:', error)
        })
    },
    eliminarCategoria(id) {
      const token = localStorage.getItem('token')

      axios
        .delete(`http://127.0.0.1:8000/api/v1/categorias/destroy/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          this.$swal({
            title: 'Éxito!',
            text: response.data.message,
            icon: 'success'
          })
          this.getCategorias()
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al eliminar la categoría'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          this.$swal({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al eliminar la categoría:', error)
        })
    },
    abrirModalEdicion(categoria) {
      this.categoriaSeleccionada = { ...categoria }
      this.mostrarModalEdicion = true
    },
    cancelarEdicion() {
      this.mostrarModalEdicion = false
      this.resetForm()
    },
    editarCategoria() {
      const token = localStorage.getItem('token')

      axios
        .put(
          `http://127.0.0.1:8000/api/v1/categorias/update/${this.categoriaSeleccionada.id}`,
          this.categoriaSeleccionada,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          this.$swal({
            title: 'Éxito!',
            text: response.data.message,
            icon: 'success'
          })
          this.getCategorias()
          this.mostrarModalEdicion = false
        })
        .catch((error) => {
          let errorMessage = 'Error al realizar la solicitud al servidor'
          if (error.response) {
            errorMessage = error.response.data.message || 'Error al editar la categoría'
          } else if (error.request) {
            errorMessage = 'No se recibió respuesta del servidor'
          }
          this.$swal({
            title: 'Error!',
            text: errorMessage,
            icon: 'error'
          })
          console.error('Error al editar la categoría:', error)
        })
    },
    initializeDataTable() {
      if (this.dataTable) {
        this.dataTable.destroy()
      }

      this.dataTable = $(this.$refs.dataTable).DataTable({
        data: this.categorias,
        columns: [
          { data: 'id' },
          { data: 'Nombre_Categoria' },
          { data: null, orderable: false, searchable: false }
        ],
        columnDefs: [
          {
            targets: 2,
            createdCell: (cell, cellData, rowData, rowIndex, colIndex) => {
              const editarButton = $(
                '<button class="btn btn-primary"><i class="fas fa-edit"></i> </button>'
              )
              editarButton.on('click', () => {
                this.abrirModalEdicion(rowData)
              })
              $(cell).empty().append(editarButton)

              const eliminarButton = $(
                '<button class="btn btn-danger"><i class="fas fa-trash"></i></button>'
              )
              eliminarButton.on('click', () => {
                this.eliminarCategoria(rowData.id)
              })
              $(cell).append(eliminarButton)
            }
          }
        ],
        language: {
          search: 'Buscar:',
          lengthMenu: 'Mostrar _MENU_ registros por página',
          zeroRecords: 'No se encontraron registros',
          info: 'Mostrando página _PAGE_ de _PAGES_',
          infoEmpty: 'No hay registros disponibles',
          infoFiltered: '(filtrados de _MAX_ registros totales)',
          paginate: {
            first: 'Primero',
            last: 'Último',
            next: 'Siguiente',
            previous: 'Anterior'
          }
        }
      })
    }
  }
}
</script>

<!-- <style scoped>
  .modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal.is-active {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background-color: #fefefe;
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
    border-radius: 5px;
  }
  
  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #aaa;
    font-size: 24px;
    cursor: pointer;
  }

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #EDE7F6;
  padding: 0 20px;
  font-family: 'Roboto', sans-serif;
}

.card {
  position: relative;
  max-width: 1200px;
  width: 100%;
  background: #FFFFFF;
  border-radius: 4px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  animation: fade-in-card 0.5s ease-out;
}

@keyframes fade-in-card {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.title {
  color: #3F51B5;
  text-align: left;
  font-size: 2em;
  font-weight: 500;
  margin-bottom: 30px;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 15px;
}

.table thead th {
  color: #FFFFFF;
  background-color: #3F51B5;
  padding: 15px 20px;
  border: none;
  text-transform: uppercase;
  font-weight: 500;
}

.table tbody tr {
  background-color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border-radius: 4px;
  animation: fade-in-row 0.5s ease-out;
}

@keyframes fade-in-row {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.table tbody tr:hover {
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
}

.table tbody tr td {
  padding: 15px 20px;
  vertical-align: middle;
}

.estado-nuevo {
  display: inline-block;
  padding: 3px 10px;
  color: white;
  background-color: #4CAF50;
  border-radius: 16px;
  font-weight: 500;
  font-size: 0.8em;
}

.btn {
  display: inline-block;
  background-color: #3F51B5;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: background-color 0.3s, box-shadow 0.3s;
}

.btn:hover {
  background-color: #303F9F;
  box-shadow: 0 2px 16px rgba(0,0,0,0.3);
}

  </style> -->

<style scoped>
.container-fluid {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('https://img.freepik.com/fotos-premium/patron-marmol-natural-fondo_1258-22162.jpg');
  background-repeat: repeat;
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding-bottom: 20px;
}

.title {
  font-size: 56px;
  font-weight: bold;
  color: white;
  border-radius: 30px;
  margin-bottom: 20px;
  animation: slideInUp 1s ease;
  -webkit-text-stroke: 2px orangered;
  color: white;
  text-align: center;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

.table th {
  background-color: #343a40;
  color: white;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table tbody td table {
  width: 100%;
}

.table tbody td table td {
  border: none;
}

.btn {
  margin-right: 10px;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
  background-color: #007bff;
  color: white;
}

.btn:hover {
  background-color: #0056b3;
}
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}
.modal.is-active {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
}

.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.modal-content:hover {
  transform: scale(1.02);
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
}
.title {
  font-size: 3em;
  font-weight: 600;
  text-transform: uppercase;
  font-family: 'Arial', sans-serif;
  padding-bottom: 10px;
  margin-bottom: 30px;
  text-align: center;
  color: #537895;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
}

.title::before,
.title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  height: 4px;
  background: linear-gradient(to right, #ffd700, #537895);
  animation: lineAnimation 2s linear infinite;
}

.title::before {
  left: 0;
  width: 30%;
}

.title::after {
  right: 0;
  width: 40%;
}

@keyframes lineAnimation {
  0% {
    transform: scaleX(0);
  }
  100% {
    transform: scaleX(1);
  }
}
</style>
